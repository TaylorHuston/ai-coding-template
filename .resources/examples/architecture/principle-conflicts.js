// Architectural Principle Conflicts and Trade-offs

// Scenario: DRY vs YAGNI conflict
// Current need: Two similar but distinct validation functions

// ❌ Over-DRY: Premature abstraction (violates YAGNI)
function createValidator(type, rules, options = {}) {
  return new GenericValidator(type, rules, options); // Complex for 2 cases
}

// ✅ Balanced approach: Accept minor duplication until pattern emerges
function validateEmail(email) {
  return email && email.includes('@') && email.includes('.');
}

function validateUsername(username) {
  return username && username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
}

// Refactor to DRY when you have 3+ similar functions (Rule of Three)

/**
 * Principle Application Priority:
 * 1. KISS First: If it's not simple, the other principles don't matter
 * 2. SOLID Structure: Once simple, organize properly
 * 3. DRY Refinement: Remove duplication after structure is clear
 * 4. YAGNI Constraint: Only build what you actually need
 *
 * Architectural Decision Framework:
 * For every significant code decision, ask:
 * 1. KISS: Is this the simplest solution that works?
 * 2. SRP: Does this class/function have a single reason to change?
 * 3. DRY: Am I repeating logic or knowledge?
 * 4. YAGNI: Do I need this feature now?
 * 5. OCP: Can I extend this without modifying existing code?
 * 6. LSP: Can I substitute implementations without breaking behavior?
 * 7. ISP: Are my interfaces focused and cohesive?
 * 8. DIP: Am I depending on abstractions rather than concretions?
 */