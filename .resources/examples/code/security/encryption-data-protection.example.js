/**
 * @example Encryption and Data Protection Implementation
 *
 * Demonstrates:
 * - AES-256-GCM encryption for data at rest
 * - TLS configuration and security headers for data in transit
 * - Secure key management with rotation capabilities
 * - PII encryption strategies for sensitive data
 * - Proper random IV and authentication tag handling
 *
 * Key Patterns:
 * - Industry-standard encryption algorithms and key sizes
 * - Secure key derivation and storage patterns
 * - Automated key rotation with data re-encryption
 * - Transport security with proper TLS configuration
 * - Comprehensive security headers for web applications
 */

const crypto = require('crypto');
const express = require('express');
const https = require('https');
const fs = require('fs');

// Data at Rest Encryption
class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32; // 256 bits
    this.ivLength = 16;  // 128 bits
    this.tagLength = 16; // 128 bits
  }

  encrypt(plaintext, key) {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipherGCM(this.algorithm, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encryptedData, key) {
    const decipher = crypto.createDecipherGCM(
      this.algorithm,
      key,
      Buffer.from(encryptedData.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

// Usage for PII storage
class UserService {
  constructor(encryptionService, repository) {
    this.encryption = encryptionService;
    this.repository = repository;
  }

  async storeUser(userData) {
    const encryptedData = {
      email: userData.email, // Searchable, less sensitive
      name: this.encryption.encrypt(userData.name, this.getEncryptionKey()),
      ssn: this.encryption.encrypt(userData.ssn, this.getEncryptionKey()),
      phone: this.encryption.encrypt(userData.phone, this.getEncryptionKey())
    };

    return await this.repository.create(encryptedData);
  }

  getEncryptionKey() {
    // In production, retrieve from secure key management service
    return crypto.scryptSync(process.env.ENCRYPTION_PASSWORD, 'salt', 32);
  }
}

// Data in Transit Protection
const app = express();

// TLS configuration
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
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'");
  next();
});

https.createServer(tlsOptions, app).listen(443);

// Key Management Service
class KeyManagementService {
  constructor(vaultService) {
    this.vault = vaultService;
    this.keyRotationInterval = 90 * 24 * 60 * 60 * 1000; // 90 days
  }

  async getEncryptionKey(keyId, version = 'latest') {
    const key = await this.vault.getSecret(`encryption-keys/${keyId}`, version);

    // Check if key rotation is needed
    if (this.isKeyRotationNeeded(key)) {
      await this.rotateKey(keyId);
    }

    return key.value;
  }

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

  async scheduleDataReencryption(keyId, newVersion) {
    // Background job to re-encrypt data with new key
    await this.jobQueue.add('reencrypt-data', {
      keyId,
      newVersion,
      oldVersion: newVersion - 1
    });
  }

  isKeyRotationNeeded(key) {
    const keyAge = Date.now() - new Date(key.createdAt).getTime();
    return keyAge > this.keyRotationInterval;
  }
}

// Secure Password Hashing
class PasswordService {
  constructor() {
    this.saltRounds = 12;
    this.pepper = process.env.PASSWORD_PEPPER || '';
  }

  async hashPassword(plainPassword) {
    const bcrypt = require('bcrypt');

    // Add pepper for additional security
    const pepperedPassword = plainPassword + this.pepper;

    // Generate salt and hash
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hash = await bcrypt.hash(pepperedPassword, salt);

    return hash;
  }

  async verifyPassword(plainPassword, hashedPassword) {
    const bcrypt = require('bcrypt');

    // Add pepper for verification
    const pepperedPassword = plainPassword + this.pepper;

    return await bcrypt.compare(pepperedPassword, hashedPassword);
  }
}

// Secure Random Token Generation
class TokenService {
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  generateSecureNumericCode(length = 6) {
    const bytes = crypto.randomBytes(length);
    let code = '';

    for (let i = 0; i < length; i++) {
      code += (bytes[i] % 10).toString();
    }

    return code;
  }

  generateAPIKey() {
    const prefix = 'ak_';
    const randomPart = crypto.randomBytes(32).toString('base64url');
    return prefix + randomPart;
  }
}

module.exports = {
  EncryptionService,
  UserService,
  KeyManagementService,
  PasswordService,
  TokenService,
  tlsOptions
};