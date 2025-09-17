# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## 🌐 Live Demo

{{#DEMO_URL}}
**[View Live Demo]({{DEMO_URL}})**
{{/DEMO_URL}}

## 🚀 Features

- {{FEATURE_1}}
- {{FEATURE_2}}
- {{FEATURE_3}}
- 📱 Responsive design for all devices
- ⚡ Fast performance with modern web standards
- 🔒 Secure authentication and data protection

## 📋 Prerequisites

**Required:**
- {{TECH_REQUIREMENTS}}
- Modern web browser (Chrome, Firefox, Safari, Edge)

**Recommended:**
- {{RECOMMENDED_TOOLS}}

## ⚡ Quick Start

### Installation

```bash
# Clone the repository
git clone {{REPO_URL}} {{PROJECT_SLUG}}
cd {{PROJECT_SLUG}}

# Install dependencies
{{INSTALL_COMMANDS}}

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Development

```bash
# Start development server
{{DEV_COMMANDS}}
# Open http://localhost:3000

# Run tests
{{TEST_COMMANDS}}

# Build for production
{{BUILD_COMMANDS}}
```

## 🏗️ Architecture

This web application uses the [AI Coding Template](./docs/ai-tools/template-documentation.md) workflow for intelligent development.

### Tech Stack

- **Frontend**: {{FRONTEND_FRAMEWORK}}
- **Styling**: {{STYLING_APPROACH}}
- **State Management**: {{STATE_MANAGEMENT}}
- **Backend**: {{BACKEND_TECH}}
- **Database**: {{DATABASE_TECH}}
- **Deployment**: {{DEPLOYMENT_PLATFORM}}

### Key Directories

```
src/
├── components/     # Reusable UI components
├── pages/         # Application pages/routes
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── styles/        # Global styles and themes
├── api/           # API integration layer
└── types/         # TypeScript type definitions
```

### AI-Assisted Development

This project includes intelligent development workflows:

- **`/idea`** - Interactive architectural exploration
- **`/plan`** - Multi-agent planning and task breakdown
- **`/iterate`** - Context-aware task execution with quality gates

See [Getting Started with AI Workflow](./docs/ai-tools/getting-started-with-template.md) for details.

## 📱 User Experience

### Target Users
{{TARGET_USERS}}

### Key User Flows
1. **{{USER_FLOW_1}}** - {{USER_FLOW_1_DESCRIPTION}}
2. **{{USER_FLOW_2}}** - {{USER_FLOW_2_DESCRIPTION}}
3. **{{USER_FLOW_3}}** - {{USER_FLOW_3_DESCRIPTION}}

### Performance Goals
- ⚡ First Contentful Paint < 2s
- 📊 Lighthouse Score > 90
- 📱 Mobile-first responsive design
- ♿ WCAG 2.1 AA accessibility compliance

## 🧪 Testing Strategy

```bash
# Unit tests
{{TEST_COMMANDS}}

# Integration tests
{{INTEGRATION_TEST_COMMANDS}}

# E2E tests
{{E2E_TEST_COMMANDS}}

# Performance testing
{{PERFORMANCE_TEST_COMMANDS}}

# Accessibility testing
{{A11Y_TEST_COMMANDS}}
```

### Test Coverage Goals
- Unit Tests: > 80%
- Integration Tests: > 70%
- E2E Tests: Critical user flows
- Performance: All pages under 3s load time

## 🚀 Deployment

### {{ENVIRONMENT_1}}
```bash
{{DEPLOY_COMMANDS_1}}
```

### {{ENVIRONMENT_2}}
```bash
{{DEPLOY_COMMANDS_2}}
```

### Environment Variables

```bash
# Application
NEXT_PUBLIC_APP_URL={{APP_URL}}
NEXT_PUBLIC_API_URL={{API_URL}}

# Database
DATABASE_URL={{DATABASE_URL}}

# Authentication
AUTH_SECRET={{AUTH_SECRET}}
GOOGLE_CLIENT_ID={{GOOGLE_CLIENT_ID}}

# Third-party services
STRIPE_SECRET_KEY={{STRIPE_SECRET_KEY}}
SENDGRID_API_KEY={{SENDGRID_API_KEY}}
```

## 🛠️ Development Workflow

This project uses AI-assisted development for consistent, high-quality results:

1. **Explore** - Use `/idea` to discuss UI/UX decisions with AI specialists
2. **Plan** - Use `/plan` to create detailed implementation roadmaps
3. **Execute** - Use `/iterate` to implement with context-aware quality gates
4. **Validate** - Use `/quality` to ensure performance and accessibility standards

### Code Organization

- Follow component-driven development
- Use TypeScript for type safety
- Implement responsive design mobile-first
- Maintain accessibility standards (WCAG 2.1)
- Follow performance best practices

## 🎨 Design System

### Colors
```css
:root {
  --primary: {{PRIMARY_COLOR}};
  --secondary: {{SECONDARY_COLOR}};
  --accent: {{ACCENT_COLOR}};
  --background: {{BACKGROUND_COLOR}};
  --text: {{TEXT_COLOR}};
}
```

### Typography
- **Primary Font**: {{PRIMARY_FONT}}
- **Secondary Font**: {{SECONDARY_FONT}}
- **Font Sizes**: Responsive scale (14px - 48px)

### Components
- Consistent spacing (8px grid)
- Reusable component library
- Design tokens for consistency
- Dark/light theme support

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Use AI workflow: `/idea "amazing feature approach"` → `/plan` → `/iterate`
4. Test your changes: `npm run test`
5. Check performance: `npm run lighthouse`
6. Commit your changes: `git commit -m "feat: add amazing feature"`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Development Standards
- All features must include comprehensive tests
- Maintain accessibility standards (WCAG 2.1 AA)
- Follow the established design system
- Update Storybook documentation for new components
- Ensure mobile responsiveness

## 📊 Analytics & Monitoring

### Performance Monitoring
- **Core Web Vitals**: Tracked via {{ANALYTICS_TOOL}}
- **Error Tracking**: {{ERROR_TRACKING_TOOL}}
- **User Analytics**: {{USER_ANALYTICS_TOOL}}

### Key Metrics
- Page load times
- User engagement rates
- Conversion funnel performance
- Error rates and crash reports

## 🐛 Issue Reporting

Found a bug? Please check existing issues first, then:

1. Use the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md)
2. Include browser and device information
3. Provide steps to reproduce
4. Add screenshots or videos if applicable

## 📚 Documentation

### User Documentation
- **[User Guide](./docs/user-guide.md)** - How to use the application
- **[FAQ](./docs/faq.md)** - Common questions and answers

### Developer Documentation
- **[API Documentation](./docs/api/)** - Complete API reference
- **[Component Documentation](./docs/components/)** - Storybook component library
- **[Architecture Decisions](./docs/technical/decisions/)** - Key technical decisions
- **[Deployment Guide](./docs/development/deployment.md)** - Production deployment

### AI Development Tools
- **[Template Documentation](./docs/ai-tools/template-documentation.md)** - Complete AI template guide
- **[Available Templates](./docs/ai-tools/templates-and-examples.md)** - Code and documentation templates
- **[Agent System](./docs/ai-tools/guides/using-agents.md)** - 18 specialist AI agents

## 🔒 Security

### Security Measures
- ✅ HTTPS everywhere
- ✅ Content Security Policy (CSP)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Input validation and sanitization

### Reporting Security Issues
Please report security vulnerabilities to {{SECURITY_EMAIL}} rather than using public issues.

## 📊 Project Status

Current project status and context: [STATUS.md](./STATUS.md)

## 🙏 Acknowledgments

- Built with [AI Coding Template](https://github.com/yourusername/ai-coding-template)
- Powered by intelligent agent-assisted development
- {{ADDITIONAL_ACKNOWLEDGMENTS}}
- Special thanks to our amazing contributors

## 📄 License

This project is licensed under the {{LICENSE_TYPE}} License - see the [LICENSE](LICENSE) file for details.

---

**🤖 AI-Enhanced Development**: This web application leverages intelligent agents for architectural decisions, UI/UX planning, and quality assurance. See our [AI development guide](./docs/ai-tools/) to learn how AI accelerates every aspect of web development while maintaining high standards.