#!/usr/bin/env node

/**
 * Documentation Health Dashboard
 * 
 * Analyzes documentation quality, freshness, and completeness
 * Generates detailed health report with actionable recommendations
 * 
 * Usage: node scripts/docs-health.js [options]
 * Options:
 *   --format json|markdown  Output format (default: markdown)
 *   --output FILE          Write to file (default: stdout)
 *   --quiet                Minimal output
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  docsDir: 'docs',
  excludeDirs: ['node_modules', '.git', '.next', 'dist', 'build'],
  fileExtensions: ['.md', '.mdx'],
  maxAge: 60, // days
  minScore: 80, // target health score
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
    format: 'markdown',
    output: null,
    quiet: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--format':
        options.format = args[++i] || 'markdown';
        break;
      case '--output':
        options.output = args[++i];
        break;
      case '--quiet':
        options.quiet = true;
        break;
    }
  }

  return options;
}

function findDocFiles(dir = '.') {
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

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const stats = fs.statSync(filePath);
  const lines = content.split('\n');
  
  // Check for metadata headers
  const hasCreatedDate = /\*\*Created\*\*:\s*\d{4}-\d{2}-\d{2}/.test(content);
  const hasLastEdited = /\*\*Last (?:Updated|Edited)\*\*:\s*\d{4}-\d{2}-\d{2}/.test(content);
  const hasTargetAudience = /\*\*Target Audience\*\*:/.test(content);
  const hasStatus = /\*\*Status\*\*:/.test(content);
  
  // Count different elements
  const headingCount = (content.match(/^#+\s/gm) || []).length;
  const codeBlockCount = (content.match(/```/g) || []).length / 2;
  const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
  const todoCount = (content.match(/TODO|FIXME|XXX/g) || []).length;
  const exampleCount = (content.match(/###?\s+Example|```\w+/g) || []).length;
  
  // Check freshness
  const lastModified = stats.mtime;
  const daysSinceModified = Math.floor((Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24));
  const isStale = daysSinceModified > CONFIG.maxAge;
  
  // Calculate scores
  const metadataScore = [hasCreatedDate, hasLastEdited, hasTargetAudience, hasStatus].filter(Boolean).length * 25;
  const contentScore = Math.min(100, (headingCount * 10) + (codeBlockCount * 5) + (exampleCount * 15));
  const freshnessScore = isStale ? 0 : Math.max(0, 100 - (daysSinceModified * 2));
  const overallScore = Math.round((metadataScore + contentScore + freshnessScore) / 3);
  
  return {
    path: filePath,
    size: stats.size,
    lines: lines.length,
    lastModified,
    daysSinceModified,
    isStale,
    metadata: {
      hasCreatedDate,
      hasLastEdited,
      hasTargetAudience,
      hasStatus,
      score: metadataScore
    },
    content: {
      headings: headingCount,
      codeBlocks: codeBlockCount,
      links: linkCount,
      examples: exampleCount,
      todos: todoCount,
      score: contentScore
    },
    scores: {
      metadata: metadataScore,
      content: contentScore,
      freshness: freshnessScore,
      overall: overallScore
    }
  };
}

function generateProgressBar(percentage, width = 20) {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
}

function analyzeDocumentation() {
  log('🔍 Scanning documentation files...', colors.blue);
  
  const files = findDocFiles();
  const analysis = files.map(analyzeFile);
  
  // Calculate summary statistics
  const totalFiles = analysis.length;
  const totalLines = analysis.reduce((sum, file) => sum + file.lines, 0);
  const totalSize = analysis.reduce((sum, file) => sum + file.size, 0);
  const averageScore = Math.round(analysis.reduce((sum, file) => sum + file.scores.overall, 0) / totalFiles);
  
  const staleFiles = analysis.filter(file => file.isStale);
  const missingMetadata = analysis.filter(file => file.metadata.score < 100);
  const lowContentScore = analysis.filter(file => file.content.score < 50);
  const highTodoCount = analysis.filter(file => file.content.todos > 5);
  
  const healthMetrics = {
    totalFiles,
    totalLines,
    totalSize: Math.round(totalSize / 1024), // KB
    averageScore,
    staleFiles: staleFiles.length,
    missingMetadata: missingMetadata.length,
    lowContent: lowContentScore.length,
    highTodos: highTodoCount.length,
    healthGrade: averageScore >= 90 ? 'A' : averageScore >= 80 ? 'B' : averageScore >= 70 ? 'C' : averageScore >= 60 ? 'D' : 'F'
  };
  
  return {
    files: analysis,
    summary: healthMetrics,
    recommendations: generateRecommendations(analysis, healthMetrics)
  };
}

function generateRecommendations(analysis, metrics) {
  const recommendations = [];
  
  if (metrics.staleFiles > 0) {
    recommendations.push({
      type: 'freshness',
      priority: 'high',
      message: `${metrics.staleFiles} files haven't been updated in ${CONFIG.maxAge}+ days`,
      action: 'Review and update stale documentation'
    });
  }
  
  if (metrics.missingMetadata > 0) {
    recommendations.push({
      type: 'metadata',
      priority: 'medium',
      message: `${metrics.missingMetadata} files missing complete metadata headers`,
      action: 'Add Created/Last Updated/Target Audience/Status fields'
    });
  }
  
  if (metrics.lowContent > 0) {
    recommendations.push({
      type: 'content',
      priority: 'medium',
      message: `${metrics.lowContent} files have low content scores`,
      action: 'Add more examples, code blocks, and detailed explanations'
    });
  }
  
  if (metrics.averageScore < CONFIG.minScore) {
    recommendations.push({
      type: 'overall',
      priority: 'high',
      message: `Overall documentation health score (${metrics.averageScore}) below target (${CONFIG.minScore})`,
      action: 'Focus on top recommendations to improve overall quality'
    });
  }
  
  return recommendations;
}

function formatMarkdownReport(data) {
  const { files, summary, recommendations } = data;
  
  let report = `# Documentation Health Dashboard

**Generated**: ${new Date().toISOString().split('T')[0]}
**Files Analyzed**: ${summary.totalFiles}
**Overall Health**: ${generateProgressBar(summary.averageScore)} ${summary.averageScore}% (Grade ${summary.healthGrade})

## Summary Statistics

| Metric | Value | Status |
|--------|-------|--------|
| Total Files | ${summary.totalFiles} | ℹ️ |
| Total Lines | ${summary.totalLines.toLocaleString()} | ℹ️ |
| Total Size | ${summary.totalSize} KB | ℹ️ |
| Average Score | ${summary.averageScore}% | ${summary.averageScore >= 80 ? '✅' : summary.averageScore >= 60 ? '⚠️' : '❌'} |
| Stale Files | ${summary.staleFiles} | ${summary.staleFiles === 0 ? '✅' : '⚠️'} |
| Missing Metadata | ${summary.missingMetadata} | ${summary.missingMetadata === 0 ? '✅' : '⚠️'} |
| Low Content Score | ${summary.lowContent} | ${summary.lowContent === 0 ? '✅' : '⚠️'} |

## Health Breakdown

### Metadata Compliance
\`\`\`
Complete Metadata    ${generateProgressBar((summary.totalFiles - summary.missingMetadata) / summary.totalFiles * 100)} ${Math.round((summary.totalFiles - summary.missingMetadata) / summary.totalFiles * 100)}%
\`\`\`

### Content Quality
\`\`\`
High Content Score   ${generateProgressBar((summary.totalFiles - summary.lowContent) / summary.totalFiles * 100)} ${Math.round((summary.totalFiles - summary.lowContent) / summary.totalFiles * 100)}%
\`\`\`

### Freshness
\`\`\`
Recently Updated     ${generateProgressBar((summary.totalFiles - summary.staleFiles) / summary.totalFiles * 100)} ${Math.round((summary.totalFiles - summary.staleFiles) / summary.totalFiles * 100)}%
\`\`\`

`;

  if (recommendations.length > 0) {
    report += `## Recommendations

`;
    
    recommendations.forEach((rec, index) => {
      const priority = rec.priority === 'high' ? '🚨' : rec.priority === 'medium' ? '⚠️' : 'ℹ️';
      report += `### ${priority} ${rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}

**Issue**: ${rec.message}
**Action**: ${rec.action}

`;
    });
  }

  // Top issues
  const topIssues = files
    .filter(f => f.scores.overall < 70)
    .sort((a, b) => a.scores.overall - b.scores.overall)
    .slice(0, 10);

  if (topIssues.length > 0) {
    report += `## Files Needing Attention

| File | Score | Issues |
|------|-------|---------|
`;
    
    topIssues.forEach(file => {
      const issues = [];
      if (file.metadata.score < 100) issues.push('Missing metadata');
      if (file.content.score < 50) issues.push('Low content');
      if (file.isStale) issues.push('Stale');
      if (file.content.todos > 0) issues.push(`${file.content.todos} TODOs`);
      
      report += `| ${file.path} | ${file.scores.overall}% | ${issues.join(', ') || 'General quality'} |\n`;
    });
  }

  report += `\n## File Details

<details>
<summary>Complete File Analysis (${files.length} files)</summary>

| File | Score | Lines | Age (days) | Metadata | Content | Freshness |
|------|-------|-------|------------|----------|---------|-----------|
`;

  files.sort((a, b) => b.scores.overall - a.scores.overall).forEach(file => {
    report += `| ${file.path} | ${file.scores.overall}% | ${file.lines} | ${file.daysSinceModified} | ${file.scores.metadata}% | ${file.scores.content}% | ${file.scores.freshness}% |\n`;
  });

  report += `
</details>

---
*Generated by Documentation Health Dashboard*
`;

  return report;
}

function formatJsonReport(data) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    ...data
  }, null, 2);
}

function main() {
  const options = parseArgs();
  
  try {
    log('📊 Documentation Health Dashboard', colors.bright);
    log('================================', colors.bright);
    
    const analysisData = analyzeDocumentation();
    
    // Format report
    let report;
    if (options.format === 'json') {
      report = formatJsonReport(analysisData);
    } else {
      report = formatMarkdownReport(analysisData);
    }
    
    // Output report
    if (options.output) {
      fs.writeFileSync(options.output, report);
      log(`📄 Report written to ${options.output}`, colors.green);
    } else {
      console.log(report);
    }
    
    // Log summary to stderr so it doesn't interfere with output
    if (!options.quiet) {
      console.error(`\n${colors.green}✅ Analysis complete: ${analysisData.summary.totalFiles} files, ${analysisData.summary.averageScore}% average score${colors.reset}`);
      
      if (analysisData.recommendations.length > 0) {
        console.error(`${colors.yellow}⚠️  ${analysisData.recommendations.length} recommendations for improvement${colors.reset}`);
      }
    }
    
  } catch (error) {
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { analyzeDocumentation, generateProgressBar };