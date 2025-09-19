#!/usr/bin/env node

/**
 * Simple AI Template CLI Tool (no external dependencies)
 * Basic implementation for testing
 */

const FileCategorizer = require('./utils/file-categorizer');

function showUsage() {
  console.log(`
🎯 AI Template CLI

Usage: node cli/index-simple.js <command> [options]

Commands:
  status      Show template status and file categorization
  validate    Validate template manifest and file categorization
  info        Show template information
  help        Show this help message

Examples:
  node cli/index-simple.js status
  node cli/index-simple.js validate
  node cli/index-simple.js info
`);
}

function getCategoryIcon(categoryName) {
  const icons = {
    core: '🔧',
    reference: '📚',
    optional: '🔌',
    configuration: '⚙️',
    user: '👤',
    ignore: '🚫',
    uncategorized: '❓'
  };
  return icons[categoryName] || '📄';
}

function statusCommand() {
  try {
    console.log('🎯 AI Template Status\n');

    const categorizer = new FileCategorizer();
    const summary = categorizer.getCategorySummary();

    console.log('📊 Template File Overview:');
    console.log('═'.repeat(50));

    let totalFiles = 0;
    for (const [categoryName, info] of Object.entries(summary)) {
      totalFiles += info.count;
      const icon = getCategoryIcon(categoryName);
      console.log(`${icon} ${categoryName.padEnd(15)} ${info.count.toString().padStart(3)} files  (${info.strategy})`);
    }

    console.log('─'.repeat(50));
    console.log(`📈 Total files: ${totalFiles}`);

    // Check for warnings
    const validation = categorizer.validateCategorization();
    if (validation.warnings.length > 0) {
      console.log(`\n⚠️  ${validation.warnings.length} warnings found`);
    } else {
      console.log('\n✅ No categorization warnings');
    }

    return true;

  } catch (error) {
    console.error('❌ Status command failed:', error.message);
    return false;
  }
}

function validateCommand() {
  try {
    console.log('🔍 Validating Template Configuration\n');

    const categorizer = new FileCategorizer();
    const validation = categorizer.validateCategorization();

    if (validation.valid && validation.errors.length === 0) {
      console.log('✅ Template validation passed');
    } else {
      console.log('❌ Template validation failed');
      validation.errors.forEach(error => console.log(`   - ${error}`));
    }

    if (validation.warnings.length > 0) {
      console.log(`\n⚠️  ${validation.warnings.length} warnings:`);
      validation.warnings.slice(0, 5).forEach(warning => console.log(`   - ${warning.message}`));
      if (validation.warnings.length > 5) {
        console.log(`   ... and ${validation.warnings.length - 5} more`);
      }
    }

    const totalFiles = Object.values(validation.summary).reduce((sum, cat) => sum + cat.count, 0);
    console.log(`\n📊 Summary: ${totalFiles} files categorized across ${Object.keys(validation.summary).length} categories`);

    return validation.valid;

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    return false;
  }
}

function infoCommand() {
  try {
    const categorizer = new FileCategorizer();
    const manifest = categorizer.manifest;

    console.log('ℹ️  Template Information\n');
    console.log(`Name: ${manifest.name}`);
    console.log(`Version: ${manifest.templateVersion}`);
    console.log(`Description: ${manifest.description}`);
    console.log(`Compatibility: ${manifest.compatibilityVersion}`);

    if (manifest.features) {
      console.log('\n🎯 Features:');
      Object.entries(manifest.features).forEach(([feature, enabled]) => {
        const status = enabled ? '✅' : '❌';
        console.log(`   ${status} ${feature.replace(/-/g, ' ')}`);
      });
    }

    if (manifest.dependencies) {
      console.log('\n📦 Dependencies:');
      Object.entries(manifest.dependencies).forEach(([dep, version]) => {
        console.log(`   - ${dep}: ${version}`);
      });
    }

    return true;

  } catch (error) {
    console.error('❌ Info command failed:', error.message);
    return false;
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  let success = false;

  switch (command) {
    case 'status':
      success = statusCommand();
      break;
    case 'validate':
      success = validateCommand();
      break;
    case 'info':
      success = infoCommand();
      break;
    case 'help':
    case '--help':
    case '-h':
      showUsage();
      success = true;
      break;
    default:
      if (!command) {
        console.log('❌ No command specified. Use "help" for usage information.');
      } else {
        console.log(`❌ Unknown command: ${command}. Use "help" for usage information.`);
      }
      success = false;
  }

  process.exit(success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main();
}