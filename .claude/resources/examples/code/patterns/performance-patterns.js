// Performance Patterns Examples

// ===== Good: Efficient iteration =====
const activeUsers = users.filter(user => user.isActive);
const userEmails = activeUsers.map(user => user.email);

// ===== Good: Early exit for expensive operations =====
function findUserByEmail(email) {
  if (!email || !email.includes('@')) {
    return null; // Early exit for invalid input
  }

  return users.find(user => user.email === email);
}

// ===== Good: Caching expensive operations =====
class DataProcessor {
  constructor() {
    this.cache = new Map();
  }

  processData(key) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const result = this.expensiveOperation(key);
    this.cache.set(key, result);
    return result;
  }

  expensiveOperation(key) {
    // Simulate expensive computation
    console.log(`Processing ${key}...`);
    return key.toUpperCase();
  }

  clearCache() {
    this.cache.clear();
  }
}

// ===== Good: Batch operations =====
class DatabaseService {
  async batchInsertUsers(users) {
    // Insert multiple users in a single database operation
    return await this.database.users.insertMany(users);
  }

  async bulkUpdateUserStatus(userIds, status) {
    // Update multiple users at once instead of individual updates
    return await this.database.users.updateMany(
      { id: { $in: userIds } },
      { $set: { status } }
    );
  }
}

// ===== Good: Lazy loading =====
class UserProfile {
  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this._detailedProfile = null; // Not loaded initially
  }

  async getDetailedProfile() {
    if (!this._detailedProfile) {
      this._detailedProfile = await this.loadDetailedProfile();
    }
    return this._detailedProfile;
  }

  async loadDetailedProfile() {
    // Expensive operation only performed when needed
    return await api.getUserProfile(this.id);
  }
}