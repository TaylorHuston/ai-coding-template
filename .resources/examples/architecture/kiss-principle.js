// KISS Principle Examples - Keep It Simple, Stupid

// ❌ Complex solution
class UserDataProcessor {
  processUser(user) {
    const validator = new UserValidatorFactory().createValidator(user.type);
    const transformer = new DataTransformerChain()
      .addTransformer(new NormalizationTransformer())
      .addTransformer(new ValidationTransformer(validator))
      .addTransformer(new SerializationTransformer());
    return transformer.process(user);
  }
}

// ✅ Simple solution
function processUser(user) {
  if (!user.email || !user.name) {
    throw new Error('Missing required fields');
  }
  return {
    email: user.email.toLowerCase().trim(),
    name: user.name.trim()
  };
}

/**
 * KISS Decision Framework:
 * 1. Can this be solved with existing language features? (Prefer built-ins over libraries)
 * 2. Would a junior developer understand this in 6 months? (Optimize for readability)
 * 3. Does this solve the actual problem? (Avoid solving imaginary problems)
 * 4. Can this be explained in plain English in under 30 seconds? (Complexity indicator)
 */