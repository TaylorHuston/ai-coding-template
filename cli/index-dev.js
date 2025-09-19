#!/usr/bin/env node

/**
 * Development Mode AI Template CLI Tool
 * Enhanced version with development mode and sync capabilities
 */

const FileCategorizer = require('./utils/file-categorizer');
const TemplateInitializer = require('./commands/init');
const TemplateSyncer = require('./commands/sync');
const DevModeConfig = require('./utils/dev-mode-config');

function showUsage() {
  console.log(`
🎯 AI Template CLI (Development Mode)

Usage: ai-template <command> [options]

Template Management:
  init [dir]       Initialize a new project with AI template
  status           Show template status and file categorization
  validate         Validate template manifest and file categorization
  info             Show template information

Development Mode:
  dev enable       Enable development mode for template contribution
  dev disable      Disable development mode
  dev status       Show development mode configuration
  dev config       Configure development mode settings
  sync             Sync changes between project and template

Sync Operations:
  sync pull        Pull changes from template to project
  sync push        Push changes from project to template
  sync auto        Enable automatic bidirectional sync

Common Options:
  --dry-run        Show what would be done without making changes
  --verbose        Show detailed output
  --force          Force operations without confirmation

Examples:
  ai-template init my-project
  ai-template dev enable ../ai-coding-template
  ai-template sync --dry-run
  ai-template sync push --verbose
  ai-template dev config --auto-sync --interval=30
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

async function devCommand(args) {
  const subcommand = args[1];
  const devConfig = new DevModeConfig();

  try {
    switch (subcommand) {
      case 'enable':
        return await enableDevMode(devConfig, args);
      case 'disable':
        return await disableDevMode(devConfig);
      case 'status':
        return showDevStatus(devConfig);
      case 'config':
        return await configureDevMode(devConfig, args);
      default:
        console.log('❌ Unknown dev command. Available: enable, disable, status, config');
        return false;
    }
  } catch (error) {
    console.error('❌ Dev command failed:', error.message);
    return false;
  }
}

async function enableDevMode(devConfig, args) {
  const templateSource = args[2];

  if (!templateSource) {
    console.log('❌ Template source path required. Usage: ai-template dev enable <template-path>');
    return false;
  }

  console.log('🔧 Enabling Development Mode...\n');

  // Validate template source
  const validation = devConfig.validateTemplateSource(templateSource);
  if (!validation.valid) {
    console.log(`❌ ${validation.error}`);
    return false;
  }

  // Parse options
  const options = {
    syncMode: 'bidirectional',
    autoSync: false,
    syncInterval: 0
  };

  if (args.includes('--auto-sync')) {
    options.autoSync = true;
    const intervalArg = args.find(arg => arg.startsWith('--interval='));
    if (intervalArg) {
      options.syncInterval = parseInt(intervalArg.split('=')[1]) || 30;
    } else {
      options.syncInterval = 30; // Default 30 minutes
    }
  }

  const syncModeArg = args.find(arg => arg.startsWith('--sync-mode='));
  if (syncModeArg) {
    options.syncMode = syncModeArg.split('=')[1];
  }

  // Enable development mode
  const success = devConfig.enableDevelopmentMode(templateSource, options);

  if (success) {
    console.log('✅ Development mode enabled successfully!');
    console.log(`📂 Template Source: ${templateSource}`);
    console.log(`🔄 Sync Mode: ${options.syncMode}`);
    console.log(`⚙️  Auto Sync: ${options.autoSync ? `Every ${options.syncInterval} minutes` : 'Disabled'}`);
    console.log('\n💡 Next Steps:');
    console.log('   - Run: ai-template sync --dry-run');
    console.log('   - Review sync plan before making changes');
    console.log('   - Use sync commands to keep template and project in sync');
  } else {
    console.log('❌ Failed to enable development mode');
  }

  return success;
}

async function disableDevMode(devConfig) {
  console.log('🔧 Disabling Development Mode...\n');

  const success = devConfig.disableDevelopmentMode();

  if (success) {
    console.log('✅ Development mode disabled');
    console.log('📄 Configuration file cleared');
  } else {
    console.log('❌ Failed to disable development mode');
  }

  return success;
}

function showDevStatus(devConfig) {
  console.log('🔧 Development Mode Status\n');

  const status = devConfig.getStatus();

  console.log(devConfig.getConfigSummary());

  if (status.developmentMode) {
    console.log('\n💡 Available Commands:');
    console.log('   ai-template sync          - Sync changes bidirectionally');
    console.log('   ai-template sync pull     - Pull changes from template');
    console.log('   ai-template sync push     - Push changes to template');
    console.log('   ai-template dev disable   - Disable development mode');
  } else {
    console.log('\n💡 Enable development mode with:');
    console.log('   ai-template dev enable <template-source-path>');
  }

  return true;
}

async function configureDevMode(devConfig, args) {
  console.log('⚙️  Configuring Development Mode...\n');

  let updated = false;

  if (args.includes('--auto-sync')) {
    devConfig.config.autoSync = true;
    updated = true;
    console.log('✅ Auto-sync enabled');
  }

  if (args.includes('--no-auto-sync')) {
    devConfig.config.autoSync = false;
    devConfig.config.syncInterval = 0;
    updated = true;
    console.log('✅ Auto-sync disabled');
  }

  const intervalArg = args.find(arg => arg.startsWith('--interval='));
  if (intervalArg) {
    const interval = parseInt(intervalArg.split('=')[1]);
    if (interval > 0) {
      devConfig.config.syncInterval = interval;
      devConfig.config.autoSync = true;
      updated = true;
      console.log(`✅ Sync interval set to ${interval} minutes`);
    }
  }

  const syncModeArg = args.find(arg => arg.startsWith('--sync-mode='));
  if (syncModeArg) {
    const mode = syncModeArg.split('=')[1];
    try {
      devConfig.setSyncMode(mode);
      updated = true;
      console.log(`✅ Sync mode set to ${mode}`);
    } catch (error) {
      console.log(`❌ ${error.message}`);
      return false;
    }
  }

  if (updated) {
    const success = devConfig.saveConfig();
    if (success) {
      console.log('\n✅ Configuration updated successfully');
    } else {
      console.log('\n❌ Failed to save configuration');
      return false;
    }
  } else {
    console.log('⚠️  No configuration changes specified');
    console.log('\nAvailable options:');
    console.log('   --auto-sync              Enable automatic sync');
    console.log('   --no-auto-sync           Disable automatic sync');
    console.log('   --interval=<minutes>     Set sync interval');
    console.log('   --sync-mode=<mode>       Set sync mode (pull/push/bidirectional)');
  }

  return true;
}

async function syncCommand(args) {
  const devConfig = new DevModeConfig();

  if (!devConfig.isDevelopmentMode()) {
    console.log('❌ Development mode not enabled. Run: ai-template dev enable <template-path>');
    return false;
  }

  const subcommand = args[1] || 'bidirectional';
  const templateDir = devConfig.getTemplateSource();

  const options = {
    projectDir: '.',
    templateDir,
    mode: subcommand === 'pull' ? 'pull' : subcommand === 'push' ? 'push' : 'bidirectional',
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose'),
    force: args.includes('--force')
  };

  try {
    const syncer = new TemplateSyncer(options);
    const result = await syncer.sync();

    if (result.success && !result.dryRun) {
      devConfig.updateLastSync();
    }

    return result.success;
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    return false;
  }
}

// Standard commands (from previous CLI)
async function initCommand(args) {
  try {
    const targetDir = args[1] || '.';
    const options = {
      targetDir,
      dryRun: args.includes('--dry-run'),
      verbose: args.includes('--verbose'),
      projectType: 'web-app'
    };

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

    // Show development mode status
    const devConfig = new DevModeConfig();
    if (devConfig.isDevelopmentMode()) {
      console.log('\n🔧 Development Mode: ✅ Enabled');
      console.log(`📂 Template Source: ${devConfig.getTemplateSource()}`);
    } else {
      console.log('\n🔧 Development Mode: ❌ Disabled');
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
    case 'dev':
      success = await devCommand(args);
      break;
    case 'sync':
      success = await syncCommand(args);
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