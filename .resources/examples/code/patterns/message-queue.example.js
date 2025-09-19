/**
 * Message Queue Integration Patterns
 *
 * Comprehensive implementation of asynchronous messaging patterns:
 * - Producer/Consumer patterns
 * - Publish/Subscribe messaging
 * - Work queues and task distribution
 * - Dead letter queues and error handling
 * - Message serialization and routing
 * - Queue monitoring and management
 * - Multiple broker implementations (RabbitMQ, Redis, AWS SQS style)
 */

const EventEmitter = require('events');
const crypto = require('crypto');

/**
 * Abstract Message Broker Interface
 */
class MessageBroker extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = options;
    this.connected = false;
    this.queues = new Map();
    this.exchanges = new Map();
    this.consumers = new Map();
    this.deadLetterQueue = options.deadLetterQueue || 'dlq';
  }

  async connect() {
    throw new Error('connect() must be implemented by subclass');
  }

  async disconnect() {
    throw new Error('disconnect() must be implemented by subclass');
  }

  async publish(exchange, routingKey, message, options = {}) {
    throw new Error('publish() must be implemented by subclass');
  }

  async consume(queue, handler, options = {}) {
    throw new Error('consume() must be implemented by subclass');
  }

  async createQueue(name, options = {}) {
    throw new Error('createQueue() must be implemented by subclass');
  }

  async createExchange(name, type, options = {}) {
    throw new Error('createExchange() must be implemented by subclass');
  }

  async bindQueue(queue, exchange, routingKey) {
    throw new Error('bindQueue() must be implemented by subclass');
  }
}

/**
 * In-Memory Message Broker (for testing and development)
 */
class InMemoryBroker extends MessageBroker {
  constructor(options = {}) {
    super(options);
    this.messages = new Map(); // queue -> messages[]
    this.bindings = new Map(); // exchange -> { routingKey -> queues[] }
    this.statistics = {
      published: 0,
      consumed: 0,
      errors: 0
    };
  }

  async connect() {
    this.connected = true;
    this.emit('connected');
    return true;
  }

  async disconnect() {
    this.connected = false;
    this.consumers.clear();
    this.emit('disconnected');
    return true;
  }

  async createQueue(name, options = {}) {
    if (!this.messages.has(name)) {
      this.messages.set(name, []);
      this.queues.set(name, {
        name,
        durable: options.durable || false,
        exclusive: options.exclusive || false,
        autoDelete: options.autoDelete || false,
        arguments: options.arguments || {}
      });
    }
    return true;
  }

  async createExchange(name, type, options = {}) {
    this.exchanges.set(name, {
      name,
      type: type || 'direct',
      durable: options.durable || false,
      autoDelete: options.autoDelete || false,
      arguments: options.arguments || {}
    });

    if (!this.bindings.has(name)) {
      this.bindings.set(name, new Map());
    }
    return true;
  }

  async bindQueue(queue, exchange, routingKey) {
    await this.createQueue(queue);
    await this.createExchange(exchange);

    const exchangeBindings = this.bindings.get(exchange);
    if (!exchangeBindings.has(routingKey)) {
      exchangeBindings.set(routingKey, []);
    }
    exchangeBindings.get(routingKey).push(queue);
    return true;
  }

  async publish(exchange, routingKey, message, options = {}) {
    if (!this.connected) {
      throw new Error('Broker not connected');
    }

    const messageObj = {
      id: crypto.randomUUID(),
      exchange,
      routingKey,
      content: message,
      timestamp: new Date(),
      properties: options.properties || {},
      headers: options.headers || {},
      attempts: 0,
      maxRetries: options.maxRetries || 3
    };

    try {
      // Route message to appropriate queues
      const targetQueues = this.routeMessage(exchange, routingKey);

      for (const queueName of targetQueues) {
        await this.createQueue(queueName);
        const queue = this.messages.get(queueName);
        queue.push({ ...messageObj });

        // Trigger consumer if exists
        const consumer = this.consumers.get(queueName);
        if (consumer) {
          setImmediate(() => this.processMessage(queueName, consumer));
        }
      }

      this.statistics.published++;
      this.emit('published', messageObj);
      return true;
    } catch (error) {
      this.statistics.errors++;
      this.emit('error', error);
      throw error;
    }
  }

  async consume(queue, handler, options = {}) {
    await this.createQueue(queue);

    const consumer = {
      queue,
      handler,
      options: {
        autoAck: options.autoAck !== false,
        prefetch: options.prefetch || 1,
        ...options
      }
    };

    this.consumers.set(queue, consumer);

    // Process existing messages
    setImmediate(() => this.processMessage(queue, consumer));

    return { consumerTag: `consumer-${queue}-${Date.now()}` };
  }

  routeMessage(exchange, routingKey) {
    const exchangeBindings = this.bindings.get(exchange);
    if (!exchangeBindings) {
      return []; // No bindings, message is dropped
    }

    const exchangeConfig = this.exchanges.get(exchange);
    const exchangeType = exchangeConfig?.type || 'direct';

    switch (exchangeType) {
      case 'direct':
        return exchangeBindings.get(routingKey) || [];

      case 'fanout':
        // Fanout to all bound queues regardless of routing key
        const allQueues = [];
        for (const queues of exchangeBindings.values()) {
          allQueues.push(...queues);
        }
        return [...new Set(allQueues)];

      case 'topic':
        return this.routeTopicMessage(exchangeBindings, routingKey);

      default:
        return [];
    }
  }

  routeTopicMessage(bindings, routingKey) {
    const matchedQueues = [];

    for (const [pattern, queues] of bindings.entries()) {
      if (this.matchTopicPattern(pattern, routingKey)) {
        matchedQueues.push(...queues);
      }
    }

    return [...new Set(matchedQueues)];
  }

  matchTopicPattern(pattern, routingKey) {
    // Convert topic pattern to regex
    const regexPattern = pattern
      .replace(/\*/g, '[^.]+')  // * matches exactly one word
      .replace(/#/g, '.*');     // # matches zero or more words

    return new RegExp(`^${regexPattern}$`).test(routingKey);
  }

  async processMessage(queueName, consumer) {
    const queue = this.messages.get(queueName);
    if (!queue || queue.length === 0) return;

    const message = queue.shift();

    try {
      await consumer.handler(message, {
        ack: () => this.ackMessage(message),
        nack: (requeue = true) => this.nackMessage(message, requeue),
        reject: (requeue = false) => this.nackMessage(message, requeue)
      });

      if (consumer.options.autoAck) {
        this.ackMessage(message);
      }
    } catch (error) {
      this.statistics.errors++;
      await this.handleMessageError(message, error);
    }
  }

  ackMessage(message) {
    this.statistics.consumed++;
    this.emit('consumed', message);
  }

  async nackMessage(message, requeue = true) {
    if (requeue && message.attempts < message.maxRetries) {
      message.attempts++;

      // Exponential backoff
      const delay = Math.pow(2, message.attempts) * 1000;
      setTimeout(() => {
        const queue = this.messages.get(message.routingKey);
        if (queue) {
          queue.push(message);
        }
      }, delay);
    } else {
      // Send to dead letter queue
      await this.sendToDeadLetterQueue(message);
    }
  }

  async handleMessageError(message, error) {
    this.emit('messageError', { message, error });
    await this.nackMessage(message, true);
  }

  async sendToDeadLetterQueue(message) {
    await this.createQueue(this.deadLetterQueue);
    const dlq = this.messages.get(this.deadLetterQueue);
    dlq.push({
      ...message,
      deadLetterReason: 'max_retries_exceeded',
      deadLetterTimestamp: new Date()
    });
    this.emit('deadLetter', message);
  }

  getStatistics() {
    return {
      ...this.statistics,
      queues: this.messages.size,
      exchanges: this.exchanges.size,
      consumers: this.consumers.size,
      queueSizes: Object.fromEntries(
        Array.from(this.messages.entries()).map(([name, messages]) => [name, messages.length])
      )
    };
  }
}

/**
 * Redis-based Message Broker
 */
class RedisBroker extends MessageBroker {
  constructor(redisClient, options = {}) {
    super(options);
    this.redis = redisClient;
    this.subscriberClient = null; // Separate client for subscriptions
    this.keyPrefix = options.keyPrefix || 'mq:';
    this.processingInterval = options.processingInterval || 1000;
    this.processors = new Map();
  }

  async connect() {
    // In real implementation, create subscriber client
    this.connected = true;
    this.emit('connected');
    return true;
  }

  async disconnect() {
    this.connected = false;
    this.processors.clear();
    this.emit('disconnected');
    return true;
  }

  async createQueue(name, options = {}) {
    const queueKey = `${this.keyPrefix}queue:${name}`;
    const metaKey = `${this.keyPrefix}meta:${name}`;

    await this.redis.hset(metaKey, {
      name,
      created: new Date().toISOString(),
      durable: options.durable || false,
      arguments: JSON.stringify(options.arguments || {})
    });

    this.queues.set(name, { name, ...options });
    return true;
  }

  async publish(exchange, routingKey, message, options = {}) {
    if (!this.connected) {
      throw new Error('Broker not connected');
    }

    const messageObj = {
      id: crypto.randomUUID(),
      exchange,
      routingKey,
      content: typeof message === 'string' ? message : JSON.stringify(message),
      timestamp: new Date().toISOString(),
      properties: options.properties || {},
      headers: options.headers || {},
      attempts: 0,
      maxRetries: options.maxRetries || 3
    };

    try {
      // For simplicity, using direct queue mapping
      const queueKey = `${this.keyPrefix}queue:${routingKey}`;
      await this.redis.lpush(queueKey, JSON.stringify(messageObj));

      this.emit('published', messageObj);
      return true;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async consume(queue, handler, options = {}) {
    await this.createQueue(queue);

    const consumer = {
      queue,
      handler,
      options: {
        autoAck: options.autoAck !== false,
        prefetch: options.prefetch || 1,
        ...options
      },
      active: true
    };

    this.consumers.set(queue, consumer);

    // Start processing loop
    this.startQueueProcessor(queue, consumer);

    return { consumerTag: `redis-consumer-${queue}-${Date.now()}` };
  }

  startQueueProcessor(queue, consumer) {
    if (this.processors.has(queue)) return;

    const processor = setInterval(async () => {
      if (!consumer.active || !this.connected) return;

      try {
        const queueKey = `${this.keyPrefix}queue:${queue}`;
        const messageStr = await this.redis.brpop(queueKey, 1);

        if (messageStr && messageStr[1]) {
          const message = JSON.parse(messageStr[1]);
          await this.processRedisMessage(message, consumer);
        }
      } catch (error) {
        this.emit('error', error);
      }
    }, this.processingInterval);

    this.processors.set(queue, processor);
  }

  async processRedisMessage(message, consumer) {
    try {
      await consumer.handler(message, {
        ack: () => this.ackMessage(message),
        nack: (requeue = true) => this.nackRedisMessage(message, requeue),
        reject: (requeue = false) => this.nackRedisMessage(message, requeue)
      });

      if (consumer.options.autoAck) {
        this.ackMessage(message);
      }
    } catch (error) {
      await this.handleRedisMessageError(message, error);
    }
  }

  async nackRedisMessage(message, requeue = true) {
    if (requeue && message.attempts < message.maxRetries) {
      message.attempts++;

      // Re-queue with delay
      const delayKey = `${this.keyPrefix}delay:${message.id}`;
      const delay = Math.pow(2, message.attempts) * 1000;

      await this.redis.setex(delayKey, Math.ceil(delay / 1000), JSON.stringify(message));

      // Schedule re-queue (in real implementation, use Redis delayed jobs)
      setTimeout(async () => {
        const queueKey = `${this.keyPrefix}queue:${message.routingKey}`;
        await this.redis.lpush(queueKey, JSON.stringify(message));
        await this.redis.del(delayKey);
      }, delay);
    } else {
      await this.sendToRedisDeadLetterQueue(message);
    }
  }

  async handleRedisMessageError(message, error) {
    this.emit('messageError', { message, error });
    await this.nackRedisMessage(message, true);
  }

  async sendToRedisDeadLetterQueue(message) {
    const dlqKey = `${this.keyPrefix}queue:${this.deadLetterQueue}`;
    const dlqMessage = {
      ...message,
      deadLetterReason: 'max_retries_exceeded',
      deadLetterTimestamp: new Date().toISOString()
    };

    await this.redis.lpush(dlqKey, JSON.stringify(dlqMessage));
    this.emit('deadLetter', message);
  }
}

/**
 * Message Queue Manager - High-level interface
 */
class MessageQueueManager {
  constructor(broker, options = {}) {
    this.broker = broker;
    this.options = options;
    this.producers = new Map();
    this.consumers = new Map();
    this.middlewares = [];
    this.serializers = new Map();

    // Register default serializers
    this.registerSerializer('json', {
      serialize: JSON.stringify,
      deserialize: JSON.parse
    });
  }

  /**
   * Add middleware for message processing
   */
  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  /**
   * Register message serializer
   */
  registerSerializer(name, serializer) {
    this.serializers.set(name, serializer);
    return this;
  }

  /**
   * Create a producer for specific exchange/queue
   */
  createProducer(name, config = {}) {
    const producer = new MessageProducer(this.broker, {
      name,
      exchange: config.exchange || 'default',
      routingKey: config.routingKey || name,
      serializer: this.serializers.get(config.serializer || 'json'),
      ...config
    });

    this.producers.set(name, producer);
    return producer;
  }

  /**
   * Create a consumer for specific queue
   */
  createConsumer(name, handler, config = {}) {
    const consumer = new MessageConsumer(this.broker, {
      name,
      queue: config.queue || name,
      handler: this.wrapHandler(handler),
      serializer: this.serializers.get(config.serializer || 'json'),
      ...config
    });

    this.consumers.set(name, consumer);
    return consumer;
  }

  /**
   * Wrap handler with middleware chain
   */
  wrapHandler(handler) {
    return async (message, context) => {
      let index = 0;

      const next = async () => {
        if (index < this.middlewares.length) {
          const middleware = this.middlewares[index++];
          return await middleware(message, context, next);
        } else {
          return await handler(message, context);
        }
      };

      return await next();
    };
  }

  async connect() {
    return await this.broker.connect();
  }

  async disconnect() {
    return await this.broker.disconnect();
  }

  getStatistics() {
    return {
      broker: this.broker.getStatistics?.() || {},
      producers: this.producers.size,
      consumers: this.consumers.size,
      middlewares: this.middlewares.length
    };
  }
}

/**
 * Message Producer
 */
class MessageProducer {
  constructor(broker, config) {
    this.broker = broker;
    this.config = config;
    this.statistics = {
      sent: 0,
      errors: 0
    };
  }

  async send(message, options = {}) {
    try {
      let serializedMessage = message;

      if (this.config.serializer && typeof message !== 'string') {
        serializedMessage = this.config.serializer.serialize(message);
      }

      await this.broker.publish(
        this.config.exchange,
        this.config.routingKey,
        serializedMessage,
        {
          ...this.config.publishOptions,
          ...options
        }
      );

      this.statistics.sent++;
      return true;
    } catch (error) {
      this.statistics.errors++;
      throw error;
    }
  }

  getStatistics() {
    return { ...this.statistics };
  }
}

/**
 * Message Consumer
 */
class MessageConsumer {
  constructor(broker, config) {
    this.broker = broker;
    this.config = config;
    this.active = false;
    this.statistics = {
      consumed: 0,
      errors: 0,
      processed: 0
    };
  }

  async start() {
    if (this.active) return;

    await this.broker.createQueue(this.config.queue, this.config.queueOptions);

    const wrappedHandler = async (message, context) => {
      try {
        let deserializedMessage = message;

        if (this.config.serializer && typeof message.content === 'string') {
          try {
            deserializedMessage = {
              ...message,
              content: this.config.serializer.deserialize(message.content)
            };
          } catch (error) {
            // If deserialization fails, keep original
          }
        }

        await this.config.handler(deserializedMessage, context);
        this.statistics.processed++;
      } catch (error) {
        this.statistics.errors++;
        throw error;
      }
    };

    await this.broker.consume(this.config.queue, wrappedHandler, this.config.consumeOptions);
    this.active = true;
  }

  async stop() {
    this.active = false;
    // In real implementation, cancel consumer
  }

  getStatistics() {
    return { ...this.statistics };
  }
}

/**
 * Work Queue Pattern
 */
class WorkQueue {
  constructor(queueManager, queueName) {
    this.queueManager = queueManager;
    this.queueName = queueName;
    this.workers = [];
    this.producer = queueManager.createProducer(queueName);
  }

  /**
   * Add work to queue
   */
  async addJob(jobData, options = {}) {
    const job = {
      id: crypto.randomUUID(),
      data: jobData,
      priority: options.priority || 0,
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      createdAt: new Date(),
      delay: options.delay || 0
    };

    if (job.delay > 0) {
      // Schedule job for later
      setTimeout(() => this.producer.send(job), job.delay);
    } else {
      await this.producer.send(job);
    }

    return job.id;
  }

  /**
   * Add worker to process jobs
   */
  addWorker(name, processor, options = {}) {
    const worker = this.queueManager.createConsumer(
      `${this.queueName}-worker-${name}`,
      async (message, context) => {
        const job = message.content;

        try {
          const result = await processor(job.data, job);

          // Job completed successfully
          context.ack();
          return result;
        } catch (error) {
          job.attempts++;

          if (job.attempts >= job.maxAttempts) {
            // Job failed permanently
            await this.handleFailedJob(job, error);
            context.ack(); // Remove from queue
          } else {
            // Retry job
            context.nack(true);
          }

          throw error;
        }
      },
      {
        queue: this.queueName,
        ...options
      }
    );

    this.workers.push(worker);
    return worker;
  }

  async handleFailedJob(job, error) {
    // Send to failed jobs queue or log
    console.error(`Job ${job.id} failed permanently:`, error);
  }

  async start() {
    for (const worker of this.workers) {
      await worker.start();
    }
  }

  async stop() {
    for (const worker of this.workers) {
      await worker.stop();
    }
  }
}

/**
 * Publish/Subscribe Pattern
 */
class PubSubManager {
  constructor(queueManager) {
    this.queueManager = queueManager;
    this.topics = new Map();
    this.subscribers = new Map();
  }

  /**
   * Create topic
   */
  async createTopic(topicName, options = {}) {
    await this.queueManager.broker.createExchange(topicName, 'fanout', options);
    this.topics.set(topicName, { name: topicName, ...options });
    return true;
  }

  /**
   * Publish message to topic
   */
  async publish(topicName, message, options = {}) {
    if (!this.topics.has(topicName)) {
      await this.createTopic(topicName);
    }

    const producer = this.queueManager.createProducer(`pub-${topicName}`, {
      exchange: topicName,
      routingKey: '' // Fanout doesn't use routing key
    });

    return await producer.send(message, options);
  }

  /**
   * Subscribe to topic
   */
  async subscribe(topicName, subscriberName, handler, options = {}) {
    if (!this.topics.has(topicName)) {
      await this.createTopic(topicName);
    }

    const queueName = `${topicName}-${subscriberName}`;

    // Create exclusive queue for subscriber
    await this.queueManager.broker.createQueue(queueName, {
      exclusive: true,
      autoDelete: true,
      ...options.queueOptions
    });

    // Bind queue to topic exchange
    await this.queueManager.broker.bindQueue(queueName, topicName, '');

    const consumer = this.queueManager.createConsumer(
      `sub-${topicName}-${subscriberName}`,
      handler,
      {
        queue: queueName,
        ...options
      }
    );

    this.subscribers.set(`${topicName}:${subscriberName}`, consumer);
    await consumer.start();

    return consumer;
  }

  /**
   * Unsubscribe from topic
   */
  async unsubscribe(topicName, subscriberName) {
    const key = `${topicName}:${subscriberName}`;
    const consumer = this.subscribers.get(key);

    if (consumer) {
      await consumer.stop();
      this.subscribers.delete(key);
    }

    return true;
  }
}

/**
 * Example Usage Demonstrations
 */

// Example 1: Basic Producer/Consumer
async function exampleBasicProducerConsumer() {
  console.log('=== Basic Producer/Consumer Example ===');

  const broker = new InMemoryBroker();
  const queueManager = new MessageQueueManager(broker);

  await queueManager.connect();

  // Create producer
  const orderProducer = queueManager.createProducer('orders', {
    exchange: 'orders',
    routingKey: 'order.created'
  });

  // Create consumer
  const orderConsumer = queueManager.createConsumer('orders', async (message, context) => {
    console.log('Processing order:', message.content);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 100));

    context.ack();
  });

  await orderConsumer.start();

  // Send messages
  await orderProducer.send({ orderId: 1, amount: 100.00 });
  await orderProducer.send({ orderId: 2, amount: 250.50 });

  // Wait for processing
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log('Statistics:', queueManager.getStatistics());
}

// Example 2: Work Queue Pattern
async function exampleWorkQueue() {
  console.log('=== Work Queue Example ===');

  const broker = new InMemoryBroker();
  const queueManager = new MessageQueueManager(broker);

  await queueManager.connect();

  const workQueue = new WorkQueue(queueManager, 'image-processing');

  // Add workers
  workQueue.addWorker('worker-1', async (jobData, job) => {
    console.log(`Worker 1 processing: ${jobData.imageUrl}`);
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    return { processed: true, worker: 'worker-1' };
  });

  workQueue.addWorker('worker-2', async (jobData, job) => {
    console.log(`Worker 2 processing: ${jobData.imageUrl}`);
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    return { processed: true, worker: 'worker-2' };
  });

  await workQueue.start();

  // Add jobs
  await workQueue.addJob({ imageUrl: 'image1.jpg', operation: 'resize' });
  await workQueue.addJob({ imageUrl: 'image2.jpg', operation: 'crop' });
  await workQueue.addJob({ imageUrl: 'image3.jpg', operation: 'filter' });

  // Wait for processing
  await new Promise(resolve => setTimeout(resolve, 2000));
}

// Example 3: Publish/Subscribe Pattern
async function examplePubSub() {
  console.log('=== Publish/Subscribe Example ===');

  const broker = new InMemoryBroker();
  const queueManager = new MessageQueueManager(broker);

  await queueManager.connect();

  const pubsub = new PubSubManager(queueManager);

  // Create subscribers
  await pubsub.subscribe('user-events', 'email-service', async (message, context) => {
    console.log('Email service received:', message.content);
    // Send email
    context.ack();
  });

  await pubsub.subscribe('user-events', 'analytics-service', async (message, context) => {
    console.log('Analytics service received:', message.content);
    // Track event
    context.ack();
  });

  await pubsub.subscribe('user-events', 'notification-service', async (message, context) => {
    console.log('Notification service received:', message.content);
    // Send notification
    context.ack();
  });

  // Publish events
  await pubsub.publish('user-events', {
    type: 'user.registered',
    userId: 123,
    email: 'user@example.com'
  });

  await pubsub.publish('user-events', {
    type: 'user.login',
    userId: 123,
    timestamp: new Date()
  });

  // Wait for processing
  await new Promise(resolve => setTimeout(resolve, 500));
}

// Example 4: Error Handling and Dead Letter Queue
async function exampleErrorHandling() {
  console.log('=== Error Handling Example ===');

  const broker = new InMemoryBroker();
  const queueManager = new MessageQueueManager(broker);

  await queueManager.connect();

  // Consumer that occasionally fails
  const flakyConsumer = queueManager.createConsumer('flaky-queue', async (message, context) => {
    const shouldFail = Math.random() < 0.5;

    if (shouldFail) {
      throw new Error('Random processing error');
    }

    console.log('Successfully processed:', message.content);
    context.ack();
  });

  await flakyConsumer.start();

  // Producer
  const producer = queueManager.createProducer('flaky-queue');

  // Send messages
  for (let i = 1; i <= 5; i++) {
    await producer.send({ messageId: i, data: `Message ${i}` });
  }

  // Monitor dead letter queue
  const dlqConsumer = queueManager.createConsumer('dlq', async (message, context) => {
    console.log('Dead letter message:', message.content);
    context.ack();
  });

  await dlqConsumer.start();

  // Wait for processing
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('Final statistics:', queueManager.getStatistics());
}

module.exports = {
  MessageBroker,
  InMemoryBroker,
  RedisBroker,
  MessageQueueManager,
  MessageProducer,
  MessageConsumer,
  WorkQueue,
  PubSubManager,
  exampleBasicProducerConsumer,
  exampleWorkQueue,
  examplePubSub,
  exampleErrorHandling
};