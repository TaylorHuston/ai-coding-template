# Documentation Quality Enforcement Rules

**Created**: 2025-08-21
**Last Updated**: 2025-08-21
**Status**: Active
**Target Audience**: AI Assistants, Development Team

Intelligent documentation quality system with automated enforcement and AI-powered updates.

## Rule Integration Overview

This file implements an intelligent documentation management system that:
- Detects when EXISTING documentation needs updating
- Auto-invokes the docs-maintainer agent for fixes to EXISTING files
- Enforces quality standards with graduated responses
- Learns from patterns to improve suggestions
- Provides quick fixes for common issues

**IMPORTANT LIMITATION**: This system ONLY updates existing documentation files. It NEVER creates new documentation files unless explicitly requested by the user.

## Core Enforcement Rules

### 1. Auto-Invoke Documentation Agent

```yaml
rule_id: "auto_sync_trigger"
condition: "significant_code_change"
logic: |
  # Auto-invoke docs-maintainer to UPDATE existing documentation
  if code_changes.includes(['api/', 'components/', 'features/', 'src/', 'lib/']):
    existing_docs = find_existing_docs_for_changes()
    if existing_docs.count > 0:
      if auto_mode.enabled && confidence > 0.8:
        invoke_agent = "docs-maintainer"
        message = "Auto-invoking docs-maintainer to update existing docs"
      else:
        suggest_command = "Use docs-maintainer to update documentation"
        message = "Changes detected affecting existing docs. Consider updating."
    else:
      message = "No existing docs to update. Create docs only if explicitly requested."
      
  # Smart detection of change types
  change_analysis = {
    "breaking": patterns.includes(['BREAKING', 'deprecated', 'removed']),
    "new_feature": patterns.includes(['feat:', 'feature/', 'new']),
    "api_contract": patterns.includes(['schema', 'interface', 'type']),
    "security": patterns.includes(['auth', 'permission', 'secret'])
  }
  
  if change_analysis.breaking && existing_migration_docs:
    require_action = "Update existing migration guide"
    priority = "critical"
    auto_invoke = true
  elif change_analysis.security && existing_security_docs:
    require_action = "Update existing security documentation"
    priority = "high"
  else:
    require_action = "Ask user if new documentation should be created"
    priority = "low"
```

### 2. Documentation Creation Policy

```yaml
rule_id: "creation_policy"
condition: "new_documentation_needed"
logic: |
  # NEVER create documentation proactively
  # ONLY update existing documentation automatically
  # ASK user before creating new documentation files
  
  creation_rules = {
    "automatic": "NEVER - violates global 'Code > documentation' principle",
    "suggested": "Only when existing docs reference missing files",
    "user_requested": "Always allowed when explicitly requested",
    "critical_missing": "Ask user first, explain need"
  }
  
  if new_file_needed:
    action = "ask_user_permission"
    message = "Code changes suggest new documentation might be helpful. Create [filename]?"
    options = ["Yes, create it", "No, skip documentation", "Update existing docs instead"]
```

### 3. Graduated Quality Enforcement

```yaml
rule_id: "graduated_enforcement"
condition: "pre_commit"
logic: |
  # More nuanced quality gates with graduated responses
  if health_score >= 90:
    status = "green"
    action = "allow_commit"
    message = "Documentation quality excellent (${health_score}%)"
  elif health_score >= 80:
    status = "yellow"
    action = "warn_but_allow"
    message = "Documentation quality declining (${health_score}%). Consider updates."
    suggest = "Run docs-maintainer to improve quality"
  elif health_score >= 70:
    status = "orange"
    action = "suggest_fixes"
    message = "Documentation quality needs attention (${health_score}%)"
    auto_suggest = "docs-maintainer agent for immediate fixes"
  else:
    status = "red"
    action = "require_action"
    message = "Documentation quality critical (${health_score}%). Action required."
    required_action = "Update documentation before proceeding"
```

### 4. Context-Aware Documentation Updates

```yaml
rule_id: "smart_update_detection"
condition: "code_modification"
logic: |
  # Intelligent detection of what documentation needs updating
  file_change_patterns = {
    "api_changes": {
      patterns: ["routes/", "controllers/", "api/", "endpoints/"],
      docs_to_update: ["api.md", "endpoints.md", "integration.md"],
      priority: "high"
    },
    "schema_changes": {
      patterns: ["models/", "schemas/", "types/", "interfaces/"],
      docs_to_update: ["data-models.md", "api.md", "database.md"],
      priority: "high"
    },
    "config_changes": {
      patterns: ["config/", ".env", "settings/", "docker"],
      docs_to_update: ["setup.md", "deployment.md", "configuration.md"],
      priority: "medium"
    },
    "feature_changes": {
      patterns: ["components/", "features/", "pages/"],
      docs_to_update: ["user-guide.md", "features.md", "components.md"],
      priority: "medium"
    }
  }
  
  for pattern_group in file_change_patterns:
    if any_files_match(pattern_group.patterns):
      schedule_update(pattern_group.docs_to_update, pattern_group.priority)
```

## Quality Standards

### Documentation Health Metrics

```yaml
health_calculation:
  factors:
    freshness: "30% - How recently docs were updated relative to code"
    completeness: "25% - Coverage of features and APIs"
    accuracy: "25% - Alignment with current implementation"
    accessibility: "10% - Readability and structure quality"
    link_integrity: "10% - Working links and references"
    
  scoring:
    freshness:
      excellent: "Updated within 1 week of code changes"
      good: "Updated within 2 weeks of code changes"
      fair: "Updated within 1 month of code changes"
      poor: "Not updated in > 1 month after code changes"
      
    completeness:
      excellent: "All major features documented"
      good: "80%+ features documented"
      fair: "60%+ features documented"
      poor: "< 60% features documented"
      
    accuracy:
      excellent: "All examples work, all info current"
      good: "90%+ examples work, mostly current"
      fair: "70%+ examples work, somewhat current"
      poor: "< 70% examples work or outdated"
```

### Quality Gates Integration

```yaml
quality_gates:
  pre_commit_checks:
    - run: "docs-health.js"
      threshold: 80
      action: "warn_if_below"
      
    - run: "link_check"
      threshold: 95
      action: "block_if_below"
      
    - run: "example_validation"
      threshold: 90
      action: "warn_if_below"
      
  pre_merge_checks:
    - run: "comprehensive_docs_health"
      threshold: 85
      action: "block_if_below"
      
    - run: "documentation_coverage"
      threshold: 80
      action: "warn_if_below"
```

## Automated Improvement Suggestions

### Smart Suggestions System

```yaml
suggestion_engine:
  pattern_detection:
    outdated_examples:
      trigger: "Code examples older than 30 days"
      suggestion: "Update code examples to match current API"
      auto_fix: "Extract examples from test files"
      
    broken_links:
      trigger: "HTTP 404 or file not found"
      suggestion: "Update or remove broken links"
      auto_fix: "Update URLs to current locations"
      
    missing_sections:
      trigger: "New features without documentation"
      suggestion: "Add documentation for new features"
      auto_fix: "Generate basic documentation structure"
      
    inconsistent_formatting:
      trigger: "Different formatting patterns detected"
      suggestion: "Standardize formatting across documents"
      auto_fix: "Apply consistent formatting rules"
```

### Learning and Adaptation

```yaml
learning_system:
  pattern_learning:
    track_successful_updates:
      - What types of changes trigger documentation needs
      - Which updates are most effective
      - What patterns lead to quality improvements
      
    adaptation_mechanisms:
      - Adjust trigger sensitivity based on false positives
      - Improve suggestion accuracy based on acceptance rates
      - Refine quality thresholds based on project maturity
      
  feedback_integration:
    user_feedback:
      - Track which suggestions are accepted/rejected
      - Learn from manual documentation choices
      - Adapt to team preferences and workflows
      
    outcome_tracking:
      - Monitor documentation health trends
      - Measure impact of automated updates
      - Identify areas for improvement
```

## Integration with Development Workflow

### Git Hook Integration

```yaml
git_hooks:
  pre_commit:
    - Check documentation health score
    - Validate updated examples
    - Ensure metadata currency
    - Suggest immediate fixes
    
  post_commit:
    - Trigger docs-maintainer for affected docs
    - Update modification timestamps
    - Log documentation change requirements
    
  pre_push:
    - Comprehensive documentation validation
    - Link integrity verification
    - Quality gate enforcement
```

### CI/CD Pipeline Integration

```yaml
ci_pipeline:
  documentation_checks:
    parallel_jobs:
      - Documentation health assessment
      - Link validation across all docs
      - Example code execution validation
      - Accessibility compliance checking
      
    reporting:
      - Generate documentation quality report
      - Track quality trends over time
      - Alert on significant quality degradation
      - Provide actionable improvement suggestions
```

## Monitoring and Alerting

### Quality Monitoring

```yaml
monitoring_system:
  health_tracking:
    metrics:
      - Overall documentation health score
      - Individual document health scores
      - Update frequency and lag time
      - User engagement and feedback
      
    alerting:
      - Critical health degradation (< 70%)
      - Outdated documentation detection (> 30 days)
      - Broken link accumulation (> 5%)
      - Example validation failures
      
  trend_analysis:
    patterns:
      - Quality improvement/degradation trends
      - Documentation coverage evolution
      - Update response time optimization
      - User satisfaction correlation
```

### Performance Optimization

```yaml
performance_tuning:
  efficiency_improvements:
    caching:
      - Cache health check results
      - Reuse validation outcomes
      - Optimize repeated operations
      
    parallel_processing:
      - Concurrent documentation updates
      - Parallel validation checks
      - Batch processing optimizations
      
    smart_scheduling:
      - Priority-based update scheduling
      - Resource usage optimization
      - Background processing utilization
```

## Best Practices for Implementation

### Rule Customization
- Adapt thresholds to project maturity and team size
- Customize trigger patterns for project-specific file structures
- Adjust quality standards based on documentation importance
- Configure enforcement levels appropriate for team workflow

### Team Integration
- Train team on documentation quality standards
- Establish clear escalation procedures for quality issues
- Provide tooling and automation to support compliance
- Regular review and adjustment of rules and thresholds

### Continuous Improvement
- Monitor rule effectiveness and adjust as needed
- Gather feedback from team on rule impact and usefulness
- Evolve rules based on project growth and changing needs
- Stay current with documentation best practices and tooling

---

*This rule system balances automated quality enforcement with respect for global "Code > documentation" principles while ensuring existing documentation remains accurate and helpful.*