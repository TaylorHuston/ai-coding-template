/**
 * Development Mode Sync Command
 * Handles bidirectional sync between template source and project instances
 */

const fs = require('fs');
const path = require('path');
const FileCategorizer = require('../utils/file-categorizer');

class TemplateSyncer {
  constructor(options = {}) {
    this.projectDir = options.projectDir || '.';
    this.templateDir = options.templateDir || null;
    this.mode = options.mode || 'pull'; // pull, push, or bidirectional
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
    this.force = options.force || false;
  }

  async sync() {
    console.log('🔄 Template Development Sync\n');

    try {
      // Validate directories and configuration
      await this.validateConfiguration();

      // Load template configuration
      const categorizer = this.loadCategorizer();

      // Detect sync mode and create plan
      const plan = await this.createSyncPlan(categorizer);

      // Show what will be done
      this.displaySyncPlan(plan);

      if (this.dryRun) {
        console.log('\n🔍 Dry run complete - no files were synced');
        return { success: true, dryRun: true, plan };
      }

      // Execute sync operations
      const results = await this.executeSyncPlan(plan);

      // Report results
      this.reportSyncResults(results);

      return { success: true, results };

    } catch (error) {
      console.error('❌ Template sync failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async validateConfiguration() {
    // Check if we're in a project directory
    if (!fs.existsSync(path.join(this.projectDir, '.template-manifest.json'))) {
      throw new Error('Not in a template-managed project directory. Run from a project initialized with ai-template init.');
    }

    // Try to detect template directory
    if (!this.templateDir) {
      this.templateDir = await this.detectTemplateDirectory();
    }

    if (!this.templateDir || !fs.existsSync(this.templateDir)) {
      throw new Error('Template source directory not found. Use --template-dir to specify location.');
    }

    console.log(`📁 Project Directory: ${this.projectDir}`);
    console.log(`📂 Template Directory: ${this.templateDir}`);
    console.log(`🔄 Sync Mode: ${this.mode}`);
  }

  async detectTemplateDirectory() {
    // Common locations for template source
    const candidates = [
      // Git remote template
      path.join(this.projectDir, '.git/template-remote'),
      // NPM global installation
      path.join(process.env.HOME || process.env.USERPROFILE, '.npm/global/node_modules/@ai-template/core'),
      // Local development
      '../ai-coding-template',
      '../../ai-coding-template',
      // Current directory if it's the template
      '.'
    ];

    for (const candidate of candidates) {
      const manifestPath = path.join(candidate, '.template-manifest.json');
      if (fs.existsSync(manifestPath)) {
        console.log(`✅ Detected template source: ${candidate}`);
        return candidate;
      }
    }

    return null;
  }

  loadCategorizer() {
    const manifestPath = path.join(this.projectDir, '.template-manifest.json');
    return new FileCategorizer(manifestPath);
  }

  async createSyncPlan(categorizer) {
    const plan = {
      pull: [], // Template → Project
      push: [], // Project → Template
      conflicts: [],
      skipped: []
    };

    // Get files that can be synced (core and reference categories)
    const syncableCategories = ['core', 'reference'];

    for (const categoryName of syncableCategories) {
      try {
        const files = categorizer.getFilesInCategory(categoryName);
        const category = categorizer.manifest.categories[categoryName];

        for (const file of files) {
          const projectPath = path.join(this.projectDir, file);
          const templatePath = path.join(this.templateDir, file);

          const syncInfo = await this.analyzeSyncCandidate(file, projectPath, templatePath, category);

          if (syncInfo.conflict) {
            plan.conflicts.push(syncInfo);
          } else if (syncInfo.action === 'pull') {
            plan.pull.push(syncInfo);
          } else if (syncInfo.action === 'push') {
            plan.push.push(syncInfo);
          } else {
            plan.skipped.push(syncInfo);
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

  async analyzeSyncCandidate(file, projectPath, templatePath, category) {
    const projectExists = fs.existsSync(projectPath);
    const templateExists = fs.existsSync(templatePath);

    const info = {
      file,
      projectPath,
      templatePath,
      category: category.strategy,
      projectExists,
      templateExists,
      action: 'skip',
      conflict: false,
      reason: ''
    };

    if (!projectExists && !templateExists) {
      info.reason = 'File does not exist in either location';
      return info;
    }

    if (!projectExists && templateExists) {
      info.action = this.mode === 'push' ? 'skip' : 'pull';
      info.reason = 'File only exists in template';
      return info;
    }

    if (projectExists && !templateExists) {
      info.action = this.mode === 'pull' ? 'skip' : 'push';
      info.reason = 'File only exists in project';
      return info;
    }

    // Both files exist - check for differences
    const projectContent = fs.readFileSync(projectPath, 'utf8');
    const templateContent = fs.readFileSync(templatePath, 'utf8');

    if (projectContent === templateContent) {
      info.reason = 'Files are identical';
      return info;
    }

    // Files are different - determine action
    const projectStat = fs.statSync(projectPath);
    const templateStat = fs.statSync(templatePath);

    if (this.mode === 'pull') {
      info.action = 'pull';
      info.reason = 'Template is newer or forced pull';
    } else if (this.mode === 'push') {
      info.action = 'push';
      info.reason = 'Project changes to be pushed to template';
    } else {
      // Bidirectional - check timestamps
      if (templateStat.mtime > projectStat.mtime) {
        info.action = 'pull';
        info.reason = 'Template is newer';
      } else if (projectStat.mtime > templateStat.mtime) {
        info.action = 'push';
        info.reason = 'Project is newer';
      } else {
        info.conflict = true;
        info.reason = 'Files differ but have same timestamp';
      }
    }

    return info;
  }

  displaySyncPlan(plan) {
    console.log('\n📋 Sync Plan:');
    console.log('═'.repeat(50));

    console.log(`📥 Pull (Template → Project): ${plan.pull.length}`);
    console.log(`📤 Push (Project → Template): ${plan.push.length}`);
    console.log(`⚠️  Conflicts: ${plan.conflicts.length}`);
    console.log(`⏭️  Skipped: ${plan.skipped.length}`);

    if (this.verbose || plan.conflicts.length > 0) {
      if (plan.pull.length > 0) {
        console.log('\n📥 Files to pull from template:');
        plan.pull.slice(0, 10).forEach(item => {
          console.log(`   📄 ${item.file} (${item.reason})`);
        });
        if (plan.pull.length > 10) {
          console.log(`   ... and ${plan.pull.length - 10} more`);
        }
      }

      if (plan.push.length > 0) {
        console.log('\n📤 Files to push to template:');
        plan.push.slice(0, 10).forEach(item => {
          console.log(`   📄 ${item.file} (${item.reason})`);
        });
        if (plan.push.length > 10) {
          console.log(`   ... and ${plan.push.length - 10} more`);
        }
      }

      if (plan.conflicts.length > 0) {
        console.log('\n⚠️  Conflicts requiring resolution:');
        plan.conflicts.forEach(item => {
          console.log(`   ⚠️  ${item.file} - ${item.reason}`);
        });
      }
    }
  }

  async executeSyncPlan(plan) {
    const results = {
      pulled: 0,
      pushed: 0,
      conflicts: plan.conflicts.length,
      errors: []
    };

    console.log('\n🔧 Executing sync operations...');

    // Handle conflicts first
    if (plan.conflicts.length > 0 && !this.force) {
      console.log('⚠️  Conflicts detected. Use --force to overwrite or resolve manually.');
      return results;
    }

    // Execute pull operations
    for (const item of plan.pull) {
      try {
        this.ensureDirectoryExists(path.dirname(item.projectPath));
        fs.copyFileSync(item.templatePath, item.projectPath);
        results.pulled++;

        if (this.verbose) {
          console.log(`   📥 Pulled: ${item.file}`);
        }
      } catch (error) {
        results.errors.push(`Failed to pull ${item.file}: ${error.message}`);
        console.log(`   ❌ Failed: ${item.file}`);
      }
    }

    // Execute push operations
    for (const item of plan.push) {
      try {
        this.ensureDirectoryExists(path.dirname(item.templatePath));
        fs.copyFileSync(item.projectPath, item.templatePath);
        results.pushed++;

        if (this.verbose) {
          console.log(`   📤 Pushed: ${item.file}`);
        }
      } catch (error) {
        results.errors.push(`Failed to push ${item.file}: ${error.message}`);
        console.log(`   ❌ Failed: ${item.file}`);
      }
    }

    return results;
  }

  ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  reportSyncResults(results) {
    console.log('\n📊 Sync Results:');
    console.log('═'.repeat(50));

    const total = results.pulled + results.pushed;
    console.log(`✅ Successfully synced: ${total} files`);
    console.log(`   📥 Pulled: ${results.pulled}`);
    console.log(`   📤 Pushed: ${results.pushed}`);

    if (results.conflicts > 0) {
      console.log(`   ⚠️  Conflicts: ${results.conflicts}`);
    }

    if (results.errors.length > 0) {
      console.log(`\n❌ Errors: ${results.errors.length}`);
      results.errors.forEach(error => console.log(`   - ${error}`));
    } else if (total > 0) {
      console.log('\n🎉 Template sync completed successfully!');
      console.log('\n💡 Next Steps:');
      console.log('   - Review synced changes');
      console.log('   - Test functionality in both environments');
      console.log('   - Commit template improvements if pushing changes');
    } else {
      console.log('\n✅ No changes needed - template and project are in sync');
    }
  }
}

module.exports = TemplateSyncer;