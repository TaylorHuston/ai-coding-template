#!/usr/bin/env node

/**
 * Documentation Changelog Generator
 * Tracks documentation changes using git history
 * 
 * Usage: node scripts/docs-changelog.js [options]
 * Options:
 *   --since TIMEFRAME    Show changes since timeframe (e.g., "7 days ago", "2023-01-01")
 *   --author AUTHOR      Filter by author
 *   --format json        Output in JSON format
 *   --output FILE        Write to file
 *   --detailed           Include file-level change details
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  fileExtensions: ['.md', '.mdx'],
  excludeDirs: ['node_modules', '.git', '.next', 'dist', 'build'],
  maxCommits: 100
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
  console.log(`${color}${message}${colors.reset}`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    since: '30 days ago',
    author: null,
    format: 'text',
    output: null,
    detailed: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--since':
        options.since = args[++i];
        break;
      case '--author':
        options.author = args[++i];
        break;
      case '--format':
        options.format = args[++i] || 'text';
        break;
      case '--output':
        options.output = args[++i];
        break;
      case '--detailed':
        options.detailed = true;
        break;
    }
  }

  return options;
}

function getGitCommits(options) {
  try {
    let gitCommand = `git log --oneline --since="${options.since}" --max-count=${CONFIG.maxCommits}`;
    
    if (options.author) {
      gitCommand += ` --author="${options.author}"`;
    }
    
    // Only include commits that touch documentation files
    const docPaths = CONFIG.fileExtensions.map(ext => `*${ext}`).join(' ');
    gitCommand += ` -- ${docPaths}`;
    
    const output = execSync(gitCommand, { encoding: 'utf8' });
    
    if (!output.trim()) {
      return [];
    }
    
    return output.trim().split('\n').map(line => {
      const [hash, ...messageParts] = line.split(' ');
      return {
        hash: hash.trim(),
        message: messageParts.join(' ').trim()
      };
    });
  } catch (error) {
    if (error.message.includes('not a git repository')) {
      throw new Error('Not in a git repository');
    }
    return [];
  }
}

function getCommitDetails(hash) {
  try {
    // Get commit metadata
    const metaCommand = `git show --format="%H|%an|%ae|%ai|%s" --no-patch ${hash}`;
    const metaOutput = execSync(metaCommand, { encoding: 'utf8' }).trim();
    const [fullHash, author, email, date, subject] = metaOutput.split('|');
    
    // Get changed documentation files
    const filesCommand = `git diff-tree --no-commit-id --name-only -r ${hash} -- ${CONFIG.fileExtensions.map(ext => `*${ext}`).join(' ')}`;
    const filesOutput = execSync(filesCommand, { encoding: 'utf8' });
    const changedFiles = filesOutput.trim() ? filesOutput.trim().split('\n') : [];
    
    // Get file change stats
    const statsCommand = `git diff-tree --no-commit-id --numstat -r ${hash} -- ${CONFIG.fileExtensions.map(ext => `*${ext}`).join(' ')}`;
    const statsOutput = execSync(statsCommand, { encoding: 'utf8' });
    const fileStats = {};
    
    if (statsOutput.trim()) {
      statsOutput.trim().split('\n').forEach(line => {
        const [added, removed, file] = line.split('\t');
        fileStats[file] = {
          added: added === '-' ? 0 : parseInt(added),
          removed: removed === '-' ? 0 : parseInt(removed)
        };
      });
    }
    
    return {
      hash: fullHash,
      shortHash: hash,
      author,
      email,
      date: new Date(date),
      subject,
      changedFiles,
      fileStats,
      totalAdded: Object.values(fileStats).reduce((sum, stats) => sum + stats.added, 0),
      totalRemoved: Object.values(fileStats).reduce((sum, stats) => sum + stats.removed, 0)
    };
  } catch (error) {
    return null;
  }
}

function analyzeChanges(commits) {
  const analysis = {
    totalCommits: commits.length,
    totalFilesChanged: new Set(),
    authors: new Map(),
    fileChangeCount: new Map(),
    changesByType: {
      created: 0,
      modified: 0,
      deleted: 0
    },
    totalLinesAdded: 0,
    totalLinesRemoved: 0,
    averageChangesPerCommit: 0
  };
  
  commits.forEach(commit => {
    // Track authors
    if (!analysis.authors.has(commit.author)) {
      analysis.authors.set(commit.author, {
        commits: 0,
        filesChanged: new Set(),
        linesAdded: 0,
        linesRemoved: 0
      });
    }
    
    const authorStats = analysis.authors.get(commit.author);
    authorStats.commits++;
    authorStats.linesAdded += commit.totalAdded;
    authorStats.linesRemoved += commit.totalRemoved;
    
    // Track files and changes
    commit.changedFiles.forEach(file => {
      analysis.totalFilesChanged.add(file);
      authorStats.filesChanged.add(file);
      
      const count = analysis.fileChangeCount.get(file) || 0;
      analysis.fileChangeCount.set(file, count + 1);
    });
    
    analysis.totalLinesAdded += commit.totalAdded;
    analysis.totalLinesRemoved += commit.totalRemoved;
  });
  
  analysis.averageChangesPerCommit = commits.length > 0 ? 
    Math.round(analysis.totalFilesChanged.size / commits.length * 100) / 100 : 0;
  
  return analysis;
}

function categorizeCommit(subject, changedFiles) {
  const lowerSubject = subject.toLowerCase();
  const categories = [];
  
  // Check for common patterns
  if (lowerSubject.includes('add') || lowerSubject.includes('create') || lowerSubject.includes('new')) {
    categories.push('creation');
  }
  
  if (lowerSubject.includes('update') || lowerSubject.includes('edit') || lowerSubject.includes('modify')) {
    categories.push('update');
  }
  
  if (lowerSubject.includes('fix') || lowerSubject.includes('correct') || lowerSubject.includes('error')) {
    categories.push('fix');
  }
  
  if (lowerSubject.includes('doc') || lowerSubject.includes('readme')) {
    categories.push('documentation');
  }
  
  // Check file types
  const hasApiDocs = changedFiles.some(file => file.includes('api'));
  const hasGuides = changedFiles.some(file => file.includes('guide') || file.includes('tutorial'));
  const hasArchitecture = changedFiles.some(file => file.includes('architecture') || file.includes('design'));
  
  if (hasApiDocs) categories.push('api');
  if (hasGuides) categories.push('guides');
  if (hasArchitecture) categories.push('architecture');
  
  return categories.length > 0 ? categories : ['general'];
}

function generateTextReport(commits, analysis, options) {
  let report = `📚 Documentation Changelog Report
Generated: ${new Date().toLocaleString()}
Period: ${options.since}${options.author ? ` (Author: ${options.author})` : ''}

## Summary
Total Commits: ${analysis.totalCommits}
Files Changed: ${analysis.totalFilesChanged.size}
Lines Added: ${analysis.totalLinesAdded}
Lines Removed: ${analysis.totalLinesRemoved}
Average Files per Commit: ${analysis.averageChangesPerCommit}

## Author Activity
`;

  // Sort authors by commit count
  const authorList = Array.from(analysis.authors.entries())
    .sort((a, b) => b[1].commits - a[1].commits);
    
  authorList.forEach(([author, stats]) => {
    report += `${author}: ${stats.commits} commits, ${stats.filesChanged.size} files, +${stats.linesAdded}/-${stats.linesRemoved} lines\n`;
  });

  if (analysis.fileChangeCount.size > 0) {
    report += `\n## Most Changed Files
`;
    
    const mostChangedFiles = Array.from(analysis.fileChangeCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    mostChangedFiles.forEach(([file, count]) => {
      report += `${file}: ${count} changes\n`;
    });
  }

  if (commits.length > 0) {
    report += `\n## Recent Changes
`;
    
    const categorizedCommits = new Map();
    
    commits.forEach(commit => {
      const categories = categorizeCommit(commit.subject, commit.changedFiles);
      categories.forEach(category => {
        if (!categorizedCommits.has(category)) {
          categorizedCommits.set(category, []);
        }
        categorizedCommits.get(category).push(commit);
      });
    });
    
    Array.from(categorizedCommits.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([category, categoryCommits]) => {
        report += `\n### ${category.charAt(0).toUpperCase() + category.slice(1)} (${categoryCommits.length})\n`;
        
        categoryCommits.slice(0, 5).forEach(commit => {
          const date = commit.date.toLocaleDateString();
          report += `• ${commit.subject} (${commit.shortHash}) - ${commit.author} - ${date}\n`;
          
          if (options.detailed && commit.changedFiles.length > 0) {
            report += `  Files: ${commit.changedFiles.join(', ')}\n`;
          }
        });
        
        if (categoryCommits.length > 5) {
          report += `  ... and ${categoryCommits.length - 5} more\n`;
        }
      });
  }

  return report;
}

function generateJsonReport(commits, analysis, options) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    period: options.since,
    author: options.author,
    summary: {
      totalCommits: analysis.totalCommits,
      filesChanged: analysis.totalFilesChanged.size,
      uniqueFiles: Array.from(analysis.totalFilesChanged),
      linesAdded: analysis.totalLinesAdded,
      linesRemoved: analysis.totalLinesRemoved,
      averageChangesPerCommit: analysis.averageChangesPerCommit
    },
    authors: Object.fromEntries(
      Array.from(analysis.authors.entries()).map(([name, stats]) => [
        name, {
          commits: stats.commits,
          filesChanged: Array.from(stats.filesChanged),
          linesAdded: stats.linesAdded,
          linesRemoved: stats.linesRemoved
        }
      ])
    ),
    mostChangedFiles: Object.fromEntries(analysis.fileChangeCount),
    commits: commits.map(commit => ({
      hash: commit.shortHash,
      author: commit.author,
      date: commit.date.toISOString(),
      subject: commit.subject,
      changedFiles: commit.changedFiles,
      linesAdded: commit.totalAdded,
      linesRemoved: commit.totalRemoved,
      categories: categorizeCommit(commit.subject, commit.changedFiles)
    }))
  }, null, 2);
}

async function main() {
  const options = parseArgs();
  
  try {
    log('📚 Documentation Changelog Generator', colors.bright);
    log('====================================', colors.bright);
    
    // Get git commits
    log(`🔍 Fetching commits since ${options.since}...`, colors.blue);
    const commits = getGitCommits(options);
    
    if (commits.length === 0) {
      log('ℹ️ No documentation changes found in the specified time period', colors.yellow);
      return;
    }
    
    log(`📊 Found ${commits.length} commits, analyzing...`, colors.cyan);
    
    // Get detailed information for each commit
    const detailedCommits = [];
    for (const commit of commits) {
      const details = getCommitDetails(commit.hash);
      if (details) {
        detailedCommits.push(details);
      }
    }
    
    // Analyze changes
    const analysis = analyzeChanges(detailedCommits);
    
    // Generate report
    let report;
    if (options.format === 'json') {
      report = generateJsonReport(detailedCommits, analysis, options);
    } else {
      report = generateTextReport(detailedCommits, analysis, options);
    }
    
    // Output report
    if (options.output) {
      fs.writeFileSync(options.output, report);
      log(`📄 Report written to ${options.output}`, colors.green);
    } else {
      console.log(report);
    }
    
    log(`\n✅ Analysis complete: ${analysis.totalCommits} commits, ${analysis.totalFilesChanged.size} files changed`, colors.green);
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getGitCommits, analyzeChanges, categorizeCommit };