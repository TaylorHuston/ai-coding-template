/**
 * API Filtering Pattern Examples
 *
 * Demonstrates flexible query interfaces that scale from simple to complex filtering.
 * Includes exact matches, range queries, text search, and relationship filtering.
 */

/**
 * Query Builder
 *
 * Builds database queries from URL parameters with type safety and validation.
 */
class QueryBuilder {
  constructor(model, options = {}) {
    this.model = model;
    this.allowedFields = options.allowedFields || [];
    this.searchFields = options.searchFields || [];
    this.relationFields = options.relationFields || {};
    this.defaultSort = options.defaultSort || { createdAt: -1 };
  }

  /**
   * Parse Filter Parameters
   *
   * Converts URL query parameters into database filters
   */
  parseFilters(queryParams) {
    const filters = {};
    const errors = [];

    for (const [key, value] of Object.entries(queryParams)) {
      try {
        // Skip pagination and sorting parameters
        if (['page', 'limit', 'sort', 'order', 'search', 'after', 'before'].includes(key)) {
          continue;
        }

        // Parse field with operator
        const filterResult = this.parseFieldFilter(key, value);
        if (filterResult.error) {
          errors.push(filterResult.error);
        } else if (filterResult.filter) {
          Object.assign(filters, filterResult.filter);
        }

      } catch (error) {
        errors.push({ field: key, message: `Invalid filter: ${error.message}` });
      }
    }

    return { filters, errors };
  }

  /**
   * Parse Individual Field Filter
   */
  parseFieldFilter(key, value) {
    // Parse operator from field name (e.g., "price_gte" -> field: "price", operator: "gte")
    const operatorMatch = key.match(/^(.+)_(eq|ne|gt|gte|lt|lte|in|nin|like|ilike|exists|regex)$/);

    let field, operator;
    if (operatorMatch) {
      [, field, operator] = operatorMatch;
    } else {
      field = key;
      operator = 'eq'; // Default to equality
    }

    // Validate field access
    if (this.allowedFields.length > 0 && !this.allowedFields.includes(field)) {
      return { error: { field: key, message: `Field '${field}' is not allowed for filtering` } };
    }

    // Parse value based on operator
    const parsedValue = this.parseValue(value, operator);
    if (parsedValue.error) {
      return { error: { field: key, message: parsedValue.error } };
    }

    // Build filter object
    const filter = this.buildFilter(field, operator, parsedValue.value);
    return { filter };
  }

  /**
   * Parse and Validate Values
   */
  parseValue(value, operator) {
    try {
      switch (operator) {
        case 'in':
        case 'nin':
          // Parse comma-separated values
          if (typeof value === 'string') {
            return { value: value.split(',').map(v => this.coerceType(v.trim())) };
          }
          return { value: Array.isArray(value) ? value : [value] };

        case 'exists':
          // Boolean existence check
          return { value: value === 'true' || value === '1' };

        case 'regex':
          // Regular expression (be careful with user input)
          try {
            return { value: new RegExp(value, 'i') };
          } catch (error) {
            return { error: 'Invalid regular expression' };
          }

        case 'like':
        case 'ilike':
          // Case-insensitive partial match
          return { value: new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') };

        default:
          // Single value with type coercion
          return { value: this.coerceType(value) };
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Type Coercion
   */
  coerceType(value) {
    // Try to convert string values to appropriate types
    if (typeof value !== 'string') return value;

    // Boolean
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Number
    if (/^-?\d+$/.test(value)) return parseInt(value, 10);
    if (/^-?\d*\.\d+$/.test(value)) return parseFloat(value);

    // Date (ISO format)
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) return date;
    }

    // ObjectId (MongoDB)
    if (/^[0-9a-fA-F]{24}$/.test(value)) return value;

    // String (default)
    return value;
  }

  /**
   * Build Database Filter
   */
  buildFilter(field, operator, value) {
    const operatorMap = {
      eq: (val) => val,
      ne: (val) => ({ $ne: val }),
      gt: (val) => ({ $gt: val }),
      gte: (val) => ({ $gte: val }),
      lt: (val) => ({ $lt: val }),
      lte: (val) => ({ $lte: val }),
      in: (val) => ({ $in: val }),
      nin: (val) => ({ $nin: val }),
      like: (val) => val, // Already converted to regex in parseValue
      ilike: (val) => val,
      exists: (val) => ({ $exists: val }),
      regex: (val) => val
    };

    const mongoValue = operatorMap[operator](value);
    return { [field]: mongoValue };
  }

  /**
   * Parse Search Query
   */
  parseSearch(searchQuery) {
    if (!searchQuery || this.searchFields.length === 0) {
      return {};
    }

    // Full-text search if available
    if (this.model.schema.indexes().some(index => index[1] && index[1].text)) {
      return { $text: { $search: searchQuery } };
    }

    // Fallback to regex search across specified fields
    const searchRegex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return {
      $or: this.searchFields.map(field => ({
        [field]: searchRegex
      }))
    };
  }

  /**
   * Parse Sorting
   */
  parseSort(sortParam, orderParam = 'asc') {
    if (!sortParam) return this.defaultSort;

    const direction = orderParam.toLowerCase() === 'desc' ? -1 : 1;

    // Handle multiple sort fields (comma-separated)
    if (sortParam.includes(',')) {
      const sortObj = {};
      sortParam.split(',').forEach(field => {
        const trimmedField = field.trim();
        if (this.allowedFields.length === 0 || this.allowedFields.includes(trimmedField)) {
          sortObj[trimmedField] = direction;
        }
      });
      return Object.keys(sortObj).length > 0 ? sortObj : this.defaultSort;
    }

    // Single sort field
    if (this.allowedFields.length === 0 || this.allowedFields.includes(sortParam)) {
      return { [sortParam]: direction };
    }

    return this.defaultSort;
  }

  /**
   * Build Complete Query
   */
  buildQuery(queryParams) {
    const { filters, errors } = this.parseFilters(queryParams);

    if (errors.length > 0) {
      throw new Error(`Filter validation failed: ${errors.map(e => e.message).join(', ')}`);
    }

    // Add search filters
    const searchFilters = this.parseSearch(queryParams.search);
    const combinedFilters = { ...filters, ...searchFilters };

    // Parse sorting
    const sort = this.parseSort(queryParams.sort, queryParams.order);

    return {
      filters: combinedFilters,
      sort,
      query: this.model.find(combinedFilters).sort(sort)
    };
  }
}

/**
 * Advanced Filtering Features
 */
class AdvancedQueryBuilder extends QueryBuilder {
  constructor(model, options = {}) {
    super(model, options);
    this.aggregationPipeline = options.aggregationPipeline || [];
  }

  /**
   * Date Range Filtering
   */
  parseDateRange(field, params) {
    const dateFilters = {};

    // Handle various date range parameters
    const dateParams = {
      [`${field}_after`]: '$gte',
      [`${field}_before`]: '$lte',
      [`${field}_from`]: '$gte',
      [`${field}_to`]: '$lte',
      [`${field}_on`]: '$eq'
    };

    for (const [param, operator] of Object.entries(dateParams)) {
      if (params[param]) {
        const date = new Date(params[param]);
        if (!isNaN(date.getTime())) {
          if (!dateFilters[field]) dateFilters[field] = {};
          if (operator === '$eq') {
            // For "on" queries, create a range for the entire day
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            dateFilters[field] = { $gte: date, $lt: nextDay };
          } else {
            dateFilters[field][operator] = date;
          }
        }
      }
    }

    return dateFilters;
  }

  /**
   * Geospatial Filtering
   */
  parseGeospatial(params) {
    const geoFilters = {};

    // Near query: ?location_near=lat,lng&location_max_distance=1000
    if (params.location_near) {
      const [lat, lng] = params.location_near.split(',').map(parseFloat);
      if (!isNaN(lat) && !isNaN(lng)) {
        geoFilters.location = {
          $near: {
            $geometry: { type: 'Point', coordinates: [lng, lat] },
            $maxDistance: parseInt(params.location_max_distance) || 1000
          }
        };
      }
    }

    // Within polygon: ?location_within=lat1,lng1;lat2,lng2;lat3,lng3
    if (params.location_within) {
      const coordinates = params.location_within
        .split(';')
        .map(coord => coord.split(',').map(parseFloat))
        .filter(coord => coord.length === 2 && !coord.some(isNaN));

      if (coordinates.length >= 3) {
        // Close the polygon
        coordinates.push(coordinates[0]);

        geoFilters.location = {
          $geoWithin: {
            $geometry: {
              type: 'Polygon',
              coordinates: [coordinates]
            }
          }
        };
      }
    }

    return geoFilters;
  }

  /**
   * Relationship Filtering
   */
  parseRelationships(params) {
    const relationFilters = {};

    for (const [relationField, config] of Object.entries(this.relationFields)) {
      const paramName = `${relationField}_id`;
      const arrayParamName = `${relationField}_ids`;

      // Single relationship ID
      if (params[paramName]) {
        relationFilters[config.foreignKey || `${relationField}Id`] = params[paramName];
      }

      // Multiple relationship IDs
      if (params[arrayParamName]) {
        const ids = Array.isArray(params[arrayParamName])
          ? params[arrayParamName]
          : params[arrayParamName].split(',');
        relationFilters[config.foreignKey || `${relationField}Id`] = { $in: ids };
      }

      // Existence check
      if (params[`has_${relationField}`] !== undefined) {
        const hasRelation = params[`has_${relationField}`] === 'true';
        relationFilters[config.foreignKey || `${relationField}Id`] =
          hasRelation ? { $exists: true, $ne: null } : { $in: [null, undefined] };
      }
    }

    return relationFilters;
  }

  /**
   * Aggregation-Based Filtering
   */
  parseAggregationFilters(params) {
    const aggregationFilters = [];

    // Count-based filters: ?comments_count_gte=5
    const countMatches = Object.keys(params).filter(key => key.includes('_count_'));
    for (const countParam of countMatches) {
      const match = countParam.match(/^(.+)_count_(gte|gt|lte|lt|eq)$/);
      if (match) {
        const [, field, operator] = match;
        const value = parseInt(params[countParam]);

        if (!isNaN(value)) {
          aggregationFilters.push({
            $match: {
              [`${field}Count`]: this.buildFilter('temp', operator, value).temp
            }
          });
        }
      }
    }

    return aggregationFilters;
  }

  /**
   * Build Advanced Query with All Features
   */
  buildAdvancedQuery(queryParams) {
    const baseQuery = this.buildQuery(queryParams);

    // Add advanced filters
    const dateFilters = this.parseDateRange('createdAt', queryParams);
    const geoFilters = this.parseGeospatial(queryParams);
    const relationFilters = this.parseRelationships(queryParams);

    const combinedFilters = {
      ...baseQuery.filters,
      ...dateFilters,
      ...geoFilters,
      ...relationFilters
    };

    // Build aggregation pipeline if needed
    const aggregationFilters = this.parseAggregationFilters(queryParams);

    if (aggregationFilters.length > 0) {
      const pipeline = [
        { $match: combinedFilters },
        ...aggregationFilters,
        { $sort: baseQuery.sort }
      ];

      return {
        filters: combinedFilters,
        sort: baseQuery.sort,
        aggregation: pipeline,
        query: this.model.aggregate(pipeline)
      };
    }

    return {
      filters: combinedFilters,
      sort: baseQuery.sort,
      query: this.model.find(combinedFilters).sort(baseQuery.sort)
    };
  }
}

/**
 * Filter Middleware
 *
 * Express middleware for automatic query building and validation.
 */
function filterMiddleware(model, options = {}) {
  const queryBuilder = options.advanced
    ? new AdvancedQueryBuilder(model, options)
    : new QueryBuilder(model, options);

  return (req, res, next) => {
    try {
      // Build query from request parameters
      const queryResult = options.advanced
        ? queryBuilder.buildAdvancedQuery(req.query)
        : queryBuilder.buildQuery(req.query);

      // Attach to request for use in route handler
      req.queryBuilder = queryResult;
      req.filters = queryResult.filters;
      req.sort = queryResult.sort;

      next();
    } catch (error) {
      next(new Error(`Invalid query parameters: ${error.message}`));
    }
  };
}

/**
 * Example Route Implementations
 */

// Basic filtering example
const userFilterOptions = {
  allowedFields: ['name', 'email', 'role', 'isActive', 'createdAt'],
  searchFields: ['name', 'email'],
  defaultSort: { createdAt: -1 }
};

async function getUsers(req, res, next) {
  try {
    // Query is already built by middleware
    const users = await req.queryBuilder.query
      .select('-password') // Exclude sensitive fields
      .populate('profile', 'avatar bio')
      .exec();

    res.apiSuccess(users);
  } catch (error) {
    next(error);
  }
}

// Advanced filtering example
const productFilterOptions = {
  allowedFields: ['name', 'category', 'price', 'inStock', 'tags', 'rating', 'createdAt'],
  searchFields: ['name', 'description', 'tags'],
  relationFields: {
    category: { foreignKey: 'categoryId' },
    vendor: { foreignKey: 'vendorId' }
  },
  advanced: true
};

async function getProducts(req, res, next) {
  try {
    // Advanced query with aggregation if needed
    let products;

    if (req.queryBuilder.aggregation) {
      products = await req.queryBuilder.query.exec();
    } else {
      products = await req.queryBuilder.query
        .populate('category', 'name slug')
        .populate('vendor', 'name')
        .exec();
    }

    res.apiSuccess(products, {
      appliedFilters: req.filters,
      sortOrder: req.sort
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Example Filter URLs and Results
 */

const filterExamples = {
  basicFiltering: {
    url: "/api/users?role=admin&isActive=true&sort=name",
    description: "Get active admin users sorted by name",
    filters: { role: "admin", isActive: true },
    sort: { name: 1 }
  },

  rangeFiltering: {
    url: "/api/products?price_gte=10&price_lte=100&category=electronics",
    description: "Get electronics products priced between $10-100",
    filters: {
      price: { $gte: 10, $lte: 100 },
      category: "electronics"
    }
  },

  searchFiltering: {
    url: "/api/products?search=laptop&category_in=electronics,computers",
    description: "Search for laptops in electronics or computers categories",
    filters: {
      $text: { $search: "laptop" },
      category: { $in: ["electronics", "computers"] }
    }
  },

  dateRangeFiltering: {
    url: "/api/orders?createdAt_after=2024-01-01&createdAt_before=2024-12-31",
    description: "Get orders from 2024",
    filters: {
      createdAt: {
        $gte: "2024-01-01T00:00:00.000Z",
        $lte: "2024-12-31T23:59:59.999Z"
      }
    }
  },

  geospatialFiltering: {
    url: "/api/stores?location_near=40.7128,-74.0060&location_max_distance=5000",
    description: "Find stores within 5km of NYC coordinates",
    filters: {
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [-74.0060, 40.7128] },
          $maxDistance: 5000
        }
      }
    }
  },

  relationshipFiltering: {
    url: "/api/posts?author_id=123&has_comments=true&tags_in=tech,programming",
    description: "Get posts by author 123 that have comments and tech/programming tags",
    filters: {
      authorId: "123",
      commentsCount: { $gt: 0 },
      tags: { $in: ["tech", "programming"] }
    }
  }
};

/**
 * Query Validation Helpers
 */
function validateQueryParams(allowedFields, queryParams) {
  const errors = [];
  const unknownFields = [];

  for (const key of Object.keys(queryParams)) {
    // Extract base field name (remove operators)
    const baseField = key.replace(/_(?:eq|ne|gt|gte|lt|lte|in|nin|like|ilike|exists|regex)$/, '');

    if (!['page', 'limit', 'sort', 'order', 'search'].includes(baseField) &&
        !allowedFields.includes(baseField)) {
      unknownFields.push(key);
    }
  }

  if (unknownFields.length > 0) {
    errors.push({
      type: 'unknown_fields',
      fields: unknownFields,
      message: `Unknown filter fields: ${unknownFields.join(', ')}`
    });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Performance Monitoring
 */
function addQueryMetrics(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    // Log slow queries for optimization
    if (duration > 1000) {
      console.warn('Slow query detected:', {
        url: req.url,
        filters: req.filters,
        duration: `${duration}ms`
      });
    }
  });

  next();
}

module.exports = {
  QueryBuilder,
  AdvancedQueryBuilder,
  filterMiddleware,
  validateQueryParams,
  addQueryMetrics,

  // Example handlers
  getUsers,
  getProducts,

  // Configuration examples
  userFilterOptions,
  productFilterOptions,

  // Examples
  filterExamples
};

/**
 * Key Benefits of This Pattern:
 *
 * 1. Flexibility: Supports simple to complex filtering scenarios
 * 2. Type Safety: Automatic type coercion and validation
 * 3. Security: Field allowlisting and injection prevention
 * 4. Performance: Efficient query building with proper indexing
 * 5. User Experience: Intuitive URL-based query interface
 *
 * Usage Tips:
 * - Always define allowedFields to prevent unauthorized data access
 * - Use appropriate database indexes for filtered fields
 * - Implement caching for expensive filter combinations
 * - Monitor query performance and optimize slow filters
 * - Provide clear API documentation for available filters
 * - Consider rate limiting for complex search queries
 */