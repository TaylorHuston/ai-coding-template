# SETUP-008: Documentation Foundation Implementation

## Quick Start

1. Setup documentation:
   ```bash
   npm run docs:setup
   ```

2. Generate and serve docs:
   ```bash
   npm run docs:dev
   ```

## Implementation

### Comprehensive README

Create project README.md:
```markdown
# Project Name

Brief description of what this project does and who it's for.

## Installation

```bash
npm install
npm run setup
```

## Usage

```bash
npm start
```

## API Documentation

See [API docs](./docs/api/README.md) or visit [docs site](https://your-project.github.io/docs)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

[License Name](./LICENSE)
```

### API Documentation

Install documentation tools:
```bash
npm install --save-dev @apidevtools/swagger-jsdoc swagger-ui-express typedoc
```

Create `docs/generate-api-docs.js`:
```javascript
const swaggerJSDoc = require('@apidevtools/swagger-jsdoc');
const fs = require('fs');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Project API',
      version: '1.0.0',
      description: 'API documentation for the project',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const specs = swaggerJSDoc(options);
fs.writeFileSync('./docs/api/openapi.json', JSON.stringify(specs, null, 2));

console.log('API documentation generated successfully!');
```

### Documentation Site

Install Docusaurus:
```bash
npx create-docusaurus@latest docs-site classic
cd docs-site
npm install
```

Create `docusaurus.config.js`:
```javascript
module.exports = {
  title: 'Project Documentation',
  tagline: 'Comprehensive project documentation',
  url: 'https://your-username.github.io',
  baseUrl: '/your-project/',
  organizationName: 'your-username',
  projectName: 'your-project',
  
  themeConfig: {
    navbar: {
      title: 'Project Docs',
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Tutorial',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/your-username/your-project',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
  },
  
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/your-username/your-project/edit/main/docs-site/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
```

### Contribution Guidelines

Create `CONTRIBUTING.md`:
```markdown
# Contributing Guidelines

## Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Development Setup

```bash
git clone https://github.com/your-username/your-project.git
cd your-project
npm install
npm run setup
```

## Coding Standards

- Follow existing code style
- Write tests for new features
- Update documentation
- Follow commit message conventions

## Pull Request Process

1. Ensure all tests pass
2. Update documentation
3. Add changelog entry
4. Get review approval
5. Squash commits before merge

## Issue Reporting

Use GitHub issues for bug reports and feature requests.
```

### Documentation Automation

Add to `package.json`:
```json
{
  "scripts": {
    "docs:dev": "docusaurus start --port 3001",
    "docs:build": "docusaurus build",
    "docs:serve": "docusaurus serve",
    "docs:api": "node docs/generate-api-docs.js",
    "docs:deploy": "docusaurus deploy"
  }
}
```

Create `.github/workflows/docs.yml`:
```yaml
name: Deploy Documentation

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: |
        npm ci
        cd docs-site && npm ci
        
    - name: Generate API docs
      run: npm run docs:api
      
    - name: Build documentation
      run: |
        cd docs-site
        npm run build
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./docs-site/build
```

## Testing

### Verify Documentation

```bash
# Generate API documentation
npm run docs:api

# Start documentation site
npm run docs:dev

# Build documentation
npm run docs:build

# Check links
npm run docs:check-links
```

## Troubleshooting

### API Documentation Issues

```bash
# Check API annotations
grep -r "@swagger" src/

# Validate OpenAPI spec
npm run docs:validate
```

### Documentation Site Issues

```bash
# Check build errors
cd docs-site && npm run build

# Clear cache
cd docs-site && npm run clear
```