# Frequently Asked Questions

**Version**: 1.0.0  
**Created**: 2025-08-22  
**Last Updated**: 2025-08-22  
**Status**: Active  
**Target Audience**: Developers, Team Leads

## General Questions

### Q: Do I need to use all 17 agents?

**A**: No! Agents activate automatically based on your needs. Start simple and discover agents as you work. Most developers regularly use 5-6 agents.

### Q: Can I use this with tools other than Claude Code?

**A**: Yes! While optimized for Claude Code, the patterns work with:

- Cursor
- GitHub Copilot
- Continue.dev
- Any AI coding assistant that supports custom instructions

### Q: What if my project uses Python/Ruby/Go instead of JavaScript?

**A**: The template is language-agnostic. Simply:

1. Adapt the examples to your language
2. Update `docs/technical.md` with your stack
3. Use appropriate specialist agents
4. Follow your language's conventions

## Setup Questions

### Q: Can I integrate this into an existing large project?

**A**: Yes! Use the gradual integration approach:

1. Start with just `.claude/` directory
2. Add context files (CLAUDE.md, status.md)
3. Gradually adopt agents and workflows
4. See [Integration Guide](./integration-guide.md)

### Q: What are the minimum requirements?

**A**: Minimal setup needs:

- Git
- Node.js 16+ (for scripts)
- A code editor
- An AI assistant account

### Q: Do I need to modify my existing project structure?

**A**: No! The template adapts to your structure. Don't force your project to match the template - adapt the template to your project.

## Agent Questions

### Q: How do I add my own custom agents?

**A**: Create custom agents easily:

1. Create `.claude/agents/your-agent.md`
2. Follow the existing agent format
3. Update `.claude/agents/INDEX.md`
4. Test with simple tasks
5. See [AI Agents Guide](./ai-agents-guide.md#creating-custom-agents)

### Q: What if an agent gives wrong advice?

**A**: Agents are guides, not authorities:

1. Always review agent output
2. Trust your expertise over agent suggestions
3. Agents learn from your corrections
4. Report consistent issues via GitHub

### Q: Can agents work with my proprietary framework?

**A**: Yes! Enhance agents with your framework:

1. Update `docs/technical.md` with framework details
2. Add examples to agent instructions
3. Create framework-specific agents if needed

## Security Questions

### Q: How do I handle API keys and secrets?

**A**: Never commit secrets! Best practices:

1. Use `.env` files (already in .gitignore)
2. Use environment variables
3. Use secret management services
4. Never paste secrets in AI conversations

### Q: Is my code being sent to AI servers?

**A**: Only what you explicitly share:

1. Local files stay local
2. You control what context to share
3. Use self-hosted AI for sensitive projects
4. Review your AI provider's privacy policy

## Team Questions

### Q: Can multiple developers use this on the same project?

**A**: Yes! The system supports team collaboration:

1. Share context files via git
2. Use deliverables system for task tracking
3. Maintain consistent agent usage
4. Document AI-assisted changes

### Q: How do we maintain consistency across the team?

**A**: Ensure consistency through:

1. Shared `CLAUDE.md` instructions
2. Documented patterns in `docs/technical.md`
3. Code review by senior developers
4. Automated linting and formatting

### Q: Should we tell clients we're using AI assistance?

**A**: Transparency is recommended:

1. Check your contracts and policies
2. Many clients appreciate efficiency gains
3. Focus on quality and security
4. Document human oversight

## Workflow Questions

### Q: How do I handle merge conflicts with AI-generated code?

**A**: Handle conflicts normally:

1. AI should work on feature branches
2. Review AI changes before merging
3. Resolve conflicts manually
4. Test thoroughly after merging

### Q: What if AI keeps forgetting context?

**A**: Manage context actively:

1. Update `status.md` regularly
2. Reference specific files
3. Use context-analyzer agent
4. Break large tasks into smaller ones
5. See [Troubleshooting Guide](./troubleshooting.md#ai-forgets-context)

### Q: How often should I update documentation?

**A**: Documentation schedule:

- `status.md`: Daily/per session
- `CHANGELOG.md`: Per feature/fix
- `docs/technical.md`: Major changes only
- Other docs: As needed

## Performance Questions

### Q: Will this make my repository huge?

**A**: No, the template is lightweight:

- Core files: ~50KB
- Agents: ~200KB
- Scripts: ~100KB
- Total: <500KB addition

### Q: Do the scripts slow down my development?

**A**: Scripts are optional and fast:

- Most run in <1 second
- Use only what you need
- Can be run in background
- Cacheable results

### Q: How do I optimize for large codebases?

**A**: Large codebase tips:

1. Use focused context sharing
2. Break into modules
3. Summarize before detailed analysis
4. Use search tools efficiently

## Cost Questions

### Q: Does this increase AI API costs?

**A**: Actually reduces costs by:

1. Reducing back-and-forth clarification
2. Preventing duplicate work
3. Focused context sharing
4. Efficient agent usage

## Advanced Questions

### Q: Can I use this with microservices?

**A**: Yes, adapt for microservices:

1. Create per-service context files
2. Use api-designer for service contracts
3. Maintain service-specific agents
4. Document inter-service communication

### Q: How do I handle monorepo setups?

**A**: Monorepo strategies:

1. Root-level `.claude/` directory
2. Package-specific `status.md` files
3. Shared `docs/technical.md`
4. Package-aware agents

### Q: Can this work with CI/CD pipelines?

**A**: Yes, integrates well:

1. Scripts can run in CI
2. Documentation validation
3. Automated quality checks
4. AI-assisted deployment notes

## Contributing Questions

### Q: How can I contribute improvements?

**A**: Contributions welcome:

1. Fork the repository
2. Create feature branch
3. Submit pull request
4. Share your custom agents
5. Report issues and suggestions

### Q: Where do I report bugs?

**A**: Report issues:

1. GitHub Issues (preferred)
2. Include reproduction steps
3. Share relevant context files
4. Describe expected vs actual behavior

### Q: Can I share my custom agents?

**A**: Yes! Share agents:

1. Create PR with your agent
2. Include usage examples
3. Document agent purpose
4. Test with common scenarios

---

Don't see your question? Check:

- [Troubleshooting Guide](./troubleshooting.md)
- [Integration Guide](./integration-guide.md)
- [AI Agents Guide](./ai-agents-guide.md)
- Or open a GitHub issue
