---
title: "Design System"
version: "0.1.0"
created: "2025-10-30"
last_updated: "2025-10-30"
status: "Active"
target_audience: ["AI Assistants", "Development Team", "Design Team"]
tags: ["design-system", "ui-ux", "visual-design"]
category: "Design"
description: "Visual design system defining UI components, patterns, and interaction design."
---

# Design System

Source of truth for visual design, UI components, and interaction patterns. AI assistants should reference this when implementing UI.

## Overview

### Design Principles

[Define core design principles - typically 3-5 principles]

Example:
1. **Accessibility First** - WCAG 2.1 AA minimum
2. **Consistency** - Predictable UI patterns
3. **Clarity** - Clear visual hierarchy
4. **Efficiency** - Minimal user effort

### Design Philosophy

[Brief description of design approach]

Example: Modern, minimal aesthetic with mobile-first responsive design and performance-aware animations.

## Foundation

### Color System

```yaml
Brand Colors:
  primary: "#0066CC"        # Main brand color
  secondary: "#FF6B35"      # Accent color

Semantic Colors:
  success: "#10B981"
  warning: "#F59E0B"
  error: "#EF4444"
  info: "#3B82F6"

Neutrals:
  gray-50: "#F9FAFB"       # Lightest
  gray-500: "#6B7280"      # Mid
  gray-900: "#111827"      # Darkest
  # ... (define full scale as needed)

Accessibility:
  - Text contrast: 4.5:1 minimum (WCAG AA)
  - UI components: 3:1 minimum
  - Never rely solely on color
```

### Typography

```yaml
Fonts:
  primary:
    name: "Inter"
    fallback: "system-ui, sans-serif"
    weights: [400, 500, 600, 700]

  monospace:
    name: "JetBrains Mono"
    fallback: "Monaco, monospace"
    weights: [400, 500]

Type Scale:
  h1: { size: "3rem", line-height: "3.5rem", weight: 700 }
  h2: { size: "2.25rem", line-height: "2.75rem", weight: 600 }
  h3: { size: "1.875rem", line-height: "2.25rem", weight: 600 }
  body: { size: "1rem", line-height: "1.5rem", weight: 400 }
  small: { size: "0.875rem", line-height: "1.25rem", weight: 400 }
  # ... (add h4, h5, labels, etc. as needed)

Guidelines:
  - Line length: 60-75 characters
  - Left-align body text
  - Underline links on hover
```

### Spacing

```yaml
Base Unit: 4px (0.25rem)

Scale:
  1: "0.25rem"    # 4px
  2: "0.5rem"     # 8px
  4: "1rem"       # 16px
  6: "1.5rem"     # 24px
  8: "2rem"       # 32px
  12: "3rem"      # 48px
  16: "4rem"      # 64px
  # ... (extend as needed)

Usage:
  tight: "space-2"
  normal: "space-4"
  relaxed: "space-6"
  loose: "space-8"
```

### Layout & Grid

```yaml
Container:
  max-width: "1280px"
  padding: "1rem"           # Mobile
  padding-lg: "2rem"        # Desktop

Grid:
  columns: 12
  gap: "1.5rem"

Breakpoints:
  sm: "640px"               # Mobile landscape
  md: "768px"               # Tablet
  lg: "1024px"              # Desktop
  xl: "1280px"              # Large desktop
```

### Elevation & Shadows

```yaml
Shadows:
  sm: "0 1px 2px rgba(0,0,0,0.05)"
  md: "0 4px 6px rgba(0,0,0,0.1)"
  lg: "0 10px 15px rgba(0,0,0,0.1)"
  xl: "0 20px 25px rgba(0,0,0,0.1)"

Usage:
  cards: "shadow-sm"
  dropdowns: "shadow-md"
  modals: "shadow-xl"
```

### Border Radius

```yaml
Radius:
  sm: "0.125rem"    # 2px
  base: "0.25rem"   # 4px
  md: "0.375rem"    # 6px
  lg: "0.5rem"      # 8px
  xl: "0.75rem"     # 12px
  full: "9999px"    # Pills/avatars

Components:
  buttons: "base"
  inputs: "md"
  cards: "xl"
```

## Components

### Buttons

```yaml
Variants:
  primary:
    bg: "primary-500"
    text: "white"
    hover-bg: "primary-600"

  secondary:
    bg: "gray-100"
    text: "gray-900"
    border: "gray-300"

  outline:
    bg: "transparent"
    text: "primary-500"
    border: "primary-500"

Sizes:
  sm: { padding: "0.5rem 1rem", font-size: "0.875rem", height: "2rem" }
  md: { padding: "0.625rem 1.25rem", font-size: "1rem", height: "2.5rem" }
  lg: { padding: "0.75rem 1.5rem", font-size: "1.125rem", height: "3rem" }

States:
  - Hover: Background darkens, cursor pointer
  - Active: Scale 98%
  - Focus: 2px focus ring
  - Disabled: Opacity 50%, no interaction
  - Loading: Spinner, maintain dimensions
```

### Form Inputs

```yaml
Base:
  height: "2.5rem"
  padding: "0.625rem 0.75rem"
  border: "1px solid gray-300"
  border-radius: "md"
  font-size: "1rem"

States:
  focus:
    border: "primary-500"
    ring: "0 0 0 3px primary-500/10"
  error:
    border: "error"
    ring: "0 0 0 3px error/10"
  disabled:
    bg: "gray-50"
    opacity: 0.6

Labels:
  - Weight: 500
  - Size: 0.875rem
  - Color: gray-700
  - Margin-bottom: 0.5rem
  - Required: Red asterisk
```

### Cards

```yaml
Base:
  bg: "white"
  border: "1px solid gray-200"
  border-radius: "xl"
  padding: "1.5rem"
  shadow: "sm"

Interactive:
  hover:
    shadow: "md"
    transform: "translateY(-2px)"
    cursor: "pointer"

Sections:
  header: { padding-bottom: "1rem", border-bottom: "1px solid gray-200" }
  footer: { padding-top: "1rem", border-top: "1px solid gray-200" }
```

### Modals

```yaml
Overlay:
  bg: "rgba(0,0,0,0.5)"
  backdrop-filter: "blur(4px)"

Container:
  bg: "white"
  border-radius: "2xl"
  shadow: "2xl"
  max-width: { sm: "400px", md: "600px", lg: "800px" }
  padding: "2rem"

Structure:
  header: { border-bottom: "1px solid gray-200", padding-bottom: "1rem" }
  body: { padding: "1.5rem 0", max-height: "calc(100vh - 12rem)", overflow: "auto" }
  footer: { border-top: "1px solid gray-200", padding-top: "1rem" }
```

### Navigation

```yaml
Header:
  height: { mobile: "3.5rem", desktop: "4rem" }
  bg: "white"
  border-bottom: "1px solid gray-200"
  shadow: "sm"
  sticky: true

Sidebar:
  width: { collapsed: "4rem", expanded: "16rem" }
  bg: "gray-50"
  border-right: "1px solid gray-200"

Nav Items:
  padding: "0.75rem 1rem"
  border-radius: "md"

  states:
    default: { color: "gray-700" }
    hover: { bg: "gray-100" }
    active: { bg: "primary-50", color: "primary-600", weight: 600 }
```

### Tables

```yaml
Header:
  bg: "gray-50"
  border-bottom: "2px solid gray-200"
  font-weight: 600
  font-size: "0.875rem"
  text-transform: "uppercase"
  padding: "0.75rem 1rem"

Row:
  border-bottom: "1px solid gray-200"
  hover-bg: "gray-50"

Cell:
  padding: "1rem"
  font-size: "0.875rem"
```

## Interaction Patterns

### Animation & Motion

```yaml
Timing:
  fast: "150ms"
  base: "200ms"
  slow: "300ms"

Easing:
  ease-in-out: "cubic-bezier(0.4, 0, 0.2, 1)"
  ease-out: "cubic-bezier(0, 0, 0.2, 1)"

Transitions:
  - Color, background, border: 150ms ease-in-out
  - Shadow, transform: 200ms ease-out
  - Opacity: 150ms ease-in-out

Page Transitions:
  - Fade: 200ms ease-in-out
  - Slide: 300ms ease-out
```

### Micro-interactions

- Button press: Scale to 98%
- Card hover: Lift with shadow increase
- Input focus: Border color + ring expand
- Toggle: Smooth slide, 200ms
- Dropdown: Fade + slide, 150ms

### Loading States

```yaml
Skeleton:
  bg: "gray-200"
  animation: "pulse"
  border-radius: "base"

Spinner:
  color: "primary-500"
  size: { sm: "1rem", md: "1.5rem", lg: "2rem" }

Progress Bar:
  height: "0.5rem"
  bg: "gray-200"
  fill: "primary-500"
  border-radius: "full"
```

## Accessibility

### Standards
- WCAG 2.1 AA compliance minimum
- Keyboard navigation for all interactive elements
- Screen reader support with semantic HTML and ARIA labels
- Text contrast: 4.5:1 (normal), 3:1 (large text, UI components)
- Touch targets: 44x44px minimum on mobile

### Focus Indicators
- Always visible
- 2px offset from element
- Primary color with sufficient contrast
- Never remove outline without replacement

## Responsive Design

### Mobile-First Approach

Design and build for mobile viewports first, enhance for larger screens.

```yaml
Strategy:
  - Base styles: < 640px (mobile)
  - sm+: ≥ 640px (mobile landscape)
  - md+: ≥ 768px (tablet)
  - lg+: ≥ 1024px (desktop)
  - xl+: ≥ 1280px (large desktop)

Progressive Enhancement:
  - Single-column → multi-column at md+
  - Expand spacing on larger screens
  - Reveal additional UI elements progressively
```

### Component Responsiveness

- Navigation: Hamburger < md, full nav ≥ md
- Sidebar: Collapsed < lg, expanded ≥ lg
- Tables: Horizontal scroll < md, full ≥ md
- Forms: Single column < md, multi-column ≥ md
- Modals: Full screen < sm, centered ≥ sm

## Dark Mode

```yaml
Colors:
  background:
    primary: "gray-900"
    secondary: "gray-800"

  text:
    primary: "gray-100"
    secondary: "gray-300"

  borders:
    default: "gray-700"

  brand:
    # Use lighter variants in dark mode
    primary: "primary-400"

Contrast:
  - Maintain WCAG AA ratios
  - Test all components in both modes
  - Reduce pure white/black (use gray-100/900)
  - Adjust shadows with lighter tones

Implementation:
  - Theme toggle with localStorage persistence
  - Respect OS dark mode preference by default
  - 150ms transition on theme change
```

## Design Tokens

```yaml
Implementation:
  # CSS Custom Properties example
  :root {
    --color-primary: #0066CC;
    --space-4: 1rem;
    --font-size-base: 1rem;
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  }

Naming Convention:
  # Pattern: [category]-[property]-[variant]
  # Examples:
  # - color-primary-500
  # - spacing-container-padding
  # - typography-heading-large
```

## References

### Design Tools
- Design software: [Figma/Sketch/etc.]
- Icon library: [Heroicons/Lucide/etc.]
- Prototype tool: [Link]

### External Resources
- [Tailwind CSS](https://tailwindcss.com/)
- [Material Design](https://material.io/)
- [Apple HIG](https://developer.apple.com/design/)

### Related Documentation
- Design assets: `docs/project/design/`
- ADRs: `docs/project/adrs/`
- Writing style: `docs/project/writing-style.md` (optional)

## Maintenance

### Updating This Document

**When to Update**:
- Adding new components or variants
- Changing design tokens (colors, spacing, typography)
- Updating interaction patterns or animations
- Modifying accessibility standards
- Adding dark mode specifications

**How to Update**:

1. **Component Implementations** - Update directly as you build
   - When implementing a new component, add its spec here
   - When modifying existing components, update the spec
   - Keep this document in sync with actual implementation

2. **Strategic Design Decisions** - Use `/adr` command
   - Choosing a design framework (Tailwind, Material UI, custom)
   - Selecting accessibility standards or tooling
   - Major design system architecture changes
   - Design token structure decisions

   Example:
   ```bash
   /adr "design system framework selection"
   ```

   This creates an ADR documenting the decision and updates this design-system.md file.

3. **Review Cadence**:
   - Quarterly design system reviews
   - After major feature releases
   - When design patterns drift from documentation

**Communication**: Announce significant updates to team via [your communication channel]

### AI Assistant Instructions

**When implementing UI**:
1. **Always reference this document first** for colors, spacing, typography
2. **Follow component specifications exactly** - don't invent new patterns
3. **Update this document** when adding new components or variants
4. **Use design tokens** - never hardcode values
5. **Maintain accessibility standards** - proper contrast, semantic HTML, ARIA labels
6. **Test all breakpoints** - verify responsive behavior
7. **Check dark mode** - ensure components work in both themes
8. **Ask before creating new patterns** - propose additions before implementing

**For strategic design decisions** (framework choice, accessibility approach, token structure):
```bash
/adr "design decision topic"
```

The `/adr` command will:
- Create an ADR documenting the decision and rationale
- Update this design-system.md file with the chosen approach
- Ensure decisions are tracked with context and consequences
