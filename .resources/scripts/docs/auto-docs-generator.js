#!/usr/bin/env node

/**
 * Automatic Documentation Generator
 *
 * Analyzes codebase structure and automatically generates essential documentation
 * including architecture diagrams, API documentation, and technical decisions.
 *
 * Usage:
 *   node scripts/auto-docs-generator.js --type <type> [options]
 *
 * Types:
 *   - tech-stack: Generate technology stack documentation
 *   - system-overview: Generate system architecture overview
 *   - dependencies: Generate dependency graph documentation
 *   - api-reference: Generate API endpoint documentation
 *   - schemas: Generate data schema documentation
 *   - decision: Capture a technical decision
 *   - decision-summary: Generate summary of all technical decisions
 *   - all: Generate all documentation types
 *   - auto: Automatically detect what needs updating
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(PROJECT_ROOT, 'docs');
const ARCHITECTURE_DIR = path.join(DOCS_DIR, 'technical', 'architecture', 'auto-generated');
const API_DIR = path.join(DOCS_DIR, 'technical', 'api');
const DECISIONS_DIR = path.join(DOCS_DIR, 'technical', 'decisions');
const TEMPLATES_DIR = path.join(PROJECT_ROOT, 'templates', 'auto-docs');

class AutoDocsGenerator {
  constructor() {
    this.projectRoot = PROJECT_ROOT;
    this.ensureDirectories();
  }

  /**
   * Ensure required directories exist
   */
  ensureDirectories() {
    const dirs = [DOCS_DIR, ARCHITECTURE_DIR, API_DIR, DECISIONS_DIR, TEMPLATES_DIR];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Generate technology stack documentation
   */
  async generateTechStack() {
    console.log('📚 Generating technology stack documentation...');

    const techStack = this.analyzeTechStack();
    const content = this.renderTemplate('tech-stack', techStack);

    const outputPath = path.join(ARCHITECTURE_DIR, 'tech-stack.md');
    fs.writeFileSync(outputPath, content);

    console.log(`✅ Generated: ${outputPath}`);
    return outputPath;
  }

  /**
   * Generate system overview documentation
   */
  async generateSystemOverview() {
    console.log('🏗️ Generating system overview documentation...');

    const systemInfo = this.analyzeSystemStructure();
    const content = this.renderTemplate('system-overview', systemInfo);

    const outputPath = path.join(ARCHITECTURE_DIR, 'system-overview.md');
    fs.writeFileSync(outputPath, content);

    console.log(`✅ Generated: ${outputPath}`);
    return outputPath;
  }

  /**
   * Generate dependency graph documentation
   */
  async generateDependencyGraph() {
    console.log('🔗 Generating dependency graph documentation...');

    const dependencies = this.analyzeDependencies();
    const content = this.renderTemplate('dependency-graph', dependencies);

    const outputPath = path.join(ARCHITECTURE_DIR, 'dependency-graph.md');
    fs.writeFileSync(outputPath, content);

    console.log(`✅ Generated: ${outputPath}`);
    return outputPath;
  }

  /**
   * Analyze technology stack from various configuration files
   */
  analyzeTechStack() {
    const techStack = {
      languages: [],
      frameworks: [],
      databases: [],
      tools: [],
      devDependencies: [],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    // Analyze package.json if it exists
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      // Extract frameworks and libraries from dependencies
      if (packageJson.dependencies) {
        Object.keys(packageJson.dependencies).forEach(dep => {
          if (dep.includes('react')) techStack.frameworks.push(`React ${packageJson.dependencies[dep]}`);
          if (dep.includes('vue')) techStack.frameworks.push(`Vue ${packageJson.dependencies[dep]}`);
          if (dep.includes('angular')) techStack.frameworks.push(`Angular ${packageJson.dependencies[dep]}`);
          if (dep.includes('express')) techStack.frameworks.push(`Express ${packageJson.dependencies[dep]}`);
          if (dep.includes('fastify')) techStack.frameworks.push(`Fastify ${packageJson.dependencies[dep]}`);
          if (dep.includes('next')) techStack.frameworks.push(`Next.js ${packageJson.dependencies[dep]}`);
        });
      }

      if (packageJson.devDependencies) {
        techStack.devDependencies = Object.keys(packageJson.devDependencies).map(dep =>
          `${dep} ${packageJson.devDependencies[dep]}`
        );
      }

      techStack.languages.push('JavaScript/TypeScript');
    }

    // Analyze requirements.txt for Python projects
    const requirementsPath = path.join(this.projectRoot, 'requirements.txt');
    if (fs.existsSync(requirementsPath)) {
      techStack.languages.push('Python');
      const requirements = fs.readFileSync(requirementsPath, 'utf8').split('\n');
      requirements.forEach(req => {
        if (req.trim() && !req.startsWith('#')) {
          if (req.includes('django')) techStack.frameworks.push(`Django ${req.split('==')[1] || ''}`);
          if (req.includes('flask')) techStack.frameworks.push(`Flask ${req.split('==')[1] || ''}`);
          if (req.includes('fastapi')) techStack.frameworks.push(`FastAPI ${req.split('==')[1] || ''}`);
        }
      });
    }

    // Check for Docker
    if (fs.existsSync(path.join(this.projectRoot, 'Dockerfile'))) {
      techStack.tools.push('Docker');
    }

    // Check for database configurations
    const envFiles = ['.env', '.env.example', '.env.local'];
    envFiles.forEach(envFile => {
      const envPath = path.join(this.projectRoot, envFile);
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        if (envContent.includes('DATABASE_URL') || envContent.includes('DB_')) {
          if (envContent.includes('postgres')) techStack.databases.push('PostgreSQL');
          if (envContent.includes('mysql')) techStack.databases.push('MySQL');
          if (envContent.includes('mongodb')) techStack.databases.push('MongoDB');
          if (envContent.includes('redis')) techStack.databases.push('Redis');
        }
      }
    });

    return techStack;
  }

  /**
   * Analyze system structure and components
   */
  analyzeSystemStructure() {
    const structure = {
      projectName: this.getProjectName(),
      components: [],
      directories: [],
      entryPoints: [],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    // Analyze directory structure
    const rootContents = fs.readdirSync(this.projectRoot);
    structure.directories = rootContents.filter(item => {
      const itemPath = path.join(this.projectRoot, item);
      return fs.statSync(itemPath).isDirectory() && !item.startsWith('.') && item !== 'node_modules';
    });

    // Identify entry points
    const commonEntryPoints = ['index.js', 'index.ts', 'app.js', 'app.ts', 'main.js', 'main.ts', 'server.js'];
    commonEntryPoints.forEach(entry => {
      if (fs.existsSync(path.join(this.projectRoot, entry))) {
        structure.entryPoints.push(entry);
      }
    });

    // Analyze src directory if it exists
    const srcDir = path.join(this.projectRoot, 'src');
    if (fs.existsSync(srcDir)) {
      structure.components = this.analyzeComponents(srcDir);
    }

    return structure;
  }

  /**
   * Analyze component structure in a directory
   */
  analyzeComponents(dir) {
    const components = [];

    try {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          components.push({
            name: item,
            type: 'directory',
            path: path.relative(this.projectRoot, itemPath),
            subComponents: this.analyzeComponents(itemPath)
          });
        } else if (item.endsWith('.js') || item.endsWith('.ts') || item.endsWith('.jsx') || item.endsWith('.tsx')) {
          components.push({
            name: item,
            type: 'file',
            path: path.relative(this.projectRoot, itemPath)
          });
        }
      });
    } catch (error) {
      // Directory might not be readable, skip
    }

    return components;
  }

  /**
   * Analyze dependencies and their relationships
   */
  analyzeDependencies() {
    const dependencies = {
      production: {},
      development: {},
      internal: [],
      external: [],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      dependencies.production = packageJson.dependencies || {};
      dependencies.development = packageJson.devDependencies || {};

      // Categorize dependencies
      Object.keys(dependencies.production).forEach(dep => {
        dependencies.external.push({
          name: dep,
          version: dependencies.production[dep],
          type: 'production'
        });
      });
    }

    return dependencies;
  }

  /**
   * Get project name from package.json or directory name
   */
  getProjectName() {
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      return packageJson.name || path.basename(this.projectRoot);
    }
    return path.basename(this.projectRoot);
  }

  /**
   * Render template with data
   */
  renderTemplate(templateName, data) {
    // Always use our basic template for now
    return this.createBasicTemplate(templateName, data);
  }

  /**
   * Create basic template if none exists
   */
  createBasicTemplate(templateName, data) {
    switch (templateName) {
      case 'tech-stack':
        return this.createTechStackTemplate(data);
      case 'system-overview':
        return this.createSystemOverviewTemplate(data);
      case 'dependency-graph':
        return this.createDependencyGraphTemplate(data);
      default:
        return `# ${templateName.charAt(0).toUpperCase() + templateName.slice(1)} Documentation\n\nGenerated on: ${new Date().toISOString()}\n\n${JSON.stringify(data, null, 2)}`;
    }
  }

  /**
   * Create technology stack template
   */
  createTechStackTemplate(data) {
    return `---
title: Technology Stack
generated: ${data.lastUpdated}
type: architecture
---

# Technology Stack

## Overview

This document outlines the technology stack used in this project, including programming languages, frameworks, databases, and development tools.

## Programming Languages

${data.languages.length > 0 ? data.languages.map(lang => `- **${lang}**`).join('\n') : 'No programming languages detected in the current project structure.'}

## Frameworks and Libraries

### Production Frameworks
${data.frameworks.length > 0 ? data.frameworks.map(fw => `- **${fw}**`).join('\n') : 'No major frameworks detected in production dependencies.'}

## Databases

${data.databases.length > 0 ? data.databases.map(db => `- **${db}**`).join('\n') : 'No databases detected from environment configuration.'}

## Development Tools

${data.tools.length > 0 ? data.tools.map(tool => `- **${tool}**`).join('\n') : 'Standard development tools in use.'}

## Development Dependencies

*Key development tools and utilities:*

${data.devDependencies.length > 0 ? data.devDependencies.slice(0, 15).map(dep => `- \`${dep}\``).join('\n') : 'No development dependencies detected.'}

${data.devDependencies.length > 15 ? `\n*... and ${data.devDependencies.length - 15} more development dependencies*` : ''}

## Dependencies Analysis

- **Total Production Dependencies**: ${Object.keys(this.analyzeDependencies().production).length}
- **Total Development Dependencies**: ${data.devDependencies.length}

---

*This document was automatically generated on ${data.lastUpdated}*
`;
  }

  /**
   * Create system overview template
   */
  createSystemOverviewTemplate(data) {
    return `---
title: System Overview
generated: ${data.lastUpdated}
type: architecture
---

# System Overview

## Project: ${data.projectName}

## Directory Structure

\`\`\`
${data.projectName}/
${data.directories.map(dir => `├── ${dir}/`).join('\n')}
\`\`\`

## Entry Points

${data.entryPoints.length > 0 ? data.entryPoints.map(entry => `- ${entry}`).join('\n') : 'No standard entry points detected.'}

## Components

${this.renderComponents(data.components)}

---

*This document was automatically generated on ${data.lastUpdated}*
`;
  }

  /**
   * Render components tree
   */
  renderComponents(components, indent = '') {
    if (!components || components.length === 0) {
      return 'No components detected.';
    }

    return components.map(component => {
      let result = `${indent}- ${component.name} (${component.type})`;
      if (component.subComponents && component.subComponents.length > 0) {
        result += '\n' + this.renderComponents(component.subComponents, indent + '  ');
      }
      return result;
    }).join('\n');
  }

  /**
   * Create dependency graph template
   */
  createDependencyGraphTemplate(data) {
    return `---
title: Dependency Graph
generated: ${data.lastUpdated}
type: architecture
---

# Dependency Graph

## Production Dependencies

${Object.keys(data.production).length > 0 ?
  Object.keys(data.production).map(dep => `- **${dep}**: ${data.production[dep]}`).join('\n') :
  'No production dependencies found.'}

## Development Dependencies

${Object.keys(data.development).length > 0 ?
  Object.keys(data.development).slice(0, 15).map(dep => `- **${dep}**: ${data.development[dep]}`).join('\n') :
  'No development dependencies found.'}

${Object.keys(data.development).length > 15 ? `\n*... and ${Object.keys(data.development).length - 15} more development dependencies*` : ''}

## Dependency Analysis

- **Total Production Dependencies**: ${Object.keys(data.production).length}
- **Total Development Dependencies**: ${Object.keys(data.development).length}

---

*This document was automatically generated on ${data.lastUpdated}*
`;
  }

  /**
   * Generate all documentation types
   */
  async generateAll() {
    console.log('🚀 Generating all documentation...');

    const results = [];

    try {
      results.push(await this.generateTechStack());
      results.push(await this.generateSystemOverview());
      results.push(await this.generateDependencyGraph());
    } catch (error) {
      console.error('❌ Error generating documentation:', error.message);
      throw error;
    }

    console.log(`\n✅ Generated ${results.length} documentation files successfully!`);
    return results;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const typeIndex = args.indexOf('--type');

  if (typeIndex === -1 || !args[typeIndex + 1]) {
    console.log(`
Usage: node scripts/auto-docs-generator.js --type <type> [options]

Types:
  tech-stack       Generate technology stack documentation
  system-overview  Generate system architecture overview
  dependencies     Generate dependency graph documentation
  all             Generate all documentation types

Examples:
  node scripts/auto-docs-generator.js --type tech-stack
  node scripts/auto-docs-generator.js --type all
`);
    process.exit(1);
  }

  const type = args[typeIndex + 1];
  const generator = new AutoDocsGenerator();

  try {
    switch (type) {
      case 'tech-stack':
        await generator.generateTechStack();
        break;
      case 'system-overview':
        await generator.generateSystemOverview();
        break;
      case 'dependencies':
        await generator.generateDependencyGraph();
        break;
      case 'all':
        await generator.generateAll();
        break;
      default:
        console.error(`❌ Unknown type: ${type}`);
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = AutoDocsGenerator;