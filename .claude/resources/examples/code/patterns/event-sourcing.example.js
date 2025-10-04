/**
 * Event Sourcing Pattern Implementation
 *
 * Comprehensive implementation of event sourcing architecture:
 * - Event Store with persistence and querying
 * - Aggregate roots and domain events
 * - Event streaming and projections
 * - Snapshots for performance optimization
 * - CQRS (Command Query Responsibility Segregation)
 * - Event replay and temporal queries
 * - Saga pattern for complex workflows
 */

const crypto = require('crypto');
const EventEmitter = require('events');

/**
 * Base Domain Event
 */
class DomainEvent {
  constructor(aggregateId, eventType, data, metadata = {}) {
    this.eventId = crypto.randomUUID();
    this.aggregateId = aggregateId;
    this.eventType = eventType;
    this.data = data;
    this.metadata = {
      timestamp: new Date(),
      version: 1,
      correlationId: metadata.correlationId || crypto.randomUUID(),
      causationId: metadata.causationId,
      userId: metadata.userId,
      ...metadata
    };
    this.streamPosition = null; // Set by event store
  }

  /**
   * Create event from stored data
   */
  static fromStore(storedEvent) {
    const event = new DomainEvent(
      storedEvent.aggregateId,
      storedEvent.eventType,
      storedEvent.data,
      storedEvent.metadata
    );
    event.eventId = storedEvent.eventId;
    event.streamPosition = storedEvent.streamPosition;
    return event;
  }

  /**
   * Serialize for storage
   */
  toStore() {
    return {
      eventId: this.eventId,
      aggregateId: this.aggregateId,
      eventType: this.eventType,
      data: this.data,
      metadata: this.metadata
    };
  }
}

/**
 * Event Store Interface
 */
class EventStore extends EventEmitter {
  constructor() {
    super();
    this.streams = new Map(); // aggregateId -> events[]
    this.globalStream = []; // All events in order
    this.snapshots = new Map(); // aggregateId -> snapshot
    this.projections = new Map(); // projectionName -> projection handler
    this.subscriptions = new Map(); // subscription -> handler
  }

  /**
   * Append events to aggregate stream
   */
  async appendToStream(aggregateId, events, expectedVersion = -1) {
    if (!Array.isArray(events)) {
      events = [events];
    }

    // Get current stream
    let stream = this.streams.get(aggregateId) || [];

    // Check optimistic concurrency
    if (expectedVersion !== -1 && stream.length !== expectedVersion) {
      throw new ConcurrencyError(
        `Expected version ${expectedVersion}, but stream is at version ${stream.length}`
      );
    }

    // Append events with stream positions
    const newEvents = events.map((event, index) => {
      const streamPosition = stream.length + index;
      event.streamPosition = streamPosition;
      event.globalPosition = this.globalStream.length + index;
      return event;
    });

    // Update streams
    stream.push(...newEvents);
    this.streams.set(aggregateId, stream);
    this.globalStream.push(...newEvents);

    // Emit events for projections and subscriptions
    for (const event of newEvents) {
      this.emit('eventAppended', event);
      this.emit(`event:${event.eventType}`, event);
      this.emit(`stream:${aggregateId}`, event);
    }

    return {
      streamVersion: stream.length,
      globalPosition: this.globalStream.length
    };
  }

  /**
   * Read events from aggregate stream
   */
  async readStream(aggregateId, fromVersion = 0, maxEvents = Number.MAX_SAFE_INTEGER) {
    const stream = this.streams.get(aggregateId) || [];
    const events = stream.slice(fromVersion, fromVersion + maxEvents);

    return {
      events: events.map(event => DomainEvent.fromStore(event)),
      streamVersion: stream.length,
      isEndOfStream: fromVersion + events.length >= stream.length
    };
  }

  /**
   * Read events from global stream
   */
  async readGlobalStream(fromPosition = 0, maxEvents = Number.MAX_SAFE_INTEGER) {
    const events = this.globalStream.slice(fromPosition, fromPosition + maxEvents);

    return {
      events: events.map(event => DomainEvent.fromStore(event)),
      globalPosition: this.globalStream.length,
      isEndOfStream: fromPosition + events.length >= this.globalStream.length
    };
  }

  /**
   * Read events by event type
   */
  async readEventsByType(eventType, fromPosition = 0, maxEvents = Number.MAX_SAFE_INTEGER) {
    const filteredEvents = this.globalStream
      .filter(event => event.eventType === eventType)
      .slice(fromPosition, fromPosition + maxEvents);

    return {
      events: filteredEvents.map(event => DomainEvent.fromStore(event)),
      isEndOfStream: true // Simplified for example
    };
  }

  /**
   * Read events by correlation ID
   */
  async readEventsByCorrelationId(correlationId) {
    const filteredEvents = this.globalStream
      .filter(event => event.metadata.correlationId === correlationId);

    return filteredEvents.map(event => DomainEvent.fromStore(event));
  }

  /**
   * Save aggregate snapshot
   */
  async saveSnapshot(aggregateId, snapshot, version) {
    this.snapshots.set(aggregateId, {
      aggregateId,
      data: snapshot,
      version,
      timestamp: new Date()
    });
  }

  /**
   * Load aggregate snapshot
   */
  async loadSnapshot(aggregateId) {
    return this.snapshots.get(aggregateId);
  }

  /**
   * Subscribe to events
   */
  subscribe(handler, options = {}) {
    const subscriptionId = crypto.randomUUID();

    const subscription = {
      id: subscriptionId,
      handler,
      fromPosition: options.fromPosition || 0,
      eventTypes: options.eventTypes || [],
      ...options
    };

    this.subscriptions.set(subscriptionId, subscription);

    // Start processing from specified position
    this.processSubscription(subscription);

    return subscriptionId;
  }

  /**
   * Process subscription from current position
   */
  async processSubscription(subscription) {
    let currentPosition = subscription.fromPosition;

    // Process existing events
    while (currentPosition < this.globalStream.length) {
      const event = this.globalStream[currentPosition];

      // Filter by event types if specified
      if (subscription.eventTypes.length === 0 ||
          subscription.eventTypes.includes(event.eventType)) {

        try {
          await subscription.handler(DomainEvent.fromStore(event));
        } catch (error) {
          this.emit('subscriptionError', { subscription, event, error });
        }
      }

      currentPosition++;
    }

    // Listen for new events
    const eventHandler = async (event) => {
      if (subscription.eventTypes.length === 0 ||
          subscription.eventTypes.includes(event.eventType)) {

        try {
          await subscription.handler(DomainEvent.fromStore(event));
        } catch (error) {
          this.emit('subscriptionError', { subscription, event, error });
        }
      }
    };

    this.on('eventAppended', eventHandler);
    subscription.eventHandler = eventHandler;
  }

  /**
   * Unsubscribe from events
   */
  unsubscribe(subscriptionId) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription && subscription.eventHandler) {
      this.off('eventAppended', subscription.eventHandler);
    }
    this.subscriptions.delete(subscriptionId);
  }

  /**
   * Get stream statistics
   */
  getStatistics() {
    return {
      totalStreams: this.streams.size,
      totalEvents: this.globalStream.length,
      totalSnapshots: this.snapshots.size,
      activeSubscriptions: this.subscriptions.size,
      streamSizes: Object.fromEntries(
        Array.from(this.streams.entries()).map(([id, events]) => [id, events.length])
      )
    };
  }
}

/**
 * Base Aggregate Root
 */
class AggregateRoot {
  constructor(id) {
    this.id = id;
    this.version = 0;
    this.uncommittedEvents = [];
  }

  /**
   * Apply domain event
   */
  applyEvent(event) {
    this.raiseEvent(event);
    this.handleEvent(event);
  }

  /**
   * Raise domain event (for new events)
   */
  raiseEvent(event) {
    this.uncommittedEvents.push(event);
  }

  /**
   * Handle event (apply to state)
   */
  handleEvent(event) {
    const handlerName = `on${event.eventType}`;
    if (typeof this[handlerName] === 'function') {
      this[handlerName](event);
    }
    this.version++;
  }

  /**
   * Load from event history
   */
  loadFromHistory(events) {
    for (const event of events) {
      this.handleEvent(event);
    }
    this.uncommittedEvents = [];
  }

  /**
   * Get uncommitted events and clear them
   */
  getUncommittedEvents() {
    const events = [...this.uncommittedEvents];
    this.uncommittedEvents = [];
    return events;
  }

  /**
   * Mark events as committed
   */
  markEventsAsCommitted() {
    this.uncommittedEvents = [];
  }

  /**
   * Create snapshot of current state
   */
  createSnapshot() {
    throw new Error('createSnapshot() must be implemented by subclass');
  }

  /**
   * Restore from snapshot
   */
  restoreFromSnapshot(snapshot) {
    throw new Error('restoreFromSnapshot() must be implemented by subclass');
  }
}

/**
 * Repository for Aggregates
 */
class AggregateRepository {
  constructor(eventStore, aggregateFactory) {
    this.eventStore = eventStore;
    this.aggregateFactory = aggregateFactory;
    this.snapshotFrequency = 10; // Take snapshot every N events
  }

  /**
   * Load aggregate by ID
   */
  async load(aggregateId) {
    let aggregate = this.aggregateFactory(aggregateId);
    let fromVersion = 0;

    // Try to load from snapshot first
    const snapshot = await this.eventStore.loadSnapshot(aggregateId);
    if (snapshot) {
      aggregate.restoreFromSnapshot(snapshot.data);
      aggregate.version = snapshot.version;
      fromVersion = snapshot.version;
    }

    // Load events after snapshot
    const { events } = await this.eventStore.readStream(aggregateId, fromVersion);

    if (events.length > 0) {
      aggregate.loadFromHistory(events);
    }

    return aggregate;
  }

  /**
   * Save aggregate
   */
  async save(aggregate, expectedVersion = -1) {
    const uncommittedEvents = aggregate.getUncommittedEvents();

    if (uncommittedEvents.length === 0) {
      return; // Nothing to save
    }

    // Save events to store
    const result = await this.eventStore.appendToStream(
      aggregate.id,
      uncommittedEvents,
      expectedVersion !== -1 ? expectedVersion : aggregate.version - uncommittedEvents.length
    );

    // Take snapshot if needed
    if (result.streamVersion % this.snapshotFrequency === 0) {
      const snapshot = aggregate.createSnapshot();
      await this.eventStore.saveSnapshot(aggregate.id, snapshot, result.streamVersion);
    }

    aggregate.markEventsAsCommitted();
    return result;
  }
}

/**
 * CQRS Command Handler
 */
class CommandHandler {
  constructor(repository) {
    this.repository = repository;
    this.commandHandlers = new Map();
  }

  /**
   * Register command handler
   */
  registerHandler(commandType, handler) {
    this.commandHandlers.set(commandType, handler);
    return this;
  }

  /**
   * Handle command
   */
  async handle(command) {
    const handler = this.commandHandlers.get(command.type);

    if (!handler) {
      throw new Error(`No handler registered for command type: ${command.type}`);
    }

    return await handler(command, this.repository);
  }
}

/**
 * Projection Manager
 */
class ProjectionManager {
  constructor(eventStore) {
    this.eventStore = eventStore;
    this.projections = new Map();
    this.projectionStates = new Map();
  }

  /**
   * Register projection
   */
  registerProjection(name, projection) {
    this.projections.set(name, projection);
    this.projectionStates.set(name, {
      lastProcessedPosition: -1,
      isRunning: false,
      error: null
    });
    return this;
  }

  /**
   * Start projection
   */
  async startProjection(name) {
    const projection = this.projections.get(name);
    const state = this.projectionStates.get(name);

    if (!projection || state.isRunning) {
      return;
    }

    state.isRunning = true;
    state.error = null;

    try {
      // Subscribe to new events
      const subscriptionId = this.eventStore.subscribe(
        async (event) => {
          try {
            await projection.handle(event);
            state.lastProcessedPosition = event.globalPosition;
          } catch (error) {
            state.error = error;
            this.eventStore.emit('projectionError', { projection: name, event, error });
          }
        },
        {
          fromPosition: state.lastProcessedPosition + 1,
          eventTypes: projection.eventTypes || []
        }
      );

      state.subscriptionId = subscriptionId;
    } catch (error) {
      state.isRunning = false;
      state.error = error;
      throw error;
    }
  }

  /**
   * Stop projection
   */
  async stopProjection(name) {
    const state = this.projectionStates.get(name);

    if (state && state.subscriptionId) {
      this.eventStore.unsubscribe(state.subscriptionId);
      state.isRunning = false;
    }
  }

  /**
   * Rebuild projection from beginning
   */
  async rebuildProjection(name) {
    await this.stopProjection(name);

    const projection = this.projections.get(name);
    const state = this.projectionStates.get(name);

    if (!projection) return;

    // Reset state
    state.lastProcessedPosition = -1;

    // Rebuild from all events
    if (projection.reset) {
      await projection.reset();
    }

    await this.startProjection(name);
  }

  /**
   * Get projection status
   */
  getProjectionStatus(name) {
    return this.projectionStates.get(name);
  }
}

/**
 * Saga Manager for complex workflows
 */
class SagaManager {
  constructor(eventStore, commandHandler) {
    this.eventStore = eventStore;
    this.commandHandler = commandHandler;
    this.sagas = new Map();
    this.sagaInstances = new Map();
  }

  /**
   * Register saga definition
   */
  registerSaga(name, sagaDefinition) {
    this.sagas.set(name, sagaDefinition);
    return this;
  }

  /**
   * Start saga orchestration
   */
  async startSagaOrchestration() {
    // Subscribe to events that can trigger sagas
    this.eventStore.subscribe(async (event) => {
      for (const [name, saga] of this.sagas.entries()) {
        if (saga.canHandle && saga.canHandle(event)) {
          await this.handleSagaEvent(name, saga, event);
        }
      }
    });
  }

  /**
   * Handle saga event
   */
  async handleSagaEvent(sagaName, saga, event) {
    const sagaId = this.getSagaId(saga, event);
    let sagaInstance = this.sagaInstances.get(sagaId);

    // Create new saga instance if needed
    if (!sagaInstance && saga.isStartingEvent && saga.isStartingEvent(event)) {
      sagaInstance = {
        id: sagaId,
        name: sagaName,
        state: saga.initialState || {},
        isCompleted: false,
        startedAt: new Date(),
        lastEvent: null
      };
      this.sagaInstances.set(sagaId, sagaInstance);
    }

    if (!sagaInstance || sagaInstance.isCompleted) {
      return;
    }

    try {
      // Handle the event
      const commands = await saga.handle(event, sagaInstance.state);

      // Execute commands
      if (commands && commands.length > 0) {
        for (const command of commands) {
          await this.commandHandler.handle(command);
        }
      }

      // Check if saga is completed
      if (saga.isCompleted && saga.isCompleted(event, sagaInstance.state)) {
        sagaInstance.isCompleted = true;
        sagaInstance.completedAt = new Date();
      }

      sagaInstance.lastEvent = event;
    } catch (error) {
      this.eventStore.emit('sagaError', { sagaId, event, error });
    }
  }

  /**
   * Get saga ID for correlation
   */
  getSagaId(saga, event) {
    if (saga.getSagaId) {
      return saga.getSagaId(event);
    }
    return event.metadata.correlationId;
  }
}

/**
 * Example Domain: Order Management
 */

// Order Events
class OrderCreated extends DomainEvent {
  constructor(orderId, customerId, items, metadata) {
    super(orderId, 'OrderCreated', { customerId, items }, metadata);
  }
}

class OrderItemAdded extends DomainEvent {
  constructor(orderId, item, metadata) {
    super(orderId, 'OrderItemAdded', { item }, metadata);
  }
}

class OrderShipped extends DomainEvent {
  constructor(orderId, shippingAddress, trackingNumber, metadata) {
    super(orderId, 'OrderShipped', { shippingAddress, trackingNumber }, metadata);
  }
}

class OrderCancelled extends DomainEvent {
  constructor(orderId, reason, metadata) {
    super(orderId, 'OrderCancelled', { reason }, metadata);
  }
}

// Order Aggregate
class Order extends AggregateRoot {
  constructor(id) {
    super(id);
    this.customerId = null;
    this.items = [];
    this.status = 'draft';
    this.shippingAddress = null;
    this.trackingNumber = null;
  }

  // Commands
  static create(orderId, customerId, items, metadata) {
    const order = new Order(orderId);
    order.applyEvent(new OrderCreated(orderId, customerId, items, metadata));
    return order;
  }

  addItem(item, metadata) {
    if (this.status !== 'draft') {
      throw new Error('Cannot add items to non-draft order');
    }
    this.applyEvent(new OrderItemAdded(this.id, item, metadata));
  }

  ship(shippingAddress, trackingNumber, metadata) {
    if (this.status !== 'confirmed') {
      throw new Error('Cannot ship non-confirmed order');
    }
    this.applyEvent(new OrderShipped(this.id, shippingAddress, trackingNumber, metadata));
  }

  cancel(reason, metadata) {
    if (this.status === 'shipped' || this.status === 'cancelled') {
      throw new Error('Cannot cancel shipped or already cancelled order');
    }
    this.applyEvent(new OrderCancelled(this.id, reason, metadata));
  }

  // Event Handlers
  onOrderCreated(event) {
    this.customerId = event.data.customerId;
    this.items = [...event.data.items];
    this.status = 'draft';
  }

  onOrderItemAdded(event) {
    this.items.push(event.data.item);
  }

  onOrderShipped(event) {
    this.status = 'shipped';
    this.shippingAddress = event.data.shippingAddress;
    this.trackingNumber = event.data.trackingNumber;
  }

  onOrderCancelled(event) {
    this.status = 'cancelled';
  }

  // Snapshot
  createSnapshot() {
    return {
      customerId: this.customerId,
      items: this.items,
      status: this.status,
      shippingAddress: this.shippingAddress,
      trackingNumber: this.trackingNumber
    };
  }

  restoreFromSnapshot(snapshot) {
    this.customerId = snapshot.customerId;
    this.items = snapshot.items;
    this.status = snapshot.status;
    this.shippingAddress = snapshot.shippingAddress;
    this.trackingNumber = snapshot.trackingNumber;
  }
}

/**
 * Example Projections
 */

// Order Summary Projection
class OrderSummaryProjection {
  constructor() {
    this.orderSummaries = new Map();
    this.eventTypes = ['OrderCreated', 'OrderShipped', 'OrderCancelled'];
  }

  async handle(event) {
    switch (event.eventType) {
      case 'OrderCreated':
        this.orderSummaries.set(event.aggregateId, {
          orderId: event.aggregateId,
          customerId: event.data.customerId,
          itemCount: event.data.items.length,
          totalAmount: event.data.items.reduce((sum, item) => sum + item.price, 0),
          status: 'draft',
          createdAt: event.metadata.timestamp
        });
        break;

      case 'OrderShipped':
        const shippedOrder = this.orderSummaries.get(event.aggregateId);
        if (shippedOrder) {
          shippedOrder.status = 'shipped';
          shippedOrder.shippedAt = event.metadata.timestamp;
          shippedOrder.trackingNumber = event.data.trackingNumber;
        }
        break;

      case 'OrderCancelled':
        const cancelledOrder = this.orderSummaries.get(event.aggregateId);
        if (cancelledOrder) {
          cancelledOrder.status = 'cancelled';
          cancelledOrder.cancelledAt = event.metadata.timestamp;
        }
        break;
    }
  }

  async reset() {
    this.orderSummaries.clear();
  }

  getOrderSummary(orderId) {
    return this.orderSummaries.get(orderId);
  }

  getAllOrders() {
    return Array.from(this.orderSummaries.values());
  }
}

// Customer Order History Projection
class CustomerOrderHistoryProjection {
  constructor() {
    this.customerOrders = new Map();
    this.eventTypes = ['OrderCreated'];
  }

  async handle(event) {
    if (event.eventType === 'OrderCreated') {
      const customerId = event.data.customerId;

      if (!this.customerOrders.has(customerId)) {
        this.customerOrders.set(customerId, []);
      }

      this.customerOrders.get(customerId).push({
        orderId: event.aggregateId,
        createdAt: event.metadata.timestamp,
        itemCount: event.data.items.length
      });
    }
  }

  async reset() {
    this.customerOrders.clear();
  }

  getCustomerOrders(customerId) {
    return this.customerOrders.get(customerId) || [];
  }
}

/**
 * Custom Errors
 */
class ConcurrencyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConcurrencyError';
  }
}

/**
 * Example Usage Demonstrations
 */

// Example 1: Basic Event Sourcing
async function exampleBasicEventSourcing() {
  console.log('=== Basic Event Sourcing Example ===');

  const eventStore = new EventStore();
  const repository = new AggregateRepository(eventStore, (id) => new Order(id));

  // Create and save order
  const order = Order.create('order-1', 'customer-1', [
    { productId: 'prod-1', quantity: 2, price: 29.99 },
    { productId: 'prod-2', quantity: 1, price: 49.99 }
  ]);

  await repository.save(order);

  // Add item to order
  order.addItem({ productId: 'prod-3', quantity: 1, price: 19.99 });
  await repository.save(order);

  // Ship order
  order.ship('123 Main St', 'TRACK123');
  await repository.save(order);

  // Load order from events
  const loadedOrder = await repository.load('order-1');
  console.log('Loaded order:', {
    id: loadedOrder.id,
    customerId: loadedOrder.customerId,
    items: loadedOrder.items,
    status: loadedOrder.status,
    version: loadedOrder.version
  });

  console.log('Event store statistics:', eventStore.getStatistics());
}

// Example 2: Projections
async function exampleProjections() {
  console.log('=== Projections Example ===');

  const eventStore = new EventStore();
  const projectionManager = new ProjectionManager(eventStore);

  // Register projections
  const orderSummaryProjection = new OrderSummaryProjection();
  const customerHistoryProjection = new CustomerOrderHistoryProjection();

  projectionManager.registerProjection('order-summary', orderSummaryProjection);
  projectionManager.registerProjection('customer-history', customerHistoryProjection);

  // Start projections
  await projectionManager.startProjection('order-summary');
  await projectionManager.startProjection('customer-history');

  // Create some events
  const repository = new AggregateRepository(eventStore, (id) => new Order(id));

  const order1 = Order.create('order-1', 'customer-1', [
    { productId: 'prod-1', quantity: 1, price: 100 }
  ]);
  await repository.save(order1);

  const order2 = Order.create('order-2', 'customer-1', [
    { productId: 'prod-2', quantity: 2, price: 50 }
  ]);
  await repository.save(order2);

  order1.ship('123 Main St', 'TRACK123');
  await repository.save(order1);

  // Wait for projections to process
  await new Promise(resolve => setTimeout(resolve, 100));

  // Query projections
  console.log('Order summaries:', orderSummaryProjection.getAllOrders());
  console.log('Customer 1 orders:', customerHistoryProjection.getCustomerOrders('customer-1'));
}

// Example 3: Event Replay
async function exampleEventReplay() {
  console.log('=== Event Replay Example ===');

  const eventStore = new EventStore();
  const repository = new AggregateRepository(eventStore, (id) => new Order(id));

  // Create order with multiple events
  const order = Order.create('order-1', 'customer-1', [
    { productId: 'prod-1', quantity: 1, price: 100 }
  ]);

  await repository.save(order);

  order.addItem({ productId: 'prod-2', quantity: 1, price: 50 });
  await repository.save(order);

  order.ship('123 Main St', 'TRACK123');
  await repository.save(order);

  // Read event stream
  const { events } = await eventStore.readStream('order-1');
  console.log('Order events:');
  events.forEach((event, index) => {
    console.log(`${index + 1}. ${event.eventType}:`, event.data);
  });

  // Replay to specific point in time
  const orderAtStep2 = new Order('order-1');
  orderAtStep2.loadFromHistory(events.slice(0, 2));
  console.log('Order state after 2 events:', {
    status: orderAtStep2.status,
    itemCount: orderAtStep2.items.length
  });
}

module.exports = {
  DomainEvent,
  EventStore,
  AggregateRoot,
  AggregateRepository,
  CommandHandler,
  ProjectionManager,
  SagaManager,
  ConcurrencyError,
  Order,
  OrderCreated,
  OrderItemAdded,
  OrderShipped,
  OrderCancelled,
  OrderSummaryProjection,
  CustomerOrderHistoryProjection,
  exampleBasicEventSourcing,
  exampleProjections,
  exampleEventReplay
};