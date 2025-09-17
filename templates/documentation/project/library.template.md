# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## 📦 Installation

```bash
# Install via npm
npm install {{PROJECT_SLUG}}

# Install via yarn
yarn add {{PROJECT_SLUG}}

# Install via pnpm
pnpm add {{PROJECT_SLUG}}
```

## 🚀 Features

- {{FEATURE_1}}
- {{FEATURE_2}}
- {{FEATURE_3}}
- 📝 TypeScript support with full type definitions
- 🎯 Zero dependencies (or minimal, well-justified dependencies)
- 📱 Works in Node.js and browsers
- 🔧 ESM and CommonJS support

## ⚡ Quick Start

### Basic Usage

```javascript
import { {{MAIN_EXPORT}} } from '{{PROJECT_SLUG}}';

// Basic example
const result = {{MAIN_EXPORT}}({{EXAMPLE_INPUT}});
console.log(result); // {{EXAMPLE_OUTPUT}}
```

### Advanced Usage

```javascript
import { {{MAIN_EXPORT}}, {{ADVANCED_EXPORT}} } from '{{PROJECT_SLUG}}';

// Advanced configuration
const options = {
  {{OPTION_1}}: {{VALUE_1}},
  {{OPTION_2}}: {{VALUE_2}}
};

const result = {{ADVANCED_EXPORT}}({{EXAMPLE_INPUT}}, options);
```

## 🏗️ Architecture

This library uses the [AI Coding Template](./docs/ai-tools/template-documentation.md) workflow for intelligent development.

### Tech Stack

- **Language**: {{LANGUAGE}} ({{LANGUAGE_VERSION}})
- **Build System**: {{BUILD_SYSTEM}}
- **Testing**: {{TEST_FRAMEWORK}}
- **Documentation**: {{DOCS_TOOL}}
- **Packaging**: {{PACKAGE_MANAGER}}

### Library Structure

```
src/
├── index.ts          # Main entry point and public API
├── core/            # Core functionality
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
└── __tests__/       # Test files

dist/
├── index.js         # CommonJS build
├── index.mjs        # ESM build
├── index.d.ts       # TypeScript definitions
└── index.umd.js     # UMD build for browsers
```

## 📚 API Reference

### Core Functions

#### `{{MAIN_EXPORT}}(input, options?)`

{{MAIN_FUNCTION_DESCRIPTION}}

**Parameters:**
- `input` ({{INPUT_TYPE}}): {{INPUT_DESCRIPTION}}
- `options` ({{OPTIONS_TYPE}}, optional): {{OPTIONS_DESCRIPTION}}

**Returns:** {{RETURN_TYPE}} - {{RETURN_DESCRIPTION}}

**Example:**
```javascript
const result = {{MAIN_EXPORT}}({{EXAMPLE_INPUT}});
```

#### `{{SECONDARY_EXPORT}}(input, config?)`

{{SECONDARY_FUNCTION_DESCRIPTION}}

**Parameters:**
- `input` ({{INPUT_TYPE_2}}): {{INPUT_DESCRIPTION_2}}
- `config` ({{CONFIG_TYPE}}, optional): {{CONFIG_DESCRIPTION}}

**Returns:** {{RETURN_TYPE_2}} - {{RETURN_DESCRIPTION_2}}

### Type Definitions

```typescript
interface {{MAIN_OPTIONS_INTERFACE}} {
  {{OPTION_1}}: {{OPTION_1_TYPE}};
  {{OPTION_2}}?: {{OPTION_2_TYPE}};
  {{OPTION_3}}?: {{OPTION_3_TYPE}};
}

type {{MAIN_RESULT_TYPE}} = {
  {{RESULT_PROP_1}}: {{RESULT_TYPE_1}};
  {{RESULT_PROP_2}}: {{RESULT_TYPE_2}};
};
```

## 🧪 Testing

```bash
# Run all tests
{{TEST_COMMANDS}}

# Run tests with coverage
{{COVERAGE_COMMANDS}}

# Run tests in watch mode
{{WATCH_TEST_COMMANDS}}

# Run specific test suite
{{SPECIFIC_TEST_COMMANDS}}
```

### Test Coverage Goals
- Unit Tests: > 95%
- Integration Tests: > 85%
- Type Coverage: 100%

## 🏗️ Development

### Prerequisites

- {{TECH_REQUIREMENTS}}
- {{RECOMMENDED_TOOLS}}

### Setup

```bash
# Clone the repository
git clone {{REPO_URL}} {{PROJECT_SLUG}}
cd {{PROJECT_SLUG}}

# Install dependencies
{{INSTALL_COMMANDS}}

# Run tests
{{TEST_COMMANDS}}

# Build the library
{{BUILD_COMMANDS}}
```

### Development Workflow

This project uses AI-assisted development for consistent, high-quality results:

1. **Define** - Use `/feature` to create feature requirements and context
2. **Design** - Use `/architect` to create technical architecture and decisions
3. **Plan** - Use `/plan` to create detailed implementation roadmaps
4. **Execute** - Use `/develop` to implement with context-aware quality gates
4. **Validate** - Use `/quality` to ensure API consistency and performance standards

### Building

```bash
# Build for all targets
{{BUILD_COMMANDS}}

# Build for specific target
npm run build:esm    # ES modules
npm run build:cjs    # CommonJS
npm run build:umd    # UMD for browsers
npm run build:types  # TypeScript definitions
```

## 📦 Distribution

### NPM Package

```bash
# Build for distribution
{{BUILD_COMMANDS}}

# Run all quality checks
npm run validate

# Publish to npm
{{PUBLISH_COMMANDS}}

# Version management
npm version patch|minor|major
```

### Browser Usage

```html
<!-- UMD build for browsers -->
<script src="https://unpkg.com/{{PROJECT_SLUG}}@latest/dist/index.umd.js"></script>
<script>
  const result = {{PROJECT_SLUG}}.{{MAIN_EXPORT}}({{EXAMPLE_INPUT}});
  console.log(result);
</script>
```

### CDN Links

```html
<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/{{PROJECT_SLUG}}@latest/dist/index.umd.js"></script>

<!-- unpkg -->
<script src="https://unpkg.com/{{PROJECT_SLUG}}@latest/dist/index.umd.js"></script>
```

## 🔧 Configuration

### Environment Support

- **Node.js**: {{NODE_VERSION}}+
- **Browsers**: Modern browsers with ES2018+ support
- **TypeScript**: {{TYPESCRIPT_VERSION}}+

### Build Targets

- **ESM**: Modern JavaScript modules
- **CommonJS**: Node.js compatibility
- **UMD**: Universal browser support
- **Types**: Full TypeScript definitions

## 🛠️ Development Standards

### Code Quality
- Follow TypeScript strict mode
- Maintain 95%+ test coverage
- Use semantic versioning
- Comprehensive JSDoc documentation
- Zero production dependencies (or well-justified minimal deps)

### API Design Principles
- Consistent naming conventions
- Intuitive function signatures
- Comprehensive error handling
- Backward compatibility preservation
- Clear deprecation paths

## 📊 Performance

### Benchmarks
- **Bundle Size**: < {{BUNDLE_SIZE_TARGET}}KB (minified + gzipped)
- **Load Time**: < {{LOAD_TIME_TARGET}}ms
- **Memory Usage**: < {{MEMORY_TARGET}}MB
- **Execution Speed**: {{PERFORMANCE_BENCHMARK}}

### Optimization
- Tree-shaking support
- Minimal runtime dependencies
- Efficient algorithms
- Memory leak prevention

## 🤝 Contributing

### Development Guidelines
1. Follow API design principles
2. Maintain comprehensive test coverage
3. Document all public APIs
4. Ensure browser compatibility
5. Follow semantic versioning

### Pull Request Process
1. Create feature branch: `git checkout -b feature/new-api`
2. Use AI workflow: `/feature` → `/architect` → `/plan` → `/develop`
3. Add tests and documentation
4. Update CHANGELOG.md
5. Ensure all checks pass
6. Submit pull request

## 📚 Documentation

### API Documentation
- **[API Reference](./docs/api/)** - Complete function documentation
- **[Examples](./docs/examples/)** - Usage examples and recipes
- **[Migration Guide](./docs/migration.md)** - Version upgrade guides

### Developer Documentation
- **[Architecture Guide](./docs/architecture.md)** - Internal design decisions
- **[Contributing Guide](./docs/contributing.md)** - Development guidelines
- **[Build System](./docs/build.md)** - Build and packaging details

### AI Development Tools
- **[Template Documentation](./docs/ai-tools/template-documentation.md)** - Complete AI template guide
- **[Agent System](./docs/ai-tools/guides/using-agents.md)** - 18 specialist AI agents

## 🔒 Security

### Security Measures
- ✅ No eval() or Function() constructor usage
- ✅ Input validation and sanitization
- ✅ No prototype pollution vulnerabilities
- ✅ Secure dependency management
- ✅ Regular security audits

### Reporting Security Issues
Please report security vulnerabilities to {{SECURITY_EMAIL}} rather than using public issues.

## 📊 Project Status

Current project status and context: [STATUS.md](./STATUS.md)

## 🙏 Acknowledgments

- Built with [AI Coding Template](https://github.com/yourusername/ai-coding-template)
- Powered by intelligent agent-assisted development
- {{ADDITIONAL_ACKNOWLEDGMENTS}}

## 📄 License

This project is licensed under the {{LICENSE_TYPE}} License - see the [LICENSE](LICENSE) file for details.

---

**🤖 AI-Enhanced Development**: This library leverages intelligent agents for API design, performance optimization, and compatibility testing. See our [AI development guide](./docs/ai-tools/) to learn how AI accelerates library development while ensuring excellent developer experience.