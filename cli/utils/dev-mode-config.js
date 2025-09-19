/**
 * Development Mode Configuration
 * Manages development mode settings for template contributors
 */

const fs = require('fs');
const path = require('path');

class DevModeConfig {
  constructor(projectDir = '.') {
    this.projectDir = projectDir;
    this.configFile = path.join(projectDir, '.template-dev-config.json');
    this.config = this.loadConfig();
  }

  loadConfig() {
    const defaultConfig = {
      developmentMode: false,
      templateSource: null,
      syncMode: 'bidirectional', // pull, push, bidirectional
      autoSync: false,
      syncInterval: 0, // minutes, 0 = disabled
      excludePatterns: [
        'node_modules/**',
        '.git/**',
        '*.log',
        '.env*'
      ],
      lastSync: null,
      contributor: {
        name: null,
        email: null,
        role: 'contributor' // contributor, maintainer, user
      }
    };

    if (!fs.existsSync(this.configFile)) {
      return defaultConfig;
    }

    try {
      const fileConfig = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
      return { ...defaultConfig, ...fileConfig };
    } catch (error) {
      console.warn(`⚠️  Invalid dev config file, using defaults: ${error.message}`);
      return defaultConfig;
    }
  }

  saveConfig() {
    try {
      fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
      return true;
    } catch (error) {
      console.error(`❌ Failed to save dev config: ${error.message}`);
      return false;
    }
  }

  enableDevelopmentMode(templateSource, options = {}) {
    this.config.developmentMode = true;
    this.config.templateSource = templateSource;

    if (options.syncMode) {
      this.config.syncMode = options.syncMode;
    }

    if (options.autoSync !== undefined) {
      this.config.autoSync = options.autoSync;
    }

    if (options.syncInterval !== undefined) {
      this.config.syncInterval = options.syncInterval;
    }

    if (options.contributor) {
      this.config.contributor = { ...this.config.contributor, ...options.contributor };
    }

    return this.saveConfig();
  }

  disableDevelopmentMode() {
    this.config.developmentMode = false;
    this.config.templateSource = null;
    this.config.autoSync = false;
    this.config.syncInterval = 0;
    this.config.lastSync = null;

    return this.saveConfig();
  }

  isDevelopmentMode() {
    return this.config.developmentMode;
  }

  getTemplateSource() {
    return this.config.templateSource;
  }

  setSyncMode(mode) {
    if (!['pull', 'push', 'bidirectional'].includes(mode)) {
      throw new Error('Invalid sync mode. Must be: pull, push, or bidirectional');
    }

    this.config.syncMode = mode;
    return this.saveConfig();
  }

  updateLastSync() {
    this.config.lastSync = new Date().toISOString();
    return this.saveConfig();
  }

  getStatus() {
    return {
      developmentMode: this.config.developmentMode,
      templateSource: this.config.templateSource,
      syncMode: this.config.syncMode,
      autoSync: this.config.autoSync,
      syncInterval: this.config.syncInterval,
      lastSync: this.config.lastSync,
      contributor: this.config.contributor,
      configFile: this.configFile,
      configExists: fs.existsSync(this.configFile)
    };
  }

  validateTemplateSource(templateSource) {
    if (!templateSource) {
      return { valid: false, error: 'Template source path is required' };
    }

    if (!fs.existsSync(templateSource)) {
      return { valid: false, error: `Template source directory does not exist: ${templateSource}` };
    }

    const manifestPath = path.join(templateSource, '.template-manifest.json');
    if (!fs.existsSync(manifestPath)) {
      return { valid: false, error: `Template manifest not found in: ${templateSource}` };
    }

    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (!manifest.name || !manifest.templateVersion) {
        return { valid: false, error: 'Invalid template manifest format' };
      }
    } catch (error) {
      return { valid: false, error: `Invalid template manifest: ${error.message}` };
    }

    return { valid: true };
  }

  shouldAutoSync() {
    if (!this.config.autoSync || this.config.syncInterval <= 0) {
      return false;
    }

    if (!this.config.lastSync) {
      return true;
    }

    const lastSyncTime = new Date(this.config.lastSync);
    const now = new Date();
    const timeDiff = now - lastSyncTime;
    const intervalMs = this.config.syncInterval * 60 * 1000; // Convert minutes to ms

    return timeDiff >= intervalMs;
  }

  getConfigSummary() {
    const status = this.getStatus();

    return [
      `Development Mode: ${status.developmentMode ? '✅ Enabled' : '❌ Disabled'}`,
      `Template Source: ${status.templateSource || 'Not configured'}`,
      `Sync Mode: ${status.syncMode}`,
      `Auto Sync: ${status.autoSync ? `Every ${status.syncInterval} minutes` : 'Disabled'}`,
      `Last Sync: ${status.lastSync ? new Date(status.lastSync).toLocaleString() : 'Never'}`,
      `Contributor: ${status.contributor.name || 'Not set'} (${status.contributor.role})`
    ].join('\n');
  }
}

module.exports = DevModeConfig;