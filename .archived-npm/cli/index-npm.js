#!/usr/bin/env node

/**
 * NPM Package AI Template CLI Tool
 * Enhanced version with init command for NPM distribution
 */

const FileCategorizer = require('./utils/file-categorizer');
const TemplateInitializer = require('./commands/init');

function showUsage() {
  console.log(`
🎯 AI Template CLI

Usage: ai-template <command> [options]

Commands:
  init [dir]    Initialize a new project with AI template
  status        Show template status and file categorization
  validate      Validate template manifest and file categorization
  info          Show template information
  help          Show this help message

Init Options:
  --dry-run     Show what would be done without copying files
  --verbose     Show detailed output
  --type <type> Project type (web-app, api-service, cli-tool, library, mobile-app, enterprise)

Examples:
  ai-template init my-project
  ai-template init . --dry-run
  ai-template init --type=api-service
  ai-template status
  ai-template validate
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

async function initCommand(args) {
  try {
    const targetDir = args[1] || '.';

    // Parse options
    const options = {
      targetDir,
      dryRun: args.includes('--dry-run'),
      verbose: args.includes('--verbose'),
      projectType: 'web-app'
    };

    // Parse project type
    const typeArg = args.find(arg => arg.startsWith('--type='));
    if (typeArg) {
      options.projectType = typeArg.split('=')[1];
    }

    console.log(`🎯 Target Directory: ${targetDir}`);
    console.log(`📂 Project Type: ${options.projectType}`);
    if (options.dryRun) {
      console.log('🔍 Dry Run Mode: No files will be copied\n');
    }

    const initializer = new TemplateInitializer(options);
    const result = await initializer.initialize();

    return result.success;

  } catch (error) {
    console.error('❌ Init command failed:', error.message);
    return false;
  }
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

    // Show NPM package info if available
    try {
      const packageJson = require('../package.json');
      console.log('\n📦 NPM Package:');
      console.log(`   Name: ${packageJson.name}`);
      console.log(`   Version: ${packageJson.version}`);
      console.log(`   Homepage: ${packageJson.homepage || 'N/A'}`);
    } catch (error) {
      // Package.json not available, skip NPM info
    }

    return true;

  } catch (error) {
    console.error('❌ Info command failed:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  let success = false;

  switch (command) {
    case 'init':
      success = await initCommand(args);
      break;
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
  main().catch(error => {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  });
}