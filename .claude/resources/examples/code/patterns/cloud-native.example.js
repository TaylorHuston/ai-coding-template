/**
 * Cloud-Native Architecture Patterns
 *
 * Comprehensive implementation of cloud-native patterns and practices:
 * - Microservices architecture with service discovery
 * - Container orchestration patterns
 * - Service mesh integration
 * - Auto-scaling and load balancing
 * - Configuration management and secrets
 * - Distributed configuration with feature flags
 * - Cloud storage patterns and abstractions
 * - Serverless and FaaS integration
 * - Multi-cloud deployment strategies
 */

const EventEmitter = require('events');
const crypto = require('crypto');

/**
 * Service Registry for microservices discovery
 */
class ServiceRegistry extends EventEmitter {
  constructor(options = {}) {
    super();
    this.services = new Map();
    this.healthCheckInterval = options.healthCheckInterval || 30000;
    this.serviceTimeout = options.serviceTimeout || 60000;
    this.regions = options.regions || ['us-east-1'];
    this.environment = options.environment || 'production';

    // Start health check loop
    this.healthCheckTimer = setInterval(() => this.performHealthChecks(), this.healthCheckInterval);
  }

  /**
   * Register service instance
   */
  registerService(serviceConfig) {
    const {
      name,
      version,
      host,
      port,
      protocol = 'http',
      healthCheck,
      metadata = {},
      tags = []
    } = serviceConfig;

    const serviceId = crypto.randomUUID();
    const instance = {
      id: serviceId,
      name,
      version,
      host,
      port,
      protocol,
      url: `${protocol}://${host}:${port}`,
      healthCheck,
      metadata: {
        ...metadata,
        registeredAt: new Date().toISOString(),
        region: metadata.region || this.regions[0],
        environment: this.environment
      },
      tags,
      status: 'starting',
      lastSeen: Date.now(),
      healthStatus: {
        healthy: false,
        lastCheck: null,
        consecutiveFailures: 0
      }
    };

    // Group by service name
    if (!this.services.has(name)) {
      this.services.set(name, new Map());
    }

    this.services.get(name).set(serviceId, instance);

    this.emit('serviceRegistered', instance);
    console.log(`Service registered: ${name}@${version} [${serviceId}]`);

    return serviceId;
  }

  /**
   * Deregister service instance
   */
  deregisterService(serviceId) {
    for (const [serviceName, instances] of this.services.entries()) {
      if (instances.has(serviceId)) {
        const instance = instances.get(serviceId);
        instances.delete(serviceId);

        if (instances.size === 0) {
          this.services.delete(serviceName);
        }

        this.emit('serviceDeregistered', instance);
        console.log(`Service deregistered: ${instance.name} [${serviceId}]`);
        return true;
      }
    }

    return false;
  }

  /**
   * Discover services by name
   */
  discoverServices(serviceName, options = {}) {
    const instances = this.services.get(serviceName);
    if (!instances) {
      return [];
    }

    let availableInstances = Array.from(instances.values());

    // Filter by health status
    if (options.healthyOnly !== false) {
      availableInstances = availableInstances.filter(instance =>
        instance.healthStatus.healthy && instance.status === 'running'
      );
    }

    // Filter by version
    if (options.version) {
      availableInstances = availableInstances.filter(instance =>
        instance.version === options.version
      );
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      availableInstances = availableInstances.filter(instance =>
        options.tags.every(tag => instance.tags.includes(tag))
      );
    }

    // Filter by region
    if (options.region) {
      availableInstances = availableInstances.filter(instance =>
        instance.metadata.region === options.region
      );
    }

    return availableInstances;
  }

  /**
   * Get service instance with load balancing
   */
  getServiceInstance(serviceName, options = {}) {
    const instances = this.discoverServices(serviceName, options);

    if (instances.length === 0) {
      return null;
    }

    const strategy = options.loadBalancingStrategy || 'round-robin';

    switch (strategy) {
      case 'round-robin':
        return this.roundRobinSelection(serviceName, instances);
      case 'random':
        return instances[Math.floor(Math.random() * instances.length)];
      case 'least-connections':
        return this.leastConnectionsSelection(instances);
      case 'weighted':
        return this.weightedSelection(instances);
      default:
        return instances[0];
    }
  }

  /**
   * Round-robin load balancing
   */
  roundRobinSelection(serviceName, instances) {
    if (!this.roundRobinCounters) {
      this.roundRobinCounters = new Map();
    }

    let counter = this.roundRobinCounters.get(serviceName) || 0;
    const instance = instances[counter % instances.length];

    this.roundRobinCounters.set(serviceName, counter + 1);
    return instance;
  }

  /**
   * Least connections load balancing
   */
  leastConnectionsSelection(instances) {
    return instances.reduce((least, current) => {
      const leastConnections = least.metadata.activeConnections || 0;
      const currentConnections = current.metadata.activeConnections || 0;
      return currentConnections < leastConnections ? current : least;
    });
  }

  /**
   * Weighted load balancing
   */
  weightedSelection(instances) {
    const totalWeight = instances.reduce((sum, instance) =>
      sum + (instance.metadata.weight || 1), 0
    );

    let random = Math.random() * totalWeight;

    for (const instance of instances) {
      random -= (instance.metadata.weight || 1);
      if (random <= 0) {
        return instance;
      }
    }

    return instances[0];
  }

  /**
   * Perform health checks on all services
   */
  async performHealthChecks() {
    const promises = [];

    for (const [serviceName, instances] of this.services.entries()) {
      for (const [instanceId, instance] of instances.entries()) {
        promises.push(this.checkInstanceHealth(instance));
      }
    }

    await Promise.allSettled(promises);

    // Remove stale services
    this.removeStaleServices();
  }

  /**
   * Check health of single service instance
   */
  async checkInstanceHealth(instance) {
    if (!instance.healthCheck) {
      // Mark as healthy if no health check defined
      instance.healthStatus = {
        healthy: true,
        lastCheck: new Date().toISOString(),
        consecutiveFailures: 0
      };
      return;
    }

    try {
      const healthUrl = instance.healthCheck.url || `${instance.url}/health`;
      const timeout = instance.healthCheck.timeout || 5000;

      // Simplified health check (in real implementation, use actual HTTP client)
      const isHealthy = await this.performHttpHealthCheck(healthUrl, timeout);

      instance.healthStatus = {
        healthy: isHealthy,
        lastCheck: new Date().toISOString(),
        consecutiveFailures: isHealthy ? 0 : instance.healthStatus.consecutiveFailures + 1
      };

      instance.lastSeen = Date.now();

      if (isHealthy && instance.status === 'starting') {
        instance.status = 'running';
        this.emit('serviceReady', instance);
      }

    } catch (error) {
      instance.healthStatus = {
        healthy: false,
        lastCheck: new Date().toISOString(),
        consecutiveFailures: instance.healthStatus.consecutiveFailures + 1,
        error: error.message
      };

      this.emit('serviceUnhealthy', instance);
    }
  }

  /**
   * Simplified HTTP health check
   */
  async performHttpHealthCheck(url, timeout) {
    // Mock implementation - in real scenario, use actual HTTP client
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 90% success rate
        resolve(Math.random() > 0.1);
      }, Math.random() * 100);
    });
  }

  /**
   * Remove stale services that haven't been seen recently
   */
  removeStaleServices() {
    const now = Date.now();

    for (const [serviceName, instances] of this.services.entries()) {
      for (const [instanceId, instance] of instances.entries()) {
        if (now - instance.lastSeen > this.serviceTimeout) {
          this.deregisterService(instanceId);
        }
      }
    }
  }

  /**
   * Get registry statistics
   */
  getStatistics() {
    const stats = {
      totalServices: this.services.size,
      totalInstances: 0,
      healthyInstances: 0,
      servicesBreakdown: {}
    };

    for (const [serviceName, instances] of this.services.entries()) {
      const serviceInstances = Array.from(instances.values());
      const healthyCount = serviceInstances.filter(i => i.healthStatus.healthy).length;

      stats.totalInstances += serviceInstances.length;
      stats.healthyInstances += healthyCount;

      stats.servicesBreakdown[serviceName] = {
        instances: serviceInstances.length,
        healthy: healthyCount,
        versions: [...new Set(serviceInstances.map(i => i.version))]
      };
    }

    return stats;
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
  }
}

/**
 * Configuration Manager for cloud-native apps
 */
class ConfigurationManager {
  constructor(options = {}) {
    this.sources = options.sources || [];
    this.cache = new Map();
    this.watchers = new Map();
    this.environment = options.environment || 'production';
    this.namespace = options.namespace || 'default';
    this.refreshInterval = options.refreshInterval || 60000;

    // Add default sources
    this.addSource(new EnvironmentVariableSource());
    this.addSource(new FileSource({ path: './config.json' }));

    // Start refresh timer
    this.refreshTimer = setInterval(() => this.refresh(), this.refreshInterval);
  }

  /**
   * Add configuration source
   */
  addSource(source) {
    this.sources.push(source);
    source.on('change', (key, value) => {
      this.handleConfigChange(key, value);
    });
  }

  /**
   * Get configuration value
   */
  async get(key, defaultValue = null) {
    // Check cache first
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      if (Date.now() - cached.timestamp < 30000) { // 30 second cache
        return cached.value;
      }
    }

    // Try sources in order (last wins)
    let value = defaultValue;

    for (const source of this.sources) {
      try {
        const sourceValue = await source.get(key);
        if (sourceValue !== null && sourceValue !== undefined) {
          value = sourceValue;
        }
      } catch (error) {
        console.warn(`Failed to get config from source ${source.constructor.name}:`, error.message);
      }
    }

    // Cache the result
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });

    return value;
  }

  /**
   * Set configuration value
   */
  async set(key, value) {
    // Find writable source
    for (const source of this.sources.reverse()) {
      if (source.writable) {
        await source.set(key, value);
        this.cache.delete(key); // Invalidate cache
        return;
      }
    }

    throw new Error('No writable configuration source available');
  }

  /**
   * Watch for configuration changes
   */
  watch(key, callback) {
    if (!this.watchers.has(key)) {
      this.watchers.set(key, []);
    }

    this.watchers.get(key).push(callback);

    // Return unwatch function
    return () => {
      const callbacks = this.watchers.get(key) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Handle configuration change
   */
  handleConfigChange(key, value) {
    // Invalidate cache
    this.cache.delete(key);

    // Notify watchers
    const callbacks = this.watchers.get(key) || [];
    callbacks.forEach(callback => {
      try {
        callback(value, key);
      } catch (error) {
        console.error('Error in config watcher callback:', error);
      }
    });
  }

  /**
   * Refresh all configuration
   */
  async refresh() {
    this.cache.clear();

    for (const source of this.sources) {
      if (source.refresh) {
        try {
          await source.refresh();
        } catch (error) {
          console.warn(`Failed to refresh config source ${source.constructor.name}:`, error.message);
        }
      }
    }
  }

  /**
   * Get all configuration
   */
  async getAll() {
    const config = {};

    for (const source of this.sources) {
      if (source.getAll) {
        try {
          const sourceConfig = await source.getAll();
          Object.assign(config, sourceConfig);
        } catch (error) {
          console.warn(`Failed to get all config from source ${source.constructor.name}:`, error.message);
        }
      }
    }

    return config;
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    for (const source of this.sources) {
      if (source.destroy) {
        source.destroy();
      }
    }
  }
}

/**
 * Environment Variable Configuration Source
 */
class EnvironmentVariableSource extends EventEmitter {
  constructor() {
    super();
    this.writable = false;
  }

  async get(key) {
    // Convert dot notation to environment variable format
    const envKey = key.toUpperCase().replace(/\./g, '_');
    return process.env[envKey] || null;
  }

  async getAll() {
    return { ...process.env };
  }
}

/**
 * File Configuration Source
 */
class FileSource extends EventEmitter {
  constructor(options) {
    super();
    this.path = options.path;
    this.writable = options.writable || false;
    this.format = options.format || 'json';
    this.config = {};
    this.watchFile();
  }

  async get(key) {
    await this.loadConfig();
    return this.getNestedValue(this.config, key);
  }

  async set(key, value) {
    if (!this.writable) {
      throw new Error('File source is not writable');
    }

    await this.loadConfig();
    this.setNestedValue(this.config, key, value);
    await this.saveConfig();
  }

  async getAll() {
    await this.loadConfig();
    return { ...this.config };
  }

  async loadConfig() {
    try {
      const fs = require('fs').promises;
      const content = await fs.readFile(this.path, 'utf8');

      if (this.format === 'json') {
        this.config = JSON.parse(content);
      } else if (this.format === 'yaml') {
        // Would use yaml parser in real implementation
        this.config = {};
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      this.config = {};
    }
  }

  async saveConfig() {
    const fs = require('fs').promises;
    const content = JSON.stringify(this.config, null, 2);
    await fs.writeFile(this.path, content, 'utf8');
  }

  watchFile() {
    // In real implementation, watch file for changes
    // and emit 'change' events
  }

  getNestedValue(obj, key) {
    return key.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  setNestedValue(obj, key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, prop) => {
      if (!current[prop]) {
        current[prop] = {};
      }
      return current[prop];
    }, obj);

    target[lastKey] = value;
  }
}

/**
 * Feature Flag Manager
 */
class FeatureFlagManager {
  constructor(configManager) {
    this.configManager = configManager;
    this.cache = new Map();
    this.userSegments = new Map();
    this.rolloutStrategies = new Map();

    this.registerStrategy('percentage', this.percentageRollout.bind(this));
    this.registerStrategy('user-list', this.userListRollout.bind(this));
    this.registerStrategy('segment', this.segmentRollout.bind(this));
  }

  /**
   * Register rollout strategy
   */
  registerStrategy(name, strategy) {
    this.rolloutStrategies.set(name, strategy);
  }

  /**
   * Check if feature is enabled
   */
  async isEnabled(featureName, context = {}) {
    const flagConfig = await this.getFlagConfig(featureName);

    if (!flagConfig) {
      return false;
    }

    // Check if feature is globally enabled
    if (!flagConfig.enabled) {
      return false;
    }

    // Apply rollout strategy
    if (flagConfig.rollout) {
      const strategy = this.rolloutStrategies.get(flagConfig.rollout.strategy);
      if (strategy) {
        return await strategy(flagConfig.rollout, context);
      }
    }

    return flagConfig.enabled;
  }

  /**
   * Get feature flag configuration
   */
  async getFlagConfig(featureName) {
    const cacheKey = `feature.${featureName}`;

    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 30000) {
        return cached.config;
      }
    }

    // Get from configuration manager
    const config = await this.configManager.get(`features.${featureName}`);

    if (config) {
      this.cache.set(cacheKey, {
        config,
        timestamp: Date.now()
      });
    }

    return config;
  }

  /**
   * Percentage-based rollout
   */
  async percentageRollout(rolloutConfig, context) {
    const percentage = rolloutConfig.percentage || 0;
    const userId = context.userId || context.sessionId || 'anonymous';

    // Use hash of user ID for consistent results
    const crypto = require('crypto');
    const hash = crypto.createHash('md5').update(userId).digest('hex');
    const userPercentage = parseInt(hash.substr(0, 8), 16) % 100;

    return userPercentage < percentage;
  }

  /**
   * User list rollout
   */
  async userListRollout(rolloutConfig, context) {
    const userList = rolloutConfig.users || [];
    const userId = context.userId;

    return userId && userList.includes(userId);
  }

  /**
   * Segment-based rollout
   */
  async segmentRollout(rolloutConfig, context) {
    const segmentName = rolloutConfig.segment;
    const segment = this.userSegments.get(segmentName);

    if (!segment) {
      return false;
    }

    return segment.includes(context);
  }

  /**
   * Define user segment
   */
  defineSegment(name, predicate) {
    this.userSegments.set(name, {
      name,
      includes: predicate
    });
  }

  /**
   * Get feature flag value with type
   */
  async getFeatureValue(featureName, defaultValue, context = {}) {
    const flagConfig = await this.getFlagConfig(featureName);

    if (!flagConfig || !(await this.isEnabled(featureName, context))) {
      return defaultValue;
    }

    return flagConfig.value !== undefined ? flagConfig.value : defaultValue;
  }
}

/**
 * Auto-Scaler for cloud-native applications
 */
class AutoScaler extends EventEmitter {
  constructor(options = {}) {
    super();
    this.minInstances = options.minInstances || 1;
    this.maxInstances = options.maxInstances || 10;
    this.targetCpuUtilization = options.targetCpuUtilization || 70;
    this.targetMemoryUtilization = options.targetMemoryUtilization || 80;
    this.scaleUpCooldown = options.scaleUpCooldown || 300000; // 5 minutes
    this.scaleDownCooldown = options.scaleDownCooldown || 600000; // 10 minutes

    this.instances = new Map();
    this.metrics = new Map();
    this.lastScaleAction = 0;
    this.scalingInProgress = false;

    // Start monitoring
    this.monitoringInterval = setInterval(() => this.checkScaling(), 30000);
  }

  /**
   * Register instance for auto-scaling
   */
  registerInstance(instanceId, instanceConfig) {
    this.instances.set(instanceId, {
      id: instanceId,
      ...instanceConfig,
      status: 'running',
      createdAt: Date.now()
    });

    this.emit('instanceRegistered', instanceId);
  }

  /**
   * Update instance metrics
   */
  updateMetrics(instanceId, metrics) {
    this.metrics.set(instanceId, {
      ...metrics,
      timestamp: Date.now()
    });
  }

  /**
   * Check if scaling is needed
   */
  async checkScaling() {
    if (this.scalingInProgress) {
      return;
    }

    const runningInstances = Array.from(this.instances.values())
      .filter(instance => instance.status === 'running');

    if (runningInstances.length === 0) {
      return;
    }

    // Calculate average metrics
    const avgMetrics = this.calculateAverageMetrics(runningInstances);

    // Determine scaling action
    const action = this.determineScalingAction(avgMetrics, runningInstances.length);

    if (action && this.canScale(action)) {
      await this.executeScalingAction(action, runningInstances);
    }
  }

  /**
   * Calculate average metrics across instances
   */
  calculateAverageMetrics(instances) {
    const validMetrics = instances
      .map(instance => this.metrics.get(instance.id))
      .filter(metrics => metrics && Date.now() - metrics.timestamp < 120000); // 2 minutes

    if (validMetrics.length === 0) {
      return null;
    }

    const totals = validMetrics.reduce((acc, metrics) => ({
      cpu: acc.cpu + (metrics.cpu || 0),
      memory: acc.memory + (metrics.memory || 0),
      requests: acc.requests + (metrics.requestsPerSecond || 0)
    }), { cpu: 0, memory: 0, requests: 0 });

    return {
      cpu: totals.cpu / validMetrics.length,
      memory: totals.memory / validMetrics.length,
      requestsPerSecond: totals.requests / validMetrics.length,
      validInstances: validMetrics.length
    };
  }

  /**
   * Determine what scaling action is needed
   */
  determineScalingAction(avgMetrics, currentInstances) {
    if (!avgMetrics) {
      return null;
    }

    const cpuHigh = avgMetrics.cpu > this.targetCpuUtilization;
    const memoryHigh = avgMetrics.memory > this.targetMemoryUtilization;
    const cpuLow = avgMetrics.cpu < this.targetCpuUtilization * 0.5;
    const memoryLow = avgMetrics.memory < this.targetMemoryUtilization * 0.5;

    // Scale up conditions
    if ((cpuHigh || memoryHigh) && currentInstances < this.maxInstances) {
      const desiredInstances = Math.min(
        this.maxInstances,
        Math.ceil(currentInstances * 1.5)
      );
      return {
        type: 'scale-up',
        from: currentInstances,
        to: desiredInstances,
        reason: cpuHigh ? 'high-cpu' : 'high-memory',
        metrics: avgMetrics
      };
    }

    // Scale down conditions
    if (cpuLow && memoryLow && currentInstances > this.minInstances) {
      const desiredInstances = Math.max(
        this.minInstances,
        Math.floor(currentInstances * 0.8)
      );
      return {
        type: 'scale-down',
        from: currentInstances,
        to: desiredInstances,
        reason: 'low-utilization',
        metrics: avgMetrics
      };
    }

    return null;
  }

  /**
   * Check if scaling action can be performed
   */
  canScale(action) {
    const now = Date.now();
    const cooldown = action.type === 'scale-up' ? this.scaleUpCooldown : this.scaleDownCooldown;

    return (now - this.lastScaleAction) > cooldown;
  }

  /**
   * Execute scaling action
   */
  async executeScalingAction(action, currentInstances) {
    this.scalingInProgress = true;
    this.lastScaleAction = Date.now();

    try {
      if (action.type === 'scale-up') {
        await this.scaleUp(action);
      } else {
        await this.scaleDown(action, currentInstances);
      }

      this.emit('scaled', action);
    } catch (error) {
      this.emit('scalingError', { action, error });
    } finally {
      this.scalingInProgress = false;
    }
  }

  /**
   * Scale up instances
   */
  async scaleUp(action) {
    const instancesToAdd = action.to - action.from;

    for (let i = 0; i < instancesToAdd; i++) {
      const instanceId = `instance-${Date.now()}-${i}`;

      // In real implementation, this would launch actual container/VM
      await this.launchInstance(instanceId);
    }

    console.log(`Scaled up: ${action.from} -> ${action.to} instances (${action.reason})`);
  }

  /**
   * Scale down instances
   */
  async scaleDown(action, currentInstances) {
    const instancesToRemove = action.from - action.to;

    // Select instances to terminate (oldest first)
    const instancesToTerminate = currentInstances
      .sort((a, b) => a.createdAt - b.createdAt)
      .slice(0, instancesToRemove);

    for (const instance of instancesToTerminate) {
      await this.terminateInstance(instance.id);
    }

    console.log(`Scaled down: ${action.from} -> ${action.to} instances (${action.reason})`);
  }

  /**
   * Launch new instance
   */
  async launchInstance(instanceId) {
    // Mock instance launch
    this.instances.set(instanceId, {
      id: instanceId,
      status: 'launching',
      createdAt: Date.now()
    });

    // Simulate launch time
    setTimeout(() => {
      const instance = this.instances.get(instanceId);
      if (instance) {
        instance.status = 'running';
        this.emit('instanceLaunched', instanceId);
      }
    }, 5000);
  }

  /**
   * Terminate instance
   */
  async terminateInstance(instanceId) {
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.status = 'terminating';

      // Simulate graceful shutdown
      setTimeout(() => {
        this.instances.delete(instanceId);
        this.metrics.delete(instanceId);
        this.emit('instanceTerminated', instanceId);
      }, 2000);
    }
  }

  /**
   * Get scaling status
   */
  getStatus() {
    const instances = Array.from(this.instances.values());
    const runningCount = instances.filter(i => i.status === 'running').length;
    const launchingCount = instances.filter(i => i.status === 'launching').length;
    const terminatingCount = instances.filter(i => i.status === 'terminating').length;

    return {
      instances: {
        running: runningCount,
        launching: launchingCount,
        terminating: terminatingCount,
        total: instances.length
      },
      limits: {
        min: this.minInstances,
        max: this.maxInstances
      },
      thresholds: {
        cpu: this.targetCpuUtilization,
        memory: this.targetMemoryUtilization
      },
      scaling: {
        inProgress: this.scalingInProgress,
        lastAction: new Date(this.lastScaleAction).toISOString()
      }
    };
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  }
}

/**
 * Cloud Storage Abstraction
 */
class CloudStorageAdapter {
  constructor(provider, options = {}) {
    this.provider = provider;
    this.options = options;
    this.bucket = options.bucket || 'default-bucket';
    this.region = options.region || 'us-east-1';
  }

  /**
   * Upload file
   */
  async upload(key, data, options = {}) {
    const metadata = {
      contentType: options.contentType || 'application/octet-stream',
      contentEncoding: options.contentEncoding,
      cacheControl: options.cacheControl,
      metadata: options.metadata || {},
      tags: options.tags || {}
    };

    // Provider-specific implementation would go here
    return await this.provider.upload(this.bucket, key, data, metadata);
  }

  /**
   * Download file
   */
  async download(key, options = {}) {
    return await this.provider.download(this.bucket, key, options);
  }

  /**
   * Delete file
   */
  async delete(key) {
    return await this.provider.delete(this.bucket, key);
  }

  /**
   * List files
   */
  async list(prefix = '', options = {}) {
    return await this.provider.list(this.bucket, prefix, options);
  }

  /**
   * Get presigned URL for direct access
   */
  async getPresignedUrl(key, operation = 'get', expiresIn = 3600) {
    return await this.provider.getPresignedUrl(this.bucket, key, operation, expiresIn);
  }

  /**
   * Copy file
   */
  async copy(sourceKey, destinationKey, options = {}) {
    return await this.provider.copy(this.bucket, sourceKey, destinationKey, options);
  }

  /**
   * Check if file exists
   */
  async exists(key) {
    try {
      await this.provider.headObject(this.bucket, key);
      return true;
    } catch (error) {
      if (error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  }
}

/**
 * Example Usage Demonstrations
 */

// Example 1: Service Discovery
async function exampleServiceDiscovery() {
  console.log('=== Service Discovery Example ===');

  const registry = new ServiceRegistry({
    healthCheckInterval: 10000,
    serviceTimeout: 30000
  });

  // Register services
  const userServiceId = registry.registerService({
    name: 'user-service',
    version: '1.2.0',
    host: 'localhost',
    port: 3001,
    healthCheck: { url: '/health' },
    metadata: { region: 'us-east-1', weight: 2 },
    tags: ['api', 'core']
  });

  const orderServiceId = registry.registerService({
    name: 'order-service',
    version: '2.1.0',
    host: 'localhost',
    port: 3002,
    healthCheck: { url: '/health' },
    metadata: { region: 'us-east-1', weight: 1 },
    tags: ['api', 'business']
  });

  // Discover services
  setTimeout(() => {
    const userServices = registry.discoverServices('user-service');
    console.log('Discovered user services:', userServices.length);

    const instance = registry.getServiceInstance('user-service', {
      loadBalancingStrategy: 'weighted'
    });
    console.log('Selected instance:', instance?.url);

    console.log('Registry statistics:', registry.getStatistics());
  }, 2000);

  // Cleanup after demo
  setTimeout(() => {
    registry.destroy();
  }, 5000);
}

// Example 2: Configuration Management
async function exampleConfigurationManagement() {
  console.log('=== Configuration Management Example ===');

  const configManager = new ConfigurationManager({
    environment: 'production',
    namespace: 'my-app'
  });

  // Add cloud config source (mock)
  configManager.addSource({
    async get(key) {
      const cloudConfig = {
        'database.host': 'prod-db.example.com',
        'database.port': 5432,
        'api.rateLimit': 1000,
        'features.newDashboard': { enabled: true, rollout: { strategy: 'percentage', percentage: 50 } }
      };
      return cloudConfig[key] || null;
    },
    async getAll() {
      return cloudConfig;
    }
  });

  // Get configuration values
  const dbHost = await configManager.get('database.host', 'localhost');
  const rateLimit = await configManager.get('api.rateLimit', 100);

  console.log('Database host:', dbHost);
  console.log('Rate limit:', rateLimit);

  // Watch for changes
  const unwatch = configManager.watch('api.rateLimit', (newValue) => {
    console.log('Rate limit changed to:', newValue);
  });

  // Get all configuration
  const allConfig = await configManager.getAll();
  console.log('All configuration keys:', Object.keys(allConfig));

  setTimeout(() => {
    unwatch();
    configManager.destroy();
  }, 3000);
}

// Example 3: Feature Flags
async function exampleFeatureFlags() {
  console.log('=== Feature Flags Example ===');

  const configManager = new ConfigurationManager();
  const featureFlags = new FeatureFlagManager(configManager);

  // Mock feature configuration
  configManager.cache.set('features.newDashboard', {
    value: {
      enabled: true,
      rollout: {
        strategy: 'percentage',
        percentage: 30
      }
    },
    timestamp: Date.now()
  });

  // Define user segments
  featureFlags.defineSegment('beta-users', (context) => {
    return context.user?.plan === 'beta' || context.user?.role === 'admin';
  });

  // Check feature flags
  const contexts = [
    { userId: 'user-1', user: { plan: 'free' } },
    { userId: 'user-2', user: { plan: 'beta' } },
    { userId: 'user-3', user: { role: 'admin' } }
  ];

  for (const context of contexts) {
    const enabled = await featureFlags.isEnabled('newDashboard', context);
    console.log(`New dashboard enabled for ${context.userId}:`, enabled);
  }

  // Get feature value
  const dashboardConfig = await featureFlags.getFeatureValue(
    'newDashboard.theme',
    'light',
    { userId: 'user-1' }
  );
  console.log('Dashboard theme:', dashboardConfig);
}

// Example 4: Auto Scaling
async function exampleAutoScaling() {
  console.log('=== Auto Scaling Example ===');

  const autoScaler = new AutoScaler({
    minInstances: 2,
    maxInstances: 8,
    targetCpuUtilization: 70,
    scaleUpCooldown: 5000,   // Shortened for demo
    scaleDownCooldown: 10000
  });

  // Register initial instances
  autoScaler.registerInstance('instance-1', { type: 't3.medium' });
  autoScaler.registerInstance('instance-2', { type: 't3.medium' });

  // Simulate high load
  setTimeout(() => {
    autoScaler.updateMetrics('instance-1', { cpu: 85, memory: 75, requestsPerSecond: 100 });
    autoScaler.updateMetrics('instance-2', { cpu: 80, memory: 70, requestsPerSecond: 90 });
  }, 1000);

  // Simulate low load later
  setTimeout(() => {
    autoScaler.updateMetrics('instance-1', { cpu: 20, memory: 30, requestsPerSecond: 10 });
    autoScaler.updateMetrics('instance-2', { cpu: 25, memory: 35, requestsPerSecond: 15 });
  }, 15000);

  // Monitor scaling events
  autoScaler.on('scaled', (action) => {
    console.log('Scaling action completed:', action);
    console.log('Current status:', autoScaler.getStatus());
  });

  // Cleanup after demo
  setTimeout(() => {
    autoScaler.destroy();
  }, 25000);
}

module.exports = {
  ServiceRegistry,
  ConfigurationManager,
  EnvironmentVariableSource,
  FileSource,
  FeatureFlagManager,
  AutoScaler,
  CloudStorageAdapter,
  exampleServiceDiscovery,
  exampleConfigurationManagement,
  exampleFeatureFlags,
  exampleAutoScaling
};