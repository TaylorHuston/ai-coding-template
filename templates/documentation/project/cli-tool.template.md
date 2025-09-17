# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## 📦 Installation

```bash
# Install globally via npm
npm install -g {{PROJECT_SLUG}}

# Or install via your preferred package manager
{{INSTALL_COMMANDS}}
```

## 🚀 Features

- {{FEATURE_1}}
- {{FEATURE_2}}
- {{FEATURE_3}}
- 🎯 Simple, intuitive command interface
- 📝 Comprehensive help documentation
- ⚙️ Configurable via config files and environment variables
- 🔧 Extensible plugin architecture

## ⚡ Quick Start

```bash
# Basic usage
{{PROJECT_SLUG}} [command] [options]

# Get help
{{PROJECT_SLUG}} --help

# Check version
{{PROJECT_SLUG}} --version

# Example common usage
{{PROJECT_SLUG}} {{EXAMPLE_COMMAND}} {{EXAMPLE_ARGS}}
```

## 📋 Commands

### Core Commands

```bash
# {{COMMAND_1}} - {{COMMAND_1_DESCRIPTION}}
{{PROJECT_SLUG}} {{COMMAND_1}} [options]

# {{COMMAND_2}} - {{COMMAND_2_DESCRIPTION}}
{{PROJECT_SLUG}} {{COMMAND_2}} [options]

# {{COMMAND_3}} - {{COMMAND_3_DESCRIPTION}}
{{PROJECT_SLUG}} {{COMMAND_3}} [options]
```

### Global Options

```bash
Options:
  -h, --help         Show help information
  -v, --version      Show version number
  -c, --config       Specify config file path
  --verbose          Enable verbose output
  --quiet            Suppress non-error output
  --dry-run          Preview actions without executing
```

## ⚙️ Configuration

### Config File

Create a config file at `~/.{{PROJECT_SLUG}}/config.{{CONFIG_FORMAT}}`:

```{{CONFIG_FORMAT}}
{{#CONFIG_EXAMPLE}}
{{CONFIG_EXAMPLE}}
{{/CONFIG_EXAMPLE}}
{{^CONFIG_EXAMPLE}}
# Example configuration
{{CONFIG_KEY_1}}: {{CONFIG_VALUE_1}}
{{CONFIG_KEY_2}}: {{CONFIG_VALUE_2}}
{{CONFIG_KEY_3}}: {{CONFIG_VALUE_3}}
{{/CONFIG_EXAMPLE}}
```

### Environment Variables

```bash
# Core settings
{{PROJECT_SLUG_UPPER}}_CONFIG_PATH=~/.{{PROJECT_SLUG}}/config.{{CONFIG_FORMAT}}
{{PROJECT_SLUG_UPPER}}_LOG_LEVEL={{LOG_LEVEL}}

# Feature flags
{{PROJECT_SLUG_UPPER}}_ENABLE_{{FEATURE_FLAG_1}}=true
{{PROJECT_SLUG_UPPER}}_ENABLE_{{FEATURE_FLAG_2}}=false
```

## 🏗️ Architecture

This CLI tool uses the [AI Coding Template](./docs/ai-tools/template-documentation.md) workflow for intelligent development.

### Tech Stack

- **Runtime**: {{RUNTIME}} ({{RUNTIME_VERSION}})
- **CLI Framework**: {{CLI_FRAMEWORK}}
- **Testing**: {{TEST_FRAMEWORK}}
- **Packaging**: {{PACKAGE_MANAGER}}
- **Distribution**: {{DISTRIBUTION_METHOD}}

### Project Structure

```
src/
├── commands/       # Command implementations
├── lib/           # Core functionality
├── utils/         # Helper utilities
├── config/        # Configuration management
├── plugins/       # Plugin system
└── types/         # TypeScript definitions

bin/
└── {{PROJECT_SLUG}}  # Executable entry point

tests/
├── unit/          # Unit tests
├── integration/   # Integration tests
└── fixtures/      # Test data
```

## 🧪 Development

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

# Link for local development
npm link

# Run in development mode
{{DEV_COMMANDS}}
```

### Testing

```bash
# Run all tests
{{TEST_COMMANDS}}

# Run specific test suite
{{UNIT_TEST_COMMANDS}}
{{INTEGRATION_TEST_COMMANDS}}

# Test CLI functionality
{{CLI_TEST_COMMANDS}}

# Test installation
{{INSTALL_TEST_COMMANDS}}
```

## 📚 Usage Examples

### Basic Operations

```bash
# {{EXAMPLE_1_TITLE}}
{{PROJECT_SLUG}} {{EXAMPLE_1_COMMAND}}
# {{EXAMPLE_1_DESCRIPTION}}

# {{EXAMPLE_2_TITLE}}
{{PROJECT_SLUG}} {{EXAMPLE_2_COMMAND}}
# {{EXAMPLE_2_DESCRIPTION}}

# {{EXAMPLE_3_TITLE}}
{{PROJECT_SLUG}} {{EXAMPLE_3_COMMAND}}
# {{EXAMPLE_3_DESCRIPTION}}
```

### Advanced Usage

```bash
# {{ADVANCED_EXAMPLE_1_TITLE}}
{{PROJECT_SLUG}} {{ADVANCED_EXAMPLE_1_COMMAND}}

# {{ADVANCED_EXAMPLE_2_TITLE}}
{{PROJECT_SLUG}} {{ADVANCED_EXAMPLE_2_COMMAND}}

# {{ADVANCED_EXAMPLE_3_TITLE}}
{{PROJECT_SLUG}} {{ADVANCED_EXAMPLE_3_COMMAND}}
```

### Automation & Scripting

```bash
#!/bin/bash
# Example automation script

# Set configuration
export {{PROJECT_SLUG_UPPER}}_CONFIG_PATH="./project-config.{{CONFIG_FORMAT}}"

# Run batch operations
{{PROJECT_SLUG}} {{BATCH_COMMAND_1}}
{{PROJECT_SLUG}} {{BATCH_COMMAND_2}}

# Conditional execution
if {{PROJECT_SLUG}} {{CHECK_COMMAND}}; then
  {{PROJECT_SLUG}} {{SUCCESS_COMMAND}}
else
  {{PROJECT_SLUG}} {{FALLBACK_COMMAND}}
fi
```

## 🔌 Plugin System

### Available Plugins

- **{{PLUGIN_1}}** - {{PLUGIN_1_DESCRIPTION}}
- **{{PLUGIN_2}}** - {{PLUGIN_2_DESCRIPTION}}
- **{{PLUGIN_3}}** - {{PLUGIN_3_DESCRIPTION}}

### Installing Plugins

```bash
# Install plugin
{{PROJECT_SLUG}} plugin install {{PLUGIN_NAME}}

# List installed plugins
{{PROJECT_SLUG}} plugin list

# Update plugins
{{PROJECT_SLUG}} plugin update
```

### Creating Custom Plugins

```javascript
// plugin-example.js
module.exports = {
  name: 'example-plugin',
  description: 'Example plugin functionality',
  commands: {
    'example': {
      description: 'Example command',
      handler: (args, options) => {
        console.log('Plugin executed with:', args);
      }
    }
  }
};
```

## 🚀 Distribution

### NPM Package

```bash
# Build for distribution
{{BUILD_COMMANDS}}

# Publish to npm
{{PUBLISH_COMMANDS}}

# Version management
{{VERSION_COMMANDS}}
```

### Binary Distribution

```bash
# Create standalone binaries
{{BINARY_BUILD_COMMANDS}}

# Package for different platforms
{{PLATFORM_BUILD_COMMANDS}}
```

## 🛠️ Development Workflow

This project uses AI-assisted development for consistent, high-quality results:

1. **Define** - Use `/feature` to create feature requirements and context
2. **Design** - Use `/architect` to create technical architecture and decisions
3. **Plan** - Use `/plan` to create detailed implementation roadmaps
4. **Execute** - Use `/develop` to implement with context-aware quality gates
5. **Validate** - Use `/quality` to ensure usability and performance standards

### Development Standards
- Follow CLI best practices (POSIX compliance)
- Implement comprehensive help documentation
- Write integration tests for all commands
- Ensure cross-platform compatibility
- Optimize for startup time and memory usage

## 🤝 Contributing

### Development Guidelines
1. All commands must include help documentation
2. Implement proper error handling and user feedback
3. Add integration tests for new functionality
4. Follow semantic versioning for releases
5. Update documentation for new features

### Pull Request Process
1. Create feature branch: `git checkout -b feature/new-command`
2. Use AI workflow: `/feature` → `/architect` → `/plan` → `/develop`
3. Add tests and documentation
4. Test on multiple platforms
5. Update CHANGELOG.md
6. Submit pull request

## 📊 Performance

### Benchmarks
- **Startup Time**: < {{STARTUP_TIME_TARGET}}ms
- **Memory Usage**: < {{MEMORY_TARGET}}MB
- **Command Execution**: < {{EXECUTION_TIME_TARGET}}ms

### Optimization
- Lazy loading of modules
- Efficient argument parsing
- Minimal dependencies
- Native binary compilation for performance-critical paths

## 🐛 Troubleshooting

### Common Issues

#### Installation Problems
```bash
# Clear npm cache
npm cache clean --force

# Reinstall globally
npm uninstall -g {{PROJECT_SLUG}}
npm install -g {{PROJECT_SLUG}}
```

#### Permission Issues
```bash
# Fix npm permissions (Unix/Linux/macOS)
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

#### Configuration Issues
```bash
# Reset configuration
{{PROJECT_SLUG}} config reset

# Validate configuration
{{PROJECT_SLUG}} config validate
```

## 📚 Documentation

### User Documentation
- **[Command Reference](./docs/commands/)** - Complete command documentation
- **[Configuration Guide](./docs/configuration.md)** - Configuration options
- **[Plugin Development](./docs/plugins.md)** - Creating custom plugins

### Developer Documentation
- **[Architecture Guide](./docs/architecture.md)** - Internal architecture
- **[API Reference](./docs/api/)** - Programmatic usage
- **[Contributing Guide](./docs/contributing.md)** - Development guidelines

### AI Development Tools
- **[Template Documentation](./docs/ai-tools/template-documentation.md)** - Complete AI template guide
- **[Agent System](./docs/ai-tools/guides/using-agents.md)** - 18 specialist AI agents

## 📊 Project Status

Current project status and context: [STATUS.md](./STATUS.md)

## 🙏 Acknowledgments

- Built with [AI Coding Template](https://github.com/yourusername/ai-coding-template)
- Powered by intelligent agent-assisted development
- {{ADDITIONAL_ACKNOWLEDGMENTS}}

## 📄 License

This project is licensed under the {{LICENSE_TYPE}} License - see the [LICENSE](LICENSE) file for details.

---

**🤖 AI-Enhanced Development**: This CLI tool leverages intelligent agents for command design, user experience optimization, and cross-platform compatibility. See our [AI development guide](./docs/ai-tools/) to learn how AI accelerates CLI development while ensuring excellent user experience.