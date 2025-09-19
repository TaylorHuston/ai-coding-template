/**
 * API Pagination Pattern Examples
 *
 * Demonstrates offset-based and cursor-based pagination strategies.
 * Includes performance considerations and hybrid approaches for different use cases.
 */

/**
 * Offset-Based Pagination
 *
 * Traditional page/limit approach suitable for small to medium datasets
 * with occasional browsing patterns.
 */
class OffsetPagination {
  constructor(options = {}) {
    this.defaultLimit = options.defaultLimit || 20;
    this.maxLimit = options.maxLimit || 100;
  }

  /**
   * Parse Pagination Parameters
   */
  parseParams(req) {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(
      this.maxLimit,
      Math.max(1, parseInt(req.query.limit) || this.defaultLimit)
    );
    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }

  /**
   * Build Database Query
   */
  buildQuery(baseQuery, { offset, limit, sort = {} }) {
    return baseQuery
      .sort(sort)
      .skip(offset)
      .limit(limit);
  }

  /**
   * Build Response Metadata
   */
  buildMetadata(totalCount, { page, limit }) {
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext,
        hasPrevious,
        nextPage: hasNext ? page + 1 : null,
        previousPage: hasPrevious ? page - 1 : null
      }
    };
  }

  /**
   * Complete Pagination Handler
   */
  async paginate(model, filter = {}, options = {}) {
    const { page, limit, offset } = this.parseParams(options.req || { query: {} });
    const sort = options.sort || { createdAt: -1 };

    // Get total count for metadata
    const totalCount = await model.countDocuments(filter);

    // Get paginated results
    const items = await this.buildQuery(
      model.find(filter),
      { offset, limit, sort }
    );

    // Build response
    const metadata = this.buildMetadata(totalCount, { page, limit });

    return {
      items,
      metadata
    };
  }
}

/**
 * Cursor-Based Pagination
 *
 * High-performance approach for large datasets with consistent ordering.
 * Ideal for real-time data and APIs with high traffic.
 */
class CursorPagination {
  constructor(options = {}) {
    this.defaultLimit = options.defaultLimit || 20;
    this.maxLimit = options.maxLimit || 100;
    this.cursorField = options.cursorField || '_id';
    this.direction = options.direction || 'desc'; // 'asc' or 'desc'
  }

  /**
   * Parse Cursor Parameters
   */
  parseParams(req) {
    const limit = Math.min(
      this.maxLimit,
      Math.max(1, parseInt(req.query.limit) || this.defaultLimit)
    );
    const after = req.query.after; // Cursor for next page
    const before = req.query.before; // Cursor for previous page

    return { limit, after, before };
  }

  /**
   * Encode Cursor
   *
   * Creates base64-encoded cursor from document field value
   */
  encodeCursor(value) {
    if (!value) return null;
    return Buffer.from(JSON.stringify({
      field: this.cursorField,
      value: value,
      direction: this.direction
    })).toString('base64');
  }

  /**
   * Decode Cursor
   */
  decodeCursor(cursor) {
    if (!cursor) return null;
    try {
      return JSON.parse(Buffer.from(cursor, 'base64').toString());
    } catch (error) {
      throw new Error('Invalid cursor format');
    }
  }

  /**
   * Build Database Query with Cursor
   */
  buildQuery(baseQuery, { after, before, limit }) {
    let query = baseQuery;
    const sortDirection = this.direction === 'desc' ? -1 : 1;

    // Apply cursor filters
    if (after) {
      const afterCursor = this.decodeCursor(after);
      if (this.direction === 'desc') {
        query = query.where(this.cursorField).lt(afterCursor.value);
      } else {
        query = query.where(this.cursorField).gt(afterCursor.value);
      }
    }

    if (before) {
      const beforeCursor = this.decodeCursor(before);
      if (this.direction === 'desc') {
        query = query.where(this.cursorField).gt(beforeCursor.value);
      } else {
        query = query.where(this.cursorField).lt(beforeCursor.value);
      }
    }

    return query
      .sort({ [this.cursorField]: sortDirection })
      .limit(limit + 1); // +1 to check if there are more results
  }

  /**
   * Build Response with Cursors
   */
  buildResponse(items, { limit, after, before }) {
    const hasMore = items.length > limit;
    if (hasMore) {
      items.pop(); // Remove the extra item used for hasMore detection
    }

    let nextCursor = null;
    let previousCursor = null;
    let hasNext = false;
    let hasPrevious = false;

    if (items.length > 0) {
      const firstItem = items[0];
      const lastItem = items[items.length - 1];

      // Determine next cursor
      if (hasMore && !before) {
        nextCursor = this.encodeCursor(lastItem[this.cursorField]);
        hasNext = true;
      }

      // Determine previous cursor
      if (after || (before && hasMore)) {
        previousCursor = this.encodeCursor(firstItem[this.cursorField]);
        hasPrevious = true;
      }
    }

    return {
      items,
      metadata: {
        pagination: {
          limit,
          hasNext,
          hasPrevious,
          nextCursor,
          previousCursor,
          cursors: {
            after,
            before
          }
        }
      }
    };
  }

  /**
   * Complete Cursor Pagination Handler
   */
  async paginate(model, filter = {}, options = {}) {
    const { limit, after, before } = this.parseParams(options.req || { query: {} });

    // Build and execute query
    const items = await this.buildQuery(
      model.find(filter),
      { after, before, limit }
    );

    // Build response with cursor metadata
    return this.buildResponse(items, { limit, after, before });
  }
}

/**
 * Hybrid Pagination
 *
 * Combines offset and cursor approaches based on use case.
 * Provides both page-based browsing and high-performance scrolling.
 */
class HybridPagination {
  constructor(options = {}) {
    this.offsetPagination = new OffsetPagination(options);
    this.cursorPagination = new CursorPagination(options);
    this.preferCursor = options.preferCursor || false;
  }

  /**
   * Auto-select Pagination Strategy
   */
  selectStrategy(req) {
    const hasPage = req.query.page !== undefined;
    const hasCursor = req.query.after !== undefined || req.query.before !== undefined;

    if (hasCursor) {
      return 'cursor';
    } else if (hasPage) {
      return 'offset';
    } else {
      return this.preferCursor ? 'cursor' : 'offset';
    }
  }

  /**
   * Unified Pagination Handler
   */
  async paginate(model, filter = {}, options = {}) {
    const strategy = this.selectStrategy(options.req || { query: {} });

    if (strategy === 'cursor') {
      return await this.cursorPagination.paginate(model, filter, options);
    } else {
      return await this.offsetPagination.paginate(model, filter, options);
    }
  }
}

/**
 * Advanced Pagination Features
 */
class AdvancedPagination {
  constructor() {
    this.offsetPagination = new OffsetPagination();
    this.cursorPagination = new CursorPagination();
  }

  /**
   * Estimate Total Count for Cursor Pagination
   *
   * Provides approximate counts without expensive COUNT() queries
   */
  async estimateTotal(model, filter = {}) {
    // Use sampling for large collections
    const sampleSize = 1000;
    const sample = await model.aggregate([
      { $match: filter },
      { $sample: { size: sampleSize } }
    ]);

    if (sample.length < sampleSize) {
      // Small dataset, return exact count
      return await model.countDocuments(filter);
    } else {
      // Estimate based on collection stats
      const stats = await model.collection.stats();
      const filterRatio = sample.length / sampleSize;
      return Math.round(stats.count * filterRatio);
    }
  }

  /**
   * Search-Optimized Pagination
   *
   * Handles text search results with relevance scoring
   */
  async searchPaginate(model, searchQuery, options = {}) {
    const { page, limit, offset } = this.offsetPagination.parseParams(options.req || { query: {} });

    // Build text search query
    const searchFilter = {
      $text: { $search: searchQuery }
    };

    // Get results with relevance score
    const items = await model.find(searchFilter, {
      score: { $meta: 'textScore' }
    })
    .sort({ score: { $meta: 'textScore' } })
    .skip(offset)
    .limit(limit);

    // Estimated count for search results (exact count is expensive)
    const estimatedTotal = await this.estimateTotal(model, searchFilter);

    const metadata = this.offsetPagination.buildMetadata(estimatedTotal, { page, limit });
    metadata.pagination.estimated = true; // Indicate that total is estimated

    return { items, metadata };
  }

  /**
   * Time-Based Pagination
   *
   * Optimized for time-series data with date-based cursors
   */
  async timePaginate(model, filter = {}, options = {}) {
    const timeField = options.timeField || 'createdAt';
    const { limit, after, before } = this.cursorPagination.parseParams(options.req || { query: {} });

    let query = model.find(filter);

    // Apply time-based filters
    if (after) {
      const afterTime = new Date(Buffer.from(after, 'base64').toString());
      query = query.where(timeField).lt(afterTime);
    }

    if (before) {
      const beforeTime = new Date(Buffer.from(before, 'base64').toString());
      query = query.where(timeField).gt(beforeTime);
    }

    // Execute query
    const items = await query
      .sort({ [timeField]: -1 })
      .limit(limit + 1);

    // Build time-based cursors
    const hasMore = items.length > limit;
    if (hasMore) items.pop();

    let nextCursor = null;
    let previousCursor = null;

    if (items.length > 0) {
      const lastItem = items[items.length - 1];
      const firstItem = items[0];

      nextCursor = hasMore ? Buffer.from(lastItem[timeField].toISOString()).toString('base64') : null;
      previousCursor = after ? Buffer.from(firstItem[timeField].toISOString()).toString('base64') : null;
    }

    return {
      items,
      metadata: {
        pagination: {
          limit,
          hasNext: hasMore,
          hasPrevious: !!after,
          nextCursor,
          previousCursor
        }
      }
    };
  }
}

/**
 * Pagination Middleware
 *
 * Express middleware for automatic pagination handling
 */
function paginationMiddleware(strategy = 'hybrid', options = {}) {
  const paginators = {
    offset: new OffsetPagination(options),
    cursor: new CursorPagination(options),
    hybrid: new HybridPagination(options),
    advanced: new AdvancedPagination()
  };

  const paginator = paginators[strategy];

  return (req, res, next) => {
    // Attach pagination helper to request
    req.paginate = async (model, filter = {}, paginationOptions = {}) => {
      return await paginator.paginate(model, filter, {
        ...paginationOptions,
        req
      });
    };

    // Attach response helper
    res.apiPaginated = (items, pagination) => {
      return res.json({
        success: true,
        statusCode: 200,
        timestamp: new Date().toISOString(),
        requestId: req.id || null,
        data: items,
        metadata: pagination
      });
    };

    next();
  };
}

/**
 * Example Route Implementations
 */

// Offset-based pagination example
async function getUsersOffset(req, res, next) {
  try {
    const result = await req.paginate(User, {
      isActive: true
    }, {
      sort: { createdAt: -1 }
    });

    res.apiPaginated(result.items, result.metadata);
  } catch (error) {
    next(error);
  }
}

// Cursor-based pagination example
async function getPostsCursor(req, res, next) {
  try {
    const cursorPagination = new CursorPagination({
      cursorField: 'createdAt',
      direction: 'desc'
    });

    const result = await cursorPagination.paginate(Post, {
      published: true
    }, { req });

    res.apiPaginated(result.items, result.metadata);
  } catch (error) {
    next(error);
  }
}

// Search with pagination example
async function searchProducts(req, res, next) {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const advancedPagination = new AdvancedPagination();
    const result = await advancedPagination.searchPaginate(Product, query, { req });

    res.apiPaginated(result.items, result.metadata);
  } catch (error) {
    next(error);
  }
}

/**
 * Pagination Response Examples
 */

// Offset-based response
const offsetResponseExample = {
  "success": true,
  "statusCode": 200,
  "timestamp": "2025-09-17T10:30:00.000Z",
  "data": [
    { "id": 1, "name": "User 1" },
    { "id": 2, "name": "User 2" }
  ],
  "metadata": {
    "pagination": {
      "page": 2,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrevious": true,
      "nextPage": 3,
      "previousPage": 1
    }
  }
};

// Cursor-based response
const cursorResponseExample = {
  "success": true,
  "statusCode": 200,
  "timestamp": "2025-09-17T10:30:00.000Z",
  "data": [
    { "id": 1, "name": "Post 1" },
    { "id": 2, "name": "Post 2" }
  ],
  "metadata": {
    "pagination": {
      "limit": 20,
      "hasNext": true,
      "hasPrevious": false,
      "nextCursor": "eyJmaWVsZCI6Il9pZCIsInZhbHVlIjoi...",
      "previousCursor": null,
      "cursors": {
        "after": null,
        "before": null
      }
    }
  }
};

// Search pagination response
const searchResponseExample = {
  "success": true,
  "statusCode": 200,
  "timestamp": "2025-09-17T10:30:00.000Z",
  "data": [
    { "id": 1, "name": "Product 1", "score": 0.95 },
    { "id": 2, "name": "Product 2", "score": 0.87 }
  ],
  "metadata": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "estimated": true,
      "totalPages": 3,
      "hasNext": true,
      "hasPrevious": false
    }
  }
};

/**
 * Performance Optimization Tips
 */
const performanceOptimizations = {
  indexing: {
    offset: "CREATE INDEX ON table (sort_field, filter_field)",
    cursor: "CREATE INDEX ON table (cursor_field, filter_field)"
  },

  queryOptimization: {
    offset: "Use LIMIT without ORDER BY for better performance on large offsets",
    cursor: "Use covering indexes to avoid document lookups",
    search: "Use compound indexes for text search with filters"
  },

  caching: {
    totalCounts: "Cache expensive count queries for offset pagination",
    results: "Cache frequently accessed pages",
    metadata: "Cache pagination metadata for stable datasets"
  }
};

module.exports = {
  OffsetPagination,
  CursorPagination,
  HybridPagination,
  AdvancedPagination,
  paginationMiddleware,

  // Example handlers
  getUsersOffset,
  getPostsCursor,
  searchProducts,

  // Examples and tips
  examples: {
    offsetResponseExample,
    cursorResponseExample,
    searchResponseExample
  },
  performanceOptimizations
};

/**
 * Key Benefits of These Patterns:
 *
 * 1. Flexibility: Multiple pagination strategies for different use cases
 * 2. Performance: Cursor-based pagination for large datasets
 * 3. User Experience: Offset pagination for browsing and navigation
 * 4. Scalability: Consistent performance regardless of dataset size
 * 5. Search Integration: Optimized pagination for search results
 *
 * Usage Guidelines:
 * - Use offset pagination for small datasets and user browsing
 * - Use cursor pagination for large datasets and real-time feeds
 * - Implement hybrid approach when supporting both use cases
 * - Always include appropriate database indexes
 * - Consider caching strategies for expensive operations
 * - Provide clear API documentation for pagination parameters
 */