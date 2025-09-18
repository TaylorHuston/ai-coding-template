#!/usr/bin/env node

/**
 * Shared JavaScript Utilities for AI Coding Template Scripts
 * Provides consistent logging, colors, argument parsing, and common utilities
 *
 * Usage:
 *   const { log, colors, parseArgs, execSafe, findFiles } = require('./lib/common.js');
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI Color Codes - consistent with shell scripts
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Semantic colors
  error: '\x1b[31m',
  success: '\x1b[32m',
  warning: '\x1b[33m',
  info: '\x1b[34m',
  debug: '\x1b[35m'
};

// Logging utilities with consistent formatting
const log = {
  info: (message, quiet = false) => {
    if (!quiet && !process.argv.includes('--quiet')) {
      console.log(`${colors.info}ℹ ${message}${colors.reset}`);
    }
  },

  success: (message, quiet = false) => {
    if (!quiet && !process.argv.includes('--quiet')) {
      console.log(`${colors.success}✓ ${message}${colors.reset}`);
    }
  },

  warning: (message, quiet = false) => {
    if (!quiet && !process.argv.includes('--quiet')) {
      console.log(`${colors.warning}⚠ ${message}${colors.reset}`);
    }
  },

  error: (message, quiet = false) => {
    if (!quiet) {
      console.error(`${colors.error}✗ ${message}${colors.reset}`);
    }
  },

  debug: (message, quiet = false) => {
    if (!quiet && (process.argv.includes('--debug') || process.argv.includes('-v'))) {
      console.log(`${colors.debug}🐛 ${message}${colors.reset}`);
    }
  },

  plain: (message, color = colors.reset, quiet = false) => {
    if (!quiet && !process.argv.includes('--quiet')) {
      console.log(`${color}${message}${colors.reset}`);
    }
  }
};

// Progress bar generator
function generateProgressBar(percentage, width = 20, char = '█', empty = '░') {
  const filled = Math.round((percentage / 100) * width);
  const emptyCount = width - filled;
  const bar = char.repeat(filled) + empty.repeat(emptyCount);
  return `[${bar}] ${percentage.toFixed(1)}%`;
}

// Argument parsing utilities
function parseArgs(expectedArgs = {}) {
  const args = process.argv.slice(2);
  const parsed = {
    _: [], // positional arguments
    flags: new Set(),
    options: {}
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const key = arg.slice(2);

      // Check if it's a flag or option
      if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
        parsed.options[key] = args[i + 1];
        i++; // skip next argument
      } else {
        parsed.flags.add(key);
      }
    } else if (arg.startsWith('-')) {
      parsed.flags.add(arg.slice(1));
    } else {
      parsed._.push(arg);
    }
  }

  // Apply defaults from expectedArgs
  for (const [key, defaultValue] of Object.entries(expectedArgs)) {
    if (!(key in parsed.options)) {
      parsed.options[key] = defaultValue;
    }
  }

  return parsed;
}

// Safe command execution
function execSafe(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return { success: true, output: result };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: error.status,
      output: error.stdout || ''
    };
  }
}

// File system utilities
function findFiles(dir, options = {}) {
  const {
    extensions = ['.md', '.js', '.ts', '.json'],
    excludeDirs = ['node_modules', '.git', 'dist', 'build'],
    recursive = true
  } = options;

  const results = [];

  function scan(currentDir) {
    try {
      const items = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(currentDir, item.name);

        if (item.isDirectory()) {
          if (recursive && !excludeDirs.includes(item.name)) {
            scan(fullPath);
          }
        } else if (item.isFile()) {
          const ext = path.extname(item.name);
          if (extensions.length === 0 || extensions.includes(ext)) {
            results.push(fullPath);
          }
        }
      }
    } catch (error) {
      log.debug(`Unable to scan directory: ${currentDir} - ${error.message}`);
    }
  }

  scan(dir);
  return results;
}

// File content utilities
function readFileLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n');
  } catch (error) {
    return [];
  }
}

function writeJsonReport(data, filePath) {
  try {
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, json, 'utf8');
    return true;
  } catch (error) {
    log.error(`Failed to write JSON report: ${error.message}`);
    return false;
  }
}

// Date utilities
function formatDate(date = new Date()) {
  return date.toISOString().split('T')[0];
}

function getFileAge(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const now = new Date();
    const modified = new Date(stats.mtime);
    const days = Math.floor((now - modified) / (1000 * 60 * 60 * 24));
    return days;
  } catch (error) {
    return -1;
  }
}

// Git utilities
function getGitInfo(filePath = '.') {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    const modified = execSync('git status --porcelain', { encoding: 'utf8' }).trim() !== '';

    return { branch, commit, modified };
  } catch (error) {
    return { branch: 'unknown', commit: 'unknown', modified: false };
  }
}

// Output formatting
const formatters = {
  table: (data, headers) => {
    if (!data.length) return '';

    const widths = headers.map((header, i) => {
      const values = data.map(row => String(row[i] || ''));
      return Math.max(header.length, ...values.map(v => v.length));
    });

    const separator = '┼' + widths.map(w => '─'.repeat(w + 2)).join('┼') + '┼';
    const headerRow = '│ ' + headers.map((h, i) => h.padEnd(widths[i])).join(' │ ') + ' │';

    let result = '┌' + widths.map(w => '─'.repeat(w + 2)).join('┬') + '┐\n';
    result += headerRow + '\n';
    result += separator + '\n';

    for (const row of data) {
      const rowStr = '│ ' + row.map((cell, i) => String(cell || '').padEnd(widths[i])).join(' │ ') + ' │';
      result += rowStr + '\n';
    }

    result += '└' + widths.map(w => '─'.repeat(w + 2)).join('┴') + '┘';
    return result;
  },

  json: (data) => JSON.stringify(data, null, 2),

  yaml: (data) => {
    // Simple YAML formatter for basic objects
    function toYaml(obj, indent = 0) {
      const spaces = ' '.repeat(indent);
      let result = '';

      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          result += `${spaces}${key}:\n${toYaml(value, indent + 2)}`;
        } else {
          result += `${spaces}${key}: ${value}\n`;
        }
      }

      return result;
    }

    return toYaml(data);
  }
};

// Exit codes for consistency
const EXIT_CODES = {
  SUCCESS: 0,
  GENERAL_ERROR: 1,
  INVALID_ARGS: 2,
  FILE_NOT_FOUND: 3,
  PERMISSION_ERROR: 4,
  VALIDATION_FAILED: 5
};

module.exports = {
  colors,
  log,
  generateProgressBar,
  parseArgs,
  execSafe,
  findFiles,
  readFileLines,
  writeJsonReport,
  formatDate,
  getFileAge,
  getGitInfo,
  formatters,
  EXIT_CODES
};