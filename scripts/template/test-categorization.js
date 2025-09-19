#!/usr/bin/env node

/**
 * Test Template File Categorization
 * Tests the file categorizer against our current file structure
 */

const path = require('path');
const FileCategorizer = require('../../cli/utils/file-categorizer');

function testCategorization() {
  console.log('🧪 Testing Template File Categorization\n');

  try {
    const categorizer = new FileCategorizer();

    // Test specific files we know should exist
    const testFiles = [
      { path: '.claude/commands/plan.md', expectedCategory: 'core' },
      { path: 'CLAUDE.md', expectedCategory: 'core' },
      { path: 'docs/development/guidelines/README.md', expectedCategory: 'reference' },
      { path: 'src/example.js', expectedCategory: 'user' },
      { path: 'workbench/misc/test.md', expectedCategory: 'ignore' },
      { path: 'package.json', expectedCategory: 'configuration' },
      { path: '.template-manifest.json', expectedCategory: 'optional' } // Users should see the manifest
    ];

    console.log('🔍 Testing individual file categorization:');
    let testsPassed = 0;
    let testsTotal = 0;

    for (const test of testFiles) {
      testsTotal++;
      const result = categorizer.categorizeFile(test.path);
      const passed = result.category === test.expectedCategory;

      if (passed) testsPassed++;

      const status = passed ? '✅' : '❌';
      console.log(`   ${status} ${test.path} → ${result.category} (expected: ${test.expectedCategory})`);

      if (!passed) {
        console.log(`      Strategy: ${result.strategy}, Pattern: ${result.pattern}`);
      }
    }

    // Get category summary
    console.log('\n📊 Category Summary:');
    const summary = categorizer.getCategorySummary();

    for (const [categoryName, info] of Object.entries(summary)) {
      console.log(`   ${categoryName}: ${info.count} files (${info.strategy})`);

      // Show a few example files
      if (info.files.length > 0) {
        const examples = info.files.slice(0, 3);
        examples.forEach(file => console.log(`     - ${file.path}`));
        if (info.files.length > 3) {
          console.log(`     ... and ${info.files.length - 3} more`);
        }
      }
    }

    // Validate for overlaps
    console.log('\n🔍 Checking for pattern overlaps:');
    const validation = categorizer.validateCategorization();

    if (validation.warnings.length === 0) {
      console.log('   ✅ No pattern overlaps detected');
    } else {
      validation.warnings.forEach(warning => {
        console.log(`   ⚠️  ${warning.file}: ${warning.message}`);
      });
    }

    console.log('\n📈 Test Results:');
    console.log(`   Individual tests: ${testsPassed}/${testsTotal} passed`);
    console.log(`   Pattern overlaps: ${validation.warnings.length} warnings`);
    console.log(`   Total files categorized: ${Object.values(summary).reduce((sum, cat) => sum + cat.count, 0)}`);

    const success = testsPassed === testsTotal && validation.warnings.length === 0;
    console.log(`   Overall: ${success ? '✅ PASS' : '❌ FAIL'}`);

    return success;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  const success = testCategorization();
  process.exit(success ? 0 : 1);
}

module.exports = { testCategorization };