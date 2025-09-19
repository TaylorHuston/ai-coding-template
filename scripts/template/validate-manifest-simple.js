#!/usr/bin/env node

/**
 * Simple Template Manifest Validator
 * Basic validation without external dependencies
 */

const fs = require('fs');
const path = require('path');

function validateManifest() {
  console.log('🔍 Validating template manifest...\n');

  try {
    // Load manifest
    const manifestPath = '.template-manifest.json';
    if (!fs.existsSync(manifestPath)) {
      throw new Error('Manifest file not found: .template-manifest.json');
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log(`✅ Loaded: ${manifest.name} v${manifest.templateVersion}`);

    // Validate required fields
    const required = ['version', 'templateVersion', 'name', 'categories'];
    const missing = required.filter(field => !manifest[field]);

    if (missing.length > 0) {
      console.log(`❌ Missing required fields: ${missing.join(', ')}`);
      return false;
    }

    // Validate categories
    console.log('\n📂 Categories:');
    for (const [categoryName, category] of Object.entries(manifest.categories)) {
      console.log(`   ${categoryName}: ${category.strategy} (${category.files.length} patterns)`);

      if (!category.strategy) {
        console.log(`   ❌ Missing strategy for category: ${categoryName}`);
        return false;
      }

      if (!Array.isArray(category.files)) {
        console.log(`   ❌ Files must be array for category: ${categoryName}`);
        return false;
      }
    }

    // Test a few file patterns manually
    console.log('\n🔍 Testing key file patterns:');

    const testPatterns = [
      { pattern: '.claude/', category: 'core', shouldExist: true },
      { pattern: 'CLAUDE.md', category: 'core', shouldExist: true },
      { pattern: 'docs/development/guidelines/', category: 'reference', shouldExist: true },
      { pattern: 'src/', category: 'user', shouldExist: false }, // May not exist yet
      { pattern: 'workbench/', category: 'ignore', shouldExist: true }
    ];

    for (const test of testPatterns) {
      const exists = fs.existsSync(test.pattern);
      const status = test.shouldExist ? (exists ? '✅' : '⚠️') : (exists ? '✅' : '📝');
      console.log(`   ${status} ${test.pattern} (${test.category})`);
    }

    console.log('\n📊 Validation Summary:');
    console.log('✅ Manifest structure is valid');
    console.log(`📈 Template: ${manifest.name}`);
    console.log(`📈 Version: ${manifest.templateVersion}`);
    console.log(`📈 Categories: ${Object.keys(manifest.categories).length}`);
    console.log(`📈 Features: ${Object.keys(manifest.features || {}).length}`);

    return true;

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  const success = validateManifest();
  process.exit(success ? 0 : 1);
}

module.exports = { validateManifest };