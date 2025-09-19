/**
 * Template Initialization Command
 * Handles setting up a new project with the AI template
 */

const fs = require('fs');
const path = require('path');
const FileCategorizer = require('../utils/file-categorizer');

class TemplateInitializer {
  constructor(options = {}) {
    this.targetDir = options.targetDir || '.';
    this.projectName = options.projectName || path.basename(process.cwd());
    this.projectType = options.projectType || 'web-app';
    this.templatePath = options.templatePath || process.cwd(); // For development mode
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
  }

  async initialize() {
    console.log('🚀 Initializing AI Template Project\n');

    try {
      // Validate target directory
      await this.validateTargetDirectory();

      // Load template configuration
      const categorizer = this.loadTemplate();

      // Plan the installation
      const plan = this.createInstallationPlan(categorizer);

      // Show what will be done
      this.displayPlan(plan);

      if (this.dryRun) {
        console.log('\n🔍 Dry run complete - no files were copied');
        return { success: true, dryRun: true, plan };
      }

      // Execute the installation
      const results = await this.executeInstallation(plan);

      // Report results
      this.reportResults(results);

      return { success: true, results };

    } catch (error) {
      console.error('❌ Template initialization failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  validateTargetDirectory() {
    if (!fs.existsSync(this.targetDir)) {
      fs.mkdirSync(this.targetDir, { recursive: true });
      console.log(`📁 Created target directory: ${this.targetDir}`);
    }

    // Check if directory is empty or has only basic files
    const existing = fs.readdirSync(this.targetDir);
    const safeFiles = ['.git', '.gitignore', 'README.md', 'package.json', '.env'];
    const conflicts = existing.filter(file => !safeFiles.includes(file));

    if (conflicts.length > 0) {
      console.log('⚠️  Target directory contains files that might conflict:');
      conflicts.forEach(file => console.log(`   - ${file}`));
      console.log('   Consider using --force or choosing an empty directory');
    }
  }

  loadTemplate() {
    // Try to load from current directory (development) or node_modules (NPM install)
    let manifestPath = path.join(this.templatePath, '.template-manifest.json');

    if (!fs.existsSync(manifestPath)) {
      // Try NPM package location
      manifestPath = path.join(__dirname, '../../.template-manifest.json');
    }

    if (!fs.existsSync(manifestPath)) {
      throw new Error('Template manifest not found. Make sure you\'re in a template directory or have installed the package.');
    }

    return new FileCategorizer(manifestPath);
  }

  createInstallationPlan(categorizer) {
    const plan = {
      copy: [],
      skip: [],
      merge: [],
      configure: []
    };

    // Get files by category
    const categories = ['core', 'reference', 'optional', 'configuration'];

    for (const categoryName of categories) {
      try {
        const files = categorizer.getFilesInCategory(categoryName);
        const category = categorizer.manifest.categories[categoryName];

        for (const file of files) {
          const sourcePath = path.join(this.templatePath, file);
          const targetPath = path.join(this.targetDir, file);

          if (!fs.existsSync(sourcePath)) {
            continue; // Skip files that don't exist in template
          }

          const action = {
            source: sourcePath,
            target: targetPath,
            category: categoryName,
            strategy: category.strategy,
            file: file
          };

          switch (category.strategy) {
            case 'replace':
              plan.copy.push(action);
              break;
            case 'merge':
              plan.merge.push(action);
              break;
            case 'smart-merge':
              plan.configure.push(action);
              break;
            case 'prompt':
              // For now, include optional files by default
              plan.copy.push(action);
              break;
            default:
              plan.skip.push(action);
          }
        }
      } catch (error) {
        if (this.verbose) {
          console.log(`⚠️  Skipping category ${categoryName}: ${error.message}`);
        }
      }
    }

    return plan;
  }

  displayPlan(plan) {
    console.log('📋 Installation Plan:');
    console.log('═'.repeat(50));

    const totalActions = plan.copy.length + plan.merge.length + plan.configure.length;
    console.log(`📦 Files to copy: ${plan.copy.length}`);
    console.log(`🔄 Files to merge: ${plan.merge.length}`);
    console.log(`⚙️  Files to configure: ${plan.configure.length}`);
    console.log(`⏭️  Files to skip: ${plan.skip.length}`);
    console.log(`📊 Total actions: ${totalActions}`);

    if (this.verbose) {
      console.log('\n📄 File Details:');

      if (plan.copy.length > 0) {
        console.log('\n📦 Copy (replace):');
        plan.copy.slice(0, 10).forEach(action => console.log(`   ✅ ${action.file}`));
        if (plan.copy.length > 10) {
          console.log(`   ... and ${plan.copy.length - 10} more`);
        }
      }

      if (plan.merge.length > 0) {
        console.log('\n🔄 Merge:');
        plan.merge.slice(0, 5).forEach(action => console.log(`   📝 ${action.file}`));
        if (plan.merge.length > 5) {
          console.log(`   ... and ${plan.merge.length - 5} more`);
        }
      }
    }
  }

  async executeInstallation(plan) {
    const results = {
      copied: 0,
      merged: 0,
      configured: 0,
      errors: []
    };

    console.log('\n🔧 Executing installation...');

    // Copy files
    for (const action of plan.copy) {
      try {
        this.ensureDirectoryExists(path.dirname(action.target));
        fs.copyFileSync(action.source, action.target);
        results.copied++;

        if (this.verbose) {
          console.log(`   ✅ Copied: ${action.file}`);
        }
      } catch (error) {
        results.errors.push(`Failed to copy ${action.file}: ${error.message}`);
        console.log(`   ❌ Failed: ${action.file}`);
      }
    }

    // For now, treat merge as copy (simple implementation)
    for (const action of plan.merge) {
      try {
        this.ensureDirectoryExists(path.dirname(action.target));
        if (!fs.existsSync(action.target)) {
          fs.copyFileSync(action.source, action.target);
          results.merged++;

          if (this.verbose) {
            console.log(`   📝 Merged: ${action.file}`);
          }
        } else {
          if (this.verbose) {
            console.log(`   ⏭️  Skipped existing: ${action.file}`);
          }
        }
      } catch (error) {
        results.errors.push(`Failed to merge ${action.file}: ${error.message}`);
        console.log(`   ❌ Failed: ${action.file}`);
      }
    }

    // Configure files (basic implementation)
    for (const action of plan.configure) {
      try {
        this.ensureDirectoryExists(path.dirname(action.target));
        if (!fs.existsSync(action.target)) {
          fs.copyFileSync(action.source, action.target);
          results.configured++;

          if (this.verbose) {
            console.log(`   ⚙️  Configured: ${action.file}`);
          }
        }
      } catch (error) {
        results.errors.push(`Failed to configure ${action.file}: ${error.message}`);
        console.log(`   ❌ Failed: ${action.file}`);
      }
    }

    return results;
  }

  ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  reportResults(results) {
    console.log('\n📊 Installation Results:');
    console.log('═'.repeat(50));

    const total = results.copied + results.merged + results.configured;
    console.log(`✅ Successfully processed: ${total} files`);
    console.log(`   📦 Copied: ${results.copied}`);
    console.log(`   🔄 Merged: ${results.merged}`);
    console.log(`   ⚙️  Configured: ${results.configured}`);

    if (results.errors.length > 0) {
      console.log(`\n❌ Errors: ${results.errors.length}`);
      results.errors.forEach(error => console.log(`   - ${error}`));
    } else {
      console.log('\n🎉 Template initialization completed successfully!');
      console.log('\n🚀 Next Steps:');
      console.log('   1. Review the installed files');
      console.log('   2. Customize CLAUDE.md for your project');
      console.log('   3. Update docs/project-brief.md with your project details');
      console.log('   4. Run: ai-template status');
    }
  }
}

module.exports = TemplateInitializer;