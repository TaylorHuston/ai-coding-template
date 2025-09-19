/**
 * AI/ML Integration Patterns
 *
 * Comprehensive implementation of AI/ML integration into applications:
 * - LLM integration with prompt engineering
 * - Model inference and caching strategies
 * - Vector embeddings and similarity search
 * - AI-powered content generation and summarization
 * - Machine learning pipeline orchestration
 * - Model versioning and A/B testing
 * - AI safety and content moderation
 * - Intelligent data processing and analysis
 * - Real-time AI decision making
 * - MLOps patterns and model monitoring
 */

const EventEmitter = require('events');
const crypto = require('crypto');

/**
 * Large Language Model (LLM) Client
 */
class LLMClient {
  constructor(options = {}) {
    this.provider = options.provider || 'openai';
    this.model = options.model || 'gpt-3.5-turbo';
    this.apiKey = options.apiKey;
    this.baseURL = options.baseURL;
    this.timeout = options.timeout || 30000;
    this.maxRetries = options.maxRetries || 3;
    this.rateLimiter = new RateLimiter(options.rateLimit);
    this.cache = new Map();
    this.cacheTTL = options.cacheTTL || 3600000; // 1 hour
    this.usage = {
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
      requests: 0
    };
  }

  /**
   * Generate text completion
   */
  async generateCompletion(prompt, options = {}) {
    const requestConfig = {
      model: options.model || this.model,
      messages: this.formatMessages(prompt, options),
      temperature: options.temperature || 0.7,
      maxTokens: options.maxTokens || 1000,
      topP: options.topP || 1.0,
      frequencyPenalty: options.frequencyPenalty || 0,
      presencePenalty: options.presencePenalty || 0,
      stop: options.stop,
      stream: options.stream || false
    };

    // Check cache
    const cacheKey = this.generateCacheKey(requestConfig);
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // Rate limiting
    await this.rateLimiter.checkLimit();

    try {
      const response = await this.makeRequest(requestConfig);
      const result = this.processResponse(response);

      // Cache result
      this.saveToCache(cacheKey, result);

      // Update usage statistics
      this.updateUsage(response.usage);

      return result;
    } catch (error) {
      throw new LLMError(`LLM request failed: ${error.message}`, error);
    }
  }

  /**
   * Generate text embeddings
   */
  async generateEmbeddings(texts, options = {}) {
    if (!Array.isArray(texts)) {
      texts = [texts];
    }

    const requestConfig = {
      model: options.embeddingModel || 'text-embedding-ada-002',
      input: texts
    };

    const cacheKey = this.generateCacheKey(requestConfig);
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    await this.rateLimiter.checkLimit();

    try {
      const response = await this.makeEmbeddingRequest(requestConfig);
      const embeddings = response.data.map(item => item.embedding);

      this.saveToCache(cacheKey, embeddings);
      this.updateUsage(response.usage);

      return embeddings;
    } catch (error) {
      throw new LLMError(`Embedding request failed: ${error.message}`, error);
    }
  }

  /**
   * Stream completion
   */
  async *streamCompletion(prompt, options = {}) {
    const requestConfig = {
      ...options,
      stream: true,
      messages: this.formatMessages(prompt, options)
    };

    await this.rateLimiter.checkLimit();

    try {
      const stream = await this.makeStreamRequest(requestConfig);

      for await (const chunk of stream) {
        if (chunk.choices?.[0]?.delta?.content) {
          yield {
            content: chunk.choices[0].delta.content,
            finished: false
          };
        }

        if (chunk.choices?.[0]?.finish_reason) {
          yield {
            content: '',
            finished: true,
            finishReason: chunk.choices[0].finish_reason
          };
        }
      }
    } catch (error) {
      throw new LLMError(`Stream request failed: ${error.message}`, error);
    }
  }

  /**
   * Format messages for API
   */
  formatMessages(prompt, options) {
    if (typeof prompt === 'string') {
      return [
        { role: 'system', content: options.systemPrompt || 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ];
    }

    if (Array.isArray(prompt)) {
      return prompt;
    }

    throw new Error('Prompt must be string or array of messages');
  }

  /**
   * Make HTTP request to LLM API
   */
  async makeRequest(config) {
    // Mock implementation - replace with actual HTTP client
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    return {
      choices: [{
        message: {
          role: 'assistant',
          content: 'This is a mock response from the LLM.'
        },
        finish_reason: 'stop'
      }],
      usage: {
        prompt_tokens: 50,
        completion_tokens: 20,
        total_tokens: 70
      }
    };
  }

  /**
   * Make embedding request
   */
  async makeEmbeddingRequest(config) {
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));

    return {
      data: config.input.map(text => ({
        embedding: Array.from({ length: 1536 }, () => Math.random() - 0.5)
      })),
      usage: {
        prompt_tokens: config.input.join(' ').length / 4,
        total_tokens: config.input.join(' ').length / 4
      }
    };
  }

  /**
   * Make streaming request
   */
  async *makeStreamRequest(config) {
    const words = 'This is a mock streaming response from the LLM API.'.split(' ');

    for (const word of words) {
      await new Promise(resolve => setTimeout(resolve, 100));
      yield {
        choices: [{
          delta: { content: word + ' ' }
        }]
      };
    }

    yield {
      choices: [{
        finish_reason: 'stop'
      }]
    };
  }

  /**
   * Process API response
   */
  processResponse(response) {
    return {
      content: response.choices[0].message.content,
      role: response.choices[0].message.role,
      finishReason: response.choices[0].finish_reason,
      usage: response.usage
    };
  }

  /**
   * Generate cache key
   */
  generateCacheKey(config) {
    const hash = crypto.createHash('md5');
    hash.update(JSON.stringify(config));
    return hash.digest('hex');
  }

  /**
   * Get from cache
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }
    return null;
  }

  /**
   * Save to cache
   */
  saveToCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Update usage statistics
   */
  updateUsage(usage) {
    this.usage.totalTokens += usage.total_tokens || 0;
    this.usage.promptTokens += usage.prompt_tokens || 0;
    this.usage.completionTokens += usage.completion_tokens || 0;
    this.usage.requests += 1;
  }

  /**
   * Get usage statistics
   */
  getUsage() {
    return { ...this.usage };
  }
}

/**
 * Rate Limiter for API calls
 */
class RateLimiter {
  constructor(options = {}) {
    this.requestsPerMinute = options.requestsPerMinute || 60;
    this.tokensPerMinute = options.tokensPerMinute || 100000;
    this.requests = [];
    this.tokens = [];
  }

  async checkLimit() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Clean old entries
    this.requests = this.requests.filter(time => time > oneMinuteAgo);
    this.tokens = this.tokens.filter(entry => entry.time > oneMinuteAgo);

    // Check request limit
    if (this.requests.length >= this.requestsPerMinute) {
      const waitTime = this.requests[0] + 60000 - now;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.checkLimit();
    }

    this.requests.push(now);
  }

  recordTokenUsage(tokenCount) {
    this.tokens.push({
      time: Date.now(),
      count: tokenCount
    });
  }
}

/**
 * Vector Database for embeddings
 */
class VectorDatabase {
  constructor(options = {}) {
    this.dimensions = options.dimensions || 1536;
    this.vectors = new Map();
    this.metadata = new Map();
    this.index = null; // In real implementation, use proper vector index
  }

  /**
   * Store vector with metadata
   */
  async store(id, vector, metadata = {}) {
    if (vector.length !== this.dimensions) {
      throw new Error(`Vector dimension mismatch: expected ${this.dimensions}, got ${vector.length}`);
    }

    this.vectors.set(id, vector);
    this.metadata.set(id, {
      ...metadata,
      id,
      timestamp: new Date().toISOString()
    });

    // Update index
    await this.updateIndex(id, vector);

    return id;
  }

  /**
   * Search for similar vectors
   */
  async search(queryVector, options = {}) {
    const k = options.k || 10;
    const threshold = options.threshold || 0.7;
    const filter = options.filter;

    const results = [];

    for (const [id, vector] of this.vectors.entries()) {
      const metadata = this.metadata.get(id);

      // Apply filters
      if (filter && !this.matchesFilter(metadata, filter)) {
        continue;
      }

      const similarity = this.cosineSimilarity(queryVector, vector);

      if (similarity >= threshold) {
        results.push({
          id,
          similarity,
          metadata,
          vector: options.includeVectors ? vector : undefined
        });
      }
    }

    // Sort by similarity and return top k
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, k);
  }

  /**
   * Calculate cosine similarity
   */
  cosineSimilarity(vectorA, vectorB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Check if metadata matches filter
   */
  matchesFilter(metadata, filter) {
    for (const [key, value] of Object.entries(filter)) {
      if (metadata[key] !== value) {
        return false;
      }
    }
    return true;
  }

  /**
   * Update search index
   */
  async updateIndex(id, vector) {
    // In real implementation, update proper vector index (FAISS, etc.)
  }

  /**
   * Delete vector
   */
  async delete(id) {
    this.vectors.delete(id);
    this.metadata.delete(id);
    return true;
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalVectors: this.vectors.size,
      dimensions: this.dimensions,
      memoryUsage: this.vectors.size * this.dimensions * 8 // 8 bytes per float64
    };
  }
}

/**
 * AI Content Moderator
 */
class ContentModerator {
  constructor(llmClient, options = {}) {
    this.llmClient = llmClient;
    this.toxicityThreshold = options.toxicityThreshold || 0.7;
    this.categories = options.categories || [
      'hate', 'harassment', 'violence', 'sexual', 'spam', 'misinformation'
    ];
    this.customRules = options.customRules || [];
  }

  /**
   * Moderate content
   */
  async moderateContent(content, options = {}) {
    const results = {
      content,
      flagged: false,
      categories: {},
      confidence: 0,
      reasoning: '',
      actions: []
    };

    // Quick keyword checks
    const keywordResults = await this.checkKeywords(content);
    if (keywordResults.flagged) {
      results.flagged = true;
      results.categories = { ...results.categories, ...keywordResults.categories };
    }

    // LLM-based moderation
    const llmResults = await this.llmModeration(content);
    if (llmResults.flagged) {
      results.flagged = true;
      results.categories = { ...results.categories, ...llmResults.categories };
      results.confidence = Math.max(results.confidence, llmResults.confidence);
      results.reasoning = llmResults.reasoning;
    }

    // Custom rule checks
    const customResults = await this.checkCustomRules(content);
    if (customResults.flagged) {
      results.flagged = true;
      results.actions.push(...customResults.actions);
    }

    // Determine actions
    if (results.flagged) {
      results.actions.push(...this.determineActions(results));
    }

    return results;
  }

  /**
   * Check for problematic keywords
   */
  async checkKeywords(content) {
    const keywords = {
      hate: ['hate', 'racist', 'sexist'],
      violence: ['kill', 'murder', 'violence'],
      spam: ['click here', 'limited time', 'act now']
    };

    const results = {
      flagged: false,
      categories: {}
    };

    const lowerContent = content.toLowerCase();

    for (const [category, words] of Object.entries(keywords)) {
      const matches = words.filter(word => lowerContent.includes(word));
      if (matches.length > 0) {
        results.flagged = true;
        results.categories[category] = {
          confidence: 0.8,
          matches
        };
      }
    }

    return results;
  }

  /**
   * LLM-based content moderation
   */
  async llmModeration(content) {
    const prompt = `
Analyze the following content for potentially harmful or inappropriate material.

Categories to check:
- Hate speech or discrimination
- Harassment or bullying
- Violence or threats
- Sexual content
- Spam or misleading information
- Misinformation

Content: "${content}"

Respond with a JSON object containing:
{
  "flagged": boolean,
  "categories": {
    "category_name": {"confidence": 0.0-1.0, "reason": "explanation"}
  },
  "overall_confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}
`;

    try {
      const response = await this.llmClient.generateCompletion(prompt, {
        temperature: 0.1,
        maxTokens: 500
      });

      // Parse JSON response
      const analysis = JSON.parse(response.content);

      return {
        flagged: analysis.flagged || false,
        categories: analysis.categories || {},
        confidence: analysis.overall_confidence || 0,
        reasoning: analysis.reasoning || ''
      };
    } catch (error) {
      console.warn('LLM moderation failed:', error.message);
      return { flagged: false, categories: {}, confidence: 0, reasoning: '' };
    }
  }

  /**
   * Check custom moderation rules
   */
  async checkCustomRules(content) {
    const results = {
      flagged: false,
      actions: []
    };

    for (const rule of this.customRules) {
      if (rule.condition(content)) {
        results.flagged = true;
        results.actions.push({
          type: rule.action,
          reason: rule.reason,
          severity: rule.severity
        });
      }
    }

    return results;
  }

  /**
   * Determine moderation actions
   */
  determineActions(results) {
    const actions = [];

    if (results.confidence > 0.9) {
      actions.push({ type: 'block', reason: 'High confidence violation' });
    } else if (results.confidence > 0.7) {
      actions.push({ type: 'flag', reason: 'Potential violation' });
    } else if (results.confidence > 0.5) {
      actions.push({ type: 'review', reason: 'Moderate confidence violation' });
    }

    return actions;
  }

  /**
   * Add custom moderation rule
   */
  addCustomRule(rule) {
    this.customRules.push(rule);
  }
}

/**
 * AI-Powered Content Generator
 */
class ContentGenerator {
  constructor(llmClient) {
    this.llmClient = llmClient;
    this.templates = new Map();
    this.cache = new Map();
  }

  /**
   * Register content template
   */
  registerTemplate(name, template) {
    this.templates.set(name, template);
  }

  /**
   * Generate content from template
   */
  async generateFromTemplate(templateName, variables, options = {}) {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }

    const prompt = this.buildPrompt(template, variables);
    const cacheKey = this.generateCacheKey(templateName, variables, options);

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 3600000) {
      return cached.content;
    }

    const response = await this.llmClient.generateCompletion(prompt, {
      temperature: options.temperature || template.temperature || 0.7,
      maxTokens: options.maxTokens || template.maxTokens || 1000,
      ...options
    });

    const content = this.postProcess(response.content, template.postProcess);

    // Cache result
    this.cache.set(cacheKey, {
      content,
      timestamp: Date.now()
    });

    return content;
  }

  /**
   * Generate personalized content
   */
  async generatePersonalized(baseContent, userProfile, options = {}) {
    const prompt = `
Personalize the following content for a user with this profile:

User Profile:
${JSON.stringify(userProfile, null, 2)}

Base Content:
${baseContent}

Instructions:
- Adapt the tone and style to match the user's preferences
- Include relevant examples or references based on their interests
- Adjust complexity level based on their expertise
- Maintain the core message while making it more engaging for this specific user

Personalized Content:
`;

    const response = await this.llmClient.generateCompletion(prompt, {
      temperature: 0.6,
      maxTokens: 1500,
      ...options
    });

    return response.content;
  }

  /**
   * Summarize content
   */
  async summarize(content, options = {}) {
    const length = options.length || 'medium';
    const style = options.style || 'bullet-points';

    const lengthInstructions = {
      short: 'in 1-2 sentences',
      medium: 'in 3-5 sentences',
      long: 'in 1-2 paragraphs'
    };

    const styleInstructions = {
      'bullet-points': 'as bullet points',
      'paragraph': 'as a coherent paragraph',
      'executive': 'as an executive summary'
    };

    const prompt = `
Summarize the following content ${lengthInstructions[length]} ${styleInstructions[style]}:

${content}

Summary:
`;

    const response = await this.llmClient.generateCompletion(prompt, {
      temperature: 0.3,
      maxTokens: 500
    });

    return response.content;
  }

  /**
   * Build prompt from template
   */
  buildPrompt(template, variables) {
    let prompt = template.prompt;

    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      prompt = prompt.replace(new RegExp(placeholder, 'g'), value);
    }

    return prompt;
  }

  /**
   * Post-process generated content
   */
  postProcess(content, postProcessors) {
    if (!postProcessors) return content;

    let processed = content;

    for (const processor of postProcessors) {
      switch (processor.type) {
        case 'trim':
          processed = processed.trim();
          break;
        case 'removePrefix':
          if (processed.startsWith(processor.value)) {
            processed = processed.substring(processor.value.length);
          }
          break;
        case 'removeSuffix':
          if (processed.endsWith(processor.value)) {
            processed = processed.substring(0, processed.length - processor.value.length);
          }
          break;
        case 'replace':
          processed = processed.replace(
            new RegExp(processor.from, 'g'),
            processor.to
          );
          break;
      }
    }

    return processed;
  }

  /**
   * Generate cache key
   */
  generateCacheKey(templateName, variables, options) {
    const hash = crypto.createHash('md5');
    hash.update(JSON.stringify({ templateName, variables, options }));
    return hash.digest('hex');
  }
}

/**
 * ML Model Manager for inference
 */
class ModelManager extends EventEmitter {
  constructor(options = {}) {
    super();
    this.models = new Map();
    this.modelVersions = new Map();
    this.loadBalancer = new ModelLoadBalancer();
    this.monitor = new ModelMonitor();
  }

  /**
   * Register ML model
   */
  registerModel(name, config) {
    const model = {
      name,
      version: config.version || '1.0.0',
      type: config.type, // 'classification', 'regression', 'nlp', etc.
      endpoint: config.endpoint,
      inputSchema: config.inputSchema,
      outputSchema: config.outputSchema,
      preprocessing: config.preprocessing,
      postprocessing: config.postprocessing,
      metadata: config.metadata || {},
      status: 'registered'
    };

    this.models.set(name, model);

    // Track versions
    if (!this.modelVersions.has(name)) {
      this.modelVersions.set(name, []);
    }
    this.modelVersions.get(name).push(config.version);

    this.emit('modelRegistered', model);
    return model;
  }

  /**
   * Make prediction
   */
  async predict(modelName, input, options = {}) {
    const model = this.models.get(modelName);
    if (!model) {
      throw new Error(`Model not found: ${modelName}`);
    }

    const startTime = Date.now();

    try {
      // Validate input
      this.validateInput(input, model.inputSchema);

      // Preprocess input
      const processedInput = await this.preprocess(input, model.preprocessing);

      // Get prediction from model
      const rawOutput = await this.invokeModel(model, processedInput, options);

      // Postprocess output
      const prediction = await this.postprocess(rawOutput, model.postprocessing);

      // Record metrics
      this.monitor.recordPrediction(modelName, {
        duration: Date.now() - startTime,
        success: true,
        inputSize: JSON.stringify(input).length,
        outputSize: JSON.stringify(prediction).length
      });

      return {
        prediction,
        modelName,
        version: model.version,
        confidence: rawOutput.confidence,
        metadata: {
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      this.monitor.recordPrediction(modelName, {
        duration: Date.now() - startTime,
        success: false,
        error: error.message
      });

      throw new ModelInferenceError(`Prediction failed for model ${modelName}: ${error.message}`, error);
    }
  }

  /**
   * Batch predictions
   */
  async batchPredict(modelName, inputs, options = {}) {
    const batchSize = options.batchSize || 10;
    const results = [];

    for (let i = 0; i < inputs.length; i += batchSize) {
      const batch = inputs.slice(i, i + batchSize);
      const batchPromises = batch.map(input => this.predict(modelName, input, options));

      try {
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      } catch (error) {
        // Handle partial batch failures
        const settledResults = await Promise.allSettled(batchPromises);
        for (const result of settledResults) {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          } else {
            results.push({
              error: result.reason.message,
              prediction: null
            });
          }
        }
      }
    }

    return results;
  }

  /**
   * Validate input against schema
   */
  validateInput(input, schema) {
    if (!schema) return;

    // Simplified validation - in real implementation, use proper schema validator
    for (const [field, requirements] of Object.entries(schema)) {
      if (requirements.required && !(field in input)) {
        throw new Error(`Required field missing: ${field}`);
      }

      if (field in input && requirements.type) {
        const actualType = typeof input[field];
        if (actualType !== requirements.type) {
          throw new Error(`Type mismatch for field ${field}: expected ${requirements.type}, got ${actualType}`);
        }
      }
    }
  }

  /**
   * Preprocess input
   */
  async preprocess(input, preprocessing) {
    if (!preprocessing) return input;

    let processed = { ...input };

    for (const step of preprocessing) {
      switch (step.type) {
        case 'normalize':
          processed[step.field] = this.normalizeValue(processed[step.field], step.min, step.max);
          break;
        case 'tokenize':
          processed[step.field] = this.tokenizeText(processed[step.field]);
          break;
        case 'embed':
          // Would use actual embedding service
          processed[step.field] = await this.generateEmbeddings(processed[step.field]);
          break;
      }
    }

    return processed;
  }

  /**
   * Invoke model for prediction
   */
  async invokeModel(model, input, options) {
    // Mock model inference - replace with actual model calls
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));

    if (model.type === 'classification') {
      return {
        class: 'positive',
        confidence: 0.85,
        probabilities: { positive: 0.85, negative: 0.15 }
      };
    }

    if (model.type === 'regression') {
      return {
        value: 42.5,
        confidence: 0.92
      };
    }

    return {
      result: 'mock prediction',
      confidence: 0.8
    };
  }

  /**
   * Postprocess model output
   */
  async postprocess(output, postprocessing) {
    if (!postprocessing) return output;

    let processed = { ...output };

    for (const step of postprocessing) {
      switch (step.type) {
        case 'threshold':
          if (processed.confidence < step.threshold) {
            processed.class = 'uncertain';
          }
          break;
        case 'format':
          processed = this.formatOutput(processed, step.format);
          break;
      }
    }

    return processed;
  }

  /**
   * Get model statistics
   */
  getModelStats(modelName) {
    return this.monitor.getStats(modelName);
  }

  /**
   * List available models
   */
  listModels() {
    return Array.from(this.models.values());
  }

  // Helper methods
  normalizeValue(value, min, max) {
    return (value - min) / (max - min);
  }

  tokenizeText(text) {
    return text.toLowerCase().split(/\s+/);
  }

  async generateEmbeddings(text) {
    // Mock embedding generation
    return Array.from({ length: 768 }, () => Math.random() - 0.5);
  }

  formatOutput(output, format) {
    // Apply output formatting rules
    return output;
  }
}

/**
 * Model Load Balancer
 */
class ModelLoadBalancer {
  constructor() {
    this.strategies = {
      'round-robin': this.roundRobin.bind(this),
      'least-latency': this.leastLatency.bind(this),
      'weighted': this.weighted.bind(this)
    };
  }

  selectInstance(instances, strategy = 'round-robin') {
    const strategyFn = this.strategies[strategy];
    return strategyFn ? strategyFn(instances) : instances[0];
  }

  roundRobin(instances) {
    // Implementation details...
    return instances[0];
  }

  leastLatency(instances) {
    // Implementation details...
    return instances[0];
  }

  weighted(instances) {
    // Implementation details...
    return instances[0];
  }
}

/**
 * Model Performance Monitor
 */
class ModelMonitor {
  constructor() {
    this.metrics = new Map();
  }

  recordPrediction(modelName, data) {
    if (!this.metrics.has(modelName)) {
      this.metrics.set(modelName, {
        totalRequests: 0,
        successfulRequests: 0,
        totalLatency: 0,
        errors: []
      });
    }

    const stats = this.metrics.get(modelName);
    stats.totalRequests++;

    if (data.success) {
      stats.successfulRequests++;
      stats.totalLatency += data.duration;
    } else {
      stats.errors.push({
        error: data.error,
        timestamp: new Date().toISOString()
      });
    }
  }

  getStats(modelName) {
    const stats = this.metrics.get(modelName);
    if (!stats) return null;

    return {
      totalRequests: stats.totalRequests,
      successRate: stats.successfulRequests / stats.totalRequests,
      averageLatency: stats.totalLatency / stats.successfulRequests,
      errorCount: stats.errors.length,
      recentErrors: stats.errors.slice(-5)
    };
  }
}

/**
 * Custom Errors
 */
class LLMError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'LLMError';
    this.originalError = originalError;
  }
}

class ModelInferenceError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'ModelInferenceError';
    this.originalError = originalError;
  }
}

/**
 * Example Usage Demonstrations
 */

// Example 1: LLM Integration
async function exampleLLMIntegration() {
  console.log('=== LLM Integration Example ===');

  const llmClient = new LLMClient({
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    cacheTTL: 3600000
  });

  // Simple completion
  const response = await llmClient.generateCompletion(
    'Explain the benefits of microservices architecture',
    {
      temperature: 0.7,
      maxTokens: 200
    }
  );

  console.log('LLM Response:', response.content);
  console.log('Usage:', llmClient.getUsage());

  // Generate embeddings
  const embeddings = await llmClient.generateEmbeddings([
    'microservices architecture',
    'distributed systems',
    'cloud computing'
  ]);

  console.log('Generated embeddings:', embeddings.length, 'vectors');
}

// Example 2: Vector Search
async function exampleVectorSearch() {
  console.log('=== Vector Search Example ===');

  const vectorDB = new VectorDatabase({ dimensions: 1536 });

  // Store some documents with embeddings
  const documents = [
    { id: 'doc1', text: 'Introduction to machine learning', category: 'education' },
    { id: 'doc2', text: 'Advanced deep learning techniques', category: 'education' },
    { id: 'doc3', text: 'Recipe for chocolate cake', category: 'cooking' }
  ];

  for (const doc of documents) {
    // Mock embedding generation
    const embedding = Array.from({ length: 1536 }, () => Math.random() - 0.5);
    await vectorDB.store(doc.id, embedding, {
      text: doc.text,
      category: doc.category
    });
  }

  // Search for similar documents
  const queryEmbedding = Array.from({ length: 1536 }, () => Math.random() - 0.5);
  const results = await vectorDB.search(queryEmbedding, {
    k: 3,
    threshold: 0.1,
    filter: { category: 'education' }
  });

  console.log('Search results:', results.length);
  results.forEach(result => {
    console.log(`- ${result.metadata.text} (similarity: ${result.similarity.toFixed(3)})`);
  });
}

// Example 3: Content Moderation
async function exampleContentModeration() {
  console.log('=== Content Moderation Example ===');

  const llmClient = new LLMClient();
  const moderator = new ContentModerator(llmClient);

  // Add custom rule
  moderator.addCustomRule({
    condition: (content) => content.includes('spam'),
    action: 'block',
    reason: 'Contains spam keyword',
    severity: 'high'
  });

  const testContent = [
    'This is a normal message',
    'Click here for free money - limited time offer!',
    'I hate this product'
  ];

  for (const content of testContent) {
    const result = await moderator.moderateContent(content);
    console.log(`Content: "${content}"`);
    console.log(`Flagged: ${result.flagged}`);
    if (result.flagged) {
      console.log(`Reason: ${result.reasoning}`);
      console.log(`Actions: ${result.actions.map(a => a.type).join(', ')}`);
    }
    console.log('---');
  }
}

// Example 4: AI Content Generation
async function exampleContentGeneration() {
  console.log('=== Content Generation Example ===');

  const llmClient = new LLMClient();
  const generator = new ContentGenerator(llmClient);

  // Register template
  generator.registerTemplate('product-description', {
    prompt: `Write a compelling product description for:
Product Name: {{productName}}
Category: {{category}}
Key Features: {{features}}
Target Audience: {{audience}}

Description:`,
    temperature: 0.8,
    maxTokens: 200,
    postProcess: [
      { type: 'trim' },
      { type: 'removePrefix', value: 'Description: ' }
    ]
  });

  // Generate content
  const description = await generator.generateFromTemplate('product-description', {
    productName: 'CloudSync Pro',
    category: 'Software',
    features: 'Real-time synchronization, encryption, collaboration tools',
    audience: 'Business professionals'
  });

  console.log('Generated description:', description);

  // Summarize content
  const longContent = `
    CloudSync Pro is a revolutionary cloud synchronization platform designed for modern businesses.
    It offers real-time file synchronization across multiple devices and platforms, ensuring that
    your team always has access to the latest versions of important documents. The platform includes
    advanced encryption protocols to keep your data secure, collaborative editing tools that allow
    multiple users to work on documents simultaneously, and intelligent conflict resolution that
    prevents data loss. CloudSync Pro integrates seamlessly with popular productivity suites and
    offers extensive API support for custom integrations.
  `;

  const summary = await generator.summarize(longContent, {
    length: 'short',
    style: 'bullet-points'
  });

  console.log('Summary:', summary);
}

// Example 5: ML Model Management
async function exampleMLModelManagement() {
  console.log('=== ML Model Management Example ===');

  const modelManager = new ModelManager();

  // Register models
  modelManager.registerModel('sentiment-classifier', {
    version: '2.1.0',
    type: 'classification',
    inputSchema: {
      text: { type: 'string', required: true }
    },
    preprocessing: [
      { type: 'tokenize', field: 'text' }
    ],
    postprocessing: [
      { type: 'threshold', threshold: 0.7 }
    ]
  });

  modelManager.registerModel('price-predictor', {
    version: '1.0.0',
    type: 'regression',
    inputSchema: {
      features: { type: 'object', required: true }
    }
  });

  // Make predictions
  const sentimentResult = await modelManager.predict('sentiment-classifier', {
    text: 'I love this new product!'
  });

  console.log('Sentiment prediction:', sentimentResult);

  const priceResult = await modelManager.predict('price-predictor', {
    features: { bedrooms: 3, bathrooms: 2, sqft: 1500, location: 'downtown' }
  });

  console.log('Price prediction:', priceResult);

  // Batch predictions
  const batchInputs = [
    { text: 'Great service!' },
    { text: 'Terrible experience' },
    { text: 'Average quality' }
  ];

  const batchResults = await modelManager.batchPredict('sentiment-classifier', batchInputs);
  console.log('Batch predictions:', batchResults.length, 'results');

  // Get model statistics
  console.log('Model stats:', modelManager.getModelStats('sentiment-classifier'));
}

module.exports = {
  LLMClient,
  RateLimiter,
  VectorDatabase,
  ContentModerator,
  ContentGenerator,
  ModelManager,
  ModelLoadBalancer,
  ModelMonitor,
  LLMError,
  ModelInferenceError,
  exampleLLMIntegration,
  exampleVectorSearch,
  exampleContentModeration,
  exampleContentGeneration,
  exampleMLModelManagement
};