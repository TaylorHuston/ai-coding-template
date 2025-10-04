/**
 * Comprehensive Caching Strategies Implementation
 *
 * Demonstrates various caching patterns and strategies for improving application performance:
 * - In-Memory Caching (LRU, TTL)
 * - Redis Distributed Caching
 * - Multi-Level Caching
 * - Cache-Aside Pattern
 * - Write-Through/Write-Behind
 * - Cache Warming and Invalidation
 */

const crypto = require('crypto');
const EventEmitter = require('events');

/**
 * Base Cache Interface
 */
class CacheInterface {
  async get(key) {
    throw new Error('get() method must be implemented');
  }

  async set(key, value, ttl) {
    throw new Error('set() method must be implemented');
  }

  async delete(key) {
    throw new Error('delete() method must be implemented');
  }

  async clear() {
    throw new Error('clear() method must be implemented');
  }

  async exists(key) {
    throw new Error('exists() method must be implemented');
  }
}

/**
 * In-Memory LRU Cache with TTL support
 */
class MemoryCache extends CacheInterface {
  constructor(options = {}) {
    super();
    this.maxSize = options.maxSize || 1000;
    this.defaultTTL = options.defaultTTL || 300000; // 5 minutes
    this.cleanupInterval = options.cleanupInterval || 60000; // 1 minute

    this.cache = new Map();
    this.accessOrder = [];

    // Start cleanup interval
    this.cleanupTimer = setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  async get(key) {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check TTL
    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      return null;
    }

    // Update access order for LRU
    this.updateAccessOrder(key);
    return item.value;
  }

  async set(key, value, ttl) {
    const expires = ttl ? Date.now() + ttl : (this.defaultTTL ? Date.now() + this.defaultTTL : null);

    // Remove existing item if present
    if (this.cache.has(key)) {
      this.removeFromAccessOrder(key);
    }

    // Check size limit and evict LRU items
    while (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, { value, expires, createdAt: Date.now() });
    this.accessOrder.push(key);

    return true;
  }

  async delete(key) {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.removeFromAccessOrder(key);
    }
    return deleted;
  }

  async clear() {
    this.cache.clear();
    this.accessOrder = [];
    return true;
  }

  async exists(key) {
    const item = this.cache.get(key);
    if (!item) return false;

    // Check TTL
    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      return false;
    }

    return true;
  }

  // LRU management
  updateAccessOrder(key) {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  removeFromAccessOrder(key) {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  evictLRU() {
    if (this.accessOrder.length > 0) {
      const lruKey = this.accessOrder.shift();
      this.cache.delete(lruKey);
    }
  }

  // Cleanup expired items
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expires && now > item.expires) {
        this.cache.delete(key);
        this.removeFromAccessOrder(key);
      }
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      accessOrder: this.accessOrder.length,
      items: Array.from(this.cache.entries()).map(([key, item]) => ({
        key,
        createdAt: new Date(item.createdAt),
        expires: item.expires ? new Date(item.expires) : null,
        expired: item.expires ? Date.now() > item.expires : false
      }))
    };
  }

  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

/**
 * Redis Cache Implementation (Mock for demonstration)
 */
class RedisCache extends CacheInterface {
  constructor(redisClient, options = {}) {
    super();
    this.redis = redisClient;
    this.keyPrefix = options.keyPrefix || 'cache:';
    this.defaultTTL = options.defaultTTL || 300; // 5 minutes in seconds
    this.serializer = options.serializer || JSON;
  }

  buildKey(key) {
    return `${this.keyPrefix}${key}`;
  }

  async get(key) {
    try {
      const value = await this.redis.get(this.buildKey(key));
      if (value === null) return null;
      return this.serializer.parse(value);
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key, value, ttl) {
    try {
      const serializedValue = this.serializer.stringify(value);
      const cacheKey = this.buildKey(key);

      if (ttl) {
        await this.redis.setex(cacheKey, ttl, serializedValue);
      } else if (this.defaultTTL) {
        await this.redis.setex(cacheKey, this.defaultTTL, serializedValue);
      } else {
        await this.redis.set(cacheKey, serializedValue);
      }

      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }

  async delete(key) {
    try {
      const result = await this.redis.del(this.buildKey(key));
      return result > 0;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  }

  async clear() {
    try {
      const keys = await this.redis.keys(`${this.keyPrefix}*`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Redis clear error:', error);
      return false;
    }
  }

  async exists(key) {
    try {
      const result = await this.redis.exists(this.buildKey(key));
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  // Redis-specific methods
  async increment(key, amount = 1) {
    try {
      return await this.redis.incrby(this.buildKey(key), amount);
    } catch (error) {
      console.error('Redis increment error:', error);
      return null;
    }
  }

  async setHash(key, field, value, ttl) {
    try {
      const cacheKey = this.buildKey(key);
      await this.redis.hset(cacheKey, field, this.serializer.stringify(value));

      if (ttl) {
        await this.redis.expire(cacheKey, ttl);
      }

      return true;
    } catch (error) {
      console.error('Redis setHash error:', error);
      return false;
    }
  }

  async getHash(key, field) {
    try {
      const value = await this.redis.hget(this.buildKey(key), field);
      if (value === null) return null;
      return this.serializer.parse(value);
    } catch (error) {
      console.error('Redis getHash error:', error);
      return null;
    }
  }
}

/**
 * Multi-Level Cache Implementation
 */
class MultiLevelCache extends EventEmitter {
  constructor(levels = []) {
    super();
    this.levels = levels; // Array of cache instances ordered by speed (fastest first)
    this.stats = {
      hits: Array(levels.length).fill(0),
      misses: 0,
      promotions: 0
    };
  }

  async get(key) {
    for (let i = 0; i < this.levels.length; i++) {
      const value = await this.levels[i].get(key);

      if (value !== null) {
        this.stats.hits[i]++;

        // Promote to higher levels (cache warming)
        if (i > 0) {
          this.promoteToHigherLevels(key, value, i);
          this.stats.promotions++;
        }

        this.emit('hit', { key, level: i, value });
        return value;
      }
    }

    this.stats.misses++;
    this.emit('miss', { key });
    return null;
  }

  async set(key, value, ttl) {
    // Set to all levels
    const promises = this.levels.map(cache => cache.set(key, value, ttl));
    const results = await Promise.allSettled(promises);

    this.emit('set', { key, value, results });
    return results.every(result => result.status === 'fulfilled' && result.value);
  }

  async delete(key) {
    // Delete from all levels
    const promises = this.levels.map(cache => cache.delete(key));
    const results = await Promise.allSettled(promises);

    this.emit('delete', { key, results });
    return results.some(result => result.status === 'fulfilled' && result.value);
  }

  async clear() {
    const promises = this.levels.map(cache => cache.clear());
    await Promise.allSettled(promises);
    this.emit('clear');
    return true;
  }

  async exists(key) {
    for (const cache of this.levels) {
      if (await cache.exists(key)) {
        return true;
      }
    }
    return false;
  }

  // Promote value to higher cache levels
  async promoteToHigherLevels(key, value, fromLevel) {
    for (let i = 0; i < fromLevel; i++) {
      try {
        await this.levels[i].set(key, value);
      } catch (error) {
        console.error(`Failed to promote to level ${i}:`, error);
      }
    }
  }

  getStats() {
    const totalHits = this.stats.hits.reduce((sum, hits) => sum + hits, 0);
    const totalRequests = totalHits + this.stats.misses;

    return {
      ...this.stats,
      totalHits,
      totalRequests,
      hitRate: totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0,
      levelHitRates: this.stats.hits.map(hits =>
        totalRequests > 0 ? (hits / totalRequests) * 100 : 0
      )
    };
  }
}

/**
 * Cache-Aside Pattern Implementation
 */
class CacheAsideService {
  constructor(cache, dataSource, options = {}) {
    this.cache = cache;
    this.dataSource = dataSource;
    this.keyGenerator = options.keyGenerator || ((id) => `entity:${id}`);
    this.ttl = options.ttl || 300000; // 5 minutes
    this.stats = {
      cacheHits: 0,
      cacheMisses: 0,
      dataSourceCalls: 0
    };
  }

  async get(id) {
    const key = this.keyGenerator(id);

    // Try cache first
    let data = await this.cache.get(key);

    if (data !== null) {
      this.stats.cacheHits++;
      return data;
    }

    // Cache miss - fetch from data source
    this.stats.cacheMisses++;
    this.stats.dataSourceCalls++;

    data = await this.dataSource.findById(id);

    if (data) {
      // Store in cache for next time
      await this.cache.set(key, data, this.ttl);
    }

    return data;
  }

  async update(id, data) {
    // Update data source
    const updated = await this.dataSource.update(id, data);

    // Invalidate cache
    const key = this.keyGenerator(id);
    await this.cache.delete(key);

    return updated;
  }

  async delete(id) {
    // Delete from data source
    const deleted = await this.dataSource.delete(id);

    // Remove from cache
    const key = this.keyGenerator(id);
    await this.cache.delete(key);

    return deleted;
  }

  async invalidate(id) {
    const key = this.keyGenerator(id);
    return await this.cache.delete(key);
  }

  getStats() {
    const total = this.stats.cacheHits + this.stats.cacheMisses;
    return {
      ...this.stats,
      hitRate: total > 0 ? (this.stats.cacheHits / total) * 100 : 0
    };
  }
}

/**
 * Write-Through Cache Implementation
 */
class WriteThroughCache {
  constructor(cache, dataSource, options = {}) {
    this.cache = cache;
    this.dataSource = dataSource;
    this.keyGenerator = options.keyGenerator || ((id) => `entity:${id}`);
    this.ttl = options.ttl || 300000;
  }

  async get(id) {
    const key = this.keyGenerator(id);

    // Try cache first
    let data = await this.cache.get(key);

    if (data === null) {
      // Cache miss - fetch from data source
      data = await this.dataSource.findById(id);

      if (data) {
        await this.cache.set(key, data, this.ttl);
      }
    }

    return data;
  }

  async set(id, data) {
    // Write to both cache and data source simultaneously
    const key = this.keyGenerator(id);

    const [cacheResult, dataSourceResult] = await Promise.all([
      this.cache.set(key, data, this.ttl),
      this.dataSource.save(id, data)
    ]);

    return dataSourceResult;
  }

  async delete(id) {
    const key = this.keyGenerator(id);

    const [cacheResult, dataSourceResult] = await Promise.all([
      this.cache.delete(key),
      this.dataSource.delete(id)
    ]);

    return dataSourceResult;
  }
}

/**
 * Write-Behind (Write-Back) Cache Implementation
 */
class WriteBehindCache extends EventEmitter {
  constructor(cache, dataSource, options = {}) {
    super();
    this.cache = cache;
    this.dataSource = dataSource;
    this.keyGenerator = options.keyGenerator || ((id) => `entity:${id}`);
    this.ttl = options.ttl || 300000;

    // Write-behind configuration
    this.flushInterval = options.flushInterval || 5000; // 5 seconds
    this.batchSize = options.batchSize || 100;

    this.writeQueue = new Map();
    this.flushTimer = setInterval(() => this.flush(), this.flushInterval);
  }

  async get(id) {
    const key = this.keyGenerator(id);

    // Check write queue first (most recent data)
    if (this.writeQueue.has(key)) {
      return this.writeQueue.get(key).data;
    }

    // Try cache
    let data = await this.cache.get(key);

    if (data === null) {
      // Cache miss - fetch from data source
      data = await this.dataSource.findById(id);

      if (data) {
        await this.cache.set(key, data, this.ttl);
      }
    }

    return data;
  }

  async set(id, data) {
    const key = this.keyGenerator(id);

    // Write to cache immediately
    await this.cache.set(key, data, this.ttl);

    // Queue for write-behind to data source
    this.writeQueue.set(key, {
      id,
      data,
      timestamp: Date.now(),
      operation: 'set'
    });

    this.emit('queued', { key, operation: 'set' });

    // Flush if queue is getting large
    if (this.writeQueue.size >= this.batchSize) {
      await this.flush();
    }

    return true;
  }

  async delete(id) {
    const key = this.keyGenerator(id);

    // Remove from cache immediately
    await this.cache.delete(key);

    // Queue for deletion from data source
    this.writeQueue.set(key, {
      id,
      timestamp: Date.now(),
      operation: 'delete'
    });

    this.emit('queued', { key, operation: 'delete' });

    return true;
  }

  async flush() {
    if (this.writeQueue.size === 0) return;

    const batch = Array.from(this.writeQueue.entries()).slice(0, this.batchSize);

    for (const [key, operation] of batch) {
      try {
        if (operation.operation === 'set') {
          await this.dataSource.save(operation.id, operation.data);
        } else if (operation.operation === 'delete') {
          await this.dataSource.delete(operation.id);
        }

        this.writeQueue.delete(key);
        this.emit('flushed', { key, operation: operation.operation });
      } catch (error) {
        this.emit('flushError', { key, operation: operation.operation, error });
      }
    }
  }

  async forceFlush() {
    await this.flush();
  }

  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    // Flush remaining items
    return this.flush();
  }
}

/**
 * Cache Warming Service
 */
class CacheWarmingService {
  constructor(cache, dataSource, options = {}) {
    this.cache = cache;
    this.dataSource = dataSource;
    this.keyGenerator = options.keyGenerator || ((id) => `entity:${id}`);
    this.ttl = options.ttl || 300000;
    this.batchSize = options.batchSize || 50;
    this.concurrency = options.concurrency || 5;
  }

  async warmCache(ids) {
    const batches = this.createBatches(ids, this.batchSize);

    for (const batch of batches) {
      await this.processBatch(batch);
    }
  }

  async processBatch(ids) {
    const semaphore = new Array(this.concurrency).fill(null);
    const promises = [];

    for (const id of ids) {
      const promise = this.limitConcurrency(semaphore, () => this.warmSingleItem(id));
      promises.push(promise);
    }

    await Promise.allSettled(promises);
  }

  async warmSingleItem(id) {
    const key = this.keyGenerator(id);

    // Check if already cached
    if (await this.cache.exists(key)) {
      return;
    }

    // Fetch from data source
    const data = await this.dataSource.findById(id);

    if (data) {
      await this.cache.set(key, data, this.ttl);
    }
  }

  async limitConcurrency(semaphore, task) {
    // Wait for available slot
    while (!semaphore.includes(null)) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const index = semaphore.indexOf(null);
    semaphore[index] = true;

    try {
      return await task();
    } finally {
      semaphore[index] = null;
    }
  }

  createBatches(items, batchSize) {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }
}

/**
 * Example Usage and Demonstrations
 */

// Example 1: Basic Memory Cache Usage
async function exampleMemoryCache() {
  const cache = new MemoryCache({
    maxSize: 100,
    defaultTTL: 5000 // 5 seconds
  });

  // Basic operations
  await cache.set('user:1', { id: 1, name: 'John Doe' });
  await cache.set('user:2', { id: 2, name: 'Jane Smith' }, 10000); // Custom TTL

  const user1 = await cache.get('user:1');
  console.log('Retrieved user:', user1);

  // Check cache stats
  console.log('Cache stats:', cache.getStats());

  cache.destroy();
}

// Example 2: Multi-Level Cache
async function exampleMultiLevelCache() {
  const l1Cache = new MemoryCache({ maxSize: 100, defaultTTL: 30000 });
  const l2Cache = new MemoryCache({ maxSize: 1000, defaultTTL: 300000 });

  const multiCache = new MultiLevelCache([l1Cache, l2Cache]);

  // Set up event listeners
  multiCache.on('hit', ({ key, level }) => {
    console.log(`Cache hit: ${key} at level ${level}`);
  });

  multiCache.on('miss', ({ key }) => {
    console.log(`Cache miss: ${key}`);
  });

  // Usage
  await multiCache.set('data:1', { value: 'test data' });

  // This will hit L1 cache
  await multiCache.get('data:1');

  // Remove from L1, next get will hit L2 and promote to L1
  await l1Cache.delete('data:1');
  await multiCache.get('data:1');

  console.log('Multi-level cache stats:', multiCache.getStats());
}

// Example 3: Cache-Aside Pattern
async function exampleCacheAside() {
  const cache = new MemoryCache();

  // Mock data source
  const dataSource = {
    async findById(id) {
      console.log(`Fetching user ${id} from database`);
      // Simulate database call
      await new Promise(resolve => setTimeout(resolve, 100));
      return { id, name: `User ${id}`, email: `user${id}@example.com` };
    },

    async update(id, data) {
      console.log(`Updating user ${id} in database`);
      return { ...data, id, updatedAt: new Date() };
    },

    async delete(id) {
      console.log(`Deleting user ${id} from database`);
      return true;
    }
  };

  const userService = new CacheAsideService(cache, dataSource, {
    keyGenerator: (id) => `user:${id}`,
    ttl: 60000
  });

  // First call - cache miss, fetches from database
  const user1 = await userService.get(1);
  console.log('First call:', user1);

  // Second call - cache hit
  const user1Again = await userService.get(1);
  console.log('Second call (cached):', user1Again);

  // Update invalidates cache
  await userService.update(1, { name: 'Updated User 1' });

  // Next call will fetch from database again
  const updatedUser = await userService.get(1);
  console.log('After update:', updatedUser);

  console.log('Service stats:', userService.getStats());
}

module.exports = {
  CacheInterface,
  MemoryCache,
  RedisCache,
  MultiLevelCache,
  CacheAsideService,
  WriteThroughCache,
  WriteBehindCache,
  CacheWarmingService,
  exampleMemoryCache,
  exampleMultiLevelCache,
  exampleCacheAside
};