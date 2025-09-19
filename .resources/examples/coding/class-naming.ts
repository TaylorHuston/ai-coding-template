// Class and Type Naming Examples

// Good: Clear, descriptive class names
class UserAuthenticationService {
  authenticate(credentials: UserCredentials): Promise<AuthResult> {
    // Implementation
  }
}

class PaymentProcessor {
  processPayment(payment: PaymentRequest): Promise<PaymentResult> {
    // Implementation
  }
}

interface DatabaseConnection {
  query(sql: string, params?: any[]): Promise<QueryResult>;
  close(): Promise<void>;
}

type ApiResponse<T> = {
  data: T;
  status: number;
  message?: string;
};

// Bad: Unclear or generic
class Service {
  // What kind of service?
}

class Manager {
  // Manages what?
}

interface Connection {
  // Connection to what?
}

type Response = {
  // Response from what?
};