---
version: "1.0.0"
created: "2025-10-03"
last_updated: "2025-10-03"
status: "active"
target_audience: ["developers", "template-contributors"]
document_type: "guide"
priority: "high"
tags: ["template-development", "bidirectional-sync", "contribution"]
---

# Template Development Guide

**Actively develop the template while using it in real projects**

This guide shows you how to contribute improvements back to the AI Coding Template while building your actual projects. Use the manifest-driven sync system to maintain bidirectional flow between your projects and the template repository.

## Table of Contents

- [Why Bidirectional Development?](#why-bidirectional-development)
- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [Real-World Workflow](#real-world-workflow)
- [Commands Reference](#commands-reference)
- [Troubleshooting](#troubleshooting)

---

## Why Bidirectional Development?

**The Problem:** Template improvements come from real-world usage, but templates are usually static snapshots.

**The Solution:** Active template development lets you:
- ✅ Discover template improvements while building real projects
- ✅ Contribute fixes and enhancements back to the template
- ✅ Pull template updates into existing projects
- ✅ Share improvements across all your projects

---

## Quick Start

### 1. Initial Setup

```bash
# In your project (created from template)
./.claude/resources/scripts/template/template-sync.sh config

# Enter path to template repo when prompted:
# Example: ~/dev/ai-coding-template or ../ai-coding-template
```

This creates `.template-dev.json` (git-ignored) with your configuration.

### 2. Verify Setup

```bash
# Check sync status
./.claude/resources/scripts/template/template-sync.sh status
```

### 3. Start Developing!

```bash
# Make improvements in your project
# Template files are automatically tracked

# Preview what would sync
./.claude/resources/scripts/template/template-sync.sh push --dry-run

# Actually push improvements to template
./.claude/resources/scripts/template/template-sync.sh push
```

---

## How It Works

### File Categorization

The template uses `.template-manifest.json` to categorize files:

| Category | Strategy | Description | Syncable |
|----------|----------|-------------|----------|
| **core** | replace | Essential template infrastructure | ✅ Yes |
| **reference** | merge | Documentation and examples | ✅ Yes |
| **optional** | prompt | Optional components | ⏭️ Manual |
| **configuration** | smart-merge | Config files | ⏭️ Manual |
| **user** | preserve | Your project code | ❌ Never |
| **ignore** | skip | Development artifacts | ❌ Never |

**Syncable files include:**
- `.claude/` - All AI system files
- `CLAUDE.md` - Main AI instructions
- `docs/ai-toolkit/` - Template documentation
- `docs/development/guidelines/` - Development guidelines
- `.claude/resources/` - Scripts, templates, examples

**Project-specific files (never synced):**
- `src/` - Your application code
- `docs/project-brief.md` - Your project's description
- `docs/project/` - Your project's documentation
- `README.md` - Your project's README
- Any files matching `user` or `ignore` categories

### Sync Modes

- **pull** - Template → Project (get updates)
- **push** - Project → Template (contribute improvements)
- **bidirectional** - Auto-detect based on file timestamps

### How Files Are Selected

1. Script reads `.template-manifest.json`
2. Extracts files in `core` and `reference` categories
3. Compares project vs template versions
4. Determines action based on mode and timestamps
5. Copies files while preserving directory structure

---

## CLAUDE.md Management

### Two-File System

The template uses a **two-file system** for CLAUDE.md to preserve your customizations while allowing template improvements:

| File | Purpose | Syncs? | Customizable? |
|------|---------|--------|---------------|
| `CLAUDE.md` (root) | Your project's version | ❌ No | ✅ Yes |
| `.claude/CLAUDE-template.md` | Template reference | ✅ Yes | ⏭️ For contributing |

### Why This Design?

CLAUDE.md contains both:
- **Template content**: Core principles, AI agent system, workflow rules
- **Project-specific content**: Tech stack, external links, custom rules

If we synced the root CLAUDE.md:
- **Pull** would overwrite your customizations
- **Push** would pollute template with project-specific details

Solution: Template reference file that syncs independently.

### Workflow

**Initial Setup:**
1. Both files start identical
2. Customize `CLAUDE.md` with your project details (tech stack, links, etc.)
3. `.claude/CLAUDE-template.md` stays as reference copy

**Getting Template Updates:**
```bash
# Pull template updates (only updates .claude/CLAUDE-template.md)
template-sync.sh pull

# See what changed
template-sync.sh claude-diff

# Manually merge improvements you want into CLAUDE.md
# Update "Last compared with template" date in CLAUDE.md comment
```

**Contributing Improvements:**
```bash
# You improved something in CLAUDE.md (e.g., better MCP Tool Decision Framework)
# Copy the improvement to .claude/CLAUDE-template.md
vim .claude/CLAUDE-template.md
# Paste your improvement

# Push to template
template-sync.sh push

# Now other projects can get your improvement
```

### Example: Merging Template Updates

```bash
# 1. Template updated, pull changes
template-sync.sh pull
# Output: ✓ Pulled: 1 files (.claude/CLAUDE-template.md)

# 2. See what changed
template-sync.sh claude-diff
# Shows diff: template improved "Core Principles" section

# 3. Manually edit CLAUDE.md
vim CLAUDE.md
# Add improvements you want from template

# 4. Update tracking comment
# Change: "Last compared with template: 2025-10-03"

# 5. Commit
git add CLAUDE.md
git commit -m "Merge template CLAUDE.md improvements: enhanced core principles"
```

### CLAUDE.md Commands

```bash
# Compare your CLAUDE.md with template
template-sync.sh claude-diff

# Check if CLAUDE.md matches template (ignoring comments)
template-sync.sh claude-status

# Reset to template defaults (⚠️ lose customizations!)
cp .claude/CLAUDE-template.md CLAUDE.md
```

### Best Practices

✅ **DO:**
- Keep "Project Context" section customized for your project
- Review template updates before merging
- Update "Last compared" date after merging
- Copy improvements to `.claude/CLAUDE-template.md` before pushing

❌ **DON'T:**
- Auto-merge without reviewing
- Forget to update tracking date
- Put project-specific details in template file
- Ignore template updates (review regularly)

---

## Real-World Workflow

### Scenario: Improve Agent Prompt

You're building Project A and discover the `code-architect` agent could have better prompts.

**Step 1: Make the improvement**

```bash
# Edit in your project
vim .claude/agents/code-architect.md

# Make your improvements based on real usage
```

**Step 2: Preview sync**

```bash
# See what would be pushed
./scripts/template-sync.sh push --dry-run --verbose

# Output:
# 📋 Sync Plan:
# ═══════════════════════════════════════════════════════
# 📤 Push (Project → Template): 1
#    📄 .claude/agents/code-architect.md (Project is newer)
```

**Step 3: Push to template**

```bash
# Copy improvements to template repo
./scripts/template-sync.sh push

# Output:
# ✓ Successfully synced: 1 files
#    📤 Pushed: 1
#
# 💡 Next Steps:
#    - Commit template improvements: cd ~/dev/ai-coding-template && git commit
```

**Step 4: Commit in template repo**

```bash
# Go to template repository
cd ~/dev/ai-coding-template

# Review changes
git diff

# Commit
git add .claude/agents/code-architect.md
git commit -m "Improve code-architect agent prompts based on real usage

- Add more context about architectural decisions
- Improve example prompts
- Based on experience from Project A"

# Push to GitHub
git push origin main
```

**Step 5: Pull into other projects**

```bash
# In Project B
cd ~/projects/project-b

# Get the improvement
./scripts/template-sync.sh pull

# Output:
# ✓ Successfully synced: 1 files
#    📥 Pulled: 1

# Commit in your project
git add .claude/agents/code-architect.md
git commit -m "Update template: improved code-architect prompts"
```

---

## Commands Reference

### Setup

```bash
# Create configuration (one-time setup)
template-sync.sh config
```

### Pull Updates

```bash
# Pull all template updates
template-sync.sh pull

# Preview first (dry-run)
template-sync.sh pull --dry-run

# Verbose output
template-sync.sh pull --verbose
```

### Push Improvements

```bash
# Push improvements to template
template-sync.sh push

# Preview first (dry-run)
template-sync.sh push --dry-run

# Verbose output
template-sync.sh push --verbose
```

### Check Status

```bash
# Show what's different (no changes)
template-sync.sh status

# Detailed output
template-sync.sh status --verbose
```

### View Diffs

```bash
# See diff for specific file
template-sync.sh diff .claude/agents/code-architect.md
```

### Options

```bash
# Specify template directory (override config)
template-sync.sh push --template-dir ~/dev/ai-coding-template

# Force sync even with conflicts
template-sync.sh pull --force

# Dry run (preview only)
template-sync.sh push --dry-run

# Verbose output
template-sync.sh status --verbose
```

---

## Configuration

### .template-dev.json

Create in your project root (git-ignored):

```json
{
  "templateRepo": "~/dev/ai-coding-template",
  "autoCommit": false,
  "defaultMode": "bidirectional",
  "verbose": false
}
```

**Fields:**
- `templateRepo` - Path to template repository (required)
- `autoCommit` - Auto-commit to template repo (not recommended)
- `defaultMode` - Default sync mode: `pull`, `push`, or `bidirectional`
- `verbose` - Show detailed output by default

### Template Directory Detection

If `.template-dev.json` doesn't exist, the script tries these locations:
1. `../ai-coding-template`
2. `../../ai-coding-template`
3. `~/dev/ai-coding-template`
4. `~/projects/ai-coding-template`

---

## Best Practices

### DO ✅

- **Preview first**: Use `--dry-run` before syncing
- **Review changes**: Run `git diff` before committing
- **Test thoroughly**: Ensure improvements work in multiple projects
- **Write clear commits**: Explain the improvement and reasoning
- **Pull regularly**: Keep projects up-to-date with template
- **Share context**: Mention which project revealed the improvement

### DON'T ❌

- **Don't auto-commit**: Review changes before committing
- **Don't force blindly**: Understand conflicts before using `--force`
- **Don't mix concerns**: Keep template improvements separate from project work
- **Don't break others**: Test before pushing to template main branch
- **Don't sync project code**: Script prevents this, but be aware

---

## Troubleshooting

### Script says "jq is required"

Install jq (JSON processor):

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Fedora
sudo dnf install jq
```

### Template directory not found

1. Check `.template-dev.json` has correct path
2. Ensure template repo is cloned
3. Run `template-sync.sh config` to reconfigure

### Conflicts detected

```bash
# See what's conflicting
template-sync.sh status --verbose

# Option 1: Force pull (keep template version)
template-sync.sh pull --force

# Option 2: Force push (keep project version)
template-sync.sh push --force

# Option 3: Manually resolve
template-sync.sh diff <conflicting-file>
# Edit file, then sync again
```

### No changes detected

Verify you're editing template files (not project-specific files):

```bash
# Check if file is tracked
grep -r "your-file-path" .template-manifest.json

# Show all syncable files
cat .template-manifest.json | jq -r '.categories.core.files[], .categories.reference.files[]'
```

### Permission denied

Make script executable:

```bash
chmod +x .claude/resources/scripts/template/template-sync.sh
```

---

## Advanced Usage

### Creating a Slash Command

Add to `.claude/commands/template.md`:

```markdown
---
description: "Template development sync operations"
allowed-tools: ["Bash"]
model: claude-sonnet-4-5
---

# /template Command

Sync template improvements bidirectionally.

## Usage

```bash
/template pull       # Pull template updates
/template push       # Push improvements
/template status     # Show sync status
```

Wrapper for `.claude/resources/scripts/template/template-sync.sh`
```

Then use:

```bash
/template push
/template pull
/template status
```

### Automated Sync Checks

Add to `.githooks/pre-commit`:

```bash
# Check for unsync'd template changes
if ./.claude/resources/scripts/template/template-sync.sh status --verbose | grep -q "Push.*[1-9]"; then
    echo "⚠️  You have template improvements that could be pushed"
    echo "   Run: template-sync.sh push"
fi
```

### Multi-Project Dashboard

Create a script to check all projects:

```bash
#!/bin/bash
# check-all-projects.sh

for project in ~/projects/*/; do
    if [ -f "$project/.template-dev.json" ]; then
        echo "Checking: $project"
        cd "$project"
        ./.claude/resources/scripts/template/template-sync.sh status
    fi
done
```

---

## Contributing Back to Template

### Workflow for Template Contributors

1. **Use template in real project**
2. **Discover improvement** based on actual usage
3. **Make change in project**
4. **Push to template repo**: `template-sync.sh push`
5. **Create feature branch** in template repo
6. **Test change** in multiple projects
7. **Create PR** to template main branch
8. **After merge**, pull into all projects

### What Makes a Good Contribution?

✅ **Good Contributions:**
- Agent prompt improvements based on real usage
- Script enhancements that solve actual problems
- Documentation clarifications from confusion you experienced
- New templates/examples from patterns you discovered
- Bug fixes from issues you encountered

❌ **Not Good Contributions:**
- Project-specific customizations
- Untested experimental changes
- Breaking changes without migration guide
- Personal preferences without broader applicability

---

## FAQ

**Q: Can I use this with GitHub Template-created projects?**
A: Yes! After clicking "Use this template", clone your repo and set up sync.

**Q: Do I need to clone the template separately?**
A: Yes, you need a local copy of the template repo to sync with.

**Q: Will this overwrite my project code?**
A: No, the manifest ensures only template files are synced. Project code (`src/`, etc.) is never touched.

**Q: Can I sync specific files only?**
A: Currently syncs all files in `core` and `reference` categories. Use `--dry-run` to preview.

**Q: How do I know what's a template file?**
A: Check `.template-manifest.json` - files in `core` and `reference` categories are syncable.

**Q: What if template and project files both changed?**
A: In bidirectional mode, newer file wins. Use `--force` to override. Or manually merge with `diff`.

---

## Related Documentation

- [Template Usage Guide](../README.md) - Getting started with the template
- [Contributing Guide](../../../CONTRIBUTING.md) - How to contribute to the template
- [Commands Reference](../reference/commands.md) - All available slash commands

---

**Ready to improve the template while building real projects? Start with `template-sync.sh config`!**
