# Design Assets

This directory contains design-related artifacts and references for the project.

## Directory Structure

### `/mockups/`
UI/UX mockups and wireframes from design tools
- Figma exports
- Sketch files
- Adobe XD designs
- Low-fidelity wireframes

### `/screenshots/`
Reference screenshots and visual examples
- Competitor analysis screenshots
- Design inspiration captures
- User flow examples
- A/B test variants

### `/color-schemes/`
Color palette references and definitions
- Brand color specifications
- Accessibility contrast reports
- Color palette exports (from Coolors, Adobe Color, etc.)
- Semantic color mapping documentation

### `/assets/`
Design assets and resources
- Logo files (SVG, PNG)
- Icon sets
- Typography specimens
- Pattern libraries
- Canva templates

## Usage Guidelines

**File Naming**: Use descriptive, lowercase-kebab-case names
- Good: `dashboard-mobile-mockup-v2.png`
- Bad: `Screen Shot 2024-01-15.png`

**Organization**: Group related files in dated subdirectories when working on iterations
- Example: `mockups/2024-01-checkout-redesign/`

**Formats**:
- Prefer vector formats (SVG, Figma) for scalability
- Use PNG for screenshots and raster images
- Include source files when possible

## Design System Documentation

### Visual Design (Required)

The **source of truth** for all visual design decisions:
```
docs/project/design-system.md
```

Defines:
- Visual language (colors, typography, spacing)
- UI components and variants
- Interaction patterns and animations
- Accessibility standards
- Responsive design and dark mode

**When to update**: When adding components, changing design tokens, or updating visual standards.

### Writing & Content (Optional)

For projects with content/copywriting needs:
```
docs/project/writing-style.md
```

Defines:
- Voice and tone guidelines
- Microcopy patterns (buttons, errors, empty states)
- Capitalization and formatting rules
- Grammar and usage conventions

**When to use**: Projects with user-facing content, marketing copy, or specific brand voice requirements. Many technical projects won't need this.

## Strategic Design Decisions

For foundational design decisions that need documentation and rationale, use:
```bash
/adr "design system framework selection"
```

Examples of strategic design decisions:
- Choosing a design framework (Tailwind CSS, Material UI, custom)
- Selecting accessibility standards or tooling
- Design token structure and naming conventions
- Component library architecture

These decisions are:
- Stored as ADRs in `docs/project/adrs/`
- Documented with context, alternatives, and consequences
- Used to update `design-system.md` with the chosen approach

**Tactical design changes** (component specs, color values, spacing) should be updated directly in `design-system.md` by AI assistants as they implement UI.

## Documentation Structure

- **`design-system.md`**: Visual design specifications (required)
- **`writing-style.md`**: Content and copy guidelines (optional)
- **`design/` directory**: Visual assets and mockups (this folder)
- **Component library**: Implementation code (in your codebase)

This separation ensures design decisions are documented separately from assets and implementation.
