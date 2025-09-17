---
version: "1.0.0"
created: "{{CREATED_DATE}}"
last_updated: "{{LAST_UPDATED_DATE}}"
purpose: "Template for creating comprehensive feature documentation"
when_to_use: "When documenting new features, major enhancements, or complex functionality"
target_audience: ["developers", "technical-writers", "product-managers"]
document_type: "template"
tags: ["feature", "documentation", "implementation"]
placeholders:
  - name: "FEATURE_NAME"
    description: "Name of the feature being documented"
    example: "User Authentication System"
  - name: "FEATURE_SUMMARY"
    description: "Brief description of what the feature does"
    example: "Secure user login and session management with multi-factor authentication"
  - name: "BUSINESS_VALUE"
    description: "Business justification and value proposition"
    example: "Improves security and reduces support tickets by 40%"
  - name: "PRIMARY_STAKEHOLDER"
    description: "Main stakeholder or product owner"
    example: "Security Team"
  - name: "IMPLEMENTATION_COMPLEXITY"
    description: "Development complexity estimate"
    example: "Medium (2-3 sprints)"
  - name: "DEPENDENCIES"
    description: "List of dependencies and prerequisites"
    example: "Database schema updates, OAuth integration"
  - name: "CREATED_DATE"
    description: "Date when this document was created"
    example: "2025-09-17"
  - name: "LAST_UPDATED_DATE"
    description: "Date when this document was last updated"
    example: "2025-09-17"
---

# {{FEATURE_NAME}}

## 📋 Summary

{{FEATURE_SUMMARY}}

**Business Value**: {{BUSINESS_VALUE}}

**Stakeholder**: {{PRIMARY_STAKEHOLDER}}

**Complexity**: {{IMPLEMENTATION_COMPLEXITY}}

## 🎯 Objectives

### Primary Goals
- [ ] Goal 1: Brief description
- [ ] Goal 2: Brief description
- [ ] Goal 3: Brief description

### Success Metrics
- Metric 1: Target value
- Metric 2: Target value
- Metric 3: Target value

## 🏗️ Technical Architecture

### Overview
Brief architectural overview of how the feature fits into the system.

### Components
| Component | Responsibility | Technology |
|-----------|---------------|------------|
| Component A | What it does | Tech stack |
| Component B | What it does | Tech stack |
| Component C | What it does | Tech stack |

### Data Flow
```
[User] → [Frontend] → [API] → [Service] → [Database]
```

## 📝 Requirements

### Functional Requirements
1. **Requirement 1**: Detailed description
   - Acceptance criteria 1
   - Acceptance criteria 2

2. **Requirement 2**: Detailed description
   - Acceptance criteria 1
   - Acceptance criteria 2

### Non-Functional Requirements
- **Performance**: Response time targets
- **Security**: Security requirements
- **Scalability**: Load capacity requirements
- **Accessibility**: Accessibility standards

## 🔗 Dependencies

{{DEPENDENCIES}}

### Prerequisites
- [ ] Dependency 1
- [ ] Dependency 2

### Affected Systems
- System 1: Impact description
- System 2: Impact description

## 🧪 Testing Strategy

### Test Types
- [ ] **Unit Tests**: Coverage target and focus areas
- [ ] **Integration Tests**: Integration points to test
- [ ] **E2E Tests**: User journeys to validate
- [ ] **Performance Tests**: Load and stress testing
- [ ] **Security Tests**: Security validation

### Test Data
Requirements for test data setup and management.

## 🚀 Implementation Plan

### Complexity Classification
**Classification**: [Simple | Complex | Architectural]
- **Simple**: Single-phase implementation → Direct /iterate execution
- **Complex**: Multi-phase planning → Full /idea → /plan → /iterate workflow
- **Architectural**: System decisions → Extended /idea with multi-model consultation

**Development Strategy**: [Backend-First | Frontend-First | Full-Stack]
- **Backend-First** (Recommended): API/data layer → Business logic → Frontend integration

### Phase 1: Foundation (Mission Objective: [Clear goal])
- [ ] Task 1
  - **Objective**: [Specific goal]
  - **Acceptance Criteria**: [How to verify completion]
  - **Dependencies**: [Prerequisites]
- [ ] Task 2
  - **Objective**: [Specific goal]
  - **Acceptance Criteria**: [How to verify completion]
  - **Dependencies**: [Prerequisites]

### Phase 2: Core Implementation (Mission Objective: [Clear goal])
- [ ] Task 1
  - **Objective**: [Specific goal]
  - **Acceptance Criteria**: [How to verify completion]
  - **Dependencies**: [Prerequisites]
- [ ] Task 2
  - **Objective**: [Specific goal]
  - **Acceptance Criteria**: [How to verify completion]
  - **Dependencies**: [Prerequisites]

### Phase 3: Integration & Testing (Mission Objective: [Clear goal])
- [ ] Task 1
  - **Objective**: [Specific goal]
  - **Acceptance Criteria**: [How to verify completion]
  - **Dependencies**: [Prerequisites]
- [ ] Task 2
  - **Objective**: [Specific goal]
  - **Acceptance Criteria**: [How to verify completion]
  - **Dependencies**: [Prerequisites]

## 📖 Documentation Requirements

- [ ] **API Documentation**: Endpoint specifications
- [ ] **User Documentation**: End-user guides
- [ ] **Developer Documentation**: Integration guides
- [ ] **Operations Documentation**: Deployment and monitoring

## 🔍 Review & Approval

### Stakeholder Sign-off
- [ ] **Technical Review**: Architecture and implementation approach
- [ ] **Product Review**: Requirements and user experience
- [ ] **Security Review**: Security implications and compliance
- [ ] **Operations Review**: Deployment and operational impact

### Decision Log
| Date | Decision | Rationale | Stakeholder |
|------|----------|-----------|-------------|
| | | | |

## 📚 References

- [Related Documentation](#)
- [API Specifications](#)
- [Design Documents](#)
- [External Resources](#)

---

**Template Usage**: Replace all `{{PLACEHOLDER}}` values with actual content. Remove placeholder sections that don't apply to your feature.