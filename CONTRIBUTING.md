# Contributing to AI Coding Template

Thank you for your interest in contributing to the AI Coding Template project! This document provides guidelines for contributing to this repository.

## Quick Start

1. **Read the Documentation**: Start with [README.md](./README.md) for project overview
2. **Review Guidelines**: Check [docs/development/guidelines/](./docs/development/guidelines/) for detailed standards
3. **Understand the Workflow**: Familiarize yourself with our [4-phase workflow](./docs/ai-toolkit/reference/commands.md)

## Types of Contributions

### 🐛 Bug Reports
- Use the [issue templates](.github/ISSUE_TEMPLATE/) when available
- Include clear reproduction steps
- Provide system information and error messages

### ✨ Feature Requests
- Check existing issues to avoid duplicates
- Use the `/feature` command to create comprehensive feature documentation
- Include use cases and implementation considerations

### 📖 Documentation Improvements
- Follow our [3-tier documentation system](./docs/ai-toolkit/system-context.md)
- Use the established [metadata headers](./docs/development/guidelines/quality-standards.md)
- Test all links using `./.claude/resources/scripts/docs/link-validator.sh`

### 🔧 Code Contributions
- Follow the project's established patterns and conventions
- Include appropriate tests and documentation
- Use the AI agent system for complex changes

## Development Process

### 1. Setup
```bash
# Clone and setup the repository
git clone <repository-url>
cd ai-coding-template
./.claude/resources/scripts/setup/setup-manager.sh
```

### 2. Workflow
- Use feature branches for all changes
- Follow the `/vision → /feature → /architect → /plan → /develop` workflow for substantial changes
- Run quality checks before committing: `./.githooks/pre-commit`

### 3. Quality Standards
- **Documentation**: Maintain 85+ quality score
- **Links**: All internal links must be valid
- **Tests**: Include tests for functional changes
- **Style**: Follow established conventions in similar files

## AI-Assisted Development

This project is optimized for AI-assisted development:

### Using the Agent System
- **19 Specialized Agents**: Use appropriate agents for domain expertise
- **Multi-Model Validation**: Critical decisions get cross-validation
- **Context Management**: Agents maintain project context automatically

### Best Practices
- Use `/plan` for complex changes to get multi-agent analysis
- Leverage the technical-writer agent for documentation
- Use the code-reviewer agent before submitting changes

## Submission Guidelines

### Pull Requests
1. **Clear Description**: Explain what changes were made and why
2. **Linked Issues**: Reference related issues using keywords (fixes #123)
3. **Quality Checks**: Ensure all automated checks pass
4. **Documentation**: Update relevant documentation
5. **AI Attribution**: Note if AI tools were used significantly

### Commit Messages
Follow conventional commit format:
```
type(scope): description

- Detailed change 1
- Detailed change 2

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

## Review Process

### Automated Checks
- **Pre-commit Hooks**: 7-stage validation including security, style, and documentation
- **Link Validation**: All internal links must resolve correctly
- **Quality Gates**: Documentation and code quality standards

### Human Review
- Focus on architectural decisions and user experience
- Verify AI assistance attribution is appropriate
- Ensure changes align with project vision and standards

## Community Standards

### Code of Conduct
- Be respectful and inclusive in all interactions
- Focus on constructive feedback and collaboration
- Help maintain a welcoming environment for all contributors

### Communication
- Use GitHub issues for bug reports and feature requests
- Ask questions in discussions or issues, not in pull requests
- Be clear and specific in all communications

## Getting Help

### Resources
- **Documentation**: [docs/](./docs/) directory contains comprehensive guides
- **Examples**: [.claude/resources/examples/](./.claude/resources/examples/) show implementation patterns
- **Scripts**: [.claude/resources/scripts/](./.claude/resources/scripts/) provide automation tools

### Support Channels
- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general help
- **Documentation**: Self-service guides for most scenarios

## Recognition

Contributors are recognized through:
- Git commit attribution
- CHANGELOG.md entries for significant contributions
- Project documentation acknowledgments

---

Thank you for contributing to the AI Coding Template project! Your contributions help improve AI-assisted development for everyone.
