/**
 * GraphQL API Implementation Patterns
 *
 * Comprehensive GraphQL server implementation with advanced patterns:
 * - Schema design and type definitions
 * - Resolvers with data fetching optimization
 * - Query complexity analysis and rate limiting
 * - Real-time subscriptions with WebSocket
 * - Error handling and validation
 * - Authentication and authorization
 * - Caching strategies (query-level and field-level)
 * - DataLoader pattern for N+1 problem resolution
 * - Federation and schema stitching patterns
 */

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  execute,
  subscribe
} = require('graphql'); // Assuming graphql is available

const { PubSub } = require('graphql-subscriptions'); // Assuming available
const DataLoader = require('dataloader'); // Assuming available

/**
 * GraphQL Server Implementation
 */
class GraphQLServer {
  constructor(options = {}) {
    this.options = options;
    this.pubsub = new PubSub();
    this.middlewares = [];
    this.validators = [];
    this.cache = new Map();
    this.rateLimiter = new GraphQLRateLimiter(options.rateLimit);
    this.complexityAnalyzer = new GraphQLComplexityAnalyzer(options.complexity);
  }

  /**
   * Add middleware
   */
  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  /**
   * Add validator
   */
  addValidator(validator) {
    this.validators.push(validator);
    return this;
  }

  /**
   * Execute GraphQL query
   */
  async executeQuery(query, variables = {}, context = {}) {
    // Add server context
    const extendedContext = {
      ...context,
      pubsub: this.pubsub,
      cache: this.cache,
      dataloaders: this.createDataLoaders(context),
      user: context.user || null
    };

    // Apply middleware
    for (const middleware of this.middlewares) {
      await middleware(query, variables, extendedContext);
    }

    // Validate query
    for (const validator of this.validators) {
      await validator(query, variables, extendedContext);
    }

    // Rate limiting
    await this.rateLimiter.checkLimit(extendedContext);

    // Complexity analysis
    const complexity = this.complexityAnalyzer.analyze(query);
    if (complexity > this.complexityAnalyzer.maxComplexity) {
      throw new Error(`Query complexity ${complexity} exceeds maximum ${this.complexityAnalyzer.maxComplexity}`);
    }

    // Execute query
    return await execute({
      schema: this.schema,
      document: query,
      variableValues: variables,
      contextValue: extendedContext
    });
  }

  /**
   * Create DataLoaders for batch loading
   */
  createDataLoaders(context) {
    return {
      userLoader: new DataLoader(async (userIds) => {
        // Batch load users
        const users = await this.batchLoadUsers(userIds, context);
        return userIds.map(id => users.find(user => user.id === id));
      }),

      postLoader: new DataLoader(async (postIds) => {
        // Batch load posts
        const posts = await this.batchLoadPosts(postIds, context);
        return postIds.map(id => posts.find(post => post.id === id));
      }),

      commentsByPostLoader: new DataLoader(async (postIds) => {
        // Batch load comments by post
        const allComments = await this.batchLoadCommentsByPosts(postIds, context);
        return postIds.map(postId =>
          allComments.filter(comment => comment.postId === postId)
        );
      })
    };
  }

  // Mock data loading methods (replace with real data sources)
  async batchLoadUsers(userIds, context) {
    console.log('Batch loading users:', userIds);
    // Simulate database query
    return userIds.map(id => ({
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
      createdAt: new Date()
    }));
  }

  async batchLoadPosts(postIds, context) {
    console.log('Batch loading posts:', postIds);
    return postIds.map(id => ({
      id,
      title: `Post ${id}`,
      content: `Content for post ${id}`,
      authorId: `user-${id}`,
      createdAt: new Date()
    }));
  }

  async batchLoadCommentsByPosts(postIds, context) {
    console.log('Batch loading comments for posts:', postIds);
    const allComments = [];
    postIds.forEach(postId => {
      for (let i = 1; i <= 3; i++) {
        allComments.push({
          id: `comment-${postId}-${i}`,
          content: `Comment ${i} on post ${postId}`,
          postId,
          authorId: `user-${i}`,
          createdAt: new Date()
        });
      }
    });
    return allComments;
  }
}

/**
 * GraphQL Rate Limiter
 */
class GraphQLRateLimiter {
  constructor(options = {}) {
    this.maxRequests = options.maxRequests || 100;
    this.windowMs = options.windowMs || 60000; // 1 minute
    this.requests = new Map(); // user -> requests[]
  }

  async checkLimit(context) {
    if (!context.user) {
      return; // Skip rate limiting for unauthenticated users
    }

    const userId = context.user.id;
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];

    // Remove old requests outside the window
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );

    if (validRequests.length >= this.maxRequests) {
      throw new Error('Rate limit exceeded');
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(userId, validRequests);
  }
}

/**
 * GraphQL Query Complexity Analyzer
 */
class GraphQLComplexityAnalyzer {
  constructor(options = {}) {
    this.maxComplexity = options.maxComplexity || 1000;
    this.scalarCost = options.scalarCost || 1;
    this.objectCost = options.objectCost || 2;
    this.listMultiplier = options.listMultiplier || 10;
  }

  analyze(query) {
    // Simplified complexity analysis
    // In real implementation, parse AST and calculate based on query structure
    const queryString = query.toString();

    let complexity = 0;

    // Count fields (simplified)
    const fieldMatches = queryString.match(/\w+(?=\s*[{(])/g) || [];
    complexity += fieldMatches.length * this.objectCost;

    // Add cost for nested queries
    const braceDepth = (queryString.match(/{/g) || []).length;
    complexity += braceDepth * this.objectCost;

    // Add cost for lists
    const listMatches = queryString.match(/\[\w+\]/g) || [];
    complexity += listMatches.length * this.listMultiplier;

    return complexity;
  }
}

/**
 * GraphQL Schema Builder
 */
class GraphQLSchemaBuilder {
  constructor() {
    this.types = new Map();
    this.interfaces = new Map();
    this.unions = new Map();
    this.enums = new Map();
    this.inputs = new Map();
  }

  /**
   * Build complete schema with types, queries, mutations, and subscriptions
   */
  buildSchema() {
    // Define enums
    const UserRole = new GraphQLEnumType({
      name: 'UserRole',
      values: {
        ADMIN: { value: 'admin' },
        MODERATOR: { value: 'moderator' },
        USER: { value: 'user' }
      }
    });

    const PostStatus = new GraphQLEnumType({
      name: 'PostStatus',
      values: {
        DRAFT: { value: 'draft' },
        PUBLISHED: { value: 'published' },
        ARCHIVED: { value: 'archived' }
      }
    });

    // Define interfaces
    const Node = new GraphQLInterfaceType({
      name: 'Node',
      fields: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolveType: (obj) => {
        if (obj.email) return 'User';
        if (obj.title) return 'Post';
        if (obj.content && obj.postId) return 'Comment';
        return null;
      }
    });

    const Timestamped = new GraphQLInterfaceType({
      name: 'Timestamped',
      fields: {
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        updatedAt: { type: GraphQLString }
      }
    });

    // Define types
    const User = new GraphQLObjectType({
      name: 'User',
      interfaces: [Node, Timestamped],
      fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: UserRole },
        posts: {
          type: new GraphQLList(Post),
          args: {
            limit: { type: GraphQLInt, defaultValue: 10 },
            offset: { type: GraphQLInt, defaultValue: 0 },
            status: { type: PostStatus }
          },
          resolve: async (user, args, context) => {
            // Use DataLoader or direct query
            return this.getUserPosts(user.id, args, context);
          }
        },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        updatedAt: { type: GraphQLString }
      })
    });

    const Post = new GraphQLObjectType({
      name: 'Post',
      interfaces: [Node, Timestamped],
      fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLString },
        excerpt: {
          type: GraphQLString,
          args: {
            length: { type: GraphQLInt, defaultValue: 100 }
          },
          resolve: (post, args) => {
            return post.content ? post.content.substring(0, args.length) + '...' : null;
          }
        },
        status: { type: PostStatus },
        author: {
          type: User,
          resolve: async (post, args, context) => {
            return await context.dataloaders.userLoader.load(post.authorId);
          }
        },
        comments: {
          type: new GraphQLList(Comment),
          args: {
            limit: { type: GraphQLInt, defaultValue: 10 },
            offset: { type: GraphQLInt, defaultValue: 0 }
          },
          resolve: async (post, args, context) => {
            const allComments = await context.dataloaders.commentsByPostLoader.load(post.id);
            return allComments.slice(args.offset, args.offset + args.limit);
          }
        },
        commentCount: {
          type: GraphQLInt,
          resolve: async (post, args, context) => {
            const comments = await context.dataloaders.commentsByPostLoader.load(post.id);
            return comments.length;
          }
        },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        updatedAt: { type: GraphQLString }
      })
    });

    const Comment = new GraphQLObjectType({
      name: 'Comment',
      interfaces: [Node, Timestamped],
      fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        author: {
          type: User,
          resolve: async (comment, args, context) => {
            return await context.dataloaders.userLoader.load(comment.authorId);
          }
        },
        post: {
          type: Post,
          resolve: async (comment, args, context) => {
            return await context.dataloaders.postLoader.load(comment.postId);
          }
        },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        updatedAt: { type: GraphQLString }
      })
    });

    // Define input types
    const CreateUserInput = new GraphQLInputObjectType({
      name: 'CreateUserInput',
      fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: UserRole, defaultValue: 'user' }
      }
    });

    const CreatePostInput = new GraphQLInputObjectType({
      name: 'CreatePostInput',
      fields: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLString },
        status: { type: PostStatus, defaultValue: 'draft' }
      }
    });

    const UpdatePostInput = new GraphQLInputObjectType({
      name: 'UpdatePostInput',
      fields: {
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        status: { type: PostStatus }
      }
    });

    // Define connection types for pagination
    const PageInfo = new GraphQLObjectType({
      name: 'PageInfo',
      fields: {
        hasNextPage: { type: new GraphQLNonNull(GraphQLBoolean) },
        hasPreviousPage: { type: new GraphQLNonNull(GraphQLBoolean) },
        startCursor: { type: GraphQLString },
        endCursor: { type: GraphQLString }
      }
    });

    const PostEdge = new GraphQLObjectType({
      name: 'PostEdge',
      fields: {
        node: { type: Post },
        cursor: { type: new GraphQLNonNull(GraphQLString) }
      }
    });

    const PostConnection = new GraphQLObjectType({
      name: 'PostConnection',
      fields: {
        edges: { type: new GraphQLList(PostEdge) },
        pageInfo: { type: new GraphQLNonNull(PageInfo) },
        totalCount: { type: GraphQLInt }
      }
    });

    // Define root query type
    const Query = new GraphQLObjectType({
      name: 'Query',
      fields: {
        // Single item queries
        user: {
          type: User,
          args: {
            id: { type: new GraphQLNonNull(GraphQLID) }
          },
          resolve: async (root, args, context) => {
            return await context.dataloaders.userLoader.load(args.id);
          }
        },

        post: {
          type: Post,
          args: {
            id: { type: new GraphQLNonNull(GraphQLID) }
          },
          resolve: async (root, args, context) => {
            return await context.dataloaders.postLoader.load(args.id);
          }
        },

        // List queries with pagination
        posts: {
          type: PostConnection,
          args: {
            first: { type: GraphQLInt },
            after: { type: GraphQLString },
            last: { type: GraphQLInt },
            before: { type: GraphQLString },
            status: { type: PostStatus },
            authorId: { type: GraphQLID }
          },
          resolve: async (root, args, context) => {
            return await this.getPostsConnection(args, context);
          }
        },

        users: {
          type: new GraphQLList(User),
          args: {
            limit: { type: GraphQLInt, defaultValue: 10 },
            offset: { type: GraphQLInt, defaultValue: 0 },
            role: { type: UserRole }
          },
          resolve: async (root, args, context) => {
            return await this.getUsers(args, context);
          }
        },

        // Search queries
        search: {
          type: new GraphQLList(new GraphQLUnionType({
            name: 'SearchResult',
            types: [User, Post, Comment],
            resolveType: (obj) => {
              if (obj.email) return 'User';
              if (obj.title) return 'Post';
              if (obj.content && obj.postId) return 'Comment';
              return null;
            }
          })),
          args: {
            query: { type: new GraphQLNonNull(GraphQLString) },
            limit: { type: GraphQLInt, defaultValue: 10 }
          },
          resolve: async (root, args, context) => {
            return await this.search(args.query, args.limit, context);
          }
        }
      }
    });

    // Define root mutation type
    const Mutation = new GraphQLObjectType({
      name: 'Mutation',
      fields: {
        createUser: {
          type: User,
          args: {
            input: { type: new GraphQLNonNull(CreateUserInput) }
          },
          resolve: async (root, args, context) => {
            // Check authentication and authorization
            this.requireAuth(context);
            return await this.createUser(args.input, context);
          }
        },

        createPost: {
          type: Post,
          args: {
            input: { type: new GraphQLNonNull(CreatePostInput) }
          },
          resolve: async (root, args, context) => {
            this.requireAuth(context);
            const post = await this.createPost(args.input, context);

            // Publish subscription event
            context.pubsub.publish('POST_CREATED', { postCreated: post });

            return post;
          }
        },

        updatePost: {
          type: Post,
          args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(UpdatePostInput) }
          },
          resolve: async (root, args, context) => {
            this.requireAuth(context);

            // Check if user can update this post
            const existingPost = await context.dataloaders.postLoader.load(args.id);
            if (!existingPost) {
              throw new Error('Post not found');
            }

            if (existingPost.authorId !== context.user.id && context.user.role !== 'admin') {
              throw new Error('Not authorized to update this post');
            }

            const updatedPost = await this.updatePost(args.id, args.input, context);

            // Publish subscription event
            context.pubsub.publish('POST_UPDATED', { postUpdated: updatedPost });

            return updatedPost;
          }
        },

        deletePost: {
          type: GraphQLBoolean,
          args: {
            id: { type: new GraphQLNonNull(GraphQLID) }
          },
          resolve: async (root, args, context) => {
            this.requireAuth(context);

            const existingPost = await context.dataloaders.postLoader.load(args.id);
            if (!existingPost) {
              throw new Error('Post not found');
            }

            if (existingPost.authorId !== context.user.id && context.user.role !== 'admin') {
              throw new Error('Not authorized to delete this post');
            }

            const success = await this.deletePost(args.id, context);

            if (success) {
              context.pubsub.publish('POST_DELETED', { postDeleted: { id: args.id } });
            }

            return success;
          }
        }
      }
    });

    // Define subscription type
    const Subscription = new GraphQLObjectType({
      name: 'Subscription',
      fields: {
        postCreated: {
          type: Post,
          resolve: (payload) => payload.postCreated,
          subscribe: (root, args, context) => {
            return context.pubsub.asyncIterator(['POST_CREATED']);
          }
        },

        postUpdated: {
          type: Post,
          resolve: (payload) => payload.postUpdated,
          subscribe: (root, args, context) => {
            return context.pubsub.asyncIterator(['POST_UPDATED']);
          }
        },

        postDeleted: {
          type: new GraphQLObjectType({
            name: 'PostDeleted',
            fields: {
              id: { type: new GraphQLNonNull(GraphQLID) }
            }
          }),
          resolve: (payload) => payload.postDeleted,
          subscribe: (root, args, context) => {
            return context.pubsub.asyncIterator(['POST_DELETED']);
          }
        },

        userActivity: {
          type: new GraphQLObjectType({
            name: 'UserActivity',
            fields: {
              userId: { type: new GraphQLNonNull(GraphQLID) },
              activity: { type: new GraphQLNonNull(GraphQLString) },
              timestamp: { type: new GraphQLNonNull(GraphQLString) }
            }
          }),
          args: {
            userId: { type: GraphQLID }
          },
          resolve: (payload, args) => {
            // Filter by userId if specified
            if (args.userId && payload.userActivity.userId !== args.userId) {
              return null;
            }
            return payload.userActivity;
          },
          subscribe: (root, args, context) => {
            return context.pubsub.asyncIterator(['USER_ACTIVITY']);
          }
        }
      }
    });

    return new GraphQLSchema({
      query: Query,
      mutation: Mutation,
      subscription: Subscription,
      types: [User, Post, Comment] // Ensure all types are included
    });
  }

  // Helper methods (would be implemented with real data sources)
  async getUserPosts(userId, args, context) {
    // Mock implementation
    const posts = [];
    for (let i = 1; i <= args.limit; i++) {
      posts.push({
        id: `post-${userId}-${i}`,
        title: `Post ${i} by user ${userId}`,
        content: `Content for post ${i}`,
        authorId: userId,
        status: args.status || 'published',
        createdAt: new Date().toISOString()
      });
    }
    return posts;
  }

  async getPostsConnection(args, context) {
    // Mock implementation of cursor-based pagination
    const limit = args.first || args.last || 10;
    const posts = [];

    for (let i = 1; i <= limit; i++) {
      posts.push({
        id: `post-${i}`,
        title: `Post ${i}`,
        content: `Content for post ${i}`,
        authorId: `user-${i}`,
        status: 'published',
        createdAt: new Date().toISOString()
      });
    }

    const edges = posts.map((post, index) => ({
      node: post,
      cursor: Buffer.from(`post:${post.id}`).toString('base64')
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage: false, // Simplified
        hasPreviousPage: false,
        startCursor: edges[0]?.cursor,
        endCursor: edges[edges.length - 1]?.cursor
      },
      totalCount: posts.length
    };
  }

  async getUsers(args, context) {
    // Mock implementation
    const users = [];
    for (let i = args.offset + 1; i <= args.offset + args.limit; i++) {
      users.push({
        id: `user-${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        role: args.role || 'user',
        createdAt: new Date().toISOString()
      });
    }
    return users;
  }

  async search(query, limit, context) {
    // Mock search implementation
    const results = [];

    // Add some users
    results.push({
      id: 'user-search-1',
      name: `User matching ${query}`,
      email: 'search@example.com',
      role: 'user',
      createdAt: new Date().toISOString()
    });

    // Add some posts
    results.push({
      id: 'post-search-1',
      title: `Post about ${query}`,
      content: `Content about ${query}`,
      authorId: 'user-search-1',
      status: 'published',
      createdAt: new Date().toISOString()
    });

    return results.slice(0, limit);
  }

  async createUser(input, context) {
    const user = {
      id: `user-${Date.now()}`,
      ...input,
      createdAt: new Date().toISOString()
    };

    // Publish activity
    context.pubsub.publish('USER_ACTIVITY', {
      userActivity: {
        userId: user.id,
        activity: 'USER_CREATED',
        timestamp: new Date().toISOString()
      }
    });

    return user;
  }

  async createPost(input, context) {
    const post = {
      id: `post-${Date.now()}`,
      ...input,
      authorId: context.user.id,
      createdAt: new Date().toISOString()
    };

    return post;
  }

  async updatePost(id, input, context) {
    const post = {
      id,
      ...input,
      updatedAt: new Date().toISOString()
    };

    return post;
  }

  async deletePost(id, context) {
    // Mock deletion
    return true;
  }

  requireAuth(context) {
    if (!context.user) {
      throw new Error('Authentication required');
    }
  }
}

/**
 * GraphQL Caching Middleware
 */
class GraphQLCacheMiddleware {
  constructor(cache, options = {}) {
    this.cache = cache;
    this.ttl = options.ttl || 300; // 5 minutes
    this.cacheableOperations = options.cacheableOperations || ['query'];
  }

  async middleware(query, variables, context) {
    const operationType = this.getOperationType(query);

    if (!this.cacheableOperations.includes(operationType)) {
      return; // Skip caching for mutations/subscriptions
    }

    // Generate cache key
    const cacheKey = this.generateCacheKey(query, variables, context);

    // Check cache
    const cachedResult = await this.cache.get(cacheKey);
    if (cachedResult) {
      context.cacheHit = true;
      return cachedResult;
    }

    // Store result after execution (would need to be integrated differently)
    context.cacheKey = cacheKey;
  }

  generateCacheKey(query, variables, context) {
    const keyParts = [
      query.toString(),
      JSON.stringify(variables),
      context.user?.id || 'anonymous'
    ];

    const crypto = require('crypto');
    return crypto.createHash('sha256').update(keyParts.join('|')).digest('hex');
  }

  getOperationType(query) {
    // Simplified operation type detection
    const queryString = query.toString();
    if (queryString.includes('mutation')) return 'mutation';
    if (queryString.includes('subscription')) return 'subscription';
    return 'query';
  }
}

/**
 * GraphQL Authentication Middleware
 */
class GraphQLAuthMiddleware {
  constructor(options = {}) {
    this.secretKey = options.secretKey || 'your-secret-key';
    this.publicOperations = options.publicOperations || [];
  }

  async middleware(query, variables, context) {
    const operationType = this.getOperationType(query);
    const operationName = this.getOperationName(query);

    // Check if operation requires authentication
    if (this.publicOperations.includes(operationName)) {
      return; // Public operation, no auth needed
    }

    // Extract token from context
    const token = context.authToken || context.req?.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new Error('Authentication token required');
    }

    try {
      // Verify JWT token (simplified)
      const user = await this.verifyToken(token);
      context.user = user;
    } catch (error) {
      throw new Error('Invalid authentication token');
    }
  }

  async verifyToken(token) {
    // Mock JWT verification
    // In real implementation, use proper JWT library
    if (token === 'valid-token') {
      return {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      };
    }

    throw new Error('Invalid token');
  }

  getOperationType(query) {
    const queryString = query.toString();
    if (queryString.includes('mutation')) return 'mutation';
    if (queryString.includes('subscription')) return 'subscription';
    return 'query';
  }

  getOperationName(query) {
    // Extract operation name from query
    const match = query.toString().match(/(?:query|mutation|subscription)\s+(\w+)/);
    return match ? match[1] : null;
  }
}

/**
 * Example Usage Demonstrations
 */

// Example 1: Basic GraphQL Server Setup
async function exampleBasicGraphQLServer() {
  console.log('=== Basic GraphQL Server Example ===');

  const schemaBuilder = new GraphQLSchemaBuilder();
  const server = new GraphQLServer();

  server.schema = schemaBuilder.buildSchema();

  // Add middleware
  const authMiddleware = new GraphQLAuthMiddleware({
    publicOperations: ['GetPosts', 'GetPost']
  });

  const cacheMiddleware = new GraphQLCacheMiddleware(new Map(), {
    ttl: 300,
    cacheableOperations: ['query']
  });

  server.use(authMiddleware.middleware.bind(authMiddleware));
  server.use(cacheMiddleware.middleware.bind(cacheMiddleware));

  // Example query
  const query = `
    query GetPosts {
      posts(first: 5) {
        edges {
          node {
            id
            title
            author {
              name
              email
            }
            commentCount
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  try {
    const result = await server.executeQuery(query, {}, {});
    console.log('Query result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Query error:', error.message);
  }
}

// Example 2: GraphQL Mutations with Authorization
async function exampleGraphQLMutations() {
  console.log('=== GraphQL Mutations Example ===');

  const schemaBuilder = new GraphQLSchemaBuilder();
  const server = new GraphQLServer();

  server.schema = schemaBuilder.buildSchema();

  // Mutation with authentication
  const mutation = `
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        id
        title
        content
        status
        author {
          name
        }
        createdAt
      }
    }
  `;

  const variables = {
    input: {
      title: "My New Post",
      content: "This is the content of my new post",
      status: "published"
    }
  };

  const context = {
    user: {
      id: 'user-1',
      name: 'John Doe',
      role: 'user'
    }
  };

  try {
    const result = await server.executeQuery(mutation, variables, context);
    console.log('Mutation result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Mutation error:', error.message);
  }
}

// Example 3: GraphQL Subscriptions
async function exampleGraphQLSubscriptions() {
  console.log('=== GraphQL Subscriptions Example ===');

  const schemaBuilder = new GraphQLSchemaBuilder();
  const server = new GraphQLServer();

  server.schema = schemaBuilder.buildSchema();

  // Subscription query
  const subscription = `
    subscription PostUpdates {
      postCreated {
        id
        title
        author {
          name
        }
      }
    }
  `;

  try {
    // In real implementation, this would establish WebSocket connection
    const asyncIterator = await subscribe({
      schema: server.schema,
      document: subscription,
      contextValue: { pubsub: server.pubsub }
    });

    console.log('Subscription established');

    // Simulate creating a post to trigger subscription
    setTimeout(() => {
      server.pubsub.publish('POST_CREATED', {
        postCreated: {
          id: 'new-post-1',
          title: 'New Post via Subscription',
          author: { name: 'Jane Doe' }
        }
      });
    }, 1000);

  } catch (error) {
    console.error('Subscription error:', error.message);
  }
}

// Example 4: Complex Query with DataLoader
async function exampleComplexQuery() {
  console.log('=== Complex Query with DataLoader Example ===');

  const schemaBuilder = new GraphQLSchemaBuilder();
  const server = new GraphQLServer();

  server.schema = schemaBuilder.buildSchema();

  // Complex nested query
  const query = `
    query ComplexQuery {
      posts(first: 3) {
        edges {
          node {
            id
            title
            excerpt(length: 50)
            author {
              id
              name
              posts(limit: 2) {
                id
                title
              }
            }
            comments(limit: 2) {
              id
              content
              author {
                name
              }
            }
          }
        }
      }
    }
  `;

  try {
    const result = await server.executeQuery(query, {}, {});
    console.log('Complex query result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Complex query error:', error.message);
  }
}

module.exports = {
  GraphQLServer,
  GraphQLSchemaBuilder,
  GraphQLRateLimiter,
  GraphQLComplexityAnalyzer,
  GraphQLCacheMiddleware,
  GraphQLAuthMiddleware,
  exampleBasicGraphQLServer,
  exampleGraphQLMutations,
  exampleGraphQLSubscriptions,
  exampleComplexQuery
};