#!/usr/bin/env node

/**
 * Template Manifest Validator
 * Validates the .template-manifest.json file and reports on file categorization
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class ManifestValidator {
  constructor(manifestPath = '.template-manifest.json') {
    this.manifestPath = manifestPath;
    this.manifest = null;
    this.errors = [];
    this.warnings = [];
  }

  async validate() {
    console.log('🔍 Validating template manifest...\n');

    try {
      // Load and parse manifest
      await this.loadManifest();

      // Validate schema
      this.validateSchema();

      // Validate file patterns
      await this.validateFilePatterns();

      // Report results
      this.reportResults();

      return this.errors.length === 0;
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      return false;
    }
  }

  async loadManifest() {
    if (!fs.existsSync(this.manifestPath)) {
      throw new Error(`Manifest file not found: ${this.manifestPath}`);
    }

    const content = fs.readFileSync(this.manifestPath, 'utf8');
    this.manifest = JSON.parse(content);
    console.log(`✅ Loaded manifest: ${this.manifest.name} v${this.manifest.templateVersion}`);
  }

  validateSchema() {
    const required = ['version', 'templateVersion', 'name', 'categories'];

    for (const field of required) {
      if (!this.manifest[field]) {
        this.errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate categories
    if (this.manifest.categories) {
      for (const [categoryName, category] of Object.entries(this.manifest.categories)) {
        if (!category.strategy) {
          this.errors.push(`Category '${categoryName}' missing strategy`);
        }
        if (!Array.isArray(category.files)) {
          this.errors.push(`Category '${categoryName}' files must be an array`);
        }
      }
    }

    console.log('✅ Schema validation completed');
  }

  async validateFilePatterns() {
    console.log('\n📁 Analyzing file patterns...');

    const allFiles = await this.getAllFiles();
    const categorizedFiles = new Set();
    const fileCategories = {};

    // Process each category
    for (const [categoryName, category] of Object.entries(this.manifest.categories)) {
      console.log(`\n📂 Category: ${categoryName} (${category.strategy})`);
      console.log(`   ${category.description}`);

      const categoryFiles = [];

      for (const pattern of category.files) {
        const matches = await this.expandPattern(pattern);
        categoryFiles.push(...matches);

        // Track which files are in which categories
        for (const file of matches) {
          if (!fileCategories[file]) {
            fileCategories[file] = [];
          }
          fileCategories[file].push(categoryName);
          categorizedFiles.add(file);
        }
      }

      console.log(`   Files: ${categoryFiles.length} matches`);
      if (categoryFiles.length > 0 && categoryFiles.length <= 10) {
        categoryFiles.forEach(file => console.log(`     - ${file}`));
      } else if (categoryFiles.length > 10) {
        categoryFiles.slice(0, 5).forEach(file => console.log(`     - ${file}`));
        console.log(`     ... and ${categoryFiles.length - 5} more`);
      }
    }

    // Check for overlaps
    const overlaps = Object.entries(fileCategories).filter(([file, categories]) => categories.length > 1);
    if (overlaps.length > 0) {
      console.log('\n⚠️  File overlaps detected:');
      overlaps.forEach(([file, categories]) => {
        console.log(`   ${file} → ${categories.join(', ')}`);
        this.warnings.push(`File '${file}' matches multiple categories: ${categories.join(', ')}`);
      });
    }

    // Check for uncategorized files
    const uncategorized = allFiles.filter(file => !categorizedFiles.has(file));
    if (uncategorized.length > 0) {
      console.log('\n📋 Uncategorized files:');
      uncategorized.slice(0, 10).forEach(file => console.log(`   - ${file}`));
      if (uncategorized.length > 10) {
        console.log(`   ... and ${uncategorized.length - 10} more`);
      }
      this.warnings.push(`${uncategorized.length} files are not categorized`);
    }
  }

  async getAllFiles() {
    return new Promise((resolve, reject) => {
      glob('**/*', {
        ignore: ['node_modules/**', '.git/**', '*.log'],
        nodir: true
      }, (err, files) => {
        if (err) reject(err);
        else resolve(files);
      });
    });
  }

  async expandPattern(pattern) {
    return new Promise((resolve, reject) => {
      glob(pattern, { nodir: true }, (err, files) => {
        if (err) reject(err);
        else resolve(files.filter(file => fs.existsSync(file)));
      });
    });
  }

  reportResults() {
    console.log('\n📊 Validation Summary');
    console.log('='.repeat(50));

    if (this.errors.length === 0) {
      console.log('✅ No errors found');
    } else {
      console.log(`❌ ${this.errors.length} error(s):`);
      this.errors.forEach(error => console.log(`   - ${error}`));
    }

    if (this.warnings.length === 0) {
      console.log('✅ No warnings');
    } else {
      console.log(`⚠️  ${this.warnings.length} warning(s):`);
      this.warnings.forEach(warning => console.log(`   - ${warning}`));
    }

    console.log(`\n📈 Template: ${this.manifest.name}`);
    console.log(`📈 Version: ${this.manifest.templateVersion}`);
    console.log(`📈 Categories: ${Object.keys(this.manifest.categories).length}`);
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new ManifestValidator();
  validator.validate().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = ManifestValidator;