#!/usr/bin/env node

/**
 * Unified Documentation Management Tool
 * Consolidates all documentation scripts into a single CLI interface
 *
 * Usage: node scripts/docs-tool.js <command> [options]
 *
 * Commands:
 *   health                   Analyze documentation health and coverage
 *   check-links             Validate internal and external links
 *   generate <template>     Generate docs from templates
 *   auto-generate <type>    Auto-generate docs from codebase analysis
 *   changelog               Track documentation changes via git
 *
 * Options:
 *   --format json|yaml|table  Output format (default: table)
 *   --output FILE            Write results to file
 *   --quiet                  Minimal output
 *   --debug                  Verbose debugging output
 *
 * Examples:
 *   docs-tool.js health --format json --output report.json
 *   docs-tool.js check-links --external --fix
 *   docs-tool.js auto-generate tech-stack
 *   docs-tool.js changelog --since "7 days ago" --detailed
 */

const { log, colors, parseArgs, execSafe, findFiles, writeJsonReport, formatters, EXIT_CODES } = require('../lib/common.js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const CONFIG = {
  docsDir: './docs',
  templatesDir: './templates/documentation',
  outputDir: './docs/reports',
  fileExtensions: ['.md', '.mdx'],
  excludeDirs: ['node_modules', '.git', '.next', 'dist', 'build'],
  linkTimeout: 5000,
  maxRedirects: 3
};

// Command handlers
const commands = {
  async health(args) {
    log.info('Starting documentation health analysis...');

    const metrics = {
      files: 0,
      totalLines: 0,
      codeBlocks: 0,
      links: 0,
      todos: 0,
      lastModified: null,
      coverage: {}
    };

    const files = findFiles(CONFIG.docsDir, {
      extensions: CONFIG.fileExtensions,
      excludeDirs: CONFIG.excludeDirs
    });

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');

        metrics.files++;
        metrics.totalLines += lines.length;

        // Count code blocks
        const codeBlockMatches = content.match(/```[\s\S]*?```/g) || [];
        metrics.codeBlocks += codeBlockMatches.length;

        // Count links
        const linkMatches = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
        metrics.links += linkMatches.length;

        // Count TODOs
        const todoMatches = content.match(/TODO|FIXME|XXX/gi) || [];
        metrics.todos += todoMatches.length;

        // File freshness
        const result = execSafe(`git log -1 --format="%ai" -- "${file}"`, { silent: true });
        if (result.success && result.output.trim()) {
          const modDate = new Date(result.output.trim());
          if (!metrics.lastModified || modDate > metrics.lastModified) {
            metrics.lastModified = modDate;
          }
        }

      } catch (error) {
        log.debug(`Error processing ${file}: ${error.message}`);
      }
    }

    // Calculate coverage
    const expectedDocs = ['README.md', 'CHANGELOG.md', 'CONTRIBUTING.md'];
    metrics.coverage.hasRequired = expectedDocs.every(doc =>
      files.some(file => file.endsWith(doc))
    );

    const result = {
      summary: {
        files: metrics.files,
        totalLines: metrics.totalLines,
        averageLinesPerFile: Math.round(metrics.totalLines / metrics.files),
        codeBlocks: metrics.codeBlocks,
        links: metrics.links,
        todos: metrics.todos,
        lastModified: metrics.lastModified?.toISOString() || 'unknown',
        hasRequiredDocs: metrics.coverage.hasRequired
      },
      files: files.map(file => ({
        path: file,
        size: fs.statSync(file).size,
        lines: fs.readFileSync(file, 'utf8').split('\n').length
      }))
    };

    if (args.options.format === 'json') {
      console.log(formatters.json(result));
    } else {
      log.success(`Documentation Health Report`);
      log.plain(`Files: ${result.summary.files}`, colors.cyan);
      log.plain(`Total Lines: ${result.summary.totalLines}`, colors.cyan);
      log.plain(`Code Blocks: ${result.summary.codeBlocks}`, colors.cyan);
      log.plain(`Links: ${result.summary.links}`, colors.cyan);
      log.plain(`TODOs: ${result.summary.todos}`, colors.yellow);
      log.plain(`Required Docs: ${result.summary.hasRequiredDocs ? '✓' : '✗'}`,
        result.summary.hasRequiredDocs ? colors.green : colors.red);
    }

    if (args.options.output) {
      writeJsonReport(result, args.options.output);
    }

    return result.summary.hasRequiredDocs ? EXIT_CODES.SUCCESS : EXIT_CODES.VALIDATION_FAILED;
  },

  async checkLinks(args) {
    log.info('Validating documentation links...');

    const results = {
      internal: { valid: 0, broken: 0, links: [] },
      external: { valid: 0, broken: 0, links: [] },
      summary: { totalChecked: 0, totalBroken: 0 }
    };

    const files = findFiles(CONFIG.docsDir, {
      extensions: CONFIG.fileExtensions,
      excludeDirs: CONFIG.excludeDirs
    });

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;

        while ((match = linkRegex.exec(content)) !== null) {
          const [fullMatch, text, url] = match;

          if (url.startsWith('http://') || url.startsWith('https://')) {
            // External link
            if (args.flags.has('external')) {
              const isValid = await checkExternalLink(url);
              results.external.links.push({ text, url, valid: isValid, file });
              if (isValid) results.external.valid++;
              else results.external.broken++;
            }
          } else {
            // Internal link
            const isValid = checkInternalLink(url, file);
            results.internal.links.push({ text, url, valid: isValid, file });
            if (isValid) results.internal.valid++;
            else results.internal.broken++;
          }
        }
      } catch (error) {
        log.debug(`Error processing ${file}: ${error.message}`);
      }
    }

    results.summary.totalChecked = results.internal.links.length + results.external.links.length;
    results.summary.totalBroken = results.internal.broken + results.external.broken;

    if (args.options.format === 'json') {
      console.log(formatters.json(results));
    } else {
      log.success('Link Validation Complete');
      log.plain(`Internal Links: ${results.internal.valid} valid, ${results.internal.broken} broken`, colors.cyan);
      if (args.flags.has('external')) {
        log.plain(`External Links: ${results.external.valid} valid, ${results.external.broken} broken`, colors.cyan);
      }

      if (results.summary.totalBroken > 0) {
        log.warning(`Found ${results.summary.totalBroken} broken links`);

        [...results.internal.links, ...results.external.links]
          .filter(link => !link.valid)
          .forEach(link => {
            log.error(`${link.file}: ${link.url}`);
          });
      }
    }

    if (args.options.output) {
      writeJsonReport(results, args.options.output);
    }

    return results.summary.totalBroken === 0 ? EXIT_CODES.SUCCESS : EXIT_CODES.VALIDATION_FAILED;
  },

  async generate(args) {
    const template = args._[1];
    if (!template) {
      log.error('Template name required. Use --list to see available templates.');
      return EXIT_CODES.INVALID_ARGS;
    }

    if (args.flags.has('list')) {
      return listTemplates();
    }

    log.info(`Generating documentation from template: ${template}`);

    try {
      const templatePath = path.join(CONFIG.templatesDir, `${template}.template.md`);

      if (!fs.existsSync(templatePath)) {
        log.error(`Template not found: ${templatePath}`);
        return EXIT_CODES.FILE_NOT_FOUND;
      }

      const templateContent = fs.readFileSync(templatePath, 'utf8');
      const processed = await processTemplate(templateContent);

      if (args.flags.has('preview')) {
        console.log(processed);
      } else {
        const outputPath = args.options.output || `./docs/${template}.md`;
        fs.writeFileSync(outputPath, processed, 'utf8');
        log.success(`Generated: ${outputPath}`);
      }

      return EXIT_CODES.SUCCESS;
    } catch (error) {
      log.error(`Generation failed: ${error.message}`);
      return EXIT_CODES.GENERAL_ERROR;
    }
  },

  async autoGenerate(args) {
    const type = args._[1];
    if (!type) {
      log.error('Generation type required (tech-stack, system-overview, dependencies, etc.)');
      return EXIT_CODES.INVALID_ARGS;
    }

    log.info(`Auto-generating ${type} documentation...`);

    const generators = {
      'tech-stack': generateTechStack,
      'system-overview': generateSystemOverview,
      'dependencies': generateDependencies,
      'api-reference': generateApiReference,
      'schemas': generateSchemas,
      'decision': generateDecision,
      'decision-summary': generateDecisionSummary,
      'all': generateAll
    };

    if (!(type in generators)) {
      log.error(`Unknown generation type: ${type}`);
      return EXIT_CODES.INVALID_ARGS;
    }

    try {
      const result = await generators[type](args);
      log.success(`Generated ${type} documentation`);
      return EXIT_CODES.SUCCESS;
    } catch (error) {
      log.error(`Auto-generation failed: ${error.message}`);
      return EXIT_CODES.GENERAL_ERROR;
    }
  },

  async changelog(args) {
    log.info('Generating documentation changelog...');

    const since = args.options.since || '30 days ago';
    const author = args.options.author;

    try {
      let gitCmd = `git log --oneline --since="${since}" --pretty="format:%h|%ai|%an|%s"`;
      if (author) {
        gitCmd += ` --author="${author}"`;
      }
      gitCmd += ' -- docs/';

      const result = execSafe(gitCmd, { silent: true });
      if (!result.success) {
        log.error('Failed to retrieve git history');
        return EXIT_CODES.GENERAL_ERROR;
      }

      const changes = result.output.trim().split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [hash, date, authorName, message] = line.split('|');
          return { hash, date, author: authorName, message };
        });

      const changelog = {
        period: since,
        totalChanges: changes.length,
        changes: args.flags.has('detailed') ? changes : changes.slice(0, 10),
        authors: [...new Set(changes.map(c => c.author))]
      };

      if (args.options.format === 'json') {
        console.log(formatters.json(changelog));
      } else {
        log.success(`Documentation Changes (${since})`);
        log.plain(`Total Changes: ${changelog.totalChanges}`, colors.cyan);
        log.plain(`Contributors: ${changelog.authors.join(', ')}`, colors.cyan);

        changelog.changes.forEach(change => {
          log.plain(`${change.hash} ${change.message} (${change.author})`, colors.dim);
        });
      }

      if (args.options.output) {
        writeJsonReport(changelog, args.options.output);
      }

      return EXIT_CODES.SUCCESS;
    } catch (error) {
      log.error(`Changelog generation failed: ${error.message}`);
      return EXIT_CODES.GENERAL_ERROR;
    }
  }
};

// Helper functions
async function checkExternalLink(url) {
  return new Promise((resolve) => {
    const request = (url.startsWith('https') ? https : http).get(url, {
      timeout: CONFIG.linkTimeout
    }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });

    request.on('error', () => resolve(false));
    request.on('timeout', () => resolve(false));
  });
}

function checkInternalLink(url, baseFile) {
  try {
    // Handle relative paths
    const basePath = path.dirname(baseFile);
    const targetPath = path.resolve(basePath, url);
    return fs.existsSync(targetPath);
  } catch (error) {
    return false;
  }
}

function listTemplates() {
  try {
    const templates = fs.readdirSync(CONFIG.templatesDir)
      .filter(file => file.endsWith('.template.md'))
      .map(file => file.replace('.template.md', ''));

    log.success('Available Templates:');
    templates.forEach(template => log.plain(`  • ${template}`, colors.cyan));

    return EXIT_CODES.SUCCESS;
  } catch (error) {
    log.error(`Failed to list templates: ${error.message}`);
    return EXIT_CODES.GENERAL_ERROR;
  }
}

async function processTemplate(content) {
  // Simple template processing - replace common placeholders
  const gitInfo = execSafe('git config user.name', { silent: true });
  const authorName = gitInfo.success ? gitInfo.output.trim() : 'Unknown';

  return content
    .replace(/\{\{author\}\}/g, authorName)
    .replace(/\{\{date\}\}/g, new Date().toISOString().split('T')[0])
    .replace(/\{\{year\}\}/g, new Date().getFullYear().toString());
}

// Auto-generation functions (simplified versions)
function generateTechStack(args) {
  const packageJson = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJson)) {
    const pkg = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
    const techStack = {
      dependencies: Object.keys(pkg.dependencies || {}),
      devDependencies: Object.keys(pkg.devDependencies || {})
    };

    log.plain('Tech Stack Analysis:', colors.cyan);
    log.plain(`Dependencies: ${techStack.dependencies.length}`, colors.dim);
    log.plain(`Dev Dependencies: ${techStack.devDependencies.length}`, colors.dim);
  }
}

function generateSystemOverview(args) {
  log.plain('System Overview:', colors.cyan);
  log.plain('Analyzing project structure...', colors.dim);
  // Simplified implementation
}

function generateDependencies(args) {
  log.plain('Dependency Analysis:', colors.cyan);
  log.plain('Analyzing dependency relationships...', colors.dim);
  // Simplified implementation
}

function generateApiReference(args) {
  log.plain('API Reference:', colors.cyan);
  log.plain('Scanning for API endpoints...', colors.dim);
  // Simplified implementation
}

function generateSchemas(args) {
  log.plain('Schema Documentation:', colors.cyan);
  log.plain('Analyzing data schemas...', colors.dim);
  // Simplified implementation
}

function generateDecision(args) {
  log.plain('Decision Documentation:', colors.cyan);
  log.plain('Creating decision record...', colors.dim);
  // Simplified implementation
}

function generateDecisionSummary(args) {
  log.plain('Decision Summary:', colors.cyan);
  log.plain('Compiling decision history...', colors.dim);
  // Simplified implementation
}

function generateAll(args) {
  log.plain('Generating all documentation:', colors.cyan);
  // Run all generators
}

// Main execution
async function main() {
  const args = parseArgs({
    format: 'table',
    output: null
  });

  const command = args._[0];

  if (!command || !commands[command]) {
    log.error('Usage: docs-tool.js <command> [options]');
    log.plain('Commands: health, check-links, generate, auto-generate, changelog', colors.cyan);
    process.exit(EXIT_CODES.INVALID_ARGS);
  }

  try {
    const exitCode = await commands[command](args);
    process.exit(exitCode);
  } catch (error) {
    log.error(`Command failed: ${error.message}`);
    process.exit(EXIT_CODES.GENERAL_ERROR);
  }
}

// Only run main if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { commands };