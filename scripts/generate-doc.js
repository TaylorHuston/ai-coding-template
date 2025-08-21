#!/usr/bin/env node

/**
 * Documentation Generator
 * Interactive CLI tool for generating documentation from templates
 * 
 * Usage: node scripts/generate-doc.js [options]
 * Options:
 *   --template NAME    Use specific template
 *   --output FILE      Specify output file
 *   --list            List available templates
 *   --preview         Preview generated content without writing
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function prompt(question) {
  const rl = createInterface();
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    template: null,
    output: null,
    list: false,
    preview: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--template':
        options.template = args[++i];
        break;
      case '--output':
        options.output = args[++i];
        break;
      case '--list':
        options.list = true;
        break;
      case '--preview':
        options.preview = true;
        break;
    }
  }

  return options;
}

function getAvailableTemplates() {
  const templatesDir = path.join(__dirname, '../docs/templates');
  
  if (!fs.existsSync(templatesDir)) {
    return [];
  }

  return fs.readdirSync(templatesDir)
    .filter(file => file.endsWith('.template.md'))
    .map(file => ({
      file: file,
      name: file.replace('.template.md', ''),
      displayName: file.replace('.template.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      path: path.join(templatesDir, file)
    }));
}

function extractTemplateVariables(content) {
  const variableRegex = /\{\{(\w+)\}\}/g;
  const variables = new Set();
  let match;
  
  while ((match = variableRegex.exec(content)) !== null) {
    variables.add(match[1]);
  }
  
  return Array.from(variables).sort();
}

function getDefaultValueForVariable(varName) {
  const defaults = {
    'CREATED': new Date().toISOString().split('T')[0],
    'LAST_UPDATED': new Date().toISOString().split('T')[0],
    'STATUS': 'Draft',
    'TARGET_AUDIENCE': 'Developers',
    'COMPONENT_TYPE': 'Component',
    'API_VERSION': 'v1',
    'PRIORITY': 'Medium',
    'CATEGORY': 'General'
  };

  return defaults[varName] || '';
}

function generateSuggestedFilename(templateName, variables) {
  const baseName = variables.FEATURE_NAME || 
                   variables.COMPONENT_NAME || 
                   variables.API_NAME || 
                   variables.TITLE || 
                   'untitled';

  const nameSlug = baseName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');

  const templateTypeMap = {
    'feature': `docs/${nameSlug}.md`,
    'api': `docs/api/${nameSlug}.md`,
    'component': `docs/components/${nameSlug}.md`,
    'architecture': `docs/architecture/${nameSlug}.md`,
    'troubleshooting': `docs/troubleshooting/${nameSlug}.md`,
    'guide': `docs/guides/${nameSlug}.md`
  };

  return templateTypeMap[templateName] || `docs/${nameSlug}.md`;
}

function substituteVariables(content, variables) {
  let result = content;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
  }
  
  return result;
}

async function collectVariables(templateVariables) {
  const variables = {};
  
  log('\n📝 Please provide values for template variables:', colors.blue);
  log('(Press Enter to use default values shown in brackets)', colors.cyan);
  
  for (const varName of templateVariables) {
    const defaultValue = getDefaultValueForVariable(varName);
    const displayName = varName.replace(/_/g, ' ').toLowerCase();
    const promptText = defaultValue ? 
      `${displayName} [${defaultValue}]: ` : 
      `${displayName}: `;
    
    const userInput = await prompt(promptText);
    variables[varName] = userInput || defaultValue;
  }
  
  return variables;
}

async function selectTemplate(templates) {
  log('\n📋 Available templates:', colors.blue);
  templates.forEach((template, index) => {
    log(`  ${index + 1}. ${template.displayName}`, colors.cyan);
  });
  
  const selection = await prompt('\nSelect template (number): ');
  const selectedIndex = parseInt(selection) - 1;
  
  if (selectedIndex < 0 || selectedIndex >= templates.length) {
    throw new Error('Invalid template selection');
  }
  
  return templates[selectedIndex];
}

function ensureDirectoryExists(filePath) {
  const directory = path.dirname(filePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

async function main() {
  const options = parseArgs();
  
  try {
    log('📄 Documentation Generator', colors.bright);
    log('=========================', colors.bright);
    
    const templates = getAvailableTemplates();
    
    if (templates.length === 0) {
      log('❌ No templates found in docs/templates/', colors.red);
      log('Create some template files first with .template.md extension', colors.yellow);
      process.exit(1);
    }
    
    if (options.list) {
      log('\n📋 Available templates:', colors.blue);
      templates.forEach(template => {
        log(`  • ${template.name} - ${template.displayName}`, colors.cyan);
      });
      return;
    }
    
    // Select template
    let selectedTemplate;
    if (options.template) {
      selectedTemplate = templates.find(t => t.name === options.template);
      if (!selectedTemplate) {
        log(`❌ Template '${options.template}' not found`, colors.red);
        log('Available templates:', colors.yellow);
        templates.forEach(t => log(`  • ${t.name}`, colors.cyan));
        process.exit(1);
      }
    } else {
      selectedTemplate = await selectTemplate(templates);
    }
    
    log(`\n✅ Using template: ${selectedTemplate.displayName}`, colors.green);
    
    // Load template content
    const templateContent = fs.readFileSync(selectedTemplate.path, 'utf8');
    const templateVariables = extractTemplateVariables(templateContent);
    
    if (templateVariables.length === 0) {
      log('ℹ️ This template has no variables to substitute', colors.yellow);
    }
    
    // Collect variable values
    const variables = templateVariables.length > 0 ? 
      await collectVariables(templateVariables) : {};
    
    // Generate content
    const content = substituteVariables(templateContent, variables);
    
    // Determine output file
    let outputFile = options.output;
    if (!outputFile) {
      const suggested = generateSuggestedFilename(selectedTemplate.name, variables);
      outputFile = await prompt(`\nOutput file [${suggested}]: `) || suggested;
    }
    
    // Preview mode
    if (options.preview) {
      log('\n📄 Generated content preview:', colors.blue);
      log('================================', colors.blue);
      console.log(content);
      log('================================', colors.blue);
      log(`\n💾 Would be written to: ${outputFile}`, colors.cyan);
      return;
    }
    
    // Ensure output directory exists
    ensureDirectoryExists(outputFile);
    
    // Check if file already exists
    if (fs.existsSync(outputFile)) {
      const overwrite = await prompt(`\n⚠️  File ${outputFile} already exists. Overwrite? (y/n): `);
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        log('❌ Cancelled', colors.yellow);
        return;
      }
    }
    
    // Write file
    fs.writeFileSync(outputFile, content);
    
    log(`\n✅ Documentation generated successfully!`, colors.green);
    log(`📄 File: ${outputFile}`, colors.cyan);
    
    if (templateVariables.length > 0) {
      log(`📝 Variables substituted: ${templateVariables.join(', ')}`, colors.cyan);
    }
    
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { 
  getAvailableTemplates, 
  extractTemplateVariables, 
  substituteVariables,
  generateSuggestedFilename
};