// SOLID Principles - Single Responsibility Principle (SRP)

// ❌ SRP violation: Multiple responsibilities
class User {
  constructor(
    public name: string,
    public email: string
  ) {}

  // Responsibility 1: User data management
  updateEmail(newEmail: string) {
    this.email = newEmail;
  }

  // Responsibility 2: Validation logic
  isValidEmail(): boolean {
    return this.email.includes('@');
  }

  // Responsibility 3: Persistence
  save() {
    database.users.update(this.id, this);
  }

  // Responsibility 4: Email sending
  sendWelcomeEmail() {
    emailService.send(this.email, 'Welcome!');
  }
}

// ✅ SRP compliance: Single responsibility per class
class User {
  constructor(
    public name: string,
    public email: string
  ) {}

  updateEmail(newEmail: string) {
    this.email = newEmail;
  }
}

class UserValidator {
  static isValidEmail(email: string): boolean {
    return email.includes('@') && email.includes('.');
  }
}

class UserRepository {
  save(user: User): void {
    database.users.update(user.id, user);
  }
}

class UserNotificationService {
  sendWelcomeEmail(user: User): void {
    emailService.send(user.email, 'Welcome!');
  }
}