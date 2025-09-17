# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## 📱 Download

{{#APP_STORE_URL}}
[![Download on the App Store](https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg)]({{APP_STORE_URL}})
{{/APP_STORE_URL}}

{{#GOOGLE_PLAY_URL}}
[![Get it on Google Play](https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png)]({{GOOGLE_PLAY_URL}})
{{/GOOGLE_PLAY_URL}}

## 🚀 Features

- {{FEATURE_1}}
- {{FEATURE_2}}
- {{FEATURE_3}}
- 📱 Native iOS and Android support
- 🔄 Offline-first architecture
- 🔔 Push notifications
- 🌐 Multi-language support

## 📋 Prerequisites

**Development:**
- {{TECH_REQUIREMENTS}}
- {{MOBILE_REQUIREMENTS}}

**Target Platforms:**
- iOS {{IOS_VERSION}}+ (iPhone, iPad)
- Android {{ANDROID_VERSION}}+ (API level {{ANDROID_API_LEVEL}}+)

## ⚡ Quick Start

### Development Setup

```bash
# Clone the repository
git clone {{REPO_URL}} {{PROJECT_SLUG}}
cd {{PROJECT_SLUG}}

# Install dependencies
{{INSTALL_COMMANDS}}

# Install pods (iOS)
{{IOS_SETUP_COMMANDS}}

# Start development server
{{DEV_COMMANDS}}

# Run on iOS simulator
{{IOS_RUN_COMMANDS}}

# Run on Android emulator
{{ANDROID_RUN_COMMANDS}}
```

### Building for Production

```bash
# Build for iOS
{{IOS_BUILD_COMMANDS}}

# Build for Android
{{ANDROID_BUILD_COMMANDS}}

# Create release builds
{{RELEASE_BUILD_COMMANDS}}
```

## 🏗️ Architecture

This mobile application uses the [AI Coding Template](./docs/ai-tools/template-documentation.md) workflow for intelligent development.

### Tech Stack

- **Framework**: {{MOBILE_FRAMEWORK}}
- **Language**: {{LANGUAGE}}
- **State Management**: {{STATE_MANAGEMENT}}
- **Navigation**: {{NAVIGATION_LIBRARY}}
- **UI Components**: {{UI_LIBRARY}}
- **Backend**: {{BACKEND_TECH}}
- **Database**: {{DATABASE_TECH}}

### Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/         # Application screens
├── navigation/      # Navigation configuration
├── services/        # API and external services
├── store/          # State management
├── utils/          # Utility functions
├── hooks/          # Custom hooks
├── types/          # TypeScript definitions
└── assets/         # Images, fonts, etc.

{{#PLATFORM_SPECIFIC}}
ios/                # iOS-specific code
android/            # Android-specific code
{{/PLATFORM_SPECIFIC}}
```

## 📱 Features

### Core Functionality

- **{{CORE_FEATURE_1}}** - {{CORE_FEATURE_1_DESCRIPTION}}
- **{{CORE_FEATURE_2}}** - {{CORE_FEATURE_2_DESCRIPTION}}
- **{{CORE_FEATURE_3}}** - {{CORE_FEATURE_3_DESCRIPTION}}

### User Experience

- **{{UX_FEATURE_1}}** - {{UX_FEATURE_1_DESCRIPTION}}
- **{{UX_FEATURE_2}}** - {{UX_FEATURE_2_DESCRIPTION}}
- **{{UX_FEATURE_3}}** - {{UX_FEATURE_3_DESCRIPTION}}

### Technical Features

- **Offline Support**: Data synchronization when connection restored
- **Push Notifications**: Real-time updates and alerts
- **Biometric Authentication**: Face ID, Touch ID, Fingerprint
- **Dark Mode**: System-aware theme switching
- **Accessibility**: WCAG 2.1 AA compliance

## 🧪 Testing Strategy

```bash
# Unit tests
{{TEST_COMMANDS}}

# Integration tests
{{INTEGRATION_TEST_COMMANDS}}

# E2E tests
{{E2E_TEST_COMMANDS}}

# Device testing
{{DEVICE_TEST_COMMANDS}}

# Performance testing
{{PERFORMANCE_TEST_COMMANDS}}
```

### Testing Coverage

- **Unit Tests**: Component logic and utility functions
- **Integration Tests**: API integration and data flow
- **E2E Tests**: Critical user journeys
- **Device Tests**: Physical device validation
- **Performance Tests**: Memory usage, battery impact

## 🚀 Deployment

### App Store Distribution

#### iOS App Store

```bash
# Build for App Store
{{IOS_RELEASE_COMMANDS}}

# Upload to App Store Connect
{{IOS_UPLOAD_COMMANDS}}

# Submit for review
# Process via Xcode or App Store Connect
```

#### Google Play Store

```bash
# Build release APK/AAB
{{ANDROID_RELEASE_COMMANDS}}

# Upload to Google Play Console
{{ANDROID_UPLOAD_COMMANDS}}

# Submit for review
# Process via Google Play Console
```

### Beta Distribution

```bash
# TestFlight (iOS)
{{TESTFLIGHT_COMMANDS}}

# Google Play Internal Testing
{{PLAY_INTERNAL_COMMANDS}}

# Firebase App Distribution
{{FIREBASE_DISTRIBUTION_COMMANDS}}
```

## 📊 Performance & Analytics

### Performance Targets

- **App Launch Time**: < {{LAUNCH_TIME_TARGET}}ms
- **Memory Usage**: < {{MEMORY_TARGET}}MB
- **Battery Impact**: Minimal background usage
- **Crash Rate**: < {{CRASH_RATE_TARGET}}%

### Analytics Integration

- **{{ANALYTICS_PLATFORM_1}}**: User behavior and engagement
- **{{ANALYTICS_PLATFORM_2}}**: Performance monitoring
- **{{ANALYTICS_PLATFORM_3}}**: Crash reporting

### Key Metrics

- Daily/Monthly Active Users
- Session duration and frequency
- Feature adoption rates
- Conversion funnel performance
- Technical performance metrics

## 🛠️ Development Workflow

This project uses AI-assisted development for consistent, high-quality results:

1. **Define** - Use `/feature` to create feature requirements and context
2. **Design** - Use `/architect` to create technical architecture and decisions
3. **Plan** - Use `/plan` to create detailed implementation roadmaps
4. **Execute** - Use `/develop` to implement with context-aware quality gates
5. **Validate** - Use `/quality` to ensure performance and user experience standards

### Development Standards

- Follow platform-specific design guidelines (iOS Human Interface Guidelines, Material Design)
- Implement comprehensive error handling and offline support
- Optimize for performance and battery life
- Ensure accessibility compliance
- Maintain consistent cross-platform experience

## 🎨 Design System

### Visual Design

- **Color Palette**: {{PRIMARY_COLOR}}, {{SECONDARY_COLOR}}, {{ACCENT_COLOR}}
- **Typography**: {{PRIMARY_FONT}}, {{SECONDARY_FONT}}
- **Spacing**: {{SPACING_SYSTEM}} (8pt grid system)
- **Components**: Consistent UI component library

### Platform Adaptations

#### iOS Specific
- Native navigation patterns
- iOS-style alerts and modals
- System font integration
- Safe area handling

#### Android Specific
- Material Design components
- Android navigation patterns
- System theme integration
- Adaptive icons

## 🔒 Security & Privacy

### Security Measures

- ✅ Secure data storage (Keychain/Android Keystore)
- ✅ Certificate pinning for API communications
- ✅ Biometric authentication integration
- ✅ Code obfuscation for release builds
- ✅ Runtime application self-protection (RASP)

### Privacy Compliance

- **GDPR**: European data protection compliance
- **CCPA**: California privacy rights compliance
- **COPPA**: Children's privacy protection (if applicable)
- **Platform Privacy**: iOS App Tracking Transparency, Android permissions

### Data Handling

- Minimal data collection principles
- Clear privacy policy and consent flows
- Secure data transmission (TLS 1.3+)
- Regular security audits and penetration testing

## 🤝 Contributing

### Development Guidelines

1. Follow platform-specific development best practices
2. Maintain cross-platform feature parity
3. Implement comprehensive testing for new features
4. Update documentation for user-facing changes
5. Follow App Store and Play Store guidelines

### Pull Request Process

1. Create feature branch: `git checkout -b feature/new-screen`
2. Use AI workflow: `/feature` → `/architect` → `/plan` → `/develop`
3. Test on both platforms
4. Update screenshots and documentation
5. Submit pull request with device testing results

## 📚 Documentation

### User Documentation
- **[User Guide](./docs/user-guide/)** - How to use the app
- **[Privacy Policy](./docs/privacy-policy.md)** - Data handling and privacy
- **[Terms of Service](./docs/terms-of-service.md)** - Usage terms

### Developer Documentation
- **[API Documentation](./docs/api/)** - Backend API reference
- **[Architecture Guide](./docs/architecture.md)** - Technical architecture
- **[Platform Guides](./docs/platforms/)** - iOS and Android specific guides
- **[Deployment Guide](./docs/deployment.md)** - Distribution and release process

### AI Development Tools
- **[Template Documentation](./docs/ai-tools/template-documentation.md)** - Complete AI template guide
- **[Agent System](./docs/ai-tools/guides/using-agents.md)** - 18 specialist AI agents

## 🐛 Bug Reports & Support

### User Support
- **In-App**: Help & Support section
- **Email**: {{SUPPORT_EMAIL}}
- **Knowledge Base**: {{SUPPORT_URL}}

### Developer Issues
- **GitHub Issues**: Technical problems and feature requests
- **Documentation Issues**: Corrections and improvements
- **Security Issues**: {{SECURITY_EMAIL}} (private disclosure)

## 📊 Project Status

Current project status and context: [STATUS.md](./STATUS.md)

## 🙏 Acknowledgments

- Built with [AI Coding Template](https://github.com/yourusername/ai-coding-template)
- Powered by intelligent agent-assisted development
- {{ADDITIONAL_ACKNOWLEDGMENTS}}
- Special thanks to our beta testers and community

## 📄 License

This project is licensed under the {{LICENSE_TYPE}} License - see the [LICENSE](LICENSE) file for details.

---

**🤖 AI-Enhanced Development**: This mobile application leverages intelligent agents for user experience design, performance optimization, and cross-platform consistency. See our [AI development guide](./docs/ai-tools/) to learn how AI accelerates mobile development while ensuring excellent user experience across platforms.