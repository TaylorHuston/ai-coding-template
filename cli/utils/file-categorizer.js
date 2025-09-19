/**
 * File Categorizer Utility
 * Categorizes files based on template manifest patterns
 */

const fs = require('fs');
const path = require('path');

class FileCategorizer {
  constructor(manifestPath = '.template-manifest.json', baseDir = null) {
    this.manifestPath = manifestPath;
    this.baseDir = baseDir || path.dirname(manifestPath);
    this.manifest = null;
    this.loadManifest();
  }

  loadManifest() {
    if (!fs.existsSync(this.manifestPath)) {
      throw new Error(`Manifest file not found: ${this.manifestPath}`);
    }
    this.manifest = JSON.parse(fs.readFileSync(this.manifestPath, 'utf8'));
  }

  /**
   * Categorize a single file path
   * @param {string} filePath - The file path to categorize
   * @returns {Object} - Category info with name, strategy, and match details
   */
  categorizeFile(filePath) {
    const normalizedPath = filePath.replace(/\\/g, '/');

    for (const [categoryName, category] of Object.entries(this.manifest.categories)) {
      for (const pattern of category.files) {
        if (this.matchesPattern(normalizedPath, pattern)) {
          return {
            category: categoryName,
            strategy: category.strategy,
            description: category.description,
            pattern: pattern,
            backup: category.backup || false
          };
        }
      }
    }

    return {
      category: 'uncategorized',
      strategy: 'unknown',
      description: 'File not matched by any pattern',
      pattern: null,
      backup: false
    };
  }

  /**
   * Get all files in a category
   * @param {string} categoryName - Name of the category
   * @returns {Array} - Array of file paths
   */
  getFilesInCategory(categoryName) {
    const category = this.manifest.categories[categoryName];
    if (!category) {
      throw new Error(`Category not found: ${categoryName}`);
    }

    const files = [];
    for (const pattern of category.files) {
      files.push(...this.expandPattern(pattern));
    }

    return [...new Set(files)]; // Remove duplicates
  }

  /**
   * Get categorization summary for all files in project
   * @returns {Object} - Summary with counts and lists by category
   */
  getCategorySummary() {
    const summary = {};

    // Initialize categories
    for (const categoryName of Object.keys(this.manifest.categories)) {
      summary[categoryName] = {
        count: 0,
        files: [],
        strategy: this.manifest.categories[categoryName].strategy
      };
    }
    summary.uncategorized = { count: 0, files: [], strategy: 'unknown' };

    // Get all files and categorize them
    const allFiles = this.getAllFiles(this.baseDir);

    for (const file of allFiles) {
      const category = this.categorizeFile(file);
      summary[category.category].count++;
      summary[category.category].files.push({
        path: file,
        pattern: category.pattern
      });
    }

    return summary;
  }

  /**
   * Check if a file path matches a glob-like pattern
   * @param {string} filePath - The file path to test
   * @param {string} pattern - The pattern to match against
   * @returns {boolean} - Whether the file matches the pattern
   */
  matchesPattern(filePath, pattern) {
    // Handle directory patterns ending with /
    if (pattern.endsWith('/')) {
      const dirPattern = pattern.slice(0, -1);
      return filePath.startsWith(dirPattern + '/') || filePath === dirPattern;
    }

    // Convert glob pattern to regex - handle ** first, then *
    let regexPattern = pattern
      .replace(/\./g, '\\.')  // Escape dots
      .replace(/\*\*/g, '___DOUBLESTAR___')  // Temporarily replace **
      .replace(/\*/g, '[^/]*')  // * matches anything except /
      .replace(/___DOUBLESTAR___/g, '.*')  // ** matches anything including /
      .replace(/\?/g, '[^/]');  // ? matches single character except /

    const regex = new RegExp('^' + regexPattern + '$');
    return regex.test(filePath);
  }

  /**
   * Expand a pattern to actual files (simple implementation)
   * @param {string} pattern - The pattern to expand
   * @returns {Array} - Array of matching file paths
   */
  expandPattern(pattern) {
    const matches = [];
    const allFiles = this.getAllFiles(this.baseDir);

    for (const file of allFiles) {
      if (this.matchesPattern(file, pattern)) {
        matches.push(file);
      }
    }

    return matches;
  }

  /**
   * Get all files in the project (simple recursive implementation)
   * @param {string} dir - Directory to start from
   * @param {Array} fileList - Accumulator for file paths
   * @returns {Array} - Array of all file paths
   */
  getAllFiles(dir = '.', fileList = [], baseDir = null) {
    if (baseDir === null) {
      baseDir = dir;
    }

    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

      // Skip common directories we don't want to scan
      if (['node_modules', '.git'].includes(file)) {
        continue;
      }

      if (fs.statSync(fullPath).isDirectory()) {
        this.getAllFiles(fullPath, fileList, baseDir);
      } else {
        fileList.push(relativePath);
      }
    }

    return fileList;
  }

  /**
   * Validate that file categorization is working correctly
   * @returns {Object} - Validation results
   */
  validateCategorization() {
    const results = {
      valid: true,
      errors: [],
      warnings: [],
      summary: this.getCategorySummary()
    };

    // Check for overlapping patterns
    const allFiles = this.getAllFiles(this.baseDir);
    for (const file of allFiles) {
      const matches = [];
      for (const [categoryName, category] of Object.entries(this.manifest.categories)) {
        for (const pattern of category.files) {
          if (this.matchesPattern(file, pattern)) {
            matches.push({ category: categoryName, pattern });
          }
        }
      }

      if (matches.length > 1) {
        results.warnings.push({
          file,
          message: `File matches multiple patterns: ${matches.map(m => `${m.category}:${m.pattern}`).join(', ')}`
        });
      }
    }

    return results;
  }
}

module.exports = FileCategorizer;