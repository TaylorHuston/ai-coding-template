# Archived NPM Package Files

**Archive Date**: 2025-10-03
**Reason**: Converted from NPM package distribution to GitHub Template distribution

## Archived Contents

This directory contains the NPM package implementation that was used from v0.4.0 through v0.7.0. The project has migrated to GitHub Template distribution as the primary method, with degit as an alternative.

### Archived Files

- **cli/** - CLI tools for NPM package (`init`, `status`, `validate`, `sync` commands)
- **.template-manifest.json** - File categorization manifest for template installation
- **template/** - Template validation and categorization scripts

### Why the Change?

The project is a **project template/scaffold**, not a code library. GitHub Templates are the standard distribution method for scaffolds because:

1. **One-click setup** - Users click "Use this template" → instant repository
2. **Git isolation** - Each project gets clean git history
3. **Simple updates** - Users pull template changes when needed
4. **No dependencies** - No NPM package to maintain or publish

### NPM Distribution Issues

The NPM approach had several problems:
- Complex installation requiring `npx` commands
- Dependency management overhead (commander, etc.)
- File categorization complexity (core vs reference vs optional)
- Git history pollution from template repository
- Confusion between "installing a package" and "creating a project"

### Alternative: degit

For users who prefer CLI, we now recommend degit:

```bash
npx degit TaylorHuston/ai-coding-template my-project
cd my-project
git init
```

This achieves the same result as the NPM package but with simpler implementation.

### Future: Updater Tool

The file categorization and merge logic may be repurposed for a future **template updater tool** that helps users pull updates from the template into their existing projects. This would be a separate utility focused specifically on updates, not initial installation.

## File Inventory

```
.archived-npm/
├── cli/
│   ├── index.js
│   ├── index-npm.js
│   ├── index-dev.js
│   ├── index-simple.js
│   ├── commands/
│   │   ├── init.js
│   │   └── sync.js
│   └── utils/
│       ├── file-categorizer.js
│       └── dev-mode-config.js
├── template/
│   ├── test-categorization.js
│   └── validate-manifest-simple.js
└── .template-manifest.json
```

## Version History

- **v0.4.0** - Initial NPM package implementation with FileCategorizer
- **v0.5.0** - Fixed baseDir handling and NPM binary resolution
- **v0.6.4** - Added ai-assisted-template binary name
- **v0.7.0** - Final NPM version before conversion to GitHub Template

## Preservation Rationale

These files are preserved rather than deleted because:
1. They represent significant development work (template categorization logic)
2. The file categorization system may be useful for future updater tools
3. Historical reference for understanding the evolution of the distribution strategy
4. Code examples for CLI development and template management patterns
