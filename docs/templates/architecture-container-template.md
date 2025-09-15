---
version: "{{VERSION}}"
created: "{{CREATED_DATE}}"
last_updated: "{{CREATED_DATE}}"
status: "draft"
target_audience: ["architects", "senior-developers", "ai-assistants"]
document_type: "architecture"
category: "architecture"
c4_level: "container"
diagram_type: "container"
related_diagrams: ["system-context.md", "components/{{COMPONENT_1}}.md", "components/{{COMPONENT_2}}.md"]
external_tools: ["{{DIAGRAM_TOOL}}"]
tags: ["c4", "containers", "architecture", "technology-choices"]
---

# Container Architecture: {{SYSTEM_NAME}}

**Purpose**: Shows the high-level technology choices and container responsibilities within the {{SYSTEM_NAME}} system.

## Container Overview

The {{SYSTEM_NAME}} system is decomposed into {{CONTAINER_COUNT}} major containers, each with distinct responsibilities and technology choices. This architecture enables {{ARCHITECTURE_BENEFITS}}.

## Container Architecture Principles

### Design Philosophy
- **{{PRINCIPLE_1}}**: {{PRINCIPLE_DESCRIPTION_1}}
- **{{PRINCIPLE_2}}**: {{PRINCIPLE_DESCRIPTION_2}}
- **{{PRINCIPLE_3}}**: {{PRINCIPLE_DESCRIPTION_3}}

### Communication Patterns
- **{{COMMUNICATION_PATTERN_1}}**: {{COMMUNICATION_DESCRIPTION_1}}
- **{{COMMUNICATION_PATTERN_2}}**: {{COMMUNICATION_DESCRIPTION_2}}
- **{{COMMUNICATION_PATTERN_3}}**: {{COMMUNICATION_DESCRIPTION_3}}

## Core Containers

### 1. {{CONTAINER_1_NAME}}

#### Technology Stack
- **Primary**: {{CONTAINER_1_PRIMARY_TECH}}
- **Secondary**: {{CONTAINER_1_SECONDARY_TECH}}
- **Storage**: {{CONTAINER_1_STORAGE_TECH}}
- **Integration**: {{CONTAINER_1_INTEGRATION_TECH}}

#### Responsibilities
- **{{CONTAINER_1_RESPONSIBILITY_1}}**: {{CONTAINER_1_RESP_DESC_1}}
- **{{CONTAINER_1_RESPONSIBILITY_2}}**: {{CONTAINER_1_RESP_DESC_2}}
- **{{CONTAINER_1_RESPONSIBILITY_3}}**: {{CONTAINER_1_RESP_DESC_3}}
- **{{CONTAINER_1_RESPONSIBILITY_4}}**: {{CONTAINER_1_RESP_DESC_4}}

#### Key Interfaces
- **{{CONTAINER_1_INTERFACE_1}}**: {{CONTAINER_1_INTERFACE_DESC_1}}
- **{{CONTAINER_1_INTERFACE_2}}**: {{CONTAINER_1_INTERFACE_DESC_2}}
- **{{CONTAINER_1_INTERFACE_3}}**: {{CONTAINER_1_INTERFACE_DESC_3}}

#### Data Storage
- **{{CONTAINER_1_DATA_TYPE_1}}**: {{CONTAINER_1_DATA_DESC_1}}
- **{{CONTAINER_1_DATA_TYPE_2}}**: {{CONTAINER_1_DATA_DESC_2}}
- **{{CONTAINER_1_DATA_TYPE_3}}**: {{CONTAINER_1_DATA_DESC_3}}

#### Technology Rationale
{{CONTAINER_1_TECH_RATIONALE}}

### 2. {{CONTAINER_2_NAME}}

#### Technology Stack
- **Primary**: {{CONTAINER_2_PRIMARY_TECH}}
- **Secondary**: {{CONTAINER_2_SECONDARY_TECH}}
- **Storage**: {{CONTAINER_2_STORAGE_TECH}}
- **Integration**: {{CONTAINER_2_INTEGRATION_TECH}}

#### Responsibilities
- **{{CONTAINER_2_RESPONSIBILITY_1}}**: {{CONTAINER_2_RESP_DESC_1}}
- **{{CONTAINER_2_RESPONSIBILITY_2}}**: {{CONTAINER_2_RESP_DESC_2}}
- **{{CONTAINER_2_RESPONSIBILITY_3}}**: {{CONTAINER_2_RESP_DESC_3}}
- **{{CONTAINER_2_RESPONSIBILITY_4}}**: {{CONTAINER_2_RESP_DESC_4}}

#### Key Interfaces
- **{{CONTAINER_2_INTERFACE_1}}**: {{CONTAINER_2_INTERFACE_DESC_1}}
- **{{CONTAINER_2_INTERFACE_2}}**: {{CONTAINER_2_INTERFACE_DESC_2}}
- **{{CONTAINER_2_INTERFACE_3}}**: {{CONTAINER_2_INTERFACE_DESC_3}}

#### Data Storage
- **{{CONTAINER_2_DATA_TYPE_1}}**: {{CONTAINER_2_DATA_DESC_1}}
- **{{CONTAINER_2_DATA_TYPE_2}}**: {{CONTAINER_2_DATA_DESC_2}}
- **{{CONTAINER_2_DATA_TYPE_3}}**: {{CONTAINER_2_DATA_DESC_3}}

#### Technology Rationale
{{CONTAINER_2_TECH_RATIONALE}}

### 3. {{CONTAINER_3_NAME}}

#### Technology Stack
- **Primary**: {{CONTAINER_3_PRIMARY_TECH}}
- **Secondary**: {{CONTAINER_3_SECONDARY_TECH}}
- **Storage**: {{CONTAINER_3_STORAGE_TECH}}
- **Integration**: {{CONTAINER_3_INTEGRATION_TECH}}

#### Responsibilities
- **{{CONTAINER_3_RESPONSIBILITY_1}}**: {{CONTAINER_3_RESP_DESC_1}}
- **{{CONTAINER_3_RESPONSIBILITY_2}}**: {{CONTAINER_3_RESP_DESC_2}}
- **{{CONTAINER_3_RESPONSIBILITY_3}}**: {{CONTAINER_3_RESP_DESC_3}}
- **{{CONTAINER_3_RESPONSIBILITY_4}}**: {{CONTAINER_3_RESP_DESC_4}}

#### Key Interfaces
- **{{CONTAINER_3_INTERFACE_1}}**: {{CONTAINER_3_INTERFACE_DESC_1}}
- **{{CONTAINER_3_INTERFACE_2}}**: {{CONTAINER_3_INTERFACE_DESC_2}}
- **{{CONTAINER_3_INTERFACE_3}}**: {{CONTAINER_3_INTERFACE_DESC_3}}

#### Data Storage
- **{{CONTAINER_3_DATA_TYPE_1}}**: {{CONTAINER_3_DATA_DESC_1}}
- **{{CONTAINER_3_DATA_TYPE_2}}**: {{CONTAINER_3_DATA_DESC_2}}
- **{{CONTAINER_3_DATA_TYPE_3}}**: {{CONTAINER_3_DATA_DESC_3}}

#### Technology Rationale
{{CONTAINER_3_TECH_RATIONALE}}

## Inter-Container Communication

### Primary Communication Patterns

#### {{COMMUNICATION_TYPE_1}}
```
{{CONTAINER_A}} ←→ {{CONTAINER_B}}
- {{COMMUNICATION_DETAIL_1}}
- {{COMMUNICATION_DETAIL_2}}
- {{COMMUNICATION_DETAIL_3}}
```

#### {{COMMUNICATION_TYPE_2}}
```
{{CONTAINER_C}} → {{CONTAINER_D}} → {{CONTAINER_E}}
- {{COMMUNICATION_DETAIL_4}}
- {{COMMUNICATION_DETAIL_5}}
- {{COMMUNICATION_DETAIL_6}}
```

### Data Flow Patterns

#### {{DATA_FLOW_1}}
1. **{{DATA_FLOW_STEP_1}}** → {{CONTAINER_1_NAME}} → {{CONTAINER_2_NAME}}
2. **{{DATA_FLOW_STEP_2}}** → {{CONTAINER_2_NAME}} → {{CONTAINER_3_NAME}}
3. **{{DATA_FLOW_STEP_3}}** → {{CONTAINER_3_NAME}} → {{OUTPUT_SYSTEM}}

#### {{DATA_FLOW_2}}
1. **{{DATA_FLOW_2_STEP_1}}** → {{CONTAINER_X}} → {{CONTAINER_Y}}
2. **{{DATA_FLOW_2_STEP_2}}** → {{CONTAINER_Y}} → {{CONTAINER_Z}}
3. **{{DATA_FLOW_2_STEP_3}}** → {{CONTAINER_Z}} → {{OUTPUT_SYSTEM_2}}

## Container Deployment Patterns

### {{DEPLOYMENT_ENVIRONMENT_1}}
```
{{DEPLOYMENT_DESCRIPTION_1}}
```

### {{DEPLOYMENT_ENVIRONMENT_2}}
```
{{DEPLOYMENT_DESCRIPTION_2}}
```

### {{DEPLOYMENT_ENVIRONMENT_3}}
```
{{DEPLOYMENT_DESCRIPTION_3}}
```

## Container Architecture Diagram

```
{{CONTAINER_ARCHITECTURE_DIAGRAM_ASCII_OR_REFERENCE}}
```

*Note: Replace this ASCII diagram with an embedded image from your preferred diagramming tool*

## Technology Decision Rationale

### {{TECH_DECISION_1}}
**Decision**: {{TECH_DECISION_DESCRIPTION_1}}
**Rationale**: {{TECH_RATIONALE_1}}

### {{TECH_DECISION_2}}
**Decision**: {{TECH_DECISION_DESCRIPTION_2}}
**Rationale**: {{TECH_RATIONALE_2}}

### {{TECH_DECISION_3}}
**Decision**: {{TECH_DECISION_DESCRIPTION_3}}
**Rationale**: {{TECH_RATIONALE_3}}

## Success Metrics

### Container Performance
- **{{CONTAINER_1_NAME}}**: {{CONTAINER_1_PERFORMANCE_METRICS}}
- **{{CONTAINER_2_NAME}}**: {{CONTAINER_2_PERFORMANCE_METRICS}}
- **{{CONTAINER_3_NAME}}**: {{CONTAINER_3_PERFORMANCE_METRICS}}

### Integration Effectiveness
- **{{INTEGRATION_METRIC_1}}**: {{INTEGRATION_TARGET_1}}
- **{{INTEGRATION_METRIC_2}}**: {{INTEGRATION_TARGET_2}}
- **{{INTEGRATION_METRIC_3}}**: {{INTEGRATION_TARGET_3}}

---

*This container architecture provides the foundation for {{ARCHITECTURE_VALUE_PROPOSITION}} through {{ARCHITECTURE_APPROACH}}.*

## Template Variables

Replace the following placeholders when using this template:

**System Information**:
- `{{SYSTEM_NAME}}` - Name of your system
- `{{CONTAINER_COUNT}}` - Number of major containers (e.g., "six")
- `{{ARCHITECTURE_BENEFITS}}` - Key benefits of this architecture
- `{{ARCHITECTURE_VALUE_PROPOSITION}}` - Main value delivered by architecture
- `{{ARCHITECTURE_APPROACH}}` - How the architecture delivers value

**Architecture Principles**:
- `{{PRINCIPLE_1-3}}` - Core design principles
- `{{PRINCIPLE_DESCRIPTION_1-3}}` - Descriptions of each principle

**Communication Patterns**:
- `{{COMMUNICATION_PATTERN_1-3}}` - Types of communication between containers
- `{{COMMUNICATION_DESCRIPTION_1-3}}` - How each communication pattern works

**Container Details** (repeat for each container):
- `{{CONTAINER_X_NAME}}` - Name of the container
- `{{CONTAINER_X_PRIMARY_TECH}}` - Primary technology choice
- `{{CONTAINER_X_SECONDARY_TECH}}` - Secondary/supporting technologies
- `{{CONTAINER_X_STORAGE_TECH}}` - Data storage technology
- `{{CONTAINER_X_INTEGRATION_TECH}}` - Integration/communication technology
- `{{CONTAINER_X_RESPONSIBILITY_1-4}}` - Key responsibilities
- `{{CONTAINER_X_RESP_DESC_1-4}}` - Detailed descriptions of responsibilities
- `{{CONTAINER_X_INTERFACE_1-3}}` - Key interfaces provided
- `{{CONTAINER_X_INTERFACE_DESC_1-3}}` - Interface descriptions
- `{{CONTAINER_X_DATA_TYPE_1-3}}` - Types of data stored
- `{{CONTAINER_X_DATA_DESC_1-3}}` - Data descriptions
- `{{CONTAINER_X_TECH_RATIONALE}}` - Why these technologies were chosen
- `{{CONTAINER_X_PERFORMANCE_METRICS}}` - Performance metrics for container

**Inter-Container Communication**:
- `{{COMMUNICATION_TYPE_1-2}}` - Types of communication patterns
- `{{CONTAINER_A-E}}` - Container names in communication examples
- `{{COMMUNICATION_DETAIL_1-6}}` - Details about communication flows

**Data Flows**:
- `{{DATA_FLOW_1-2}}` - Names of data flow patterns
- `{{DATA_FLOW_STEP_1-3}}` - Steps in data flow
- `{{DATA_FLOW_2_STEP_1-3}}` - Steps in second data flow
- `{{OUTPUT_SYSTEM}}` - External systems receiving output

**Deployment**:
- `{{DEPLOYMENT_ENVIRONMENT_1-3}}` - Deployment environment names
- `{{DEPLOYMENT_DESCRIPTION_1-3}}` - How containers are deployed in each environment

**Technology Decisions**:
- `{{TECH_DECISION_1-3}}` - Major technology decisions
- `{{TECH_DECISION_DESCRIPTION_1-3}}` - What was decided
- `{{TECH_RATIONALE_1-3}}` - Why the decision was made

**Performance Metrics**:
- `{{INTEGRATION_METRIC_1-3}}` - Integration effectiveness metrics
- `{{INTEGRATION_TARGET_1-3}}` - Target values for metrics

**Diagram Information**:
- `{{CONTAINER_ARCHITECTURE_DIAGRAM_ASCII_OR_REFERENCE}}` - Diagram or reference
- `{{DIAGRAM_TOOL}}` - Tool used for diagrams

**Related Components**:
- `{{COMPONENT_1-2}}` - Names of related component documents

**Standard Template Variables**:
- `{{VERSION}}` - Document version
- `{{CREATED_DATE}}` - Creation date