#!/usr/bin/env node

/**
 * AI Template CLI Tool
 * Main entry point for template management commands
 */

const { program } = require('commander');
const FileCategorizer = require('./utils/file-categorizer');

// Package info (would normally come from package.json)
const packageInfo = {
  name: 'ai-template',
  version: '1.0.0',
  description: 'AI Coding Template management CLI'
};

program
  .name(packageInfo.name)
  .description(packageInfo.description)
  .version(packageInfo.version);

// Status command - show template file categorization
program
  .command('status')
  .description('Show template status and file categorization')
  .option('-v, --verbose', 'Show detailed file lists')
  .option('-c, --category <name>', 'Show files in specific category')
  .action((options) => {
    try {
      console.log('🎯 AI Template Status\n');

      const categorizer = new FileCategorizer();
      const summary = categorizer.getCategorySummary();

      if (options.category) {
        // Show specific category
        const category = summary[options.category];
        if (!category) {
          console.error(`❌ Category '${options.category}' not found`);
          console.log(`Available categories: ${Object.keys(summary).join(', ')}`);
          process.exit(1);
        }

        console.log(`📂 Category: ${options.category} (${category.strategy})`);
        console.log(`📊 Files: ${category.count}\n`);

        if (category.files.length === 0) {
          console.log('   (no files in this category)');
        } else {
          category.files.forEach(file => {
            console.log(`   📄 ${file.path}`);
            if (options.verbose && file.pattern) {
              console.log(`      Pattern: ${file.pattern}`);
            }
          });
        }
      } else {
        // Show overview
        console.log('📊 Template File Overview:');
        console.log('═'.repeat(50));

        let totalFiles = 0;
        for (const [categoryName, info] of Object.entries(summary)) {
          totalFiles += info.count;
          const icon = getCategoryIcon(categoryName);
          console.log(`${icon} ${categoryName.padEnd(15)} ${info.count.toString().padStart(3)} files  (${info.strategy})`);

          if (options.verbose && info.files.length > 0) {
            const examples = info.files.slice(0, 3);
            examples.forEach(file => console.log(`     - ${file.path}`));
            if (info.files.length > 3) {
              console.log(`     ... and ${info.files.length - 3} more`);
            }
            console.log();
          }
        }

        console.log('─'.repeat(50));
        console.log(`📈 Total files: ${totalFiles}`);

        // Check for warnings
        const validation = categorizer.validateCategorization();
        if (validation.warnings.length > 0) {
          console.log(`\n⚠️  ${validation.warnings.length} warnings:`);
          validation.warnings.slice(0, 3).forEach(warning => {
            console.log(`   - ${warning.message}`);
          });
          if (validation.warnings.length > 3) {
            console.log(`   ... and ${validation.warnings.length - 3} more`);
          }
        }

        console.log('\n💡 Use --verbose for detailed file lists');
        console.log('💡 Use --category <name> to focus on specific category');
      }

    } catch (error) {
      console.error('❌ Status command failed:', error.message);
      process.exit(1);
    }
  });

// Validate command - check manifest and categorization
program
  .command('validate')
  .description('Validate template manifest and file categorization')
  .action(() => {
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
        validation.warnings.forEach(warning => console.log(`   - ${warning.message}`));
      }

      const totalFiles = Object.values(validation.summary).reduce((sum, cat) => sum + cat.count, 0);
      console.log(`\n📊 Summary: ${totalFiles} files categorized across ${Object.keys(validation.summary).length} categories`);

      process.exit(validation.valid ? 0 : 1);

    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      process.exit(1);
    }
  });

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

// Add info about template
program
  .command('info')
  .description('Show template information')
  .action(() => {
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

    } catch (error) {
      console.error('❌ Info command failed:', error.message);
      process.exit(1);
    }
  });

// Error handling
program.on('command:*', () => {
  console.error('❌ Invalid command. See --help for available commands.');
  process.exit(1);
});

// Parse arguments
program.parse();