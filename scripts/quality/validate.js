#!/usr/bin/env node

/**
 * Unified Validation Framework
 * Consolidates all validation scripts into a pluggable framework
 *
 * Usage: node scripts/validate.js <validator> [options]
 *
 * Validators:
 *   quality-gates           Enforce quality standards before task progression
 *   context                 Validate HANDOFF.yml and RESEARCH.md integrity
 *   agent-output           Validate agent outputs meet requirements
 *   workflow-state         Check workflow state and transitions
 *   pre-task               Pre-task validation checks
 *   pre-edit               Pre-edit validation checks
 *   post-agent             Post-agent execution validation
 *   all                    Run all applicable validators
 *
 * Options:
 *   --strict               Enable strict validation mode
 *   --quiet                Minimal output
 *   --continue-on-failure  Don't exit on validation failures
 *   --format json|table    Output format (default: table)
 *   --output FILE          Write results to file
 *   --task TASK-ID         Task identifier for context
 *   --agent AGENT-TYPE     Agent type for specific validation
 *   --file FILE            File to validate
 *
 * Examples:
 *   validate.js quality-gates --strict
 *   validate.js context --quiet
 *   validate.js agent-output --task TASK-001 --file output.md
 *   validate.js all --format json --output validation-report.json
 */

const { log, colors, parseArgs, execSafe, writeJsonReport, formatters, EXIT_CODES, findFiles } = require('../lib/common.js');
const fs = require('fs');
const path = require('path');
// Optional js-yaml dependency with fallback
let yaml;
try {
  yaml = require('js-yaml');
} catch (e) {
  // Fallback if js-yaml not available
  yaml = {
    load: (content) => {
      try {
        return JSON.parse(content);
      } catch (e) {
        throw new Error('js-yaml not available and content is not JSON');
      }
    }
  };
}

// Configuration
const CONFIG = {
  workflowDir: './.claude/working',
  contextFiles: ['HANDOFF.yml', 'RESEARCH.md'],
  qualityGates: {
    testsRequired: true,
    lintRequired: true,
    typeCheckRequired: true,
    documentationRequired: false
  },
  agents: {
    frontend: ['component', 'styling', 'responsive'],
    backend: ['api', 'database', 'middleware'],
    database: ['schema', 'migration', 'query'],
    test: ['unit', 'integration', 'e2e']
  }
};

// Validation result structure
class ValidationResult {
  constructor(validator, valid = true) {
    this.validator = validator;
    this.valid = valid;
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.metrics = {};
  }

  addError(message, file = null, line = null) {
    this.errors.push({ message, file, line });
    this.valid = false;
  }

  addWarning(message, file = null, line = null) {
    this.warnings.push({ message, file, line });
  }

  addInfo(message, file = null, line = null) {
    this.info.push({ message, file, line });
  }

  setMetric(key, value) {
    this.metrics[key] = value;
  }

  toJSON() {
    return {
      validator: this.validator,
      valid: this.valid,
      errors: this.errors,
      warnings: this.warnings,
      info: this.info,
      metrics: this.metrics,
      summary: {
        errorCount: this.errors.length,
        warningCount: this.warnings.length,
        infoCount: this.info.length
      }
    };
  }
}

// Validator implementations
const validators = {
  async qualityGates(args) {
    const result = new ValidationResult('quality-gates');
    const strict = args.flags.has('strict');

    log.debug('Running quality gate validation...');

    // Test validation
    if (CONFIG.qualityGates.testsRequired) {
      const testResult = await runTests();
      result.setMetric('testsPass', testResult.success);

      if (!testResult.success) {
        if (strict) {
          result.addError('Tests are failing', null, null);
        } else {
          result.addWarning('Tests are failing');
        }
      } else {
        result.addInfo('All tests passing');
      }
    }

    // Lint validation
    if (CONFIG.qualityGates.lintRequired) {
      const lintResult = await runLinter();
      result.setMetric('lintPass', lintResult.success);

      if (!lintResult.success) {
        if (strict) {
          result.addError('Linting issues found');
        } else {
          result.addWarning('Linting issues found');
        }
      } else {
        result.addInfo('Linting passed');
      }
    }

    // Type check validation
    if (CONFIG.qualityGates.typeCheckRequired) {
      const typeResult = await runTypeCheck();
      result.setMetric('typeCheckPass', typeResult.success);

      if (!typeResult.success) {
        if (strict) {
          result.addError('Type checking failed');
        } else {
          result.addWarning('Type checking failed');
        }
      } else {
        result.addInfo('Type checking passed');
      }
    }

    // Git status check
    const gitStatus = execSafe('git status --porcelain', { silent: true });
    if (gitStatus.success && gitStatus.output.trim()) {
      const changes = gitStatus.output.trim().split('\n').length;
      result.setMetric('uncommittedChanges', changes);
      result.addInfo(`${changes} uncommitted changes`);
    }

    return result;
  },

  async context(args) {
    const result = new ValidationResult('context');

    log.debug('Validating context files...');

    // Check for workflow directory
    if (!fs.existsSync(CONFIG.workflowDir)) {
      result.addWarning('No active workflow directory found');
      return result;
    }

    // Find current task directory
    const taskDirs = fs.readdirSync(CONFIG.workflowDir)
      .filter(dir => fs.statSync(path.join(CONFIG.workflowDir, dir)).isDirectory());

    if (taskDirs.length === 0) {
      result.addWarning('No task directories found');
      return result;
    }

    // Validate each task directory
    for (const taskDir of taskDirs) {
      const taskPath = path.join(CONFIG.workflowDir, taskDir);

      // Check for required context files
      for (const requiredFile of CONFIG.contextFiles) {
        const filePath = path.join(taskPath, requiredFile);

        if (!fs.existsSync(filePath)) {
          result.addError(`Missing ${requiredFile}`, taskDir);
          continue;
        }

        // Validate file content
        try {
          const content = fs.readFileSync(filePath, 'utf8');

          if (requiredFile === 'HANDOFF.yml') {
            await validateHandoffFile(content, result, taskDir);
          } else if (requiredFile === 'RESEARCH.md') {
            await validateResearchFile(content, result, taskDir);
          }
        } catch (error) {
          result.addError(`Failed to read ${requiredFile}: ${error.message}`, taskDir);
        }
      }
    }

    result.setMetric('taskDirectories', taskDirs.length);
    return result;
  },

  async agentOutput(args) {
    const result = new ValidationResult('agent-output');
    const outputFile = args.options.file;
    const taskId = args.options.task;
    const agentType = args.options.agent;

    if (!outputFile) {
      result.addError('Output file required (--file)');
      return result;
    }

    if (!fs.existsSync(outputFile)) {
      result.addError(`Output file not found: ${outputFile}`);
      return result;
    }

    log.debug(`Validating agent output: ${outputFile}`);

    try {
      const content = fs.readFileSync(outputFile, 'utf8');

      // Basic structure validation
      const lines = content.split('\n');
      result.setMetric('outputLines', lines.length);

      // Check for common agent output patterns
      const hasCodeBlocks = /```[\s\S]*?```/.test(content);
      const hasExplanation = content.length > 100;
      const hasErrors = /error|failed|exception/i.test(content);

      result.setMetric('hasCodeBlocks', hasCodeBlocks);
      result.setMetric('hasExplanation', hasExplanation);
      result.setMetric('hasErrors', hasErrors);

      if (!hasExplanation) {
        result.addWarning('Output appears too brief');
      }

      if (hasErrors) {
        result.addWarning('Output contains error indicators');
      }

      // Agent-specific validation
      if (agentType && CONFIG.agents[agentType]) {
        await validateAgentSpecificOutput(content, agentType, result);
      }

      if (taskId) {
        result.setMetric('taskId', taskId);
      }

    } catch (error) {
      result.addError(`Failed to validate output: ${error.message}`);
    }

    return result;
  },

  async workflowState(args) {
    const result = new ValidationResult('workflow-state');

    log.debug('Checking workflow state...');

    // Check git branch
    const branchResult = execSafe('git rev-parse --abbrev-ref HEAD', { silent: true });
    if (branchResult.success) {
      const branch = branchResult.output.trim();
      result.setMetric('currentBranch', branch);

      if (branch === 'main' || branch === 'master') {
        result.addWarning('Working on main branch - consider using feature branch');
      }
    }

    // Check for active workflows
    if (fs.existsSync(CONFIG.workflowDir)) {
      const activeTasks = fs.readdirSync(CONFIG.workflowDir)
        .filter(dir => fs.statSync(path.join(CONFIG.workflowDir, dir)).isDirectory());

      result.setMetric('activeTasks', activeTasks.length);

      if (activeTasks.length > 3) {
        result.addWarning('Many active tasks - consider cleaning up completed work');
      }
    }

    return result;
  },

  async preTask(args) {
    const result = new ValidationResult('pre-task');

    log.debug('Running pre-task validation...');

    // Check git status
    const gitStatus = execSafe('git status --porcelain', { silent: true });
    if (gitStatus.success && gitStatus.output.trim()) {
      result.addInfo('Working directory has uncommitted changes');
    }

    // Validate context if available
    if (fs.existsSync(CONFIG.workflowDir)) {
      const contextResult = await validators.context(args);
      result.errors.push(...contextResult.errors);
      result.warnings.push(...contextResult.warnings);
    }

    return result;
  },

  async preEdit(args) {
    const result = new ValidationResult('pre-edit');

    log.debug('Running pre-edit validation...');

    // Check if tests are passing before allowing edits
    const testResult = await runTests();
    if (!testResult.success) {
      result.addWarning('Tests failing before edit - proceed with caution');
    }

    // Check file permissions and status
    const file = args.options.file;
    if (file && fs.existsSync(file)) {
      const stats = fs.statSync(file);
      result.setMetric('fileSize', stats.size);
      result.setMetric('lastModified', stats.mtime.toISOString());
    }

    return result;
  },

  async postAgent(args) {
    const result = new ValidationResult('post-agent');

    log.debug('Running post-agent validation...');

    // Run quality gates with less strict mode
    const qualityResult = await validators.qualityGates({ ...args, flags: new Set() });

    // Convert quality gate errors to warnings for post-agent
    qualityResult.errors.forEach(error => {
      result.addWarning(`Quality: ${error.message}`);
    });

    result.warnings.push(...qualityResult.warnings);
    Object.assign(result.metrics, qualityResult.metrics);

    return result;
  },

  async all(args) {
    const result = new ValidationResult('all');
    const validatorNames = ['quality-gates', 'context', 'workflow-state'];

    log.debug('Running all validators...');

    for (const validatorName of validatorNames) {
      try {
        const validatorResult = await validators[validatorName.replace('-', '').replace('gates', 'Gates')](args);

        result.errors.push(...validatorResult.errors.map(e => ({ ...e, validator: validatorName })));
        result.warnings.push(...validatorResult.warnings.map(w => ({ ...w, validator: validatorName })));
        result.info.push(...validatorResult.info.map(i => ({ ...i, validator: validatorName })));

        Object.keys(validatorResult.metrics).forEach(key => {
          result.setMetric(`${validatorName}.${key}`, validatorResult.metrics[key]);
        });

      } catch (error) {
        result.addError(`Validator ${validatorName} failed: ${error.message}`);
      }
    }

    return result;
  }
};

// Helper functions
async function runTests() {
  const commands = ['npm test', 'npm run test', 'yarn test', 'pnpm test'];

  for (const cmd of commands) {
    const result = execSafe(cmd, { silent: true });
    if (result.success) {
      return { success: true, output: result.output };
    }
  }

  return { success: false, output: 'No test command found' };
}

async function runLinter() {
  const commands = ['npm run lint', 'yarn lint', 'pnpm lint'];

  for (const cmd of commands) {
    const result = execSafe(cmd, { silent: true });
    if (result.success) {
      return { success: result.output.includes('0 errors'), output: result.output };
    }
  }

  return { success: true, output: 'No linter found' };
}

async function runTypeCheck() {
  const commands = ['npm run typecheck', 'npx tsc --noEmit', 'yarn typecheck'];

  for (const cmd of commands) {
    const result = execSafe(cmd, { silent: true });
    if (result.success) {
      return { success: true, output: result.output };
    }
  }

  return { success: true, output: 'No type checker found' };
}

async function validateHandoffFile(content, result, context) {
  try {
    const handoff = yaml.load(content);

    // Check required fields
    const requiredFields = ['current_agent', 'next_agent', 'task_status', 'context'];
    for (const field of requiredFields) {
      if (!(field in handoff)) {
        result.addError(`Missing required field: ${field}`, context);
      }
    }

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed', 'blocked'];
    if (handoff.task_status && !validStatuses.includes(handoff.task_status)) {
      result.addWarning(`Invalid task status: ${handoff.task_status}`, context);
    }

  } catch (error) {
    result.addError(`Invalid YAML format: ${error.message}`, context);
  }
}

async function validateResearchFile(content, result, context) {
  const lines = content.split('\n').length;

  if (lines < 10) {
    result.addWarning('RESEARCH.md appears too brief', context);
  }

  // Check for key sections
  const requiredSections = ['# Research', '## Context', '## Findings'];
  for (const section of requiredSections) {
    if (!content.includes(section)) {
      result.addWarning(`Missing section: ${section}`, context);
    }
  }
}

async function validateAgentSpecificOutput(content, agentType, result) {
  const patterns = CONFIG.agents[agentType] || [];

  for (const pattern of patterns) {
    if (!content.toLowerCase().includes(pattern)) {
      result.addInfo(`Agent output may be missing ${pattern} considerations`);
    }
  }
}

// Output formatting
function formatResults(results, format) {
  if (format === 'json') {
    return formatters.json(results);
  }

  let output = '';

  for (const result of results) {
    output += `\n${colors.bright}${result.validator.toUpperCase()} VALIDATION${colors.reset}\n`;
    output += `Status: ${result.valid ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}\n`;

    if (result.errors.length > 0) {
      output += `\n${colors.red}Errors:${colors.reset}\n`;
      result.errors.forEach(error => {
        output += `  • ${error.message}${error.file ? ` (${error.file})` : ''}\n`;
      });
    }

    if (result.warnings.length > 0) {
      output += `\n${colors.yellow}Warnings:${colors.reset}\n`;
      result.warnings.forEach(warning => {
        output += `  • ${warning.message}${warning.file ? ` (${warning.file})` : ''}\n`;
      });
    }

    if (Object.keys(result.metrics).length > 0) {
      output += `\n${colors.cyan}Metrics:${colors.reset}\n`;
      Object.entries(result.metrics).forEach(([key, value]) => {
        output += `  ${key}: ${value}\n`;
      });
    }
  }

  return output;
}

// Main execution
async function main() {
  const args = parseArgs({
    format: 'table',
    output: null,
    task: null,
    agent: null,
    file: null
  });

  const validator = args._[0];

  if (!validator) {
    log.error('Usage: validate.js <validator> [options]');
    log.plain('Validators: quality-gates, context, agent-output, workflow-state, pre-task, pre-edit, post-agent, all', colors.cyan);
    process.exit(EXIT_CODES.INVALID_ARGS);
  }

  const validatorKey = validator.replace('-', '').replace('gates', 'Gates');

  if (!validators[validatorKey]) {
    log.error(`Unknown validator: ${validator}`);
    process.exit(EXIT_CODES.INVALID_ARGS);
  }

  try {
    const result = await validators[validatorKey](args);
    const results = [result];

    if (args.options.format === 'json') {
      console.log(formatters.json(results));
    } else {
      console.log(formatResults(results, args.options.format));
    }

    if (args.options.output) {
      writeJsonReport(results, args.options.output);
    }

    const exitCode = result.valid ? EXIT_CODES.SUCCESS : EXIT_CODES.VALIDATION_FAILED;

    if (!args.flags.has('continue-on-failure') && !result.valid) {
      process.exit(exitCode);
    }

    process.exit(EXIT_CODES.SUCCESS);

  } catch (error) {
    log.error(`Validation failed: ${error.message}`);
    process.exit(EXIT_CODES.GENERAL_ERROR);
  }
}

// Only run main if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { validators, ValidationResult };