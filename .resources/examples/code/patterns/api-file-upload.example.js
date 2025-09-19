/**
 * API File Upload Security Pattern Examples
 *
 * Demonstrates secure file upload handling with comprehensive validation,
 * storage isolation, and processing patterns.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const sharp = require('sharp'); // For image processing
const ffmpeg = require('fluent-ffmpeg'); // For video processing
const { ValidationError, InternalServerError } = require('./api-error-handling.example');

/**
 * File Type Configuration
 *
 * Defines allowed file types with MIME type and signature validation.
 */
const ALLOWED_FILE_TYPES = {
  images: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    signatures: {
      'image/jpeg': ['FFD8FF'],
      'image/png': ['89504E47'],
      'image/gif': ['474946'],
      'image/webp': ['52494646']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    allowThumbnails: true
  },
  documents: {
    mimeTypes: ['application/pdf', 'text/plain', 'application/msword'],
    extensions: ['.pdf', '.txt', '.doc', '.docx'],
    signatures: {
      'application/pdf': ['25504446'],
      'text/plain': [], // Text files don't have consistent signatures
      'application/msword': ['D0CF11E0A1B11AE1']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    allowThumbnails: false
  },
  videos: {
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    extensions: ['.mp4', '.webm', '.mov'],
    signatures: {
      'video/mp4': ['00000018', '00000020'],
      'video/webm': ['1A45DFA3'],
      'video/quicktime': ['6674797071742020']
    },
    maxSize: 500 * 1024 * 1024, // 500MB
    allowThumbnails: true
  }
};

/**
 * Secure Storage Configuration
 *
 * Configures isolated storage with proper directory structure.
 */
const STORAGE_CONFIG = {
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  tempDir: process.env.TEMP_DIR || './uploads/temp',
  publicDir: process.env.PUBLIC_DIR || './uploads/public',
  privateDir: process.env.PRIVATE_DIR || './uploads/private',
  thumbnailDir: process.env.THUMBNAIL_DIR || './uploads/thumbnails',
  maxFileSize: 100 * 1024 * 1024, // 100MB default
  allowedDirectories: ['temp', 'public', 'private', 'thumbnails']
};

/**
 * File Signature Validator
 *
 * Validates actual file content against expected file signatures.
 */
class FileSignatureValidator {
  /**
   * Read file signature from buffer
   */
  static getFileSignature(buffer, length = 8) {
    return buffer.slice(0, length).toString('hex').toUpperCase();
  }

  /**
   * Validate file signature matches expected MIME type
   */
  static validateSignature(buffer, mimeType, fileType) {
    const signature = this.getFileSignature(buffer);
    const allowedSignatures = ALLOWED_FILE_TYPES[fileType]?.signatures[mimeType] || [];

    // Text files and some formats don't have consistent signatures
    if (allowedSignatures.length === 0) {
      return true;
    }

    return allowedSignatures.some(allowed => signature.startsWith(allowed));
  }

  /**
   * Comprehensive file validation
   */
  static async validateFile(filePath, mimeType, fileType) {
    try {
      const buffer = await fs.readFile(filePath);

      // Check file size
      const stats = await fs.stat(filePath);
      const maxSize = ALLOWED_FILE_TYPES[fileType]?.maxSize || STORAGE_CONFIG.maxFileSize;

      if (stats.size > maxSize) {
        throw new ValidationError(`File size exceeds maximum allowed size of ${maxSize} bytes`, {
          fileSize: stats.size,
          maxSize,
          type: 'size_limit'
        });
      }

      // Validate file signature
      if (!this.validateSignature(buffer, mimeType, fileType)) {
        throw new ValidationError('File signature does not match declared MIME type', {
          expectedType: mimeType,
          detectedSignature: this.getFileSignature(buffer),
          type: 'signature_mismatch'
        });
      }

      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new InternalServerError('File validation failed', { originalError: error.message });
    }
  }
}

/**
 * Filename Sanitizer
 *
 * Prevents path traversal and other filename-based attacks.
 */
class FilenameSanitizer {
  /**
   * Sanitize filename to prevent security issues
   */
  static sanitize(filename) {
    // Remove path separators and dangerous characters
    let sanitized = filename.replace(/[\/\\:*?"<>|]/g, '');

    // Remove leading dots and spaces
    sanitized = sanitized.replace(/^[.\s]+/, '');

    // Limit length
    const maxLength = 255;
    if (sanitized.length > maxLength) {
      const ext = path.extname(sanitized);
      const name = path.basename(sanitized, ext);
      sanitized = name.substring(0, maxLength - ext.length) + ext;
    }

    // Ensure filename is not empty
    if (!sanitized || sanitized.length === 0) {
      sanitized = 'unnamed_file';
    }

    return sanitized;
  }

  /**
   * Generate unique filename to prevent collisions
   */
  static generateUniqueFilename(originalFilename, prefix = '') {
    const sanitized = this.sanitize(originalFilename);
    const ext = path.extname(sanitized);
    const name = path.basename(sanitized, ext);
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');

    return `${prefix}${name}_${timestamp}_${random}${ext}`;
  }

  /**
   * Validate filename against security patterns
   */
  static isSecure(filename) {
    // Check for path traversal attempts
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return false;
    }

    // Check for system file patterns
    const dangerousPatterns = [
      /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i,
      /^\./,
      /\s+$/
    ];

    return !dangerousPatterns.some(pattern => pattern.test(filename));
  }
}

/**
 * Secure Upload Middleware
 *
 * Multer configuration with security validations.
 */
function createSecureUpload(fileType = 'images', options = {}) {
  const config = ALLOWED_FILE_TYPES[fileType];

  if (!config) {
    throw new Error(`Unsupported file type: ${fileType}`);
  }

  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        const uploadPath = path.join(STORAGE_CONFIG.tempDir);
        await fs.mkdir(uploadPath, { recursive: true });
        cb(null, uploadPath);
      } catch (error) {
        cb(error);
      }
    },

    filename: (req, file, cb) => {
      try {
        if (!FilenameSanitizer.isSecure(file.originalname)) {
          return cb(new ValidationError('Filename contains unsafe characters', {
            filename: file.originalname,
            type: 'unsafe_filename'
          }));
        }

        const uniqueFilename = FilenameSanitizer.generateUniqueFilename(
          file.originalname,
          options.prefix || ''
        );

        // Store original and sanitized names in request
        req.fileMetadata = req.fileMetadata || {};
        req.fileMetadata.originalName = file.originalname;
        req.fileMetadata.sanitizedName = uniqueFilename;

        cb(null, uniqueFilename);
      } catch (error) {
        cb(error);
      }
    }
  });

  const fileFilter = (req, file, cb) => {
    // Validate MIME type
    if (!config.mimeTypes.includes(file.mimetype)) {
      return cb(new ValidationError(`File type ${file.mimetype} not allowed`, {
        receivedType: file.mimetype,
        allowedTypes: config.mimeTypes,
        type: 'invalid_mime_type'
      }), false);
    }

    // Validate file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (!config.extensions.includes(ext)) {
      return cb(new ValidationError(`File extension ${ext} not allowed`, {
        receivedExtension: ext,
        allowedExtensions: config.extensions,
        type: 'invalid_extension'
      }), false);
    }

    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: config.maxSize,
      files: options.maxFiles || 1
    }
  });
}

/**
 * File Processing Service
 *
 * Handles post-upload processing including thumbnails and metadata extraction.
 */
class FileProcessingService {
  /**
   * Process uploaded file based on type
   */
  static async processFile(filePath, fileType, metadata = {}) {
    const results = {
      originalPath: filePath,
      processedFiles: [],
      metadata: { ...metadata },
      thumbnails: []
    };

    try {
      // Extract basic metadata
      const stats = await fs.stat(filePath);
      results.metadata.size = stats.size;
      results.metadata.uploadedAt = stats.birthtime;

      // Type-specific processing
      switch (fileType) {
        case 'images':
          await this.processImage(filePath, results);
          break;
        case 'videos':
          await this.processVideo(filePath, results);
          break;
        case 'documents':
          await this.processDocument(filePath, results);
          break;
      }

      return results;
    } catch (error) {
      throw new InternalServerError('File processing failed', {
        filePath,
        fileType,
        originalError: error.message
      });
    }
  }

  /**
   * Process image files - generate thumbnails and extract metadata
   */
  static async processImage(filePath, results) {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Extract image metadata
    results.metadata.dimensions = {
      width: metadata.width,
      height: metadata.height
    };
    results.metadata.format = metadata.format;
    results.metadata.hasAlpha = metadata.hasAlpha;

    // Generate thumbnails
    const thumbnailSizes = [
      { name: 'small', width: 150, height: 150 },
      { name: 'medium', width: 300, height: 300 },
      { name: 'large', width: 800, height: 600 }
    ];

    for (const size of thumbnailSizes) {
      const thumbnailPath = this.generateThumbnailPath(filePath, size.name);
      await fs.mkdir(path.dirname(thumbnailPath), { recursive: true });

      await image
        .resize(size.width, size.height, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(thumbnailPath);

      results.thumbnails.push({
        size: size.name,
        path: thumbnailPath,
        dimensions: size
      });
    }
  }

  /**
   * Process video files - extract metadata and generate video thumbnail
   */
  static async processVideo(filePath, results) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err);
          return;
        }

        // Extract video metadata
        const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
        if (videoStream) {
          results.metadata.dimensions = {
            width: videoStream.width,
            height: videoStream.height
          };
          results.metadata.duration = parseFloat(videoStream.duration);
          results.metadata.frameRate = eval(videoStream.r_frame_rate);
          results.metadata.codec = videoStream.codec_name;
        }

        // Generate video thumbnail
        const thumbnailPath = this.generateThumbnailPath(filePath, 'video', '.jpg');

        ffmpeg(filePath)
          .screenshots({
            timestamps: ['00:00:01'],
            filename: path.basename(thumbnailPath),
            folder: path.dirname(thumbnailPath),
            size: '300x200'
          })
          .on('end', () => {
            results.thumbnails.push({
              size: 'video',
              path: thumbnailPath,
              type: 'video_frame'
            });
            resolve();
          })
          .on('error', reject);
      });
    });
  }

  /**
   * Process document files - extract basic metadata
   */
  static async processDocument(filePath, results) {
    const ext = path.extname(filePath).toLowerCase();

    results.metadata.extension = ext;
    results.metadata.type = 'document';

    // For PDFs, you could use pdf-parse or similar libraries
    // For now, just basic file information
    if (ext === '.pdf') {
      results.metadata.documentType = 'pdf';
      // Could extract page count, text content, etc.
    }
  }

  /**
   * Generate thumbnail file path
   */
  static generateThumbnailPath(originalPath, sizeName, extension = null) {
    const originalName = path.basename(originalPath, path.extname(originalPath));
    const ext = extension || '.jpg';
    return path.join(STORAGE_CONFIG.thumbnailDir, `${originalName}_${sizeName}${ext}`);
  }
}

/**
 * File Storage Manager
 *
 * Manages file movement from temp to permanent storage with access controls.
 */
class FileStorageManager {
  /**
   * Move file from temp to permanent storage
   */
  static async moveToStorage(tempPath, destinationType = 'private', subdirectory = '') {
    if (!STORAGE_CONFIG.allowedDirectories.includes(destinationType)) {
      throw new ValidationError(`Invalid destination type: ${destinationType}`);
    }

    const filename = path.basename(tempPath);
    const destDir = path.join(STORAGE_CONFIG[`${destinationType}Dir`], subdirectory);
    const destPath = path.join(destDir, filename);

    try {
      // Ensure destination directory exists
      await fs.mkdir(destDir, { recursive: true });

      // Move file
      await fs.rename(tempPath, destPath);

      // Set appropriate permissions
      await this.setFilePermissions(destPath, destinationType);

      return destPath;
    } catch (error) {
      throw new InternalServerError('Failed to move file to storage', {
        tempPath,
        destPath,
        originalError: error.message
      });
    }
  }

  /**
   * Set appropriate file permissions based on storage type
   */
  static async setFilePermissions(filePath, storageType) {
    try {
      // Private files: owner read/write only
      // Public files: owner read/write, group/other read
      const permissions = storageType === 'private' ? 0o600 : 0o644;
      await fs.chmod(filePath, permissions);
    } catch (error) {
      // Log warning but don't fail the operation
      console.warn('Failed to set file permissions:', error.message);
    }
  }

  /**
   * Clean up temporary files
   */
  static async cleanupTempFiles(filePaths) {
    const cleanupPromises = filePaths.map(async (filePath) => {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.warn(`Failed to cleanup temp file ${filePath}:`, error.message);
      }
    });

    await Promise.allSettled(cleanupPromises);
  }

  /**
   * Generate secure download URL with expiration
   */
  static generateDownloadUrl(filePath, expiresIn = 3600) {
    const filename = path.basename(filePath);
    const timestamp = Date.now() + (expiresIn * 1000);
    const signature = crypto
      .createHmac('sha256', process.env.FILE_SECRET || 'default-secret')
      .update(`${filename}:${timestamp}`)
      .digest('hex');

    return `/api/files/download/${filename}?expires=${timestamp}&signature=${signature}`;
  }
}

/**
 * Complete Upload Handler Example
 *
 * Demonstrates the full secure upload workflow.
 */
async function handleFileUpload(req, res, next) {
  const upload = createSecureUpload('images', { maxFiles: 1 });

  upload.single('file')(req, res, async (uploadError) => {
    let tempFiles = [];

    try {
      // Handle upload errors
      if (uploadError) {
        if (uploadError instanceof multer.MulterError) {
          if (uploadError.code === 'LIMIT_FILE_SIZE') {
            throw new ValidationError('File size exceeds limit', {
              maxSize: ALLOWED_FILE_TYPES.images.maxSize,
              type: 'file_too_large'
            });
          }
          throw new ValidationError(`Upload error: ${uploadError.message}`, {
            code: uploadError.code,
            type: 'upload_error'
          });
        }
        throw uploadError;
      }

      // Check if file was uploaded
      if (!req.file) {
        throw new ValidationError('No file uploaded', { type: 'missing_file' });
      }

      const tempPath = req.file.path;
      tempFiles.push(tempPath);

      // Validate file signature
      await FileSignatureValidator.validateFile(tempPath, req.file.mimetype, 'images');

      // Process file (thumbnails, metadata)
      const processingResults = await FileProcessingService.processFile(
        tempPath,
        'images',
        {
          originalName: req.fileMetadata.originalName,
          uploadedBy: req.user?.id || null,
          userAgent: req.get('User-Agent')
        }
      );

      // Move to permanent storage
      const permanentPath = await FileStorageManager.moveToStorage(
        tempPath,
        'public',
        'uploads'
      );

      // Move thumbnails to permanent storage
      const thumbnailPaths = [];
      for (const thumbnail of processingResults.thumbnails) {
        const thumbnailPermanentPath = await FileStorageManager.moveToStorage(
          thumbnail.path,
          'public',
          'thumbnails'
        );
        thumbnailPaths.push({
          ...thumbnail,
          path: thumbnailPermanentPath,
          url: FileStorageManager.generateDownloadUrl(thumbnailPermanentPath)
        });
      }

      // Create file record in database (pseudo-code)
      const fileRecord = {
        id: crypto.randomUUID(),
        originalName: processingResults.metadata.originalName,
        filename: path.basename(permanentPath),
        path: permanentPath,
        mimeType: req.file.mimetype,
        size: processingResults.metadata.size,
        metadata: processingResults.metadata,
        thumbnails: thumbnailPaths,
        uploadedBy: req.user?.id || null,
        uploadedAt: new Date(),
        downloadUrl: FileStorageManager.generateDownloadUrl(permanentPath)
      };

      // Save to database
      // await FileModel.create(fileRecord);

      // Cleanup any remaining temp files
      await FileStorageManager.cleanupTempFiles(tempFiles);

      // Return success response
      res.apiSuccess(fileRecord, {
        processing: {
          thumbnailsGenerated: thumbnailPaths.length,
          processingTime: Date.now() - req.startTime
        }
      });

    } catch (error) {
      // Cleanup temp files on error
      await FileStorageManager.cleanupTempFiles(tempFiles);
      next(error);
    }
  });
}

/**
 * Secure File Download Handler
 *
 * Validates download URLs and enforces access controls.
 */
async function handleFileDownload(req, res, next) {
  try {
    const { filename } = req.params;
    const { expires, signature } = req.query;

    // Validate signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.FILE_SECRET || 'default-secret')
      .update(`${filename}:${expires}`)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new ValidationError('Invalid download signature', { type: 'invalid_signature' });
    }

    // Check expiration
    if (Date.now() > parseInt(expires)) {
      throw new ValidationError('Download link has expired', { type: 'expired_link' });
    }

    // Find file record and check permissions
    // const fileRecord = await FileModel.findOne({ filename });
    // if (!fileRecord) {
    //   throw new NotFoundError('File', filename);
    // }

    // For this example, assume file exists
    const filePath = path.join(STORAGE_CONFIG.publicDir, 'uploads', filename);

    try {
      await fs.access(filePath);
    } catch {
      throw new NotFoundError('File', filename);
    }

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Send file
    res.sendFile(path.resolve(filePath));

  } catch (error) {
    next(error);
  }
}

/**
 * Bulk File Upload Handler
 *
 * Handles multiple file uploads with progress tracking.
 */
async function handleBulkUpload(req, res, next) {
  const upload = createSecureUpload('images', { maxFiles: 10 });

  upload.array('files')(req, res, async (uploadError) => {
    let tempFiles = [];
    const results = [];
    const errors = [];

    try {
      if (uploadError) {
        throw uploadError;
      }

      if (!req.files || req.files.length === 0) {
        throw new ValidationError('No files uploaded', { type: 'missing_files' });
      }

      // Process each file
      for (const file of req.files) {
        tempFiles.push(file.path);

        try {
          // Validate file
          await FileSignatureValidator.validateFile(file.path, file.mimetype, 'images');

          // Process file
          const processingResults = await FileProcessingService.processFile(
            file.path,
            'images',
            { originalName: file.originalname }
          );

          // Move to storage
          const permanentPath = await FileStorageManager.moveToStorage(
            file.path,
            'public',
            'uploads'
          );

          results.push({
            originalName: file.originalname,
            filename: path.basename(permanentPath),
            status: 'success',
            metadata: processingResults.metadata
          });

        } catch (error) {
          errors.push({
            originalName: file.originalname,
            status: 'error',
            error: error.message
          });
        }
      }

      // Cleanup temp files
      await FileStorageManager.cleanupTempFiles(tempFiles);

      // Return results
      res.apiSuccess({
        successful: results,
        failed: errors,
        summary: {
          total: req.files.length,
          successful: results.length,
          failed: errors.length
        }
      });

    } catch (error) {
      await FileStorageManager.cleanupTempFiles(tempFiles);
      next(error);
    }
  });
}

/**
 * File Upload Response Examples
 */

// Successful Upload Response
const successfulUploadExample = {
  "success": true,
  "statusCode": 200,
  "timestamp": "2025-09-17T10:30:00.000Z",
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "originalName": "profile-photo.jpg",
    "filename": "profile-photo_1694948200000_a1b2c3d4.jpg",
    "path": "/uploads/public/uploads/profile-photo_1694948200000_a1b2c3d4.jpg",
    "mimeType": "image/jpeg",
    "size": 2048576,
    "metadata": {
      "dimensions": { "width": 1920, "height": 1080 },
      "format": "jpeg",
      "uploadedBy": "user123",
      "uploadedAt": "2025-09-17T10:30:00.000Z"
    },
    "thumbnails": [
      {
        "size": "small",
        "path": "/uploads/thumbnails/profile-photo_1694948200000_a1b2c3d4_small.jpg",
        "url": "/api/files/download/profile-photo_1694948200000_a1b2c3d4_small.jpg?expires=1694951800&signature=abc123"
      }
    ],
    "downloadUrl": "/api/files/download/profile-photo_1694948200000_a1b2c3d4.jpg?expires=1694951800&signature=def456"
  },
  "metadata": {
    "processing": {
      "thumbnailsGenerated": 3,
      "processingTime": 1250
    }
  }
};

// Upload Error Response
const uploadErrorExample = {
  "success": false,
  "statusCode": 400,
  "timestamp": "2025-09-17T10:30:00.000Z",
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "error": {
    "message": "File signature does not match declared MIME type",
    "code": "VALIDATION_ERROR",
    "details": {
      "expectedType": "image/jpeg",
      "detectedSignature": "89504E47",
      "type": "signature_mismatch"
    }
  }
};

module.exports = {
  // Configuration
  ALLOWED_FILE_TYPES,
  STORAGE_CONFIG,

  // Classes
  FileSignatureValidator,
  FilenameSanitizer,
  FileProcessingService,
  FileStorageManager,

  // Middleware and handlers
  createSecureUpload,
  handleFileUpload,
  handleFileDownload,
  handleBulkUpload,

  // Examples
  examples: {
    successfulUploadExample,
    uploadErrorExample
  }
};

/**
 * Key Security Benefits:
 *
 * 1. MIME Type Validation: Don't trust client-declared types
 * 2. File Signature Verification: Validate actual file content
 * 3. Filename Sanitization: Prevent path traversal attacks
 * 4. Size Restrictions: Prevent resource exhaustion
 * 5. Isolated Storage: Separate from application code
 * 6. Access Controls: Proper file permissions and download validation
 * 7. Async Processing: Don't block uploads for heavy operations
 * 8. Error Handling: Graceful failure with cleanup
 *
 * Usage Tips:
 * - Always validate both MIME type and file signature
 * - Use temporary storage during upload validation
 * - Generate unique filenames to prevent collisions
 * - Implement virus scanning for user-generated content
 * - Set appropriate file permissions based on storage type
 * - Provide secure download URLs with expiration
 * - Clean up temporary files on both success and failure
 * - Log security events for monitoring and alerting
 */