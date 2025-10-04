# Security Review Checklist Template

## Authentication & Authorization

- [ ] User authentication properly implemented
- [ ] Authorization checks in place for all protected resources
- [ ] Session management secure and properly configured
- [ ] Token generation and validation secure

## Input Validation

- [ ] All user inputs validated and sanitized
- [ ] SQL injection prevention measures in place
- [ ] XSS prevention implemented
- [ ] File upload restrictions properly configured

## Data Protection

- [ ] Sensitive data properly encrypted
- [ ] No secrets or credentials in code
- [ ] Proper logging (no sensitive data logged)
- [ ] HTTPS enforced for data transmission

## Security Headers & Configuration

- [ ] Appropriate security headers configured
- [ ] CORS policy properly configured
- [ ] Rate limiting implemented where needed
- [ ] Error messages don't leak sensitive information

**Security Score**: ⭐⭐⭐⭐⭐ (5/5) **Reviewer**: @security-team **Date**: 2025-09-17