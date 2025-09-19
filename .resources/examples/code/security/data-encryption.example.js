/**
 * Data Protection and Encryption Examples
 *
 * Comprehensive examples for data encryption at rest and in transit,
 * including key management, TLS configuration, and secure storage patterns.
 *
 * Features:
 * - AES-256-GCM encryption for data at rest
 * - TLS configuration with security headers
 * - Key management with rotation
 * - Secure data storage patterns
 * - Certificate management
 */

const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const express = require('express');

/**
 * Comprehensive Encryption Service
 * Provides AES-256-GCM encryption for sensitive data
 */
class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32; // 256 bits
    this.ivLength = 16;  // 128 bits
    this.tagLength = 16; // 128 bits
  }

  /**
   * Encrypt plaintext data
   * @param {string} plaintext - Data to encrypt
   * @param {string|Buffer} key - Encryption key
   * @returns {Object} Encrypted data with IV and auth tag
   */
  encrypt(plaintext, key) {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipher(this.algorithm, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  /**
   * Decrypt encrypted data
   * @param {Object} encryptedData - Encrypted data object
   * @param {string|Buffer} key - Decryption key
   * @returns {string} Decrypted plaintext
   */
  decrypt(encryptedData, key) {
    const decipher = crypto.createDecipher(
      this.algorithm,
      key,
      Buffer.from(encryptedData.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Generate a secure encryption key
   * @returns {string} Hex-encoded encryption key
   */
  generateKey() {
    return crypto.randomBytes(this.keyLength).toString('hex');
  }

  /**
   * Derive key from password using PBKDF2
   * @param {string} password - User password
   * @param {string} salt - Salt for key derivation
   * @returns {Buffer} Derived key
   */
  deriveKeyFromPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, this.keyLength, 'sha256');
  }
}

/**
 * User Service with Encrypted Data Storage
 * Demonstrates encryption of PII data
 */
class UserService {
  constructor(repository, encryptionService) {
    this.repository = repository;
    this.encryption = encryptionService;
  }

  /**
   * Store user with encrypted sensitive data
   * @param {Object} userData - User data to store
   * @returns {Object} Stored user record
   */
  async storeUser(userData) {
    const encryptionKey = this.getEncryptionKey();

    const encryptedData = {
      // Searchable fields - not encrypted
      email: userData.email,
      username: userData.username,
      created_at: new Date(),

      // Encrypted sensitive fields
      name: this.encryption.encrypt(userData.name, encryptionKey),
      ssn: this.encryption.encrypt(userData.ssn, encryptionKey),
      phone: this.encryption.encrypt(userData.phone, encryptionKey),
      address: this.encryption.encrypt(JSON.stringify(userData.address), encryptionKey)
    };

    return await this.repository.create(encryptedData);
  }

  /**
   * Retrieve and decrypt user data
   * @param {string} userId - User ID
   * @returns {Object} Decrypted user data
   */
  async getUser(userId) {
    const encryptedUser = await this.repository.findById(userId);
    if (!encryptedUser) {
      return null;
    }

    const encryptionKey = this.getEncryptionKey();

    return {
      id: encryptedUser.id,
      email: encryptedUser.email,
      username: encryptedUser.username,
      created_at: encryptedUser.created_at,

      // Decrypt sensitive fields
      name: this.encryption.decrypt(encryptedUser.name, encryptionKey),
      ssn: this.encryption.decrypt(encryptedUser.ssn, encryptionKey),
      phone: this.encryption.decrypt(encryptedUser.phone, encryptionKey),
      address: JSON.parse(this.encryption.decrypt(encryptedUser.address, encryptionKey))
    };
  }

  /**
   * Get encryption key from secure key management
   * @returns {string} Encryption key
   */
  getEncryptionKey() {
    // In production, retrieve from secure key management service
    return process.env.ENCRYPTION_KEY || this.encryption.generateKey();
  }
}

/**
 * Key Management Service
 * Handles key storage, rotation, and lifecycle management
 */
class KeyManagementService {
  constructor(vaultService) {
    this.vault = vaultService;
    this.keyRotationInterval = 90 * 24 * 60 * 60 * 1000; // 90 days
  }

  /**
   * Get encryption key with automatic rotation check
   * @param {string} keyId - Key identifier
   * @param {string} version - Key version (default: 'latest')
   * @returns {string} Encryption key
   */
  async getEncryptionKey(keyId, version = 'latest') {
    const key = await this.vault.getSecret(`encryption-keys/${keyId}`, version);

    // Check if key rotation is needed
    if (this.isKeyRotationNeeded(key)) {
      await this.rotateKey(keyId);
    }

    return key.value;
  }

  /**
   * Rotate encryption key
   * @param {string} keyId - Key identifier
   * @returns {number} New key version
   */
  async rotateKey(keyId) {
    // Generate new key
    const newKey = crypto.randomBytes(32);
    const newVersion = await this.vault.createSecret(
      `encryption-keys/${keyId}`,
      newKey.toString('hex')
    );

    // Schedule re-encryption of data with old key
    await this.scheduleDataReencryption(keyId, newVersion);

    return newVersion;
  }

  /**
   * Schedule background re-encryption with new key
   * @param {string} keyId - Key identifier
   * @param {number} newVersion - New key version
   */
  async scheduleDataReencryption(keyId, newVersion) {
    // Background job to re-encrypt data with new key
    await this.jobQueue.add('reencrypt-data', {
      keyId,
      newVersion,
      oldVersion: newVersion - 1
    });
  }

  /**
   * Check if key rotation is needed
   * @param {Object} key - Key object with metadata
   * @returns {boolean} True if rotation needed
   */
  isKeyRotationNeeded(key) {
    const keyAge = Date.now() - new Date(key.created_at).getTime();
    return keyAge > this.keyRotationInterval;
  }
}

/**
 * TLS Configuration and Security Headers
 * Secure HTTPS server setup with proper TLS configuration
 */
function createSecureServer() {
  const app = express();

  // TLS configuration with strong ciphers
  const tlsOptions = {
    key: fs.readFileSync('/path/to/private-key.pem'),
    cert: fs.readFileSync('/path/to/certificate.pem'),
    ca: fs.readFileSync('/path/to/ca-certificate.pem'),

    // Security enhancements
    secureProtocol: 'TLSv1_2_method',
    ciphers: [
      'ECDHE-RSA-AES128-GCM-SHA256',
      'ECDHE-RSA-AES256-GCM-SHA384',
      'ECDHE-RSA-AES128-SHA256',
      'ECDHE-RSA-AES256-SHA384'
    ].join(':'),
    honorCipherOrder: true
  };

  // Security headers middleware
  app.use((req, res, next) => {
    // HSTS - Force HTTPS for 1 year
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Content Security Policy
    res.setHeader('Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    );

    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    next();
  });

  // Create HTTPS server
  const server = https.createServer(tlsOptions, app);

  return { app, server };
}

/**
 * Certificate Management Utilities
 * Helper functions for certificate handling
 */
class CertificateManager {
  /**
   * Validate certificate expiration
   * @param {string} certPath - Path to certificate file
   * @returns {Object} Certificate validation info
   */
  static validateCertificate(certPath) {
    const cert = fs.readFileSync(certPath);
    const certObj = crypto.X509Certificate(cert);

    const now = new Date();
    const validFrom = new Date(certObj.validFrom);
    const validTo = new Date(certObj.validTo);

    const daysUntilExpiry = Math.floor((validTo - now) / (1000 * 60 * 60 * 24));

    return {
      subject: certObj.subject,
      issuer: certObj.issuer,
      validFrom,
      validTo,
      daysUntilExpiry,
      isValid: now >= validFrom && now <= validTo,
      needsRenewal: daysUntilExpiry <= 30
    };
  }

  /**
   * Generate CSR for certificate renewal
   * @param {Object} options - CSR options
   * @returns {Object} CSR and private key
   */
  static generateCSR(options) {
    const { commonName, organization, country, keySize = 2048 } = options;

    // Generate private key
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: keySize,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    // Create CSR (simplified example - use openssl or proper library in production)
    const csrData = {
      commonName,
      organization,
      country,
      publicKey
    };

    return {
      csr: csrData,
      privateKey
    };
  }
}

module.exports = {
  EncryptionService,
  UserService,
  KeyManagementService,
  createSecureServer,
  CertificateManager
};