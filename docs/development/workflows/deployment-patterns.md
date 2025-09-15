---
title: "Deployment Patterns Guide"
version: "0.1.0"
created: "2025-09-10"
last_updated: "2025-09-10"
status: "Active"
target_audience: ["devops-engineers", "developers", "system-administrators"]
tags: ["deployment-patterns", "devops", "blue-green-deployment", "infrastructure"]
category: "Implementation Guides"
description: "Platform-agnostic deployment patterns and strategies for modern application deployment across different environments and technologies."
---

# Deployment Patterns Guide

Platform-agnostic deployment patterns and strategies for modern application deployment across different environments and technologies.

## Overview

This guide provides deployment patterns that work across different platforms, focusing on principles and strategies rather than specific tools or technologies.

## Deployment Strategy Patterns

### Blue-Green Deployment

**Pattern Overview**:
- Maintain two identical production environments (Blue and Green)
- Deploy new version to inactive environment
- Switch traffic after validation
- Instant rollback capability

**Implementation Steps**:
```yaml
# Conceptual deployment flow
blue_green_deployment:
  current_environment: blue
  target_environment: green
  
  steps:
    1. Deploy new version to green environment
    2. Run smoke tests on green environment
    3. Switch load balancer from blue to green
    4. Monitor green environment
    5. Keep blue environment for rollback
```

**Benefits**:
- Zero-downtime deployments
- Instant rollback capability
- Full environment testing before switch
- Reduced deployment risk

**Considerations**:
- Requires double infrastructure resources
- Database migrations need careful planning
- Stateful applications require additional coordination

### Rolling Deployment

**Pattern Overview**:
- Gradually replace instances with new version
- Maintain service availability during deployment
- Update small batches of instances at a time

**Implementation Strategy**:
```python
# Rolling deployment algorithm
def rolling_deployment(instances, new_version, batch_size=2):
    total_instances = len(instances)
    
    for i in range(0, total_instances, batch_size):
        batch = instances[i:i + batch_size]
        
        # Remove instances from load balancer
        remove_from_load_balancer(batch)
        
        # Deploy new version
        deploy_version(batch, new_version)
        
        # Health check
        if health_check(batch):
            add_to_load_balancer(batch)
        else:
            rollback_batch(batch)
            raise DeploymentError("Health check failed")
        
        # Wait before next batch
        time.sleep(30)
```

**Benefits**:
- Minimal infrastructure overhead
- Gradual risk exposure
- Service remains available
- Easy to monitor deployment progress

**Considerations**:
- Slower deployment process
- Mixed version environment during deployment
- Requires careful version compatibility

### Canary Deployment

**Pattern Overview**:
- Deploy new version to small subset of users
- Monitor metrics and user feedback
- Gradually increase traffic to new version
- Rollback if issues detected

**Traffic Routing Strategy**:
```javascript
// Canary traffic routing logic
class CanaryRouter {
  constructor(canaryPercentage = 5) {
    this.canaryPercentage = canaryPercentage;
  }
  
  routeRequest(request) {
    const userId = request.userId;
    const routeToCanary = this.shouldRouteToCanary(userId);
    
    return routeToCanary ? 'canary' : 'stable';
  }
  
  shouldRouteToCanary(userId) {
    // Consistent routing based on user ID
    const hash = this.hashUserId(userId);
    return (hash % 100) < this.canaryPercentage;
  }
  
  adjustCanaryPercentage(newPercentage) {
    this.canaryPercentage = newPercentage;
  }
}
```

**Benefits**:
- Real user feedback with minimal risk
- Data-driven deployment decisions
- Gradual rollout capability
- Easy rollback for subset of users

**Considerations**:
- Requires sophisticated traffic routing
- Monitoring and analytics complexity
- User experience consistency challenges

### Feature Flag Deployment

**Pattern Overview**:
- Deploy code with features disabled
- Enable features through configuration
- Control feature availability independently
- A/B testing and gradual rollout capability

**Feature Flag Implementation**:
```java
// Feature flag service example
public class FeatureToggleService {
    private Map<String, FeatureToggle> features;
    
    public boolean isFeatureEnabled(String featureName, User user) {
        FeatureToggle toggle = features.get(featureName);
        
        if (toggle == null) {
            return false;
        }
        
        return toggle.isEnabledForUser(user);
    }
    
    public void updateFeatureToggle(String featureName, FeatureToggle toggle) {
        features.put(featureName, toggle);
    }
}

// Usage in application code
if (featureToggleService.isFeatureEnabled("new-checkout-flow", currentUser)) {
    return newCheckoutProcess(request);
} else {
    return legacyCheckoutProcess(request);
}
```

**Benefits**:
- Decouple deployment from feature release
- Quick feature rollback without redeployment
- A/B testing capabilities
- Reduced deployment risk

**Considerations**:
- Code complexity increases
- Feature flag technical debt
- Configuration management overhead

## Infrastructure Patterns

### Immutable Infrastructure

**Pattern Overview**:
- Never modify running infrastructure
- Replace entire components for updates
- Version all infrastructure components
- Infrastructure as code approach

**Implementation Approach**:
```terraform
# Example infrastructure versioning
resource "aws_launch_template" "app_server" {
  name_prefix = "app-server-"
  
  image_id = var.ami_id  # Versioned AMI
  instance_type = var.instance_type
  
  vpc_security_group_ids = [aws_security_group.app_server.id]
  
  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    app_version = var.app_version
  }))
  
  lifecycle {
    create_before_destroy = true
  }
}
```

**Benefits**:
- Consistent environments
- Easier troubleshooting
- Better security posture
- Simplified rollback process

**Considerations**:
- Longer deployment times
- Infrastructure provisioning overhead
- State management complexity

### Container-Based Deployment

**Pattern Overview**:
- Package applications with dependencies
- Consistent runtime environment
- Orchestration for scaling and management
- Platform-independent deployment

**Container Deployment Strategy**:
```yaml
# Generic container deployment configuration
container_deployment:
  image: myapp:v1.2.3
  replicas: 3
  
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 500m
      memory: 512Mi
  
  health_checks:
    liveness_probe:
      path: /health
      port: 8080
      initial_delay: 30s
      period: 10s
    
    readiness_probe:
      path: /ready
      port: 8080
      initial_delay: 5s
      period: 5s
  
  environment:
    - name: ENV
      value: production
    - name: DATABASE_URL
      value_from:
        secret:
          name: database-credentials
          key: url
```

**Benefits**:
- Consistent deployment artifacts
- Simplified dependency management
- Platform portability
- Efficient resource utilization

**Considerations**:
- Container orchestration complexity
- Security considerations
- Storage and networking challenges
- Monitoring and logging requirements

## Database Deployment Patterns

### Database Migration Strategies

**Backward Compatible Migrations**:
```sql
-- Safe migration pattern: Add column with default
ALTER TABLE users 
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;

-- Update existing records if needed
UPDATE users 
SET email_verified = TRUE 
WHERE email IS NOT NULL;

-- Later migration: Make column non-nullable if needed
ALTER TABLE users 
ALTER COLUMN email_verified SET NOT NULL;
```

**Schema Versioning**:
```python
# Database migration framework pattern
class MigrationManager:
    def __init__(self, database_connection):
        self.db = database_connection
        self.migrations_path = 'migrations/'
    
    def get_current_version(self):
        result = self.db.execute("SELECT version FROM schema_version LIMIT 1")
        return result.fetchone()[0] if result else 0
    
    def get_available_migrations(self):
        import os
        migration_files = os.listdir(self.migrations_path)
        return sorted([f for f in migration_files if f.endswith('.sql')])
    
    def apply_migrations(self):
        current_version = self.get_current_version()
        migrations = self.get_available_migrations()
        
        for migration_file in migrations:
            migration_version = self.extract_version(migration_file)
            
            if migration_version > current_version:
                self.apply_migration(migration_file)
                self.update_schema_version(migration_version)
```

**Zero-Downtime Database Updates**:
```sql
-- Pattern 1: Add new column, migrate data, remove old column
-- Step 1: Add new column
ALTER TABLE products ADD COLUMN price_cents INTEGER;

-- Step 2: Migrate data
UPDATE products SET price_cents = ROUND(price * 100) WHERE price_cents IS NULL;

-- Step 3: Update application to use new column
-- (Deploy application update)

-- Step 4: Remove old column (separate deployment)
ALTER TABLE products DROP COLUMN price;
```

### Data Migration Patterns

**Large Data Migration Strategy**:
```python
def migrate_large_dataset(source_table, target_table, batch_size=1000):
    """
    Migrate large dataset in batches to minimize lock time
    """
    offset = 0
    
    while True:
        # Process batch
        batch_query = f"""
        INSERT INTO {target_table} (id, name, email, created_at)
        SELECT id, name, email, created_at 
        FROM {source_table}
        ORDER BY id
        LIMIT {batch_size} OFFSET {offset}
        """
        
        result = execute_query(batch_query)
        
        if result.rowcount == 0:
            break  # No more data to migrate
        
        offset += batch_size
        
        # Brief pause to allow other operations
        time.sleep(0.1)
        
        print(f"Migrated {offset} records")
```

## Monitoring and Observability

### Deployment Monitoring

**Health Check Implementation**:
```javascript
// Comprehensive health check endpoint
app.get('/health', async (req, res) => {
  const healthChecks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    version: process.env.APP_VERSION,
    checks: {}
  };
  
  try {
    // Database connectivity
    healthChecks.checks.database = await checkDatabase();
    
    // External service connectivity
    healthChecks.checks.external_api = await checkExternalAPI();
    
    // Disk space
    healthChecks.checks.disk_space = await checkDiskSpace();
    
    // Memory usage
    healthChecks.checks.memory = await checkMemoryUsage();
    
    // Determine overall status
    const allHealthy = Object.values(healthChecks.checks)
      .every(check => check.status === 'healthy');
    
    healthChecks.status = allHealthy ? 'healthy' : 'unhealthy';
    
    res.status(allHealthy ? 200 : 503).json(healthChecks);
    
  } catch (error) {
    healthChecks.status = 'unhealthy';
    healthChecks.error = error.message;
    res.status(503).json(healthChecks);
  }
});
```

**Deployment Metrics**:
```python
# Deployment metrics tracking
class DeploymentMetrics:
    def __init__(self, metrics_client):
        self.metrics = metrics_client
    
    def track_deployment_start(self, version, environment):
        self.metrics.increment('deployment.started', tags={
            'version': version,
            'environment': environment
        })
    
    def track_deployment_success(self, version, environment, duration):
        self.metrics.increment('deployment.completed', tags={
            'version': version,
            'environment': environment,
            'status': 'success'
        })
        
        self.metrics.timing('deployment.duration', duration, tags={
            'version': version,
            'environment': environment
        })
    
    def track_deployment_failure(self, version, environment, error):
        self.metrics.increment('deployment.completed', tags={
            'version': version,
            'environment': environment,
            'status': 'failure',
            'error_type': type(error).__name__
        })
```

### Rollback Strategies

**Automated Rollback Triggers**:
```yaml
# Rollback configuration
rollback_config:
  triggers:
    error_rate:
      threshold: 5%
      window: 5m
    response_time:
      p95_threshold: 2000ms
      window: 5m
    health_check_failures:
      threshold: 3
      window: 2m
  
  rollback_strategy: "immediate"  # or "gradual"
  notification_channels:
    - slack
    - email
    - pagerduty
```

**Rollback Implementation**:
```python
class AutomaticRollback:
    def __init__(self, metrics_client, deployment_service):
        self.metrics = metrics_client
        self.deployment = deployment_service
        self.rollback_config = load_rollback_config()
    
    def monitor_deployment(self, deployment_id):
        """Monitor deployment and trigger rollback if needed"""
        
        for trigger in self.rollback_config['triggers']:
            if self.check_trigger_condition(trigger):
                self.initiate_rollback(deployment_id, trigger)
                return
    
    def check_trigger_condition(self, trigger):
        if trigger['type'] == 'error_rate':
            current_rate = self.get_error_rate(trigger['window'])
            return current_rate > trigger['threshold']
        
        elif trigger['type'] == 'response_time':
            current_p95 = self.get_response_time_p95(trigger['window'])
            return current_p95 > trigger['threshold']
        
        # Add more trigger types as needed
        return False
    
    def initiate_rollback(self, deployment_id, trigger):
        """Initiate rollback process"""
        print(f"Triggering rollback due to: {trigger['type']}")
        
        # Execute rollback
        self.deployment.rollback(deployment_id)
        
        # Send notifications
        self.send_rollback_notification(deployment_id, trigger)
```

## Security in Deployment

### Secure Deployment Practices

**Secrets Management**:
```python
# Secure secrets handling in deployment
class SecureDeployment:
    def __init__(self, secrets_manager):
        self.secrets = secrets_manager
    
    def deploy_application(self, version, environment):
        # Retrieve secrets at deployment time
        database_url = self.secrets.get_secret(
            f"{environment}/database/url"
        )
        
        api_key = self.secrets.get_secret(
            f"{environment}/external_api/key"
        )
        
        # Create deployment configuration
        config = {
            'version': version,
            'environment_variables': {
                'DATABASE_URL': database_url,
                'EXTERNAL_API_KEY': api_key,
                'ENVIRONMENT': environment
            }
        }
        
        return self.execute_deployment(config)
```

**Access Control**:
```yaml
# Deployment access control policy
deployment_permissions:
  environments:
    development:
      deploy: [developers, qa_team]
      rollback: [developers, qa_team, devops_team]
    
    staging:
      deploy: [qa_team, devops_team]
      rollback: [qa_team, devops_team]
    
    production:
      deploy: [devops_team]
      rollback: [devops_team, on_call_engineer]
      
  approval_requirements:
    production:
      required_approvals: 2
      required_roles: [senior_developer, devops_lead]
      security_scan: required
      performance_test: required
```

### Compliance and Auditing

**Deployment Audit Trail**:
```python
class DeploymentAuditLogger:
    def __init__(self, audit_storage):
        self.storage = audit_storage
    
    def log_deployment_event(self, event_type, details):
        audit_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'event_type': event_type,
            'user': details.get('user'),
            'environment': details.get('environment'),
            'version': details.get('version'),
            'details': details,
            'ip_address': details.get('ip_address'),
            'user_agent': details.get('user_agent')
        }
        
        self.storage.store_audit_entry(audit_entry)
    
    def get_deployment_history(self, environment, days=30):
        return self.storage.query_audit_entries(
            environment=environment,
            start_date=datetime.utcnow() - timedelta(days=days)
        )
```

## Best Practices Summary

### Deployment Strategy Selection

**Factors to Consider**:
- Application architecture (stateful vs stateless)
- Downtime tolerance requirements
- Infrastructure complexity and cost
- Team expertise and tooling
- Compliance and security requirements
- Rollback speed requirements

**Decision Matrix**:
```yaml
deployment_strategy_selection:
  zero_downtime_required:
    high_traffic: blue_green_deployment
    medium_traffic: rolling_deployment
    low_traffic: canary_deployment
  
  downtime_acceptable:
    simple_applications: in_place_deployment
    complex_applications: blue_green_deployment
  
  testing_focus:
    user_validation: canary_deployment
    feature_testing: feature_flag_deployment
    performance_testing: blue_green_deployment
```

### Risk Mitigation

**Pre-Deployment Checklist**:
1. Comprehensive testing in staging environment
2. Database migration validation
3. Rollback plan preparation and testing
4. Monitoring and alerting configuration
5. Team communication and coordination
6. Security and compliance verification

**Post-Deployment Monitoring**:
1. Application performance metrics
2. Error rates and types
3. User experience indicators
4. Infrastructure resource utilization
5. Business metrics validation
6. Security monitoring alerts

### Continuous Improvement

**Deployment Optimization**:
- Measure deployment frequency and lead time
- Track deployment success rates and rollback frequency
- Analyze deployment bottlenecks and pain points
- Gather team feedback and iterate on processes
- Automate repetitive deployment tasks
- Invest in better tooling and infrastructure

**Learning and Adaptation**:
- Conduct post-incident reviews for failed deployments
- Document lessons learned and update procedures
- Share knowledge across teams and projects
- Stay current with industry best practices
- Experiment with new deployment techniques in safe environments

---

**Related Documentation**: [Setup Hub](../setup/README.md) | [Quality Standards](../quality-standards.md) | [Local Environment Setup](./local-environment-setup.md)