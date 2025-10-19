#!/usr/bin/env node

/**
 * Documentation Health Dashboard for AI Coding Template
 * Analyzes documentation quality, coverage, and maintenance status
 * Run from project root: node scripts/docs-health.js
 * 
 * Features:
 * - Scans all documentation files in /docs/
 * - Calculates metrics: files, lines, code blocks, links
 * - Checks file freshness using git history
 * - Identifies TODOs and maintenance needs
 * - Generates visual progress reports
 * - Outputs both console summary and markdown report
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for output
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
  console.log(`${color}${message}${colors.reset}`);
}

function generateProgressBar(percentage, width = 10) {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `[${bar}] ${percentage}%`;
}

function findMarkdownFiles(dir) {
  const results = [];
  
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory() && !file.name.startsWith('.') && !file.name.includes('node_modules')) {
        results.push(...findMarkdownFiles(fullPath));
      } else if (file.isFile() && file.name.endsWith('.md')) {
        results.push(fullPath);
      }
    }
  } catch (err) {
    // Directory might not exist
  }
  
  return results;
}

function analyzeMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Count various elements
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    const internalLinks = content.match(/\[([^\]]+)\]\(\.\/[^)]+\)/g) || [];
    const externalLinks = content.match(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g) || [];
    const todos = content.match(/- \[ \]/g) || [];
    const completed = content.match(/- \[x\]/g) || [];
    const fixmes = content.match(/FIXME|TODO:|NOTE:/gi) || [];
    const headers = content.match(/^#+\s/gm) || [];
    
    // Get file modification date
    let lastModified = null;
    try {
      const gitCmd = `git log -1 --format="%cd" --date=short -- "${filePath}"`;
      lastModified = execSync(gitCmd, { encoding: 'utf-8', cwd: path.dirname(filePath) }).trim();
    } catch (err) {
      // File might not be in git
      const stats = fs.statSync(filePath);
      lastModified = stats.mtime.toISOString().split('T')[0];
    }
    
    // Calculate days since last update
    const daysSinceUpdate = Math.floor((new Date() - new Date(lastModified)) / (1000 * 60 * 60 * 24));
    
    return {
      path: filePath,
      lines: lines.length,
      codeBlocks: codeBlocks.length,
      internalLinks: internalLinks.length,
      externalLinks: externalLinks.length,
      todos: todos.length,
      completed: completed.length,
      fixmes: fixmes.length,
      headers: headers.length,
      lastModified: lastModified,
      daysSinceUpdate: daysSinceUpdate,
      freshness: daysSinceUpdate <= 7 ? 'fresh' : daysSinceUpdate <= 30 ? 'moderate' : 'stale'
    };
  } catch (err) {
    return {
      path: filePath,
      error: err.message
    };
  }
}

function categorizeFiles(files) {
  const categories = {
    root: [],
    docs: [],
    examples: [],
    api: [],
    guides: [],
    reference: [],
    other: []
  };
  
  const projectRoot = path.dirname(__dirname);
  
  for (const file of files) {
    const relativePath = path.relative(projectRoot, file.path);
    
    if (relativePath === 'README.md' || relativePath === 'CLAUDE.md' || !relativePath.includes('/')) {
      categories.root.push(file);
    } else if (relativePath.startsWith('docs/')) {
      const subPath = relativePath.substring(5); // Remove 'docs/'
      
      if (subPath.startsWith('api/')) {
        categories.api.push(file);
      } else if (subPath.startsWith('examples/')) {
        categories.examples.push(file);
      } else if (subPath.startsWith('guides/')) {
        categories.guides.push(file);
      } else if (subPath.startsWith('reference/')) {
        categories.reference.push(file);
      } else {
        categories.docs.push(file);
      }
    } else {
      categories.other.push(file);
    }
  }
  
  return categories;
}

function generateHealthScore(metrics) {
  let score = 100;
  
  // Deduct for staleness
  if (metrics.daysSinceUpdate > 30) score -= 20;
  else if (metrics.daysSinceUpdate > 7) score -= 10;
  
  // Deduct for FIXMEs/TODOs
  if (metrics.fixmes > 3) score -= 15;
  else if (metrics.fixmes > 0) score -= 5;
  
  // Add points for content richness
  if (metrics.codeBlocks > 0) score += 5;
  if (metrics.headers >= 3) score += 5;
  if (metrics.externalLinks > 0) score += 3;
  
  // Deduct for too many TODOs vs completed
  const todoRatio = metrics.todos / (metrics.completed + metrics.todos);
  if (todoRatio > 0.5) score -= 10;
  
  // Deduct for very short files
  if (metrics.lines < 10) score -= 15;
  
  return Math.max(0, Math.min(100, score));
}

function generateMarkdownReport(categories, summary) {
  const today = new Date().toISOString().split('T')[0];
  const projectRoot = path.dirname(__dirname);
  
  let report = `# Documentation Health Dashboard

**Generated**: ${today}  
**Script**: \`scripts/docs-health.js\`  

## Executive Summary

### Overall Health Score
\`\`\`
${generateProgressBar(summary.overallScore)} ${summary.overallScore}/100
\`\`\`

### Key Metrics
- **Total Files**: ${summary.totalFiles} documentation files
- **Total Lines**: ${summary.totalLines.toLocaleString()} lines
- **Code Examples**: ${summary.totalCodeBlocks} code blocks
- **Maintenance**: ${summary.totalTodos} TODOs, ${summary.totalFixmes} FIXMEs
- **Freshness**: ${summary.freshFiles} fresh, ${summary.moderateFiles} moderate, ${summary.staleFiles} stale

## File Health Breakdown

| Category | Files | Health Score | Last Updated |
|----------|-------|--------------|--------------|
`;

  for (const [category, files] of Object.entries(categories)) {
    if (files.length === 0) continue;
    
    const categoryMetrics = files.map(f => f.analysis).filter(a => !a.error);
    const avgScore = categoryMetrics.length > 0 
      ? Math.round(categoryMetrics.reduce((sum, m) => sum + generateHealthScore(m), 0) / categoryMetrics.length)
      : 0;
    
    const mostRecent = categoryMetrics.length > 0 
      ? categoryMetrics.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))[0].lastModified
      : 'Unknown';
    
    report += `| ${category} | ${files.length} | ${generateProgressBar(avgScore, 5)} ${avgScore}/100 | ${mostRecent} |\n`;
  }

  report += `

## Recommendations

### Immediate Actions Required
`;

  const staleFiles = Object.values(categories).flat()
    .filter(f => f.analysis && !f.analysis.error && f.analysis.daysSinceUpdate > 30);
  
  if (staleFiles.length > 0) {
    report += `- 🚨 **${staleFiles.length} stale files** need review (>30 days old)\n`;
  }

  const fixmeFiles = Object.values(categories).flat()
    .filter(f => f.analysis && !f.analysis.error && f.analysis.fixmes > 0);
  
  if (fixmeFiles.length > 0) {
    report += `- ⚠️ **${fixmeFiles.length} files** contain FIXMEs/TODOs needing attention\n`;
  }

  if (staleFiles.length === 0 && fixmeFiles.length === 0) {
    report += `- ✅ **No immediate actions required** - documentation is in good health\n`;
  }

  report += `

### Quality Improvements
- Add code examples to ${summary.totalFiles - summary.totalCodeBlocks} files without code blocks
- Convert ${summary.totalTodos} open TODOs to completed tasks or remove if obsolete
- Update ${staleFiles.length} stale documentation files

## Detailed File Analysis

`;

  // Add per-file details
  for (const [category, files] of Object.entries(categories)) {
    if (files.length === 0) continue;
    
    report += `### ${category.charAt(0).toUpperCase() + category.slice(1)} Files\n\n`;
    
    for (const file of files) {
      if (file.analysis && !file.analysis.error) {
        const relativePath = path.relative(projectRoot, file.path);
        const score = generateHealthScore(file.analysis);
        const scoreBar = generateProgressBar(score, 5);
        
        report += `#### ${relativePath}
- **Health**: ${scoreBar} ${score}/100
- **Size**: ${file.analysis.lines} lines, ${file.analysis.headers} headers
- **Elements**: ${file.analysis.codeBlocks} code blocks
- **Links**: ${file.analysis.internalLinks} internal, ${file.analysis.externalLinks} external
- **Tasks**: ${file.analysis.completed} completed, ${file.analysis.todos} pending
- **Last Updated**: ${file.analysis.lastModified} (${file.analysis.daysSinceUpdate} days ago)
- **Freshness**: ${file.analysis.freshness}

`;
      }
    }
  }

  report += `---
*Generated by \`scripts/docs-health.js\` on ${today}*
`;

  return report;
}

// Main execution
function main() {
  log('\n📊 Documentation Health Dashboard', colors.bright + colors.cyan);
  log('=====================================\n', colors.cyan);

  const projectRoot = path.dirname(__dirname);
  const docsDir = path.join(projectRoot, 'docs');
  
  log('🔍 Scanning documentation files...', colors.yellow);
  
  // Find markdown files in docs directory and project root
  const markdownFiles = [
    ...findMarkdownFiles(docsDir),
    ...findMarkdownFiles(projectRoot).filter(file => {
      const relativePath = path.relative(projectRoot, file);
      return !relativePath.includes('/') || relativePath.startsWith('docs/');
    })
  ];
  
  log(`Found ${markdownFiles.length} markdown files\n`, colors.green);

  if (markdownFiles.length === 0) {
    log('❌ No documentation files found!', colors.red);
    log('   Create some .md files in your project and docs/ directory.', colors.yellow);
    process.exit(1);
  }

  log('📈 Analyzing file contents...', colors.yellow);
  
  const analyzedFiles = markdownFiles.map(file => ({
    path: file,
    analysis: analyzeMarkdownFile(file)
  }));

  const categories = categorizeFiles(analyzedFiles);

  // Calculate summary metrics
  const validAnalyses = analyzedFiles
    .map(f => f.analysis)
    .filter(a => !a.error);

  const summary = {
    totalFiles: markdownFiles.length,
    validFiles: validAnalyses.length,
    totalLines: validAnalyses.reduce((sum, a) => sum + a.lines, 0),
    totalCodeBlocks: validAnalyses.reduce((sum, a) => sum + a.codeBlocks, 0),
    totalInternalLinks: validAnalyses.reduce((sum, a) => sum + a.internalLinks, 0),
    totalExternalLinks: validAnalyses.reduce((sum, a) => sum + a.externalLinks, 0),
    totalTodos: validAnalyses.reduce((sum, a) => sum + a.todos, 0),
    totalCompleted: validAnalyses.reduce((sum, a) => sum + a.completed, 0),
    totalFixmes: validAnalyses.reduce((sum, a) => sum + a.fixmes, 0),
    freshFiles: validAnalyses.filter(a => a.daysSinceUpdate <= 7).length,
    moderateFiles: validAnalyses.filter(a => a.daysSinceUpdate > 7 && a.daysSinceUpdate <= 30).length,
    staleFiles: validAnalyses.filter(a => a.daysSinceUpdate > 30).length
  };

  // Calculate overall health score
  const avgHealthScore = validAnalyses.length > 0 
    ? Math.round(validAnalyses.reduce((sum, a) => sum + generateHealthScore(a), 0) / validAnalyses.length)
    : 0;
  summary.overallScore = avgHealthScore;

  // Display console summary
  log('📊 Documentation Metrics:', colors.blue);
  log(`  Total Files:       ${summary.totalFiles}`);
  log(`  Total Lines:       ${summary.totalLines.toLocaleString()}`);
  log(`  Code Examples:     ${summary.totalCodeBlocks}`);
  log(`  Internal Links:    ${summary.totalInternalLinks}`);
  log(`  External Links:    ${summary.totalExternalLinks}`);

  log('\n📋 Maintenance Status:', colors.magenta);
  log(`  TODOs:             ${summary.totalTodos}`);
  log(`  Completed Items:   ${summary.totalCompleted}`);
  log(`  FIXMEs/NOTEs:      ${summary.totalFixmes}`);

  log('\n🕒 Freshness Analysis:', colors.yellow);
  log(`  Fresh (≤7 days):   ${summary.freshFiles} files`);
  log(`  Moderate (≤30):    ${summary.moderateFiles} files`);
  log(`  Stale (>30 days):  ${summary.staleFiles} files`);

  log('\n🎯 Overall Health Score:', colors.bright + colors.green);
  log(`  ${generateProgressBar(summary.overallScore)} ${summary.overallScore}/100`);

  // Category breakdown
  log('\n📁 Category Breakdown:', colors.cyan);
  for (const [category, files] of Object.entries(categories)) {
    if (files.length === 0) continue;
    
    const categoryMetrics = files.map(f => f.analysis).filter(a => !a.error);
    const avgScore = categoryMetrics.length > 0 
      ? Math.round(categoryMetrics.reduce((sum, m) => sum + generateHealthScore(m), 0) / categoryMetrics.length)
      : 0;
    
    const scoreColor = avgScore >= 80 ? colors.green : avgScore >= 60 ? colors.yellow : colors.red;
    log(`  ${category.padEnd(12)} ${files.length.toString().padStart(2)} files  ${generateProgressBar(avgScore, 5)} ${avgScore}/100`, scoreColor);
  }

  // Identify issues
  log('\n⚠️  Issues Requiring Attention:', colors.red);
  
  const staleFilesList = validAnalyses.filter(a => a.daysSinceUpdate > 30);
  if (staleFilesList.length > 0) {
    log(`\n  🚨 Stale Files (${staleFilesList.length}):`);
    staleFilesList.slice(0, 5).forEach(a => {
      const relativePath = path.relative(projectRoot, a.path);
      log(`     - ${relativePath} (${a.daysSinceUpdate} days old)`);
    });
    if (staleFilesList.length > 5) {
      log(`     ... and ${staleFilesList.length - 5} more`);
    }
  }

  const fixmeFilesList = validAnalyses.filter(a => a.fixmes > 0);
  if (fixmeFilesList.length > 0) {
    log(`\n  📝 Files with FIXMEs/TODOs (${fixmeFilesList.length}):`);
    fixmeFilesList.slice(0, 5).forEach(a => {
      const relativePath = path.relative(projectRoot, a.path);
      log(`     - ${relativePath} (${a.fixmes} items)`);
    });
    if (fixmeFilesList.length > 5) {
      log(`     ... and ${fixmeFilesList.length - 5} more`);
    }
  }

  if (staleFilesList.length === 0 && fixmeFilesList.length === 0) {
    log('\n  ✅ No issues found - documentation is healthy!', colors.green);
  }

  // Generate markdown report
  log('\n📄 Generating detailed report...', colors.yellow);
  
  const reportsDir = path.join(projectRoot, 'docs', 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const reportPath = path.join(reportsDir, 'documentation-health.md');
  const markdownReport = generateMarkdownReport(categories, summary);
  fs.writeFileSync(reportPath, markdownReport);

  log(`✅ Report saved: ${path.relative(process.cwd(), reportPath)}`, colors.green);

  // Exit with appropriate code
  const hasIssues = summary.staleFiles > 0 || summary.totalFixmes > 5;
  if (hasIssues) {
    log('\n⚠️  Documentation needs attention!', colors.yellow);
    log('   Run this script regularly to monitor health.', colors.yellow);
  } else {
    log('\n✨ Documentation is in excellent health!', colors.green);
  }

  log('\n📊 Dashboard complete!\n', colors.cyan);
}

if (require.main === module) {
  main();
}

module.exports = {
  analyzeMarkdownFile,
  generateProgressBar,
  generateHealthScore,
  findMarkdownFiles
};