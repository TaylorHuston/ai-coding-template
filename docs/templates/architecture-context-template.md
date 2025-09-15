---
version: "{{VERSION}}"
created: "{{CREATED_DATE}}"
last_updated: "{{CREATED_DATE}}"
status: "draft"
target_audience: ["all-stakeholders", "developers", "ai-assistants"]
document_type: "architecture"
category: "architecture"
c4_level: "context"
diagram_type: "system_context"
related_diagrams: ["container-architecture.md"]
external_tools: ["{{DIAGRAM_TOOL}}"]
tags: ["c4", "system-context", "boundaries", "actors"]
---

# System Context: {{SYSTEM_NAME}}

**Purpose**: Shows how the {{SYSTEM_NAME}} system fits into the broader {{DOMAIN}} ecosystem and interacts with users and external systems.

## System Overview

The **{{SYSTEM_NAME}}** is {{SYSTEM_DESCRIPTION}}. It solves {{CORE_PROBLEM}} by providing {{KEY_CAPABILITIES}}.

### Core Value Propositions

1. **{{VALUE_PROP_1}}**: {{VALUE_DESCRIPTION_1}}
2. **{{VALUE_PROP_2}}**: {{VALUE_DESCRIPTION_2}}
3. **{{VALUE_PROP_3}}**: {{VALUE_DESCRIPTION_3}}

## System Boundary

**In Scope**:
- {{IN_SCOPE_ITEM_1}}
- {{IN_SCOPE_ITEM_2}}
- {{IN_SCOPE_ITEM_3}}

**Out of Scope**:
- {{OUT_SCOPE_ITEM_1}}
- {{OUT_SCOPE_ITEM_2}}
- {{OUT_SCOPE_ITEM_3}}

## External Actors

### Primary Users

#### {{USER_TYPE_1}}
- **Role**: {{USER_ROLE_DESCRIPTION}}
- **Goals**:
  - {{USER_GOAL_1}}
  - {{USER_GOAL_2}}
  - {{USER_GOAL_3}}
- **Interactions**:
  - {{USER_INTERACTION_1}}
  - {{USER_INTERACTION_2}}
  - {{USER_INTERACTION_3}}
- **Value Received**: {{USER_VALUE_DESCRIPTION}}

#### {{USER_TYPE_2}}
- **Role**: {{USER_ROLE_DESCRIPTION_2}}
- **Goals**:
  - {{USER_GOAL_2_1}}
  - {{USER_GOAL_2_2}}
  - {{USER_GOAL_2_3}}
- **Interactions**:
  - {{USER_INTERACTION_2_1}}
  - {{USER_INTERACTION_2_2}}
  - {{USER_INTERACTION_2_3}}
- **Value Received**: {{USER_VALUE_DESCRIPTION_2}}

### External Systems

#### {{EXTERNAL_SYSTEM_1}}
- **Purpose**: {{EXTERNAL_SYSTEM_PURPOSE_1}}
- **Systems**: {{EXTERNAL_SYSTEM_EXAMPLES_1}}
- **Interactions**:
  - {{EXTERNAL_INTERACTION_1_1}}
  - {{EXTERNAL_INTERACTION_1_2}}
  - {{EXTERNAL_INTERACTION_1_3}}
- **Data Exchange**: {{DATA_EXCHANGE_DESCRIPTION_1}}

#### {{EXTERNAL_SYSTEM_2}}
- **Purpose**: {{EXTERNAL_SYSTEM_PURPOSE_2}}
- **Systems**: {{EXTERNAL_SYSTEM_EXAMPLES_2}}
- **Interactions**:
  - {{EXTERNAL_INTERACTION_2_1}}
  - {{EXTERNAL_INTERACTION_2_2}}
  - {{EXTERNAL_INTERACTION_2_3}}
- **Data Exchange**: {{DATA_EXCHANGE_DESCRIPTION_2}}

## Key System Interactions

### User-to-System Workflows

#### {{WORKFLOW_1}}
1. {{WORKFLOW_STEP_1_1}}
2. {{WORKFLOW_STEP_1_2}}
3. {{WORKFLOW_STEP_1_3}}
4. {{WORKFLOW_STEP_1_4}}

#### {{WORKFLOW_2}}
1. {{WORKFLOW_STEP_2_1}}
2. {{WORKFLOW_STEP_2_2}}
3. {{WORKFLOW_STEP_2_3}}
4. {{WORKFLOW_STEP_2_4}}

### System-to-System Integrations

#### {{INTEGRATION_PATTERN_1}}
```
{{INTEGRATION_DESCRIPTION_1}}
```

#### {{INTEGRATION_PATTERN_2}}
```
{{INTEGRATION_DESCRIPTION_2}}
```

## Data Flows

### Inbound Data
- **{{INBOUND_DATA_TYPE_1}}**: {{INBOUND_DATA_DESCRIPTION_1}}
- **{{INBOUND_DATA_TYPE_2}}**: {{INBOUND_DATA_DESCRIPTION_2}}
- **{{INBOUND_DATA_TYPE_3}}**: {{INBOUND_DATA_DESCRIPTION_3}}

### Outbound Data
- **{{OUTBOUND_DATA_TYPE_1}}**: {{OUTBOUND_DATA_DESCRIPTION_1}}
- **{{OUTBOUND_DATA_TYPE_2}}**: {{OUTBOUND_DATA_DESCRIPTION_2}}
- **{{OUTBOUND_DATA_TYPE_3}}**: {{OUTBOUND_DATA_DESCRIPTION_3}}

### Persistent Data
- **{{PERSISTENT_DATA_TYPE_1}}**: {{PERSISTENT_DATA_DESCRIPTION_1}}
- **{{PERSISTENT_DATA_TYPE_2}}**: {{PERSISTENT_DATA_DESCRIPTION_2}}
- **{{PERSISTENT_DATA_TYPE_3}}**: {{PERSISTENT_DATA_DESCRIPTION_3}}

## System Context Diagram

```
{{SYSTEM_CONTEXT_DIAGRAM_ASCII_OR_REFERENCE}}
```

*Note: Replace this ASCII diagram with an embedded image from your preferred diagramming tool (Draw.io, Miro, etc.)*

## Benefits and Outcomes

### For Users
- **{{USER_BENEFIT_1}}**: {{USER_BENEFIT_DESCRIPTION_1}}
- **{{USER_BENEFIT_2}}**: {{USER_BENEFIT_DESCRIPTION_2}}
- **{{USER_BENEFIT_3}}**: {{USER_BENEFIT_DESCRIPTION_3}}

### For Organizations
- **{{ORG_BENEFIT_1}}**: {{ORG_BENEFIT_DESCRIPTION_1}}
- **{{ORG_BENEFIT_2}}**: {{ORG_BENEFIT_DESCRIPTION_2}}
- **{{ORG_BENEFIT_3}}**: {{ORG_BENEFIT_DESCRIPTION_3}}

### For External Systems
- **{{EXTERNAL_BENEFIT_1}}**: {{EXTERNAL_BENEFIT_DESCRIPTION_1}}
- **{{EXTERNAL_BENEFIT_2}}**: {{EXTERNAL_BENEFIT_DESCRIPTION_2}}

## Success Metrics

### User Adoption
- {{METRIC_1}}: {{METRIC_TARGET_1}}
- {{METRIC_2}}: {{METRIC_TARGET_2}}
- {{METRIC_3}}: {{METRIC_TARGET_3}}

### System Integration
- {{INTEGRATION_METRIC_1}}: {{INTEGRATION_TARGET_1}}
- {{INTEGRATION_METRIC_2}}: {{INTEGRATION_TARGET_2}}
- {{INTEGRATION_METRIC_3}}: {{INTEGRATION_TARGET_3}}

### System Effectiveness
- {{EFFECTIVENESS_METRIC_1}}: {{EFFECTIVENESS_TARGET_1}}
- {{EFFECTIVENESS_METRIC_2}}: {{EFFECTIVENESS_TARGET_2}}
- {{EFFECTIVENESS_METRIC_3}}: {{EFFECTIVENESS_TARGET_3}}

---

*This system context establishes the foundation for understanding how the {{SYSTEM_NAME}} integrates into the broader {{DOMAIN}} ecosystem while providing {{KEY_VALUE_PROPOSITION}}.*

## Template Variables

Replace the following placeholders when using this template:

**System Information**:
- `{{SYSTEM_NAME}}` - Name of your system
- `{{SYSTEM_DESCRIPTION}}` - Brief description of what the system does
- `{{DOMAIN}}` - Business domain or technical area
- `{{CORE_PROBLEM}}` - Primary problem the system solves
- `{{KEY_CAPABILITIES}}` - Main capabilities provided
- `{{KEY_VALUE_PROPOSITION}}` - Primary value delivered

**Value Propositions**:
- `{{VALUE_PROP_1-3}}` - Three main value propositions
- `{{VALUE_DESCRIPTION_1-3}}` - Detailed descriptions of each value proposition

**Scope Definition**:
- `{{IN_SCOPE_ITEM_1-3}}` - What is included in the system
- `{{OUT_SCOPE_ITEM_1-3}}` - What is explicitly excluded

**User Types**:
- `{{USER_TYPE_1-2}}` - Primary user types
- `{{USER_ROLE_DESCRIPTION}}` - Role description for each user type
- `{{USER_GOAL_1-3}}` - Main goals for each user type
- `{{USER_INTERACTION_1-3}}` - How users interact with the system
- `{{USER_VALUE_DESCRIPTION}}` - Value received by each user type

**External Systems**:
- `{{EXTERNAL_SYSTEM_1-2}}` - Categories of external systems
- `{{EXTERNAL_SYSTEM_PURPOSE_1-2}}` - Purpose of each external system category
- `{{EXTERNAL_SYSTEM_EXAMPLES_1-2}}` - Specific examples of external systems
- `{{EXTERNAL_INTERACTION_X_Y}}` - How external systems interact with your system
- `{{DATA_EXCHANGE_DESCRIPTION_1-2}}` - Data exchanged with external systems

**Workflows and Integration**:
- `{{WORKFLOW_1-2}}` - Key user workflows
- `{{WORKFLOW_STEP_X_Y}}` - Steps in each workflow
- `{{INTEGRATION_PATTERN_1-2}}` - System integration patterns
- `{{INTEGRATION_DESCRIPTION_1-2}}` - Description of integration patterns

**Data Management**:
- `{{INBOUND_DATA_TYPE_1-3}}` - Types of data coming into the system
- `{{OUTBOUND_DATA_TYPE_1-3}}` - Types of data going out of the system
- `{{PERSISTENT_DATA_TYPE_1-3}}` - Types of data stored by the system
- `{{*_DATA_DESCRIPTION_*}}` - Descriptions of each data type

**Diagram Information**:
- `{{SYSTEM_CONTEXT_DIAGRAM_ASCII_OR_REFERENCE}}` - ASCII diagram or reference to external diagram
- `{{DIAGRAM_TOOL}}` - Tool used to create diagrams (Draw.io, Miro, etc.)

**Benefits and Metrics**:
- `{{USER_BENEFIT_1-3}}` - Benefits delivered to users
- `{{ORG_BENEFIT_1-3}}` - Benefits delivered to organizations
- `{{EXTERNAL_BENEFIT_1-2}}` - Benefits to external systems
- `{{METRIC_1-3}}` - Key success metrics
- `{{METRIC_TARGET_1-3}}` - Target values for success metrics

**Standard Template Variables**:
- `{{VERSION}}` - Document version (e.g., "1.0.0")
- `{{CREATED_DATE}}` - Creation date (e.g., "2025-09-15")