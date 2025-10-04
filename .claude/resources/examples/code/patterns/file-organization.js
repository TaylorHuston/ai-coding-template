// File and Directory Organization Examples

// ===== Good: Clear organization =====
/*
src/
├── user-authentication/
│   ├── auth-service.js
│   ├── password-validator.js
│   └── session-manager.js
├── payment-processing/
│   ├── payment-gateway.js
│   └── transaction-validator.js
└── shared/
    ├── error-handler.js
    └── logger.js
*/

// ===== Bad: Unclear structure =====
/*
src/
├── auth/
│   ├── svc.js
│   ├── pwd.js
│   └── sess.js
└── pay/
    ├── gw.js
    └── val.js
*/

// ===== Good: Well-organized file structure =====

// 1. Imports/requires
import { Logger } from '../shared/logger.js';
import { validateInput } from '../validators/input-validator.js';

// 2. Constants
const MAX_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

// 3. Helper functions (internal)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 4. Main functionality
export class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.logger = new Logger();
  }

  async request(endpoint, options = {}) {
    // Implementation
  }
}

// 5. Default export (if applicable)
export default ApiClient;