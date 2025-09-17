/**
 * Password Security Implementation Example
 *
 * Comprehensive password handling with strength validation, secure hashing,
 * and entropy calculation
 *
 * Features:
 * - Configurable password requirements
 * - Entropy calculation
 * - Common password detection
 * - User information validation
 * - Constant-time verification
 * - Secure random password generation
 */

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true,
  preventUserInfoInPassword: true
};

class PasswordService {
  constructor() {
    this.commonPasswords = new Set([
      'password', '123456', 'password123', 'admin', 'qwerty',
      'letmein', 'welcome', 'monkey', '1234567890', 'abc123'
      // In real implementation, load from comprehensive list
    ]);
  }

  async hashPassword(password, userData = {}) {
    // Validate password strength
    this.validatePasswordStrength(password, userData);

    // Use bcrypt with high cost factor
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  validatePasswordStrength(password, userData) {
    // Check basic requirements
    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
      throw new ValidationError('Password too short');
    }

    if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
      throw new ValidationError('Password too long');
    }

    // Check character requirements
    if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
      throw new ValidationError('Password must contain uppercase letters');
    }

    if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
      throw new ValidationError('Password must contain lowercase letters');
    }

    if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
      throw new ValidationError('Password must contain numbers');
    }

    if (PASSWORD_REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new ValidationError('Password must contain special characters');
    }

    // Check against common passwords
    if (this.isCommonPassword(password)) {
      throw new ValidationError('Password is too common');
    }

    // Check against user information
    if (this.containsUserInfo(password, userData)) {
      throw new ValidationError('Password cannot contain personal information');
    }

    // Calculate entropy
    const entropy = this.calculatePasswordEntropy(password);
    if (entropy < 60) {
      throw new ValidationError('Password is not complex enough');
    }
  }

  calculatePasswordEntropy(password) {
    const charsets = [
      /[a-z]/.test(password) ? 26 : 0, // lowercase
      /[A-Z]/.test(password) ? 26 : 0, // uppercase
      /\d/.test(password) ? 10 : 0,    // digits
      /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 32 : 0 // special chars
    ];

    const charsetSize = charsets.reduce((sum, size) => sum + size, 0);
    return password.length * Math.log2(charsetSize);
  }

  isCommonPassword(password) {
    // Check against common passwords list
    if (this.commonPasswords.has(password.toLowerCase())) {
      return true;
    }

    // Check for simple patterns
    if (/^(.)\1+$/.test(password)) { // All same character
      return true;
    }

    if (/^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+$/i.test(password)) {
      return true; // Sequential characters
    }

    if (/^(qwe|asd|zxc|qaz|wsx|edc|rfv|tgb|yhn|ujm|ik|ol|p)+$/i.test(password)) {
      return true; // Keyboard patterns
    }

    return false;
  }

  containsUserInfo(password, userData) {
    if (!userData) return false;

    const lowerPassword = password.toLowerCase();
    const checkFields = ['firstName', 'lastName', 'email', 'username', 'phone'];

    for (const field of checkFields) {
      if (userData[field]) {
        const value = userData[field].toLowerCase();

        // Check if password contains the field value
        if (lowerPassword.includes(value)) {
          return true;
        }

        // Check if password contains part of email before @
        if (field === 'email' && value.includes('@')) {
          const emailPrefix = value.split('@')[0];
          if (lowerPassword.includes(emailPrefix)) {
            return true;
          }
        }
      }
    }

    // Check birth year if provided
    if (userData.birthDate) {
      const birthYear = new Date(userData.birthDate).getFullYear().toString();
      if (lowerPassword.includes(birthYear)) {
        return true;
      }
    }

    return false;
  }

  // Prevent timing attacks during verification
  async verifyPassword(password, hashedPassword) {
    const isValid = await bcrypt.compare(password, hashedPassword);

    // Add consistent timing delay
    await this.constantTimeDelay();

    return isValid;
  }

  async constantTimeDelay() {
    // Add small random delay to prevent timing analysis
    const delay = Math.random() * 50 + 50; // 50-100ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  async generateSecureRandomPassword(length = 16) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';

    // Ensure at least one character from each required type
    password += this.getRandomChar('abcdefghijklmnopqrstuvwxyz');
    password += this.getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    password += this.getRandomChar('0123456789');
    password += this.getRandomChar('!@#$%^&*');

    // Fill remaining length
    for (let i = 4; i < length; i++) {
      password += this.getRandomChar(charset);
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  getRandomChar(charset) {
    const randomIndex = crypto.randomInt(0, charset.length);
    return charset[randomIndex];
  }

  async generatePasswordResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  async hashPasswordResetToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  validatePasswordResetToken(token, hashedToken) {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    return this.constantTimeCompare(hash, hashedToken);
  }

  constantTimeCompare(a, b) {
    if (a.length !== b.length) return false;

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  // Password strength meter
  calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];

    // Length scoring
    if (password.length >= 12) score += 25;
    else if (password.length >= 8) score += 15;
    else feedback.push('Use at least 12 characters');

    // Character variety scoring
    if (/[a-z]/.test(password)) score += 15;
    else feedback.push('Add lowercase letters');

    if (/[A-Z]/.test(password)) score += 15;
    else feedback.push('Add uppercase letters');

    if (/\d/.test(password)) score += 15;
    else feedback.push('Add numbers');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 15;
    else feedback.push('Add special characters');

    // Complexity bonuses
    if (password.length >= 16) score += 10;
    if (/[a-z].*[A-Z]|[A-Z].*[a-z]/.test(password)) score += 5; // Mixed case
    if (!/(.)\1{2,}/.test(password)) score += 5; // No repeated characters

    // Penalties
    if (this.isCommonPassword(password)) score -= 25;
    if (/^[a-zA-Z]+$/.test(password)) score -= 10; // Only letters
    if (/^\d+$/.test(password)) score -= 15; // Only numbers

    score = Math.max(0, Math.min(100, score));

    let strength;
    if (score >= 80) strength = 'Very Strong';
    else if (score >= 60) strength = 'Strong';
    else if (score >= 40) strength = 'Medium';
    else if (score >= 20) strength = 'Weak';
    else strength = 'Very Weak';

    return {
      score,
      strength,
      feedback,
      entropy: this.calculatePasswordEntropy(password)
    };
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

module.exports = { PasswordService, ValidationError, PASSWORD_REQUIREMENTS };