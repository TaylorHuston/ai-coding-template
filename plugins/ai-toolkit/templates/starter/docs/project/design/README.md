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

## Strategic Design Decisions

For foundational design decisions (design system choice, accessibility standards, etc.), use:
```bash
/architect --foundation
```

These architectural design decisions are stored as ADRs in `docs/project/adrs/`.

## Tactical Design Documentation

For component-level design decisions (token values, spacing systems, etc.), document them alongside the implementation in your design system or component documentation.
