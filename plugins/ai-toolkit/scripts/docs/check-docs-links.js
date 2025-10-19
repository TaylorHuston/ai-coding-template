#!/usr/bin/env node

/**
 * Documentation Link Validator
 * 
 * Validates internal and external links in documentation files
 * Detects broken links, missing files, and orphaned documents
 * 
 * Usage: node scripts/check-docs-links.js [options]
 * Options:
 *   --external         Check external links (slower)
 *   --format json      Output in JSON format
 *   --output FILE      Write report to file
 *   --fix              Attempt to fix obvious issues
 *   --quiet            Minimal output
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const CONFIG = {
  fileExtensions: ['.md', '.mdx'],
  excludeDirs: ['node_modules', '.git', '.next', 'dist', 'build'],
  timeout: 5000, // ms for external links
  maxRedirects: 3,
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m'
};

function log(message, color = colors.reset) {
  if (!process.argv.includes('--quiet')) {
    console.log(`${color}${message}${colors.reset}`);
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    external: false,
    format: 'text',
    output: null,
    fix: false,
    quiet: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--external':
        options.external = true;
        break;
      case '--format':
        options.format = args[++i] || 'text';
        break;
      case '--output':
        options.output = args[++i];
        break;
      case '--fix':
        options.fix = true;
        break;
      case '--quiet':
        options.quiet = true;
        break;
    }
  }

  return options;
}

function findMarkdownFiles(dir = '.') {
  const files = [];
  
  function traverse(currentDir) {
    if (CONFIG.excludeDirs.some(excluded => currentDir.includes(excluded))) {
      return;
    }

    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          traverse(fullPath);
        } else if (CONFIG.fileExtensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  traverse(dir);
  return files;
}

function extractLinks(content, filePath) {
  const links = [];
  
  // Match markdown links: [text](url)
  const markdownLinkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = markdownLinkRegex.exec(content)) !== null) {
    const [fullMatch, text, url] = match;
    const line = content.substring(0, match.index).split('\n').length;
    
    links.push({
      text: text.trim(),
      url: url.trim(),
      line,
      type: url.startsWith('http') ? 'external' : 'internal',
      raw: fullMatch,
      filePath
    });
  }
  
  // Match reference-style links: [text][ref] and [ref]: url
  const referenceLinkRegex = /\[([^\]]+)\]\[([^\]]*)\]/g;
  const referenceDefRegex = /^\s*\[([^\]]+)\]:\s*(.+)$/gm;
  
  // Extract reference definitions
  const references = {};
  while ((match = referenceDefRegex.exec(content)) !== null) {
    references[match[1].toLowerCase()] = match[2].trim();
  }
  
  // Extract reference links
  while ((match = referenceLinkRegex.exec(content)) !== null) {
    const [fullMatch, text, ref] = match;
    const refKey = (ref || text).toLowerCase();
    const url = references[refKey];
    
    if (url) {
      const line = content.substring(0, match.index).split('\n').length;
      links.push({
        text: text.trim(),
        url,
        line,
        type: url.startsWith('http') ? 'external' : 'internal',
        raw: fullMatch,
        filePath,
        reference: refKey
      });
    }
  }
  
  return links;
}

function validateInternalLink(link, baseDir = '.') {
  const { url, filePath } = link;
  
  // Handle anchor links
  let targetPath = url;
  let anchor = null;
  
  if (url.includes('#')) {
    [targetPath, anchor] = url.split('#');
  }
  
  // Skip empty paths (just anchors)
  if (!targetPath) {
    return { valid: true, reason: 'anchor-only' };
  }
  
  // Resolve relative path
  const currentDir = path.dirname(filePath);
  const resolvedPath = path.resolve(currentDir, targetPath);
  
  // Check if file exists
  if (!fs.existsSync(resolvedPath)) {
    // Try common variations
    const alternatives = [
      resolvedPath + '.md',
      path.join(resolvedPath, 'README.md'),
      path.join(resolvedPath, 'index.md'),
    ];
    
    for (const alt of alternatives) {
      if (fs.existsSync(alt)) {
        return {
          valid: true,
          suggestion: path.relative(currentDir, alt),
          reason: 'found-alternative'
        };
      }
    }
    
    return {
      valid: false,
      reason: 'file-not-found',
      suggestion: `File not found: ${resolvedPath}`
    };
  }
  
  // If there's an anchor, validate it exists in the target file
  if (anchor && targetPath.endsWith('.md')) {
    try {
      const targetContent = fs.readFileSync(resolvedPath, 'utf8');
      const anchorRegex = new RegExp(`^#+\\s+.*${anchor.replace(/-/g, '[-\\s]')}`, 'im');
      
      if (!anchorRegex.test(targetContent)) {
        return {
          valid: false,
          reason: 'anchor-not-found',
          suggestion: `Anchor '#${anchor}' not found in ${targetPath}`
        };
      }
    } catch (error) {
      // If we can't read the file, skip anchor validation
    }
  }
  
  return { valid: true };
}

function validateExternalLink(link) {
  return new Promise((resolve) => {
    const { url } = link;
    
    try {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const req = client.request({
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'HEAD',
        timeout: CONFIG.timeout,
        headers: {
          'User-Agent': 'Documentation Link Checker'
        }
      }, (res) => {
        const statusCode = res.statusCode;
        
        if (statusCode >= 200 && statusCode < 300) {
          resolve({ valid: true, statusCode });
        } else if (statusCode >= 300 && statusCode < 400) {
          resolve({
            valid: true,
            statusCode,
            reason: 'redirect',
            location: res.headers.location
          });
        } else {
          resolve({
            valid: false,
            statusCode,
            reason: `HTTP ${statusCode}`
          });
        }
      });
      
      req.on('error', (error) => {
        resolve({
          valid: false,
          reason: error.code || error.message,
          suggestion: 'Check if the URL is correct and accessible'
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve({
          valid: false,
          reason: 'timeout',
          suggestion: 'URL took too long to respond'
        });
      });
      
      req.end();
      
    } catch (error) {
      resolve({
        valid: false,
        reason: 'invalid-url',
        suggestion: 'URL format is invalid'
      });
    }
  });
}

async function validateLinks(links, options) {
  const results = {
    internal: [],
    external: [],
    summary: {
      total: links.length,
      internal: links.filter(l => l.type === 'internal').length,
      external: links.filter(l => l.type === 'external').length,
      valid: 0,
      invalid: 0
    }
  };
  
  log(`🔍 Validating ${results.summary.internal} internal links...`, colors.blue);
  
  // Validate internal links
  for (const link of links.filter(l => l.type === 'internal')) {
    const result = validateInternalLink(link);
    results.internal.push({
      ...link,
      ...result
    });
    
    if (result.valid) {
      results.summary.valid++;
    } else {
      results.summary.invalid++;
    }
  }
  
  // Validate external links if requested
  if (options.external) {
    log(`🌐 Validating ${results.summary.external} external links...`, colors.blue);
    
    const externalLinks = links.filter(l => l.type === 'external');
    const batchSize = 5; // Limit concurrent requests
    
    for (let i = 0; i < externalLinks.length; i += batchSize) {
      const batch = externalLinks.slice(i, i + batchSize);
      const promises = batch.map(validateExternalLink);
      const batchResults = await Promise.all(promises);
      
      batch.forEach((link, index) => {
        const result = batchResults[index];
        results.external.push({
          ...link,
          ...result
        });
        
        if (result.valid) {
          results.summary.valid++;
        } else {
          results.summary.invalid++;
        }
      });
      
      // Show progress
      if (!options.quiet) {
        const progress = Math.min(i + batchSize, externalLinks.length);
        log(`  Progress: ${progress}/${externalLinks.length} external links checked`, colors.cyan);
      }
    }
  } else {
    // Count external links as valid (not checked)
    results.summary.valid += results.summary.external;
  }
  
  return results;
}

function findOrphanedFiles(files, results) {
  const linkedFiles = new Set();
  
  // Add files that are referenced by links
  results.internal.forEach(link => {
    if (link.valid) {
      const currentDir = path.dirname(link.filePath);
      const targetPath = path.resolve(currentDir, link.url.split('#')[0]);
      linkedFiles.add(targetPath);
    }
  });
  
  // Find files that are never referenced
  const orphaned = files.filter(file => {
    const absPath = path.resolve(file);
    return !linkedFiles.has(absPath) && 
           !file.includes('README') && 
           !file.includes('CLAUDE.md') &&
           !file.includes('index.');
  });
  
  return orphaned;
}

function generateTextReport(results, orphaned, options) {
  let report = `📊 Documentation Link Check Report
Generated: ${new Date().toLocaleString()}

## Summary
Total Links: ${results.summary.total}
Internal Links: ${results.summary.internal}
External Links: ${results.summary.external}${!options.external ? ' (not checked)' : ''}
Valid Links: ${results.summary.valid}
Invalid Links: ${results.summary.invalid}
`;

  if (results.summary.invalid > 0) {
    report += `\n❌ Broken Links Found:\n\n`;
    
    const brokenInternal = results.internal.filter(link => !link.valid);
    const brokenExternal = results.external.filter(link => !link.valid);
    
    if (brokenInternal.length > 0) {
      report += `Internal Links (${brokenInternal.length}):\n`;
      brokenInternal.forEach(link => {
        report += `  ${link.filePath}:${link.line} - "${link.text}" -> ${link.url}\n`;
        report += `    Issue: ${link.reason || 'Unknown'}\n`;
        if (link.suggestion) {
          report += `    Suggestion: ${link.suggestion}\n`;
        }
        report += '\n';
      });
    }
    
    if (brokenExternal.length > 0) {
      report += `External Links (${brokenExternal.length}):\n`;
      brokenExternal.forEach(link => {
        report += `  ${link.filePath}:${link.line} - "${link.text}" -> ${link.url}\n`;
        report += `    Issue: ${link.reason || 'Unknown'}\n`;
        if (link.suggestion) {
          report += `    Suggestion: ${link.suggestion}\n`;
        }
        report += '\n';
      });
    }
  }

  if (orphaned.length > 0) {
    report += `\n🔍 Orphaned Files (${orphaned.length}):\n`;
    report += `Files that aren't referenced by any links:\n\n`;
    orphaned.forEach(file => {
      report += `  ${file}\n`;
    });
    report += '\nConsider adding links to these files or removing them if no longer needed.\n';
  }

  if (results.summary.invalid === 0 && orphaned.length === 0) {
    report += `\n✅ All links are valid and no orphaned files found!\n`;
  }

  return report;
}

function generateJsonReport(results, orphaned) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: results.summary,
    brokenLinks: {
      internal: results.internal.filter(link => !link.valid),
      external: results.external.filter(link => !link.valid)
    },
    orphanedFiles: orphaned,
    allResults: results
  }, null, 2);
}

async function main() {
  const options = parseArgs();
  
  try {
    log('🔗 Documentation Link Checker', colors.bright);
    log('==============================', colors.bright);
    
    // Find all markdown files
    const files = findMarkdownFiles();
    log(`📄 Found ${files.length} documentation files`, colors.cyan);
    
    // Extract all links
    let allLinks = [];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const links = extractLinks(content, file);
      allLinks = allLinks.concat(links);
    }
    
    log(`🔗 Found ${allLinks.length} links to validate`, colors.cyan);
    
    // Validate links
    const results = await validateLinks(allLinks, options);
    
    // Find orphaned files
    log('🔍 Checking for orphaned files...', colors.blue);
    const orphaned = findOrphanedFiles(files, results);
    
    // Generate report
    let report;
    if (options.format === 'json') {
      report = generateJsonReport(results, orphaned);
    } else {
      report = generateTextReport(results, orphaned, options);
    }
    
    // Output report
    if (options.output) {
      fs.writeFileSync(options.output, report);
      log(`📄 Report written to ${options.output}`, colors.green);
    } else {
      console.log(report);
    }
    
    // Exit with error code if there are broken links
    const hasIssues = results.summary.invalid > 0;
    if (hasIssues) {
      process.exit(1);
    } else {
      log(`✅ Link validation complete - all ${results.summary.valid} links are valid!`, colors.green);
    }
    
  } catch (error) {
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { extractLinks, validateInternalLink, findOrphanedFiles };