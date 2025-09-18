// Semantic Security Analysis with Serena MCP Server
// Demonstrates how AI agents use semantic code tools for security auditing

/**
 * Example: Security audit workflow using Serena's semantic capabilities
 * This shows how the security-auditor agent leverages semantic tools
 * for comprehensive security analysis
 */

// EXAMPLE SCENARIO: Auditing authentication flow for security vulnerabilities

class SecurityAuditWorkflow {
  constructor(serenaTools) {
    this.findSymbol = serenaTools.find_symbol;
    this.findReferences = serenaTools.find_referencing_symbols;
  }

  async auditAuthenticationFlow() {
    console.log("🔍 Starting semantic security audit...");

    // Step 1: Find all authentication-related symbols
    const authSymbols = await this.findSymbol("authenticate");
    console.log("Found authentication symbols:", authSymbols);

    // Step 2: Analyze each symbol's security implementation
    for (const symbol of authSymbols) {
      await this.analyzeSymbolSecurity(symbol);
    }

    // Step 3: Check for security anti-patterns
    await this.checkSecurityAntiPatterns();

    // Step 4: Validate data flow security
    await this.validateDataFlowSecurity();
  }

  async analyzeSymbolSecurity(symbol) {
    // Find all places where this authentication method is called
    const references = await this.findReferences(symbol.name);

    console.log(`Analyzing ${symbol.name} security:`);
    console.log(`- Found ${references.length} references`);

    // Security checks:
    for (const ref of references) {
      // Check 1: Input validation
      if (this.lacksInputValidation(ref)) {
        console.warn(`⚠️  Missing input validation in ${ref.location}`);
      }

      // Check 2: Rate limiting
      if (this.lacksRateLimiting(ref)) {
        console.warn(`⚠️  Missing rate limiting in ${ref.location}`);
      }

      // Check 3: Error information disclosure
      if (this.hasErrorDisclosure(ref)) {
        console.warn(`🚨 Potential error information disclosure in ${ref.location}`);
      }
    }
  }

  async checkSecurityAntiPatterns() {
    console.log("🔍 Checking for security anti-patterns...");

    // Find hardcoded credentials
    const credentialSymbols = await this.findSymbol("password|secret|key|token");
    for (const symbol of credentialSymbols) {
      if (this.isHardcodedCredential(symbol)) {
        console.error(`🚨 CRITICAL: Hardcoded credential found: ${symbol.name}`);
      }
    }

    // Find SQL injection vulnerabilities
    const querySymbols = await this.findSymbol("query|sql|SELECT|INSERT|UPDATE|DELETE");
    for (const symbol of querySymbols) {
      const references = await this.findReferences(symbol.name);
      if (this.hasStringConcatenation(references)) {
        console.error(`🚨 HIGH: Potential SQL injection in ${symbol.name}`);
      }
    }

    // Find eval() usage
    const evalSymbols = await this.findSymbol("eval");
    if (evalSymbols.length > 0) {
      console.error(`🚨 HIGH: eval() usage found - ${evalSymbols.length} instances`);
    }
  }

  async validateDataFlowSecurity() {
    console.log("🔍 Validating data flow security...");

    // Find user input entry points
    const inputSymbols = await this.findSymbol("req.body|req.params|req.query");

    for (const input of inputSymbols) {
      const dataFlow = await this.traceDataFlow(input);

      // Check if user input reaches sensitive operations without validation
      const sensitiveOps = dataFlow.filter(op =>
        op.type === 'database_operation' ||
        op.type === 'file_operation' ||
        op.type === 'system_command'
      );

      for (const op of sensitiveOps) {
        if (!this.hasValidationInPath(input, op)) {
          console.error(`🚨 CRITICAL: Unvalidated user input reaches ${op.type}`);
        }
      }
    }
  }

  async traceDataFlow(startSymbol) {
    // Use semantic analysis to trace how data flows through the application
    const references = await this.findReferences(startSymbol.name);
    const dataFlow = [];

    for (const ref of references) {
      // Semantic analysis determines the operation type
      if (ref.context.includes('query') || ref.context.includes('sql')) {
        dataFlow.push({ type: 'database_operation', location: ref.location });
      } else if (ref.context.includes('fs.') || ref.context.includes('readFile')) {
        dataFlow.push({ type: 'file_operation', location: ref.location });
      } else if (ref.context.includes('exec') || ref.context.includes('spawn')) {
        dataFlow.push({ type: 'system_command', location: ref.location });
      }
    }

    return dataFlow;
  }

  lacksInputValidation(reference) {
    // Semantic analysis to check if validation exists before this reference
    return !reference.context.includes('validate') &&
           !reference.context.includes('sanitize') &&
           !reference.context.includes('joi.') &&
           !reference.context.includes('yup.');
  }

  lacksRateLimiting(reference) {
    // Check if rate limiting middleware is present
    return !reference.context.includes('rateLimit') &&
           !reference.context.includes('slowDown') &&
           !reference.context.includes('express-rate-limit');
  }

  hasErrorDisclosure(reference) {
    // Check for detailed error messages that could leak information
    return reference.context.includes('error.message') ||
           reference.context.includes('err.stack') ||
           reference.context.includes('console.error(err)');
  }

  isHardcodedCredential(symbol) {
    // Check if the symbol value contains hardcoded credentials
    return symbol.value &&
           symbol.value.match(/^(sk_|pk_|[A-Za-z0-9]{32,}|password123|admin)$/);
  }

  hasStringConcatenation(references) {
    // Check for SQL string concatenation (injection risk)
    return references.some(ref =>
      ref.context.includes('+') &&
      (ref.context.includes('SELECT') ||
       ref.context.includes('INSERT') ||
       ref.context.includes('UPDATE') ||
       ref.context.includes('DELETE'))
    );
  }

  hasValidationInPath(input, operation) {
    // Complex semantic analysis to determine if validation exists
    // This would require tracing the actual data flow path
    // For demonstration, simplified check
    return false; // Would be implemented with full semantic analysis
  }
}

// EXAMPLE USAGE: How the security-auditor agent would use this

/*
Agent Workflow Example:

1. Agent receives task: "Audit authentication security"

2. Agent uses Serena tools:
   ```javascript
   // Find authentication entry points
   const authSymbols = await mcp__serena__find_symbol("authenticate|login|signin");

   // For each symbol, find all references
   for (const symbol of authSymbols) {
     const refs = await mcp__serena__find_referencing_symbols(symbol.name);
     // Analyze each reference for security issues
   }
   ```

3. Agent generates security report with:
   - Specific line numbers and files
   - Exact security issues found
   - Recommendations for fixes
   - Risk severity levels

4. Agent can use insert_after_symbol to suggest fixes:
   ```javascript
   await mcp__serena__insert_after_symbol(
     "function authenticate(req, res)",
     "  // Add input validation\n  if (!validateInput(req.body)) {\n    return res.status(400).json({error: 'Invalid input'});\n  }"
   );
   ```
*/

// BENEFITS OF SEMANTIC SECURITY ANALYSIS:

// 1. PRECISION: Find exact security issues, not just patterns
// 2. CONTEXT AWARENESS: Understand code relationships and data flow
// 3. TOKEN EFFICIENCY: Only analyze relevant code sections
// 4. CROSS-LANGUAGE: Works with any LSP-supported language
// 5. ARCHITECTURAL UNDERSTANDING: See security from system perspective

export default SecurityAuditWorkflow;