# Project Management Integration Guide

**Created**: 2025-08-21
**Last Updated**: 2025-08-21
**Status**: Active
**Target Audience**: Development Team, Project Managers, DevOps

Comprehensive guide for integrating project management tools (Jira and Linear) with the AI coding template via MCP servers.

## Overview

This guide covers integration with popular project management tools to enable seamless workflow between AI-assisted development and project tracking. **These integrations are optional** and should be enabled based on your team's specific needs.

## Supported Project Management Tools

### Jira Integration (Atlassian)

#### **What is Jira MCP Server?**

The Jira MCP server enables Claude Code to interact directly with your Jira instance, allowing seamless integration between development work and issue tracking.

#### **Key Capabilities**
- **Issue Management**: Create, read, update, and transition issues
- **Project Coordination**: Access project information and sprint data
- **Comment Management**: Add and retrieve issue comments
- **Search and Discovery**: Search issues and projects
- **Team Management**: User and team information access
- **Agile Support**: Sprint and board management

#### **Available Tools**
```yaml
jira_mcp_tools:
  issue_management:
    - mcp__jira__get_issue
    - mcp__jira__create_issue
    - mcp__jira__update_issue
    - mcp__jira__transition_issue
    - mcp__jira__create_subtask
    - mcp__jira__link_issues
    
  search_and_discovery:
    - mcp__jira__search_issues
    - mcp__jira__get_project
    - mcp__jira__list_projects
    - mcp__jira__search_users
    
  collaboration:
    - mcp__jira__create_comment
    - mcp__jira__get_comments
    - mcp__jira__assign_issue
    - mcp__jira__add_watcher
    
  metadata:
    - mcp__jira__get_issue_types
    - mcp__jira__get_priorities
    - mcp__jira__get_statuses
    - mcp__jira__get_transitions
    
  agile_support:
    - mcp__jira__get_board
    - mcp__jira__get_sprints
    - mcp__jira__get_sprint_issues
```

### Linear Integration

#### **What is Linear MCP Server?**

Linear is a modern issue tracking and project management tool. The Linear MCP server provides streamlined integration for teams using Linear's workflow-focused approach.

#### **Key Capabilities**
- **Modern Issue Tracking**: Streamlined issue management
- **Project Organization**: Project-based workflow support  
- **Team Coordination**: Team-based issue assignment and tracking
- **Status Management**: Custom workflow states and transitions
- **Efficient Search**: Fast issue discovery and filtering

#### **Available Tools**
```yaml
linear_mcp_tools:
  issue_management:
    - mcp__linear__get_issue
    - mcp__linear__create_issue
    - mcp__linear__update_issue
    - mcp__linear__list_issues
    - mcp__linear__list_my_issues
    - mcp__linear__search_issues
    
  project_management:
    - mcp__linear__list_projects
    - mcp__linear__create_project
    - mcp__linear__update_project
    - mcp__linear__list_teams
    - mcp__linear__get_team
    
  collaboration:
    - mcp__linear__create_comment
    - mcp__linear__list_comments
    - mcp__linear__add_comment
    - mcp__linear__get_user_issues
    
  workflow:
    - mcp__linear__get_issue_status
    - mcp__linear__list_issue_statuses
    - mcp__linear__list_issue_labels
    
  documentation:
    - mcp__linear__search_documentation
```

## Setup and Configuration

### Jira MCP Server Setup

#### **Option 1: Official Atlassian Remote MCP Server (Recommended)**

**Prerequisites**:
- Jira Cloud instance
- Atlassian account with appropriate permissions
- Claude Code or Claude Desktop

**Setup Steps**:
1. **Enable Atlassian Remote MCP Server**:
   ```bash
   # Via Claude Code integrations
   # Go to Claude Code → Settings → Integrations → Add Atlassian
   ```

2. **OAuth Authentication**:
   - Authenticate with your Atlassian account
   - Grant necessary permissions for Jira access
   - Verify connection in Claude Code

3. **Test Connection**:
   ```typescript
   // Test basic functionality
   mcp__jira__list_projects()
   ```

#### **Option 2: Local MCP Server Setup**

**Installation**:
```bash
# Install Jira MCP server
npm install -g @composio/jira-mcp-server

# Or use specific implementation
npm install -g jira-mcp
```

**Configuration**:
```json
{
  "mcpServers": {
    "jira": {
      "command": "jira-mcp-server",
      "env": {
        "JIRA_URL": "https://your-domain.atlassian.net",
        "JIRA_EMAIL": "your-email@domain.com", 
        "JIRA_API_TOKEN": "${JIRA_API_TOKEN}"
      }
    }
  }
}
```

**Environment Variables**:
```bash
# Create Jira API token at: https://id.atlassian.com/manage-profile/security/api-tokens
export JIRA_API_TOKEN="your-jira-api-token"
export JIRA_URL="https://your-domain.atlassian.net"
export JIRA_EMAIL="your-email@domain.com"
```

### Linear MCP Server Setup

**Prerequisites**:
- Linear workspace access
- Linear API key

**Installation**:
```bash
# Install Linear MCP server
npm install -g @linear/mcp-server

# Or alternative implementations
npm install -g linear-mcp
```

**Configuration**:
```json
{
  "mcpServers": {
    "linear": {
      "command": "linear-mcp-server",
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
      }
    }
  }
}
```

**API Key Setup**:
1. Go to Linear Settings → API
2. Create new Personal API Key
3. Set environment variable:
   ```bash
   export LINEAR_API_KEY="lin_api_your-api-key"
   ```

## Usage Patterns and Workflows

### Development-Driven Issue Management

#### **Feature Development Workflow**
```typescript
// 1. Get issue details before starting work
const issue = await mcp__jira__get_issue("PROJ-123");

// 2. Update issue status to "In Progress"
await mcp__jira__transition_issue("PROJ-123", "In Progress");

// 3. Add development notes
await mcp__jira__create_comment("PROJ-123", `
  Started development:
  - Branch: feature/PROJ-123-user-authentication
  - Approach: OAuth 2.0 integration with existing auth service
  - ETA: End of sprint
`);

// 4. Link related issues if needed
await mcp__jira__link_issues("PROJ-123", "PROJ-124", "blocks");
```

#### **Bug Fix Workflow**
```typescript
// 1. Create bug report from development findings
const bugIssue = await mcp__jira__create_issue({
  project: "PROJ",
  issueType: "Bug",
  summary: "Authentication service returns 500 on edge case",
  description: `
    **Environment**: Production
    **Steps to Reproduce**: 
    1. User attempts login with special characters in email
    2. Service throws unhandled exception
    
    **Expected**: Graceful error handling
    **Actual**: 500 Internal Server Error
    
    **Fix Applied**: Input validation in auth middleware
  `,
  priority: "High",
  assignee: "current-user"
});

// 2. Track fix progress
await mcp__jira__transition_issue(bugIssue.key, "In Review");
```

### AI-Assisted Project Management

#### **Multi-Model Issue Analysis**
```typescript
// 1. Get issue context
const issue = await mcp__jira__get_issue("PROJ-456");

// 2. Analyze with Sequential Thinking
const analysis = await mcp__sequential_thinking__sequentialthinking(`
  Analyze this Jira issue for implementation approach:
  Title: ${issue.summary}
  Description: ${issue.description}
  
  Break down into:
  1. Technical requirements
  2. Dependencies and blockers
  3. Implementation strategy
  4. Testing approach
  5. Risk assessment
`);

// 3. Validate with Gemini CLI
const validation = await mcp__gemini_cli__prompt(`
  Review this implementation plan:
  Issue: ${issue.summary}
  Analysis: ${analysis}
  
  Evaluate:
  - Feasibility and approach
  - Potential risks and mitigation
  - Alternative implementations
  - Resource requirements
`);

// 4. Update issue with comprehensive plan
await mcp__jira__create_comment(issue.key, `
  ## Implementation Analysis
  
  **Sequential Analysis**: ${analysis}
  
  **Gemini Validation**: ${validation}
  
  **Recommended Approach**: [Synthesized from both analyses]
`);
```

#### **Sprint Planning with AI**
```typescript
// 1. Get sprint issues
const sprintIssues = await mcp__jira__get_sprint_issues("SPRINT-123");

// 2. Analyze sprint capacity and complexity
const sprintAnalysis = await mcp__sequential_thinking__sequentialthinking(`
  Analyze sprint planning:
  Issues: ${JSON.stringify(sprintIssues, null, 2)}
  
  Evaluate:
  1. Issue complexity and effort estimation
  2. Dependencies between issues
  3. Risk factors and blockers
  4. Resource allocation recommendations
  5. Sprint goal alignment
`);

// 3. Get alternative perspective
const sprintValidation = await mcp__gemini_cli__prompt(`
  Review sprint plan and capacity:
  Issues: ${sprintIssues.length} items
  Analysis: ${sprintAnalysis}
  
  Assess:
  - Sprint goal achievability
  - Resource distribution
  - Risk mitigation strategies
  - Priority adjustments needed
`);
```

### Cross-Platform Workflows

#### **Linear to Development Workflow**
```typescript
// Modern, streamlined Linear workflow
async function linearDevelopmentWorkflow(issueId: string) {
  // 1. Get Linear issue
  const issue = await mcp__linear__get_issue(issueId);
  
  // 2. Create development branch
  const branchName = `feature/${issue.identifier}-${issue.title.toLowerCase().replace(/\s+/g, '-')}`;
  
  // 3. Update issue status  
  await mcp__linear__update_issue(issueId, {
    stateId: "in-progress-state-id"
  });
  
  // 4. Add development comment
  await mcp__linear__create_comment(issueId, `
    🚀 Development started
    
    **Branch**: \`${branchName}\`
    **Approach**: ${approach}
    **ETA**: ${estimatedCompletion}
  `);
}
```

## Agent Integration with Project Management

### Enhanced Project Manager Agent

#### **Project Management MCP Tools**
Add to `project-manager.md` agent configuration:
```yaml
additional_tools:
  - mcp__jira__create_issue
  - mcp__jira__update_issue
  - mcp__jira__search_issues
  - mcp__jira__get_project
  - mcp__linear__create_issue
  - mcp__linear__list_projects
  - mcp__linear__get_team
```

#### **Project Orchestration Patterns**
```typescript
// AI-assisted project coordination
class ProjectManagerWithMCP {
  async createFeatureEpic(featureSpec: FeatureSpec) {
    // 1. Analyze feature complexity
    const analysis = await mcp__sequential_thinking__sequentialthinking(`
      Break down feature into implementable tasks:
      Feature: ${featureSpec.name}
      Requirements: ${featureSpec.requirements}
      
      Create:
      1. Epic structure
      2. Individual user stories
      3. Technical tasks
      4. Testing requirements
      5. Documentation needs
    `);
    
    // 2. Create epic in Jira/Linear
    const epic = await mcp__jira__create_issue({
      issueType: "Epic",
      summary: featureSpec.name,
      description: `${featureSpec.description}\n\n## AI Analysis\n${analysis}`
    });
    
    // 3. Create child stories
    const stories = this.extractStoriesFromAnalysis(analysis);
    for (const story of stories) {
      await mcp__jira__create_issue({
        issueType: "Story", 
        summary: story.summary,
        description: story.description,
        parent: epic.key
      });
    }
    
    return epic;
  }
  
  async validateSprintPlan(sprintId: string) {
    // Multi-model sprint validation
    const issues = await mcp__jira__get_sprint_issues(sprintId);
    
    // Get AI validation
    const validation = await mcp__gemini_cli__prompt(`
      Validate sprint plan feasibility:
      Issues: ${issues.length}
      Sprint Duration: 2 weeks
      
      Assess: capacity, dependencies, risks, recommendations
    `);
    
    // Update sprint with AI insights
    await mcp__jira__create_comment(sprintId, `
      ## AI Sprint Validation
      ${validation}
    `);
  }
}
```

### Code Reviewer with Issue Context

#### **Enhanced Code Review with Issue Context**
```typescript
// Add to code-reviewer.md capabilities
async function reviewWithIssueContext(prNumber: string, issueKey: string) {
  // 1. Get issue context
  const issue = await mcp__jira__get_issue(issueKey);
  
  // 2. Review code against requirements
  const review = await this.conductCodeReview(`
    Review this PR against Jira requirements:
    
    **Issue**: ${issue.summary}
    **Requirements**: ${issue.description}
    **Acceptance Criteria**: ${issue.acceptanceCriteria}
    
    **Code Changes**: @${prFiles}
    
    Verify:
    1. Requirements fulfillment
    2. Acceptance criteria satisfaction  
    3. Code quality standards
    4. Security considerations
  `);
  
  // 3. Validate with Gemini
  const validation = await mcp__gemini_cli__prompt(`
    Cross-validate this code review:
    Issue: ${issue.summary}
    Review: ${review}
    
    Confirm: completeness, accuracy, missed aspects
  `);
  
  // 4. Update issue with review results
  await mcp__jira__create_comment(issueKey, `
    ## Code Review Completed
    
    **PR**: #${prNumber}
    **Review Summary**: ${review.summary}
    **Status**: ${review.approved ? '✅ Approved' : '❌ Changes Requested'}
    
    **AI Validation**: ${validation}
  `);
}
```

## Security and Permissions

### Jira Permissions

#### **Minimum Required Permissions**
```json
{
  "jira_permissions": {
    "projects": ["Browse Projects", "View Issues"],
    "issues": ["Create Issues", "Edit Issues", "Transition Issues", "Add Comments"],
    "users": ["Browse Users"],
    "agile": ["View Board", "View Sprints"]
  }
}
```

#### **Recommended Security Settings**
```json
{
  "security_recommendations": {
    "api_token": "Use dedicated service account with minimal permissions",
    "oauth_scopes": "Request only necessary scopes for your workflow",
    "ip_restrictions": "Configure IP allowlists if available",
    "audit_logging": "Enable API audit logging in Jira admin"
  }
}
```

### Linear Permissions

#### **API Key Best Practices**
```json
{
  "linear_security": {
    "api_key_type": "Personal API Key (preferred) or Service Account",
    "permissions": "Read/Write access to issues and projects only",
    "rotation": "Rotate API keys every 90 days",
    "monitoring": "Monitor API usage in Linear settings"
  }
}
```

## Troubleshooting

### Common Jira Issues

#### **Authentication Errors**
```
Error: Unauthorized (401)
```
**Solutions**:
1. Verify API token is correct and not expired
2. Check email matches Jira account
3. Verify Jira URL format: `https://domain.atlassian.net`
4. Test API access: `curl -u email:token https://domain.atlassian.net/rest/api/2/myself`

#### **Permission Errors**
```
Error: Forbidden (403) 
```
**Solutions**:
1. Verify user has necessary Jira permissions
2. Check project permissions in Jira admin
3. Ensure API token has required scopes

#### **Connection Issues**
```
Error: MCP server 'jira' not responding
```
**Solutions**:
1. Check MCP server installation: `claude mcp list`
2. Verify environment variables are set
3. Test network connectivity to Jira instance
4. Check Claude Code MCP server logs

### Common Linear Issues

#### **API Key Issues**
```
Error: Invalid API key
```
**Solutions**:
1. Verify API key format starts with `lin_api_`
2. Check API key hasn't been revoked in Linear settings  
3. Verify workspace access for the API key

#### **Rate Limiting**
```
Error: Rate limit exceeded
```
**Solutions**:
1. Implement exponential backoff in MCP calls
2. Batch API requests when possible
3. Monitor API usage in Linear settings
4. Consider using webhooks for real-time updates

## Best Practices

### Development Workflow Integration

1. **Issue-Driven Development**:
   - Always start with issue context before coding
   - Update issue status as development progresses  
   - Link commits and PRs to issues
   - Use AI to validate requirements fulfillment

2. **AI-Enhanced Project Management**:
   - Use sequential thinking for complex project planning
   - Get multi-model validation for critical decisions
   - Leverage context7 for project management best practices
   - Document AI insights in issues for team transparency

3. **Cross-Tool Synchronization**:
   - Maintain consistent naming between Git branches and issues
   - Auto-update issue status based on PR status
   - Sync release notes with completed issues
   - Use AI to identify inconsistencies between tools

### Team Adoption

1. **Gradual Rollout**:
   - Start with read-only access to familiarize team
   - Enable creation/updates for power users first
   - Provide training on MCP-enhanced workflows
   - Collect feedback and iterate on integration

2. **Quality Gates**:
   - Require issue link for all PRs
   - Validate AI-generated issue descriptions
   - Review AI-suggested project decisions with team
   - Maintain audit trail of AI-assisted decisions

---

**Note**: Project management MCP servers are **not enabled by default**. Enable them in your `.claude/settings.local.json` based on your team's specific project management tool and workflow needs.