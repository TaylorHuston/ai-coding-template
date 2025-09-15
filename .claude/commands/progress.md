---
description: Project progress validation and tracking with evidence verification
argument-hint: --mode validate|update|both [issue key or progress details]
allowed-tools: Read, Write, Edit, Grep, Glob, TodoWrite, Task
model: sonnet
---

Validate and update project progress with mandatory evidence verification.

**Modes:**
- `--mode validate`: Evidence-based progress validation only
- `--mode update`: Validation + status updates (default)
- `--mode both`: Same as update (validation always included)

**Critical Use Cases:**
- Before updating STATUS.md with new progress percentages
- Before posting progress updates to project tracking systems
- Before adding completion claims to CHANGELOG.md
- Before marking milestones as "completed"
- When progress claims seem inconsistent or suspicious

## Process Overview

### Phase 1: Evidence Collection & Validation (Always Required)
1. **Scan Implementation Files**: Count actual completed vs. required items
2. **Parse Requirements**: Extract all requirements from active PLAN.md files
3. **Cross-Reference Status**: Check consistency across STATUS.md, PLAN.md, CHANGELOG.md
4. **Generate Evidence Report**: Provide concrete file references for all claims
5. **Flag Discrepancies**: Identify gaps between claimed and actual progress
6. **Validation Decision**: PASS/WARNING/FAIL based on evidence

### Phase 2: Status Updates (Only if --mode update and validation passes)
7. **Update Local Files**: STATUS.md, PLAN.md, CHANGELOG.md with validated progress
8. **Generate External Summary**: Project tracking system update with evidence
9. **User Approval**: Show updates before posting to external systems
10. **Audit Trail**: Document the update for future reference

## Command Parameters

### From $ARGUMENTS:
- `--mode`: Operation mode (validate, update, both) - default: update
- `--scope`: Validation scope (issue, milestone, project, all)
- `--output`: Output format (summary, detailed, evidence-only)
- `--strict`: Validation level (warning, error, blocking)
- `--issue`: Specific issue to validate (e.g., PROJ-123)
- `--milestone`: Milestone to validate
- `--files`: Specific files to check for implementation

## Validation Workflow

### Implementation Discovery
```yaml
Evidence_Collection:
  - Scan project directories for implementation files
  - Count created files, components, tests, documentation
  - Identify functional vs. placeholder implementations
  - Document evidence trail with file references
```

### Requirement Analysis
```yaml
Requirement_Parsing:
  - Read active PLAN.md files for all requirements
  - Parse acceptance criteria and completion markers
  - Map requirements to discovered implementations
  - Calculate accurate completion ratios
```

### Status Cross-Check
```yaml
Status_Consistency:
  - Compare progress indicators across STATUS.md, PLAN.md
  - Check CHANGELOG.md entries for accuracy
  - Identify discrepancies between documents
  - Flag inconsistent progress reporting
```

## Update Workflow (After Validation Passes)

### Local Status Updates
```yaml
File_Updates:
  - Update PLAN.md with verified progress markers
  - Update STATUS.md with evidence-based metrics
  - Update CHANGELOG.md following public-facing standards
  - Ensure cross-document consistency
```

### External Communication
```yaml
Project_Tracking:
  - Generate validated progress summary
  - Include evidence references for credibility
  - Show update to user for approval
  - Post to external systems only after confirmation
```

## Agent Delegation

**Primary Agent**: context-analyzer (for validation and analysis)
**Supporting Agents**:
- code-reviewer: For implementation quality verification
- docs-sync-agent: For documentation consistency checks
- project-manager: For coordination and reporting

## Output Format

### Validation Report
```markdown
## Progress Validation Report - [TIMESTAMP]

**Validation Scope**: [issue/milestone/project]
**Status**: [PASS/WARNING/FAIL]
**Mode**: [validate|update]

### Progress Analysis
- **Claimed Progress**: [percentage or description]
- **Actual Progress**: [X of Y items completed]
- **Verification Status**: [VERIFIED/DISCREPANCY/INCOMPLETE]

### Implementation Evidence
[List of verified implementation files with status]

### Missing/Incomplete Items
[List of requirements not yet implemented]

### Recommendations
[Specific actions needed for accurate progress]

**Validation Confidence**: [High/Medium/Low]
```

### Update Summary (--mode update)
```markdown
## Progress Update Summary

**Files Updated**:
- STATUS.md: [changes made]
- PLAN.md: [progress markers updated]
- CHANGELOG.md: [entries added]

**External Update**:
[Project tracking system update ready for approval]

**Evidence Trail**:
[Complete audit trail of validation and updates]
```

## Safety Mechanisms

### Blocking Conditions (--strict error)
- Progress claims >90% without comprehensive evidence
- Discrepancies >20% between claimed and actual progress
- Missing evidence for milestone completion claims
- Inconsistent status across multiple documents

### Warning Conditions (--strict warning)
- Progress claims without specific file references
- Percentage increases without proportional implementation
- Generic completion statements
- Infrastructure completed but requirements not met

### Mandatory Safety Features
- **Progress Verification**: No claims without concrete evidence
- **Consistency Checking**: All status documents must align
- **User Approval**: Show updates before posting to external systems
- **Evidence Documentation**: All claims backed by file references
- **Audit Trail**: Complete history of progress validation and updates

## Best Practices

### Validation Methodology
1. **Evidence First**: Require concrete file references for all claims
2. **Conservative Estimation**: Round down when uncertain
3. **Explicit Counting**: Use "X of Y" format instead of percentages
4. **Requirement Mapping**: Trace each requirement to implementation
5. **Cross-Reference**: Verify consistency across all status documents

### Common Error Prevention
- **Infrastructure ≠ Requirements**: Having setup doesn't mean all requirements met
- **Tests ≠ Features**: Comprehensive test framework doesn't equal completed features
- **Local ≠ Complete**: Local development success doesn't mean full system completion
- **Partial ≠ Total**: One component working doesn't mean entire requirement satisfied

## Examples

### Validation Only
```bash
/progress --mode validate --scope PROJ-123
# Validates PROJ-123 requirements against implementation

/progress --mode validate --output detailed --strict error
# Detailed validation that blocks on significant discrepancies
```

### Validation + Updates
```bash
/progress --mode update --scope milestone
# Validate current milestone and update status files

/progress PROJ-123
# Default mode: validate and update for specific issue

/progress --scope project --output summary
# Validate entire project progress and update all status documents
```

This unified command provides comprehensive progress management with mandatory evidence verification to ensure accurate, credible project reporting.