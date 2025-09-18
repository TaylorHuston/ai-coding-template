/**
 * OAuth 2.0 Authentication Flows Implementation
 *
 * Comprehensive implementation of OAuth 2.0 authorization flows:
 * - Authorization Code Flow (with PKCE)
 * - Client Credentials Flow
 * - Resource Owner Password Credentials Flow
 * - Refresh Token Flow
 * - Device Authorization Flow
 * - Token introspection and validation
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // Assuming jsonwebtoken is available
const url = require('url');

/**
 * OAuth 2.0 Server Implementation
 */
class OAuth2Server {
  constructor(options = {}) {
    this.clients = new Map(); // clientId -> client config
    this.authorizationCodes = new Map(); // code -> auth data
    this.accessTokens = new Map(); // token -> token data
    this.refreshTokens = new Map(); // refresh token -> token data
    this.deviceCodes = new Map(); // device code -> device data

    this.config = {
      authorizationCodeTTL: options.authorizationCodeTTL || 600, // 10 minutes
      accessTokenTTL: options.accessTokenTTL || 3600, // 1 hour
      refreshTokenTTL: options.refreshTokenTTL || 86400 * 30, // 30 days
      deviceCodeTTL: options.deviceCodeTTL || 1800, // 30 minutes
      jwtSecret: options.jwtSecret || 'your-secret-key',
      issuer: options.issuer || 'https://auth.example.com',
      ...options
    };
  }

  /**
   * Register OAuth 2.0 client
   */
  registerClient(clientConfig) {
    const clientId = clientConfig.clientId || this.generateClientId();
    const clientSecret = clientConfig.confidential ? this.generateClientSecret() : null;

    const client = {
      clientId,
      clientSecret,
      name: clientConfig.name,
      redirectUris: clientConfig.redirectUris || [],
      scopes: clientConfig.scopes || ['read'],
      grantTypes: clientConfig.grantTypes || ['authorization_code'],
      confidential: clientConfig.confidential || false,
      ...clientConfig
    };

    this.clients.set(clientId, client);
    return { clientId, clientSecret };
  }

  /**
   * Authorization Code Flow - Step 1: Authorization Request
   */
  async authorizeRequest(params) {
    const {
      response_type,
      client_id,
      redirect_uri,
      scope,
      state,
      code_challenge,
      code_challenge_method
    } = params;

    // Validate request
    const validation = this.validateAuthorizationRequest(params);
    if (!validation.valid) {
      throw new OAuth2Error('invalid_request', validation.error);
    }

    const client = this.clients.get(client_id);
    if (!client) {
      throw new OAuth2Error('invalid_client', 'Client not found');
    }

    // Validate redirect URI
    if (!client.redirectUris.includes(redirect_uri)) {
      throw new OAuth2Error('invalid_request', 'Invalid redirect URI');
    }

    // For demo, we'll skip user authentication and consent
    // In real implementation, redirect to login/consent page
    const authorizationCode = this.generateAuthorizationCode();
    const expiresAt = Date.now() + (this.config.authorizationCodeTTL * 1000);

    this.authorizationCodes.set(authorizationCode, {
      clientId: client_id,
      redirectUri: redirect_uri,
      scope: scope || 'read',
      state,
      codeChallenge: code_challenge,
      codeChallengeMethod: code_challenge_method,
      expiresAt,
      userId: 'demo-user-id' // In real app, this would be authenticated user
    });

    return {
      authorizationCode,
      redirectUri: this.buildRedirectUri(redirect_uri, authorizationCode, state)
    };
  }

  /**
   * Authorization Code Flow - Step 2: Token Exchange
   */
  async tokenRequest(params) {
    const { grant_type } = params;

    switch (grant_type) {
      case 'authorization_code':
        return this.handleAuthorizationCodeGrant(params);
      case 'refresh_token':
        return this.handleRefreshTokenGrant(params);
      case 'client_credentials':
        return this.handleClientCredentialsGrant(params);
      case 'password':
        return this.handlePasswordGrant(params);
      case 'urn:ietf:params:oauth:grant-type:device_code':
        return this.handleDeviceCodeGrant(params);
      default:
        throw new OAuth2Error('unsupported_grant_type', 'Grant type not supported');
    }
  }

  /**
   * Handle Authorization Code Grant
   */
  async handleAuthorizationCodeGrant(params) {
    const {
      code,
      redirect_uri,
      client_id,
      client_secret,
      code_verifier
    } = params;

    // Validate authorization code
    const authData = this.authorizationCodes.get(code);
    if (!authData) {
      throw new OAuth2Error('invalid_grant', 'Authorization code not found');
    }

    if (Date.now() > authData.expiresAt) {
      this.authorizationCodes.delete(code);
      throw new OAuth2Error('invalid_grant', 'Authorization code expired');
    }

    // Validate client
    const client = this.clients.get(client_id);
    if (!client) {
      throw new OAuth2Error('invalid_client', 'Client not found');
    }

    // Validate client authentication for confidential clients
    if (client.confidential && client.clientSecret !== client_secret) {
      throw new OAuth2Error('invalid_client', 'Invalid client credentials');
    }

    // Validate redirect URI matches
    if (authData.redirectUri !== redirect_uri) {
      throw new OAuth2Error('invalid_grant', 'Redirect URI mismatch');
    }

    // Validate PKCE if used
    if (authData.codeChallenge) {
      if (!code_verifier) {
        throw new OAuth2Error('invalid_request', 'Code verifier required');
      }

      const challengeMethod = authData.codeChallengeMethod || 'plain';
      const isValid = this.validatePKCE(
        code_verifier,
        authData.codeChallenge,
        challengeMethod
      );

      if (!isValid) {
        throw new OAuth2Error('invalid_grant', 'PKCE verification failed');
      }
    }

    // Generate tokens
    const tokenResponse = this.generateTokens({
      clientId: client_id,
      userId: authData.userId,
      scope: authData.scope
    });

    // Clean up authorization code (one-time use)
    this.authorizationCodes.delete(code);

    return tokenResponse;
  }

  /**
   * Handle Refresh Token Grant
   */
  async handleRefreshTokenGrant(params) {
    const { refresh_token, scope, client_id, client_secret } = params;

    const refreshData = this.refreshTokens.get(refresh_token);
    if (!refreshData) {
      throw new OAuth2Error('invalid_grant', 'Refresh token not found');
    }

    if (Date.now() > refreshData.expiresAt) {
      this.refreshTokens.delete(refresh_token);
      throw new OAuth2Error('invalid_grant', 'Refresh token expired');
    }

    // Validate client if provided
    if (client_id) {
      const client = this.clients.get(client_id);
      if (!client || (client.confidential && client.clientSecret !== client_secret)) {
        throw new OAuth2Error('invalid_client', 'Invalid client credentials');
      }
    }

    // Generate new tokens
    const tokenResponse = this.generateTokens({
      clientId: refreshData.clientId,
      userId: refreshData.userId,
      scope: scope || refreshData.scope
    });

    // Rotate refresh token
    this.refreshTokens.delete(refresh_token);

    return tokenResponse;
  }

  /**
   * Handle Client Credentials Grant
   */
  async handleClientCredentialsGrant(params) {
    const { client_id, client_secret, scope } = params;

    const client = this.clients.get(client_id);
    if (!client) {
      throw new OAuth2Error('invalid_client', 'Client not found');
    }

    if (!client.confidential || client.clientSecret !== client_secret) {
      throw new OAuth2Error('invalid_client', 'Invalid client credentials');
    }

    if (!client.grantTypes.includes('client_credentials')) {
      throw new OAuth2Error('unauthorized_client', 'Grant type not allowed');
    }

    // Generate access token (no refresh token for client credentials)
    const accessToken = this.generateAccessToken({
      clientId: client_id,
      scope: scope || client.scopes.join(' '),
      tokenType: 'client_credentials'
    });

    return {
      access_token: accessToken.token,
      token_type: 'Bearer',
      expires_in: this.config.accessTokenTTL,
      scope: accessToken.scope
    };
  }

  /**
   * Handle Resource Owner Password Credentials Grant
   */
  async handlePasswordGrant(params) {
    const { username, password, scope, client_id, client_secret } = params;

    // Validate client
    const client = this.clients.get(client_id);
    if (!client) {
      throw new OAuth2Error('invalid_client', 'Client not found');
    }

    if (client.confidential && client.clientSecret !== client_secret) {
      throw new OAuth2Error('invalid_client', 'Invalid client credentials');
    }

    // Authenticate user (mock implementation)
    const user = await this.authenticateUser(username, password);
    if (!user) {
      throw new OAuth2Error('invalid_grant', 'Invalid user credentials');
    }

    // Generate tokens
    const tokenResponse = this.generateTokens({
      clientId: client_id,
      userId: user.id,
      scope: scope || 'read'
    });

    return tokenResponse;
  }

  /**
   * Device Authorization Flow - Step 1: Device Authorization Request
   */
  async deviceAuthorizationRequest(params) {
    const { client_id, scope } = params;

    const client = this.clients.get(client_id);
    if (!client) {
      throw new OAuth2Error('invalid_client', 'Client not found');
    }

    const deviceCode = this.generateDeviceCode();
    const userCode = this.generateUserCode();
    const expiresAt = Date.now() + (this.config.deviceCodeTTL * 1000);

    this.deviceCodes.set(deviceCode, {
      clientId: client_id,
      userCode,
      scope: scope || 'read',
      expiresAt,
      status: 'pending' // pending, authorized, denied
    });

    return {
      device_code: deviceCode,
      user_code: userCode,
      verification_uri: `${this.config.issuer}/device`,
      verification_uri_complete: `${this.config.issuer}/device?user_code=${userCode}`,
      expires_in: this.config.deviceCodeTTL,
      interval: 5 // Polling interval in seconds
    };
  }

  /**
   * Device Authorization Flow - Step 2: Device Token Request
   */
  async handleDeviceCodeGrant(params) {
    const { device_code, client_id } = params;

    const deviceData = this.deviceCodes.get(device_code);
    if (!deviceData) {
      throw new OAuth2Error('invalid_grant', 'Device code not found');
    }

    if (Date.now() > deviceData.expiresAt) {
      this.deviceCodes.delete(device_code);
      throw new OAuth2Error('invalid_grant', 'Device code expired');
    }

    if (deviceData.status === 'pending') {
      throw new OAuth2Error('authorization_pending', 'User has not authorized the device');
    }

    if (deviceData.status === 'denied') {
      this.deviceCodes.delete(device_code);
      throw new OAuth2Error('access_denied', 'User denied the authorization');
    }

    // Generate tokens
    const tokenResponse = this.generateTokens({
      clientId: client_id,
      userId: deviceData.userId,
      scope: deviceData.scope
    });

    // Clean up device code
    this.deviceCodes.delete(device_code);

    return tokenResponse;
  }

  /**
   * Token Introspection (RFC 7662)
   */
  async introspectToken(token, clientId, clientSecret) {
    // Validate client credentials
    const client = this.clients.get(clientId);
    if (!client || (client.confidential && client.clientSecret !== clientSecret)) {
      throw new OAuth2Error('invalid_client', 'Invalid client credentials');
    }

    const tokenData = this.accessTokens.get(token);
    if (!tokenData) {
      return { active: false };
    }

    if (Date.now() > tokenData.expiresAt) {
      this.accessTokens.delete(token);
      return { active: false };
    }

    return {
      active: true,
      client_id: tokenData.clientId,
      username: tokenData.userId,
      scope: tokenData.scope,
      exp: Math.floor(tokenData.expiresAt / 1000),
      iat: Math.floor(tokenData.issuedAt / 1000),
      sub: tokenData.userId,
      aud: tokenData.audience,
      iss: this.config.issuer,
      token_type: 'Bearer'
    };
  }

  /**
   * Token Validation Middleware
   */
  createTokenValidationMiddleware() {
    return async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
            error: 'invalid_token',
            error_description: 'Missing or invalid authorization header'
          });
        }

        const token = authHeader.substring(7);
        const tokenData = this.accessTokens.get(token);

        if (!tokenData) {
          return res.status(401).json({
            error: 'invalid_token',
            error_description: 'Token not found'
          });
        }

        if (Date.now() > tokenData.expiresAt) {
          this.accessTokens.delete(token);
          return res.status(401).json({
            error: 'invalid_token',
            error_description: 'Token expired'
          });
        }

        // Add token data to request
        req.oauth = {
          token: tokenData,
          clientId: tokenData.clientId,
          userId: tokenData.userId,
          scope: tokenData.scope.split(' ')
        };

        next();
      } catch (error) {
        res.status(500).json({
          error: 'server_error',
          error_description: 'Internal server error'
        });
      }
    };
  }

  /**
   * Scope validation middleware
   */
  requireScope(requiredScope) {
    return (req, res, next) => {
      if (!req.oauth) {
        return res.status(401).json({
          error: 'invalid_token',
          error_description: 'Token validation required'
        });
      }

      const userScopes = req.oauth.scope;
      if (!userScopes.includes(requiredScope)) {
        return res.status(403).json({
          error: 'insufficient_scope',
          error_description: `Required scope: ${requiredScope}`
        });
      }

      next();
    };
  }

  // Helper methods
  generateTokens({ clientId, userId, scope }) {
    const accessToken = this.generateAccessToken({ clientId, userId, scope });
    const refreshToken = this.generateRefreshToken({ clientId, userId, scope });

    return {
      access_token: accessToken.token,
      token_type: 'Bearer',
      expires_in: this.config.accessTokenTTL,
      refresh_token: refreshToken.token,
      scope: accessToken.scope
    };
  }

  generateAccessToken({ clientId, userId, scope, tokenType = 'bearer' }) {
    const tokenId = crypto.randomBytes(32).toString('hex');
    const issuedAt = Date.now();
    const expiresAt = issuedAt + (this.config.accessTokenTTL * 1000);

    const tokenData = {
      tokenId,
      clientId,
      userId,
      scope,
      tokenType,
      issuedAt,
      expiresAt,
      audience: clientId,
      issuer: this.config.issuer
    };

    this.accessTokens.set(tokenId, tokenData);

    return {
      token: tokenId,
      scope,
      expiresAt
    };
  }

  generateRefreshToken({ clientId, userId, scope }) {
    const token = crypto.randomBytes(32).toString('hex');
    const issuedAt = Date.now();
    const expiresAt = issuedAt + (this.config.refreshTokenTTL * 1000);

    const tokenData = {
      token,
      clientId,
      userId,
      scope,
      issuedAt,
      expiresAt
    };

    this.refreshTokens.set(token, tokenData);

    return { token, expiresAt };
  }

  generateAuthorizationCode() {
    return crypto.randomBytes(32).toString('base64url');
  }

  generateDeviceCode() {
    return crypto.randomBytes(32).toString('hex');
  }

  generateUserCode() {
    // Generate human-readable code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  generateClientId() {
    return crypto.randomBytes(16).toString('hex');
  }

  generateClientSecret() {
    return crypto.randomBytes(32).toString('base64url');
  }

  validateAuthorizationRequest(params) {
    const { response_type, client_id, redirect_uri } = params;

    if (!response_type) {
      return { valid: false, error: 'Missing response_type parameter' };
    }

    if (response_type !== 'code') {
      return { valid: false, error: 'Unsupported response_type' };
    }

    if (!client_id) {
      return { valid: false, error: 'Missing client_id parameter' };
    }

    if (!redirect_uri) {
      return { valid: false, error: 'Missing redirect_uri parameter' };
    }

    return { valid: true };
  }

  validatePKCE(codeVerifier, codeChallenge, method) {
    if (method === 'plain') {
      return codeVerifier === codeChallenge;
    }

    if (method === 'S256') {
      const hash = crypto.createHash('sha256').update(codeVerifier).digest();
      const challenge = hash.toString('base64url');
      return challenge === codeChallenge;
    }

    return false;
  }

  buildRedirectUri(baseUri, code, state) {
    const parsed = new URL(baseUri);
    parsed.searchParams.set('code', code);
    if (state) {
      parsed.searchParams.set('state', state);
    }
    return parsed.toString();
  }

  async authenticateUser(username, password) {
    // Mock user authentication
    if (username === 'demo' && password === 'password') {
      return { id: 'demo-user-id', username: 'demo' };
    }
    return null;
  }
}

/**
 * OAuth 2.0 Client Implementation
 */
class OAuth2Client {
  constructor(config) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
    this.authorizationEndpoint = config.authorizationEndpoint;
    this.tokenEndpoint = config.tokenEndpoint;
    this.scope = config.scope || 'read';
    this.usePKCE = config.usePKCE || true;

    if (this.usePKCE) {
      this.codeVerifier = this.generateCodeVerifier();
      this.codeChallenge = this.generateCodeChallenge(this.codeVerifier);
    }
  }

  /**
   * Generate authorization URL for Authorization Code Flow
   */
  getAuthorizationUrl(state) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      state: state || crypto.randomBytes(16).toString('hex')
    });

    if (this.usePKCE) {
      params.set('code_challenge', this.codeChallenge);
      params.set('code_challenge_method', 'S256');
    }

    return `${this.authorizationEndpoint}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code, state) {
    const params = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId
    };

    if (this.clientSecret) {
      params.client_secret = this.clientSecret;
    }

    if (this.usePKCE) {
      params.code_verifier = this.codeVerifier;
    }

    const response = await this.makeTokenRequest(params);
    return response;
  }

  /**
   * Refresh access token
   */
  async refreshTokens(refreshToken) {
    const params = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.clientId
    };

    if (this.clientSecret) {
      params.client_secret = this.clientSecret;
    }

    return await this.makeTokenRequest(params);
  }

  /**
   * Client Credentials Flow
   */
  async getClientCredentialsTokens(scope) {
    const params = {
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret
    };

    if (scope) {
      params.scope = scope;
    }

    return await this.makeTokenRequest(params);
  }

  async makeTokenRequest(params) {
    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams(params).toString()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new OAuth2Error(data.error, data.error_description);
    }

    return data;
  }

  generateCodeVerifier() {
    return crypto.randomBytes(32).toString('base64url');
  }

  generateCodeChallenge(verifier) {
    const hash = crypto.createHash('sha256').update(verifier).digest();
    return hash.toString('base64url');
  }
}

/**
 * OAuth 2.0 Error Class
 */
class OAuth2Error extends Error {
  constructor(error, description, uri) {
    super(description || error);
    this.error = error;
    this.error_description = description;
    this.error_uri = uri;
    this.name = 'OAuth2Error';
  }

  toJSON() {
    const result = { error: this.error };
    if (this.error_description) result.error_description = this.error_description;
    if (this.error_uri) result.error_uri = this.error_uri;
    return result;
  }
}

/**
 * Example Usage Demonstrations
 */

// Example 1: Authorization Code Flow with PKCE
async function exampleAuthorizationCodeFlow() {
  console.log('=== Authorization Code Flow Example ===');

  // Set up OAuth 2.0 server
  const server = new OAuth2Server({
    jwtSecret: 'demo-secret',
    issuer: 'https://auth.example.com'
  });

  // Register client
  const clientCreds = server.registerClient({
    name: 'Demo App',
    redirectUris: ['https://app.example.com/callback'],
    grantTypes: ['authorization_code', 'refresh_token'],
    scopes: ['read', 'write'],
    confidential: true
  });

  console.log('Registered client:', clientCreds);

  // Step 1: Generate authorization URL
  const client = new OAuth2Client({
    clientId: clientCreds.clientId,
    clientSecret: clientCreds.clientSecret,
    redirectUri: 'https://app.example.com/callback',
    authorizationEndpoint: 'https://auth.example.com/authorize',
    tokenEndpoint: 'https://auth.example.com/token',
    scope: 'read write'
  });

  const authUrl = client.getAuthorizationUrl('random-state');
  console.log('Authorization URL:', authUrl);

  // Step 2: Simulate authorization (normally user would authorize in browser)
  const authResponse = await server.authorizeRequest({
    response_type: 'code',
    client_id: clientCreds.clientId,
    redirect_uri: 'https://app.example.com/callback',
    scope: 'read write',
    state: 'random-state',
    code_challenge: client.codeChallenge,
    code_challenge_method: 'S256'
  });

  console.log('Authorization response:', authResponse);

  // Step 3: Exchange code for tokens
  const tokenResponse = await server.tokenRequest({
    grant_type: 'authorization_code',
    code: authResponse.authorizationCode,
    redirect_uri: 'https://app.example.com/callback',
    client_id: clientCreds.clientId,
    client_secret: clientCreds.clientSecret,
    code_verifier: client.codeVerifier
  });

  console.log('Token response:', tokenResponse);

  // Step 4: Use refresh token
  const refreshResponse = await server.tokenRequest({
    grant_type: 'refresh_token',
    refresh_token: tokenResponse.refresh_token,
    client_id: clientCreds.clientId,
    client_secret: clientCreds.clientSecret
  });

  console.log('Refresh response:', refreshResponse);
}

// Example 2: Client Credentials Flow
async function exampleClientCredentialsFlow() {
  console.log('=== Client Credentials Flow Example ===');

  const server = new OAuth2Server();

  // Register client for machine-to-machine communication
  const clientCreds = server.registerClient({
    name: 'API Service',
    grantTypes: ['client_credentials'],
    scopes: ['api:read', 'api:write'],
    confidential: true
  });

  console.log('Registered service client:', clientCreds);

  // Get access token
  const tokenResponse = await server.tokenRequest({
    grant_type: 'client_credentials',
    client_id: clientCreds.clientId,
    client_secret: clientCreds.clientSecret,
    scope: 'api:read api:write'
  });

  console.log('Service token:', tokenResponse);

  // Introspect token
  const introspection = await server.introspectToken(
    tokenResponse.access_token,
    clientCreds.clientId,
    clientCreds.clientSecret
  );

  console.log('Token introspection:', introspection);
}

// Example 3: Device Authorization Flow
async function exampleDeviceFlow() {
  console.log('=== Device Authorization Flow Example ===');

  const server = new OAuth2Server();

  const clientCreds = server.registerClient({
    name: 'Smart TV App',
    grantTypes: ['urn:ietf:params:oauth:grant-type:device_code'],
    scopes: ['read', 'write']
  });

  // Step 1: Device authorization request
  const deviceResponse = await server.deviceAuthorizationRequest({
    client_id: clientCreds.clientId,
    scope: 'read write'
  });

  console.log('Device authorization:', deviceResponse);
  console.log(`User should visit: ${deviceResponse.verification_uri}`);
  console.log(`Enter code: ${deviceResponse.user_code}`);

  // Simulate user authorization (normally done through web interface)
  const deviceData = server.deviceCodes.get(deviceResponse.device_code);
  deviceData.status = 'authorized';
  deviceData.userId = 'demo-user-id';

  // Step 2: Poll for tokens
  const tokenResponse = await server.tokenRequest({
    grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    device_code: deviceResponse.device_code,
    client_id: clientCreds.clientId
  });

  console.log('Device token response:', tokenResponse);
}

module.exports = {
  OAuth2Server,
  OAuth2Client,
  OAuth2Error,
  exampleAuthorizationCodeFlow,
  exampleClientCredentialsFlow,
  exampleDeviceFlow
};