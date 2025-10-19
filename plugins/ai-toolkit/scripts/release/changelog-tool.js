#!/usr/bin/env node

/**
 * Unified Changelog Management Tool
 * Consolidates changelog update, audit, and validation functionality
 *
 * Usage: node scripts/changelog-tool.js <command> [options]
 *
 * Commands:
 *   analyze                  Analyze recent commits and suggest changelog entries
 *   add <type> <message>     Add a new changelog entry
 *   audit                    Comprehensive changelog completeness audit
 *   check                    Validate changelog format and completeness
 *   init                     Initialize new changelog file
 *
 * Options:
 *   --since TIMEFRAME       Analyze commits since timeframe (default: "7 days ago")
 *   --type TYPE             Entry type: added, changed, deprecated, removed, fixed, security
 *   --format json|yaml      Output format (default: table)
 *   --output FILE           Write results to file
 *   --quiet                 Minimal output
 *   --fix                   Attempt to auto-fix issues
 *   --interactive           Interactive mode for adding entries
 *
 * Examples:
 *   changelog-tool.js analyze --since "3 days ago"
 *   changelog-tool.js add fixed "Resolved authentication timeout issue"
 *   changelog-tool.js audit --format json --output audit-report.json
 *   changelog-tool.js check --fix
 */

const { log, colors, parseArgs, execSafe, writeJsonReport, formatters, EXIT_CODES, formatDate } = require('../lib/common.js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const CONFIG = {
  changelogFile: './CHANGELOG.md',
  deliverablesDir: './deliverables',
  excludePatterns: [
    /^docs?\//,
    /README\.md$/,
    /\.gitignore$/,
    /package-lock\.json$/,
    /yarn\.lock$/
  ],
  changeTypes: {
    added: 'Added',
    changed: 'Changed',
    deprecated: 'Deprecated',
    removed: 'Removed',
    fixed: 'Fixed',
    security: 'Security'
  }
};

// Command handlers
const commands = {
  async analyze(args) {
    log.info('Analyzing recent commits for changelog suggestions...');

    const since = args.options.since || '7 days ago';
    const gitCmd = `git log --oneline --since="${since}" --pretty="format:%h|%ai|%an|%s"`;

    const result = execSafe(gitCmd, { silent: true });
    if (!result.success) {
      log.error('Failed to retrieve git history');
      return EXIT_CODES.GENERAL_ERROR;
    }

    const commits = result.output.trim().split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [hash, date, author, message] = line.split('|');
        return { hash, date, author, message, suggested: categorizeCommit(message) };
      })
      .filter(commit => commit.suggested.type !== 'ignore');

    const analysis = {
      period: since,
      totalCommits: commits.length,
      suggestions: commits,
      summary: generateSummary(commits)
    };

    if (args.options.format === 'json') {
      console.log(formatters.json(analysis));
    } else {
      log.success(`Changelog Analysis (${since})`);
      log.plain(`Total Commits: ${analysis.totalCommits}`, colors.cyan);

      Object.entries(analysis.summary).forEach(([type, count]) => {
        if (count > 0) {
          log.plain(`${CONFIG.changeTypes[type] || type}: ${count}`, colors.dim);
        }
      });

      log.plain('\nSuggested Entries:', colors.bright);
      commits.forEach(commit => {
        const type = commit.suggested.type;
        const color = getTypeColor(type);
        log.plain(`${commit.hash} [${type.toUpperCase()}] ${commit.suggested.description}`, color);
      });
    }

    if (args.options.output) {
      writeJsonReport(analysis, args.options.output);
    }

    return EXIT_CODES.SUCCESS;
  },

  async add(args) {
    const type = args._[1];
    const message = args._[2];

    if (args.flags.has('interactive') || !type || !message) {
      return await addInteractive();
    }

    if (!CONFIG.changeTypes[type]) {
      log.error(`Invalid type: ${type}. Valid types: ${Object.keys(CONFIG.changeTypes).join(', ')}`);
      return EXIT_CODES.INVALID_ARGS;
    }

    return await addEntry(type, message);
  },

  async audit(args) {
    log.info('Performing comprehensive changelog audit...');

    const audit = {
      fileExists: fs.existsSync(CONFIG.changelogFile),
      format: { valid: false, errors: [] },
      completeness: { score: 0, missing: [] },
      recommendations: []
    };

    if (!audit.fileExists) {
      audit.recommendations.push('Create CHANGELOG.md file');
      log.error('CHANGELOG.md not found');
      return EXIT_CODES.FILE_NOT_FOUND;
    }

    const content = fs.readFileSync(CONFIG.changelogFile, 'utf8');

    // Format validation
    audit.format = validateFormat(content);

    // Completeness check
    audit.completeness = await checkCompleteness();

    // Generate recommendations
    if (!audit.format.valid) {
      audit.recommendations.push('Fix changelog format issues');
    }
    if (audit.completeness.score < 80) {
      audit.recommendations.push('Update changelog with recent changes');
    }

    const result = {
      overall: audit.format.valid && audit.completeness.score >= 80 ? 'PASS' : 'FAIL',
      ...audit
    };

    if (args.options.format === 'json') {
      console.log(formatters.json(result));
    } else {
      log.success('Changelog Audit Results');
      log.plain(`Overall: ${result.overall}`, result.overall === 'PASS' ? colors.green : colors.red);
      log.plain(`Format Valid: ${audit.format.valid ? '✓' : '✗'}`, audit.format.valid ? colors.green : colors.red);
      log.plain(`Completeness Score: ${audit.completeness.score}%`, colors.cyan);

      if (audit.format.errors.length > 0) {
        log.warning('Format Issues:');
        audit.format.errors.forEach(error => log.plain(`  • ${error}`, colors.red));
      }

      if (audit.recommendations.length > 0) {
        log.warning('Recommendations:');
        audit.recommendations.forEach(rec => log.plain(`  • ${rec}`, colors.yellow));
      }
    }

    if (args.options.output) {
      writeJsonReport(result, args.options.output);
    }

    return result.overall === 'PASS' ? EXIT_CODES.SUCCESS : EXIT_CODES.VALIDATION_FAILED;
  },

  async check(args) {
    log.info('Checking changelog format and recent changes...');

    if (!fs.existsSync(CONFIG.changelogFile)) {
      log.error('CHANGELOG.md not found');
      return EXIT_CODES.FILE_NOT_FOUND;
    }

    const issues = [];
    const content = fs.readFileSync(CONFIG.changelogFile, 'utf8');

    // Format validation
    const formatResult = validateFormat(content);
    if (!formatResult.valid) {
      issues.push(...formatResult.errors);
    }

    // Check for recent changes
    const recentCommits = await getRecentCommits('7 days ago');
    const changelogModified = await isChangelogRecentlyModified('7 days ago');

    if (recentCommits.length > 0 && !changelogModified) {
      issues.push('Changelog not updated recently despite new commits');
    }

    const result = {
      valid: issues.length === 0,
      issues,
      recentCommits: recentCommits.length,
      changelogModified
    };

    if (args.options.format === 'json') {
      console.log(formatters.json(result));
    } else {
      if (result.valid) {
        log.success('Changelog check passed');
      } else {
        log.warning('Changelog issues found:');
        issues.forEach(issue => log.plain(`  • ${issue}`, colors.red));
      }

      if (args.flags.has('fix') && !result.valid) {
        log.info('Attempting to fix issues...');
        // Basic auto-fix functionality
        await autoFixIssues(issues);
      }
    }

    return result.valid ? EXIT_CODES.SUCCESS : EXIT_CODES.VALIDATION_FAILED;
  },

  async init(args) {
    log.info('Initializing new changelog...');

    if (fs.existsSync(CONFIG.changelogFile)) {
      log.warning('CHANGELOG.md already exists');
      return EXIT_CODES.GENERAL_ERROR;
    }

    const template = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup

## [0.1.0] - ${formatDate()}

### Added
- Initial release
`;

    fs.writeFileSync(CONFIG.changelogFile, template, 'utf8');
    log.success(`Created ${CONFIG.changelogFile}`);

    return EXIT_CODES.SUCCESS;
  }
};

// Helper functions
function categorizeCommit(message) {
  const msg = message.toLowerCase();

  const patterns = {
    added: /^(add|feat|feature|new)[:(\s]/,
    fixed: /^(fix|bug|hotfix|patch)[:(\s]|fix\s/,
    changed: /^(update|change|modify|refactor|improve)[:(\s]/,
    removed: /^(remove|delete|drop)[:(\s]/,
    security: /^(security|sec)[:(\s]|security/,
    deprecated: /^(deprecate|deprecated)[:(\s]/
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(msg)) {
      return {
        type,
        description: cleanCommitMessage(message)
      };
    }
  }

  // Check for excluded patterns
  for (const pattern of CONFIG.excludePatterns) {
    if (pattern.test(message)) {
      return { type: 'ignore', description: '' };
    }
  }

  return {
    type: 'changed',
    description: cleanCommitMessage(message)
  };
}

function cleanCommitMessage(message) {
  return message
    .replace(/^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?:\s*/i, '')
    .replace(/^(add|fix|update|remove|change):\s*/i, '')
    .trim();
}

function generateSummary(commits) {
  const summary = {};
  commits.forEach(commit => {
    const type = commit.suggested.type;
    summary[type] = (summary[type] || 0) + 1;
  });
  return summary;
}

function getTypeColor(type) {
  const colors_map = {
    added: colors.green,
    fixed: colors.red,
    changed: colors.yellow,
    removed: colors.magenta,
    security: colors.cyan,
    deprecated: colors.dim
  };
  return colors_map[type] || colors.reset;
}

function validateFormat(content) {
  const errors = [];
  let valid = true;

  // Check for required headers
  if (!content.includes('# Changelog')) {
    errors.push('Missing main "# Changelog" header');
    valid = false;
  }

  // Check for Keep a Changelog format
  if (!content.includes('keepachangelog.com')) {
    errors.push('Missing reference to Keep a Changelog format');
  }

  // Check for version sections
  const versionRegex = /## \[[\d.]+\]/g;
  const versions = content.match(versionRegex);
  if (!versions || versions.length === 0) {
    errors.push('No version sections found');
    valid = false;
  }

  return { valid, errors };
}

async function checkCompleteness() {
  const commits = await getRecentCommits('30 days ago');
  const changelogModified = await isChangelogRecentlyModified('30 days ago');

  let score = 50; // Base score

  if (changelogModified) score += 30;
  if (commits.length === 0) score += 20; // No commits means nothing to update
  else if (commits.length < 5) score += 10;

  return {
    score: Math.min(100, score),
    missing: commits.length > 0 && !changelogModified ? ['Recent commits not reflected'] : []
  };
}

async function getRecentCommits(since) {
  const result = execSafe(`git log --oneline --since="${since}"`, { silent: true });
  if (!result.success) return [];

  return result.output.trim().split('\n').filter(line => line.trim());
}

async function isChangelogRecentlyModified(since) {
  const result = execSafe(`git log --oneline --since="${since}" -- ${CONFIG.changelogFile}`, { silent: true });
  return result.success && result.output.trim() !== '';
}

async function addEntry(type, message) {
  try {
    if (!fs.existsSync(CONFIG.changelogFile)) {
      log.error('CHANGELOG.md not found. Run "init" command first.');
      return EXIT_CODES.FILE_NOT_FOUND;
    }

    let content = fs.readFileSync(CONFIG.changelogFile, 'utf8');
    const typeHeader = `### ${CONFIG.changeTypes[type]}`;
    const entry = `- ${message}`;

    // Find the Unreleased section
    const unreleasedMatch = content.match(/(## \[Unreleased\][\s\S]*?)(?=## \[|\z)/);
    if (!unreleasedMatch) {
      log.error('Could not find [Unreleased] section in changelog');
      return EXIT_CODES.GENERAL_ERROR;
    }

    let unreleasedSection = unreleasedMatch[1];

    // Check if type section exists
    if (unreleasedSection.includes(typeHeader)) {
      // Add to existing section
      const typeMatch = unreleasedSection.match(new RegExp(`(${typeHeader}[\\s\\S]*?)(?=### |## |\\z)`));
      if (typeMatch) {
        const updatedTypeSection = typeMatch[1] + entry + '\n';
        unreleasedSection = unreleasedSection.replace(typeMatch[1], updatedTypeSection);
      }
    } else {
      // Create new type section
      const typeSection = `\n${typeHeader}\n${entry}\n`;
      unreleasedSection = unreleasedSection.replace('## [Unreleased]', `## [Unreleased]${typeSection}`);
    }

    content = content.replace(unreleasedMatch[1], unreleasedSection);
    fs.writeFileSync(CONFIG.changelogFile, content, 'utf8');

    log.success(`Added ${type} entry: ${message}`);
    return EXIT_CODES.SUCCESS;
  } catch (error) {
    log.error(`Failed to add entry: ${error.message}`);
    return EXIT_CODES.GENERAL_ERROR;
  }
}

async function addInteractive() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    log.info('Interactive changelog entry creation');

    const type = await question(rl, `Entry type (${Object.keys(CONFIG.changeTypes).join('/')}): `);
    if (!CONFIG.changeTypes[type]) {
      log.error('Invalid type');
      return EXIT_CODES.INVALID_ARGS;
    }

    const message = await question(rl, 'Description: ');
    if (!message.trim()) {
      log.error('Description required');
      return EXIT_CODES.INVALID_ARGS;
    }

    return await addEntry(type, message.trim());
  } finally {
    rl.close();
  }
}

function question(rl, prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function autoFixIssues(issues) {
  // Basic auto-fix implementation
  log.info('Auto-fix is not yet implemented');
}

// Main execution
async function main() {
  const args = parseArgs({
    since: '7 days ago',
    format: 'table',
    output: null
  });

  const command = args._[0];

  if (!command || !commands[command]) {
    log.error('Usage: changelog-tool.js <command> [options]');
    log.plain('Commands: analyze, add, audit, check, init', colors.cyan);
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