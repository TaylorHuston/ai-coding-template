/**
 * @example File Upload Security Implementation
 *
 * Demonstrates:
 * - Comprehensive file validation including MIME type detection
 * - Virus scanning integration for malware detection
 * - Secure file storage with encryption and access controls
 * - File content validation and suspicious pattern detection
 * - Proper error handling and security logging for uploads
 *
 * Key Patterns:
 * - Multi-layered validation approach for file security
 * - Real MIME type detection vs client-provided headers
 * - Secure filename generation to prevent path traversal
 * - Integration with antivirus scanning services
 * - Encrypted file storage with restricted permissions
 */

const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;

// Comprehensive file upload security
class SecureFileUploadService {
  constructor(virusScanner, encryptionService, securityLogger) {
    this.virusScanner = virusScanner;
    this.encryption = encryptionService;
    this.logger = securityLogger;
    this.allowedTypes = {
      'image/jpeg': { maxSize: 5 * 1024 * 1024, extensions: ['.jpg', '.jpeg'] },
      'image/png': { maxSize: 5 * 1024 * 1024, extensions: ['.png'] },
      'image/webp': { maxSize: 5 * 1024 * 1024, extensions: ['.webp'] },
      'application/pdf': { maxSize: 10 * 1024 * 1024, extensions: ['.pdf'] },
      'text/plain': { maxSize: 1 * 1024 * 1024, extensions: ['.txt'] }
    };
  }

  async validateAndProcessUpload(file, context) {
    try {
      // 1. Basic validation
      this.validateFileBasics(file);

      // 2. MIME type validation
      const detectedType = await this.detectMimeType(file.buffer);
      this.validateMimeType(detectedType, file.mimetype);

      // 3. File size validation
      this.validateFileSize(file.size, detectedType);

      // 4. File extension validation
      this.validateFileExtension(file.originalname, detectedType);

      // 5. Content validation
      await this.validateFileContent(file.buffer, detectedType);

      // 6. Virus scanning
      await this.scanForMalware(file.buffer);

      // 7. Generate secure filename
      const secureFilename = this.generateSecureFilename(file.originalname);

      // 8. Process and store file
      const result = await this.storeSecureFile(file.buffer, secureFilename, context);

      this.logger.logSecurityEvent('file_upload_success', {
        filename: secureFilename,
        originalName: file.originalname,
        mimeType: detectedType,
        size: file.size,
        userId: context.userId
      });

      return result;

    } catch (error) {
      this.logger.logSecurityViolation('file_upload_security_violation', {
        error: error.message,
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size
      }, context);

      throw error;
    }
  }

  validateFileBasics(file) {
    if (!file || !file.buffer) {
      throw new ValidationError('No file provided');
    }

    if (file.size === 0) {
      throw new ValidationError('Empty files are not allowed');
    }

    if (file.originalname.length > 255) {
      throw new ValidationError('Filename too long');
    }

    // Check for dangerous filename patterns
    const dangerousPatterns = [
      /\.\./,           // Directory traversal
      /[<>:"|?*]/,      // Invalid filename characters
      /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Windows reserved names
      /\.(exe|bat|cmd|scr|pif|jar|com|dll|msi)$/i // Executable extensions
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(file.originalname)) {
        throw new ValidationError('Invalid filename pattern detected');
      }
    }

    // Check for null bytes (path traversal attempt)
    if (file.originalname.includes('\0')) {
      throw new ValidationError('Null byte detected in filename');
    }
  }

  async detectMimeType(buffer) {
    // Use file signature detection, not client-provided MIME type
    const FileType = require('file-type');
    const result = await FileType.fromBuffer(buffer);
    return result?.mime || 'application/octet-stream';
  }

  validateMimeType(detectedType, clientType) {
    if (!this.allowedTypes[detectedType]) {
      throw new ValidationError(`File type ${detectedType} is not allowed`);
    }

    // Check if client-provided type matches detected type
    if (clientType !== detectedType) {
      // Log potential MIME type spoofing attempt
      this.logger.logSecurityViolation('mime_type_mismatch', {
        clientType,
        detectedType
      });

      // Still allow if detected type is in allowlist
      if (!this.allowedTypes[detectedType]) {
        throw new ValidationError('MIME type spoofing detected');
      }
    }
  }

  validateFileSize(size, mimeType) {
    const typeConfig = this.allowedTypes[mimeType];
    if (size > typeConfig.maxSize) {
      throw new ValidationError(`File size exceeds maximum allowed for ${mimeType}`);
    }
  }

  validateFileExtension(filename, mimeType) {
    const ext = path.extname(filename).toLowerCase();
    const typeConfig = this.allowedTypes[mimeType];

    if (!typeConfig.extensions.includes(ext)) {
      throw new ValidationError(`File extension ${ext} not allowed for MIME type ${mimeType}`);
    }
  }

  async validateFileContent(buffer, mimeType) {
    switch (mimeType) {
      case 'image/jpeg':
      case 'image/png':
      case 'image/webp':
        return this.validateImageContent(buffer);
      case 'application/pdf':
        return this.validatePDFContent(buffer);
      case 'text/plain':
        return this.validateTextContent(buffer);
      default:
        throw new ValidationError('Content validation not implemented for this file type');
    }
  }

  async validateImageContent(buffer) {
    try {
      const sharp = require('sharp');
      const metadata = await sharp(buffer).metadata();

      // Check for reasonable image dimensions
      if (metadata.width > 10000 || metadata.height > 10000) {
        throw new ValidationError('Image dimensions too large');
      }

      if (metadata.width < 1 || metadata.height < 1) {
        throw new ValidationError('Invalid image dimensions');
      }

      // Check for embedded scripts or malicious content
      if (this.containsSuspiciousContent(buffer)) {
        throw new ValidationError('Suspicious content detected in image');
      }

      // Check for excessive metadata (potential data hiding)
      if (metadata.exif && Object.keys(metadata.exif).length > 50) {
        this.logger.logSecurityViolation('excessive_image_metadata', {
          metadataKeys: Object.keys(metadata.exif).length
        });
      }

      return metadata;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError('Invalid or corrupted image file');
    }
  }

  async validatePDFContent(buffer) {
    // Check for PDF signature
    const pdfSignature = buffer.slice(0, 4);
    if (pdfSignature.toString() !== '%PDF') {
      throw new ValidationError('Invalid PDF file signature');
    }

    // Check for suspicious JavaScript or embedded content
    const content = buffer.toString('ascii');
    const suspiciousPatterns = [
      /\/JavaScript/i,
      /\/JS/i,
      /\/Launch/i,
      /\/OpenAction/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        throw new ValidationError('Suspicious content detected in PDF');
      }
    }

    return { valid: true };
  }

  async validateTextContent(buffer) {
    const content = buffer.toString('utf-8');

    // Check for suspicious content patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:text\/html/i,
      /vbscript:/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        throw new ValidationError('Suspicious content detected in text file');
      }
    }

    // Check for excessive line length (potential DoS)
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.length > 10000) {
        throw new ValidationError('Text file contains excessively long lines');
      }
    }

    return { lineCount: lines.length };
  }

  containsSuspiciousContent(buffer) {
    const content = buffer.toString('ascii');
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i,
      /eval\(/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(content));
  }

  async scanForMalware(buffer) {
    try {
      const scanResult = await this.virusScanner.scan(buffer);

      if (scanResult.infected) {
        this.logger.logSecurityViolation('malware_detected', {
          virusName: scanResult.virusName,
          scanner: scanResult.scanner,
          confidence: scanResult.confidence
        });

        throw new SecurityError(`Malware detected: ${scanResult.virusName}`);
      }

      return scanResult;
    } catch (error) {
      if (error instanceof SecurityError) {
        throw error;
      }

      // If virus scanning fails, log error but allow upload to continue
      // (depending on security requirements, you might want to fail here)
      this.logger.logSecurityViolation('virus_scan_failed', {
        error: error.message
      });

      // Optionally throw error to prevent upload when scanner is down
      // throw new SecurityError('Virus scanning service unavailable');
    }
  }

  generateSecureFilename(originalName) {
    const ext = path.extname(originalName).toLowerCase();
    const uuid = crypto.randomUUID();
    const timestamp = Date.now();

    // Use timestamp + UUID for uniqueness and ordering
    return `${timestamp}-${uuid}${ext}`;
  }

  async storeSecureFile(buffer, filename, context) {
    // Encrypt file before storage
    const encryptedData = this.encryption.encrypt(buffer, this.getFileEncryptionKey());

    // Create secure storage directory if it doesn't exist
    const storagePath = this.getSecureStoragePath();
    await this.ensureDirectoryExists(storagePath);

    // Store with restricted permissions
    const filePath = path.join(storagePath, filename);
    await fs.writeFile(filePath, Buffer.from(encryptedData.encrypted, 'hex'), { mode: 0o600 });

    // Store encryption metadata separately
    const metadataPath = filePath + '.meta';
    await fs.writeFile(metadataPath, JSON.stringify({
      iv: encryptedData.iv,
      authTag: encryptedData.authTag,
      keyId: this.getFileEncryptionKeyId()
    }), { mode: 0o600 });

    // Create database record
    const fileRecord = {
      id: crypto.randomUUID(),
      filename,
      originalName: context.originalName,
      mimeType: context.mimeType,
      size: buffer.length,
      encryptedSize: encryptedData.encrypted.length,
      uploadedBy: context.userId,
      uploadedAt: new Date(),
      encryptionKeyId: this.getFileEncryptionKeyId(),
      storagePath: filePath,
      checksum: crypto.createHash('sha256').update(buffer).digest('hex')
    };

    return fileRecord;
  }

  async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true, mode: 0o700 });
    }
  }

  getSecureStoragePath() {
    return process.env.SECURE_FILE_STORAGE_PATH || '/secure/files';
  }

  getFileEncryptionKey() {
    // In production, retrieve from secure key management service
    return crypto.scryptSync(process.env.FILE_ENCRYPTION_KEY, 'file-salt', 32);
  }

  getFileEncryptionKeyId() {
    return process.env.FILE_ENCRYPTION_KEY_ID || 'default-key-1';
  }
}

// Virus Scanner Integration
class VirusScannerService {
  constructor(scannerConfig) {
    this.config = scannerConfig;
  }

  async scan(buffer) {
    // This would integrate with actual antivirus services like ClamAV
    // For demonstration, we'll simulate the scanning process

    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check for common malware signatures (simplified)
    const content = buffer.toString('hex');
    const malwareSignatures = [
      '4d5a', // PE executable header
      '504b0304', // ZIP file that might contain malware
      'ff4d5a' // Another common malware signature
    ];

    for (const signature of malwareSignatures) {
      if (content.includes(signature)) {
        return {
          infected: true,
          virusName: 'Generic.Malware.Detected',
          scanner: 'MockScanner',
          confidence: 0.85
        };
      }
    }

    return {
      infected: false,
      scanner: 'MockScanner',
      scanTime: Date.now()
    };
  }
}

// Custom Error Classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class SecurityError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SecurityError';
  }
}

module.exports = {
  SecureFileUploadService,
  VirusScannerService,
  ValidationError,
  SecurityError
};