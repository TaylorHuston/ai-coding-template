# {{PROJECT_NAME}}

[![Build Status](https://img.shields.io/github/actions/workflow/status/{{GITHUB_USERNAME}}/{{PROJECT_NAME}}/ci.yml)](https://github.com/{{GITHUB_USERNAME}}/{{PROJECT_NAME}}/actions)
[![License](https://img.shields.io/badge/license-{{LICENSE}}-blue.svg)](./LICENSE)
{{#NPM_PACKAGE}}[![NPM Version](https://img.shields.io/npm/v/{{NPM_PACKAGE}})](https://www.npmjs.com/package/{{NPM_PACKAGE}}){{/NPM_PACKAGE}}

> {{PROJECT_DESCRIPTION}}

{{#PROJECT_TAGLINE}}{{PROJECT_TAGLINE}}{{/PROJECT_TAGLINE}}

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
{{#HAS_API}}- [API](#api){{/HAS_API}}
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Background

{{PROJECT_BACKGROUND}}

### Key Features

{{#FEATURES}}
- **{{FEATURE_NAME}}** - {{FEATURE_DESCRIPTION}}
{{/FEATURES}}

### Problem Solved

{{PROBLEM_STATEMENT}}

## Install

{{#NPM_PACKAGE}}
### NPM Package

```bash
npm install {{NPM_PACKAGE}}
```

### Global Installation

```bash
npm install -g {{NPM_PACKAGE}}
```
{{/NPM_PACKAGE}}

{{#MANUAL_INSTALL}}
### Manual Installation

```bash
git clone https://github.com/{{GITHUB_USERNAME}}/{{PROJECT_NAME}}.git
cd {{PROJECT_NAME}}
npm install
```
{{/MANUAL_INSTALL}}

{{#DOCKER_SUPPORT}}
### Docker

```bash
docker pull {{DOCKER_IMAGE}}
docker run -it {{DOCKER_IMAGE}}
```
{{/DOCKER_SUPPORT}}

## Usage

{{#CLI_TOOL}}
### Command Line Interface

```bash
# Basic usage
{{CLI_COMMAND}} [options] [arguments]

# Common examples
{{CLI_COMMAND}} --help
{{CLI_COMMAND}} {{EXAMPLE_COMMAND}}
```

### Available Commands

{{#CLI_COMMANDS}}
- `{{COMMAND}}` - {{COMMAND_DESCRIPTION}}
{{/CLI_COMMANDS}}
{{/CLI_TOOL}}

{{#LIBRARY}}
### Basic Usage

```{{CODE_LANGUAGE}}
{{BASIC_USAGE_EXAMPLE}}
```

### Advanced Usage

```{{CODE_LANGUAGE}}
{{ADVANCED_USAGE_EXAMPLE}}
```
{{/LIBRARY}}

{{#WEB_APP}}
### Getting Started

1. **Setup the application**:
   ```bash
   npm install
   npm run setup
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   Open [http://localhost:{{DEV_PORT}}](http://localhost:{{DEV_PORT}}) in your browser

### Configuration

The application can be configured through:

{{#CONFIG_FILES}}
- **{{CONFIG_FILE}}** - {{CONFIG_DESCRIPTION}}
{{/CONFIG_FILES}}

### Environment Variables

{{#ENV_VARS}}
- `{{ENV_VAR}}` - {{ENV_DESCRIPTION}} ({{ENV_REQUIRED}})
{{/ENV_VARS}}
{{/WEB_APP}}

{{#API_SERVICE}}
### API Endpoints

The API is available at `{{API_BASE_URL}}` with the following endpoints:

{{#API_ENDPOINTS}}
- `{{HTTP_METHOD}} {{ENDPOINT}}` - {{ENDPOINT_DESCRIPTION}}
{{/API_ENDPOINTS}}

### Authentication

{{AUTH_DESCRIPTION}}

```bash
# Example API call
curl -H "Authorization: Bearer YOUR_TOKEN" \
  {{API_BASE_URL}}/{{EXAMPLE_ENDPOINT}}
```
{{/API_SERVICE}}

{{#HAS_API}}
## API

{{#API_DOCUMENTATION}}
### {{API_SECTION}}

{{API_SECTION_CONTENT}}
{{/API_DOCUMENTATION}}

For complete API documentation, see [API Reference]({{API_DOCS_URL}}).
{{/HAS_API}}

## Examples

{{#EXAMPLES}}
### {{EXAMPLE_TITLE}}

{{EXAMPLE_DESCRIPTION}}

```{{CODE_LANGUAGE}}
{{EXAMPLE_CODE}}
```

{{#EXAMPLE_OUTPUT}}
**Output:**
```
{{EXAMPLE_OUTPUT}}
```
{{/EXAMPLE_OUTPUT}}
{{/EXAMPLES}}

{{#EXAMPLE_PROJECTS}}
### Example Projects

- **[{{EXAMPLE_NAME}}]({{EXAMPLE_URL}})** - {{EXAMPLE_DESCRIPTION}}
{{/EXAMPLE_PROJECTS}}

## Development

### Prerequisites

{{#PREREQUISITES}}
- {{PREREQUISITE}}
{{/PREREQUISITES}}

### Setup

```bash
git clone https://github.com/{{GITHUB_USERNAME}}/{{PROJECT_NAME}}.git
cd {{PROJECT_NAME}}
npm install
```

### Development Workflow

```bash
# Start development
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

{{#AI_WORKFLOW}}
### AI-Assisted Development

This project uses the AI Coding Template for enhanced development workflow:

```bash
# Start a new feature
/design --epic "feature-name"
/architect feature-name
/plan --issue FEATURE-123
/develop

# Quality assurance
/quality assess
/security-audit
/test-fix

# Documentation
/docs generate
```

For complete AI workflow guide, see [AI Toolkit Documentation](./docs/ai-toolkit/README.md).
{{/AI_WORKFLOW}}

## Testing

{{#TESTING}}
### Running Tests

```bash
# All tests
npm test

# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Test Structure

{{TEST_STRUCTURE_DESCRIPTION}}
{{/TESTING}}

## Deployment

{{#DEPLOYMENT}}
### {{DEPLOYMENT_TARGET}}

{{DEPLOYMENT_INSTRUCTIONS}}
{{/DEPLOYMENT}}

{{#DOCKER_DEPLOYMENT}}
### Docker Deployment

```bash
# Build image
docker build -t {{PROJECT_NAME}} .

# Run container
docker run -p {{HOST_PORT}}:{{CONTAINER_PORT}} {{PROJECT_NAME}}
```
{{/DOCKER_DEPLOYMENT}}

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Quick Contributing Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our [Development Guidelines](./docs/development/guidelines/)
4. Ensure tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

{{#DEV_GUIDELINES}}
- {{GUIDELINE}}
{{/DEV_GUIDELINES}}

## Support

{{#SUPPORT_CHANNELS}}
- **{{SUPPORT_TYPE}}**: [{{SUPPORT_LINK}}]({{SUPPORT_URL}})
{{/SUPPORT_CHANNELS}}

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed history of changes.

## License

{{LICENSE}} License - see [LICENSE](./LICENSE) for details.

{{#ACKNOWLEDGMENTS}}
## Acknowledgments

{{#CREDITS}}
- {{CREDIT_NAME}} - {{CREDIT_DESCRIPTION}}
{{/CREDITS}}
{{/ACKNOWLEDGMENTS}}

---

{{#PROJECT_FOOTER}}{{PROJECT_FOOTER}}{{/PROJECT_FOOTER}}

{{#AI_WORKFLOW}}
**Built with [AI Coding Template](https://github.com/yourusername/ai-coding-template)** - Transform AI from a simple code generator into your intelligent architectural partner.
{{/AI_WORKFLOW}}