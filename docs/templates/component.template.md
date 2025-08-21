# {{COMPONENT_NAME}} Component

**Created**: {{CREATED}}
**Last Updated**: {{LAST_UPDATED}}
**Status**: {{STATUS}}
**Target Audience**: {{TARGET_AUDIENCE}}
**Component Type**: {{COMPONENT_TYPE}}

## Overview

The {{COMPONENT_NAME}} component provides {{COMPONENT_PURPOSE}} functionality. It is designed to be {{COMPONENT_CHARACTERISTICS}} and follows the established design system patterns.

## Usage

### Basic Usage

```tsx
import { {{COMPONENT_NAME}} } from './{{COMPONENT_NAME}}';

function ExampleUsage() {
  return (
    <{{COMPONENT_NAME}}
      {{REQUIRED_PROP}}="{{EXAMPLE_VALUE}}"
      {{OPTIONAL_PROP}}={{{EXAMPLE_OPTIONAL_VALUE}}}
    />
  );
}
```

### Advanced Usage

```tsx
import { {{COMPONENT_NAME}} } from './{{COMPONENT_NAME}}';

function AdvancedExample() {
  const [state, setState] = useState({{INITIAL_STATE}});
  
  const handleAction = ({{ACTION_PARAMS}}) => {
    // Handle component interaction
    setState({{NEW_STATE}});
  };

  return (
    <{{COMPONENT_NAME}}
      {{REQUIRED_PROP}}="{{EXAMPLE_VALUE}}"
      {{OPTIONAL_PROP}}={{{EXAMPLE_OPTIONAL_VALUE}}}
      {{EVENT_HANDLER}}={handleAction}
      {{CONFIG_PROP}}={{
        {{CONFIG_OPTION_1}}: {{CONFIG_VALUE_1}},
        {{CONFIG_OPTION_2}}: {{CONFIG_VALUE_2}}
      }}
    />
  );
}
```

## Props API

### Required Props

```typescript
interface {{COMPONENT_NAME}}Props {
  /** {{REQUIRED_PROP_DESCRIPTION}} */
  {{REQUIRED_PROP}}: {{REQUIRED_PROP_TYPE}};
  
  /** {{REQUIRED_PROP_2_DESCRIPTION}} */
  {{REQUIRED_PROP_2}}: {{REQUIRED_PROP_2_TYPE}};
}
```

### Optional Props

```typescript
interface {{COMPONENT_NAME}}OptionalProps {
  /** {{OPTIONAL_PROP_DESCRIPTION}} (default: {{DEFAULT_VALUE}}) */
  {{OPTIONAL_PROP}}?: {{OPTIONAL_PROP_TYPE}};
  
  /** {{OPTIONAL_PROP_2_DESCRIPTION}} */
  {{OPTIONAL_PROP_2}}?: {{OPTIONAL_PROP_2_TYPE}};
  
  /** Custom CSS classes for styling customization */
  className?: string;
  
  /** Custom styles object */
  style?: React.CSSProperties;
  
  /** Test ID for testing purposes */
  testId?: string;
}
```

### Event Handlers

```typescript
interface {{COMPONENT_NAME}}Events {
  /** Called when {{EVENT_1_DESCRIPTION}} */
  {{EVENT_HANDLER_1}}?: ({{EVENT_1_PARAMS}}) => void;
  
  /** Called when {{EVENT_2_DESCRIPTION}} */
  {{EVENT_HANDLER_2}}?: ({{EVENT_2_PARAMS}}) => void;
  
  /** Called when component state changes */
  onChange?: (newState: {{STATE_TYPE}}) => void;
}
```

## Component Architecture

### Component Structure

```mermaid
graph TD
    A[{{COMPONENT_NAME}}] --> B[{{SUB_COMPONENT_1}}]
    A --> C[{{SUB_COMPONENT_2}}]
    A --> D[{{SUB_COMPONENT_3}}]
    
    B --> E[{{CHILD_COMPONENT_1}}]
    C --> F[{{CHILD_COMPONENT_2}}]
    
    A --> G[Custom Hooks]
    G --> H[{{HOOK_1}}]
    G --> I[{{HOOK_2}}]
```

### State Management

```typescript
interface {{COMPONENT_NAME}}State {
  {{STATE_PROPERTY_1}}: {{STATE_TYPE_1}};
  {{STATE_PROPERTY_2}}: {{STATE_TYPE_2}};
  loading: boolean;
  error: Error | null;
}

// State management approach
const [state, setState] = useState<{{COMPONENT_NAME}}State>({
  {{STATE_PROPERTY_1}}: {{INITIAL_VALUE_1}},
  {{STATE_PROPERTY_2}}: {{INITIAL_VALUE_2}},
  loading: false,
  error: null
});
```

### Custom Hooks

#### {{HOOK_NAME}}
```typescript
function {{HOOK_NAME}}({{HOOK_PARAMS}}) {
  const [{{HOOK_STATE}}, set{{HOOK_STATE}}] = useState({{HOOK_INITIAL_VALUE}});
  
  const {{HOOK_METHOD}} = useCallback(({{METHOD_PARAMS}}) => {
    // Hook implementation
  }, [{{HOOK_DEPENDENCIES}}]);
  
  return {
    {{HOOK_STATE}},
    {{HOOK_METHOD}},
    // Other returned values
  };
}
```

## Styling

### CSS Classes

```css
/* {{COMPONENT_NAME}} base styles */
.{{COMPONENT_NAME_KEBAB}} {
  /* Base component styles */
}

.{{COMPONENT_NAME_KEBAB}}--{{VARIANT_1}} {
  /* Variant 1 styles */
}

.{{COMPONENT_NAME_KEBAB}}--{{VARIANT_2}} {
  /* Variant 2 styles */
}

.{{COMPONENT_NAME_KEBAB}}__{{ELEMENT_1}} {
  /* Sub-element styles */
}
```

### Styling Approach
- **Method**: {{STYLING_APPROACH}}
- **Theme Integration**: {{THEME_INTEGRATION}}
- **Responsive Design**: {{RESPONSIVE_STRATEGY}}
- **Dark Mode Support**: {{DARK_MODE_SUPPORT}}

### Design Tokens
```typescript
const {{COMPONENT_NAME}}Tokens = {
  colors: {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    accent: 'var(--color-accent)'
  },
  spacing: {
    small: 'var(--spacing-sm)',
    medium: 'var(--spacing-md)',
    large: 'var(--spacing-lg)'
  },
  typography: {
    heading: 'var(--font-heading)',
    body: 'var(--font-body)'
  }
};
```

## Accessibility

### WCAG Compliance
- **Level**: {{WCAG_LEVEL}}
- **Keyboard Navigation**: {{KEYBOARD_SUPPORT}}
- **Screen Reader Support**: {{SCREEN_READER_SUPPORT}}
- **Focus Management**: {{FOCUS_MANAGEMENT}}
- **Color Contrast**: {{COLOR_CONTRAST_RATIO}}

### Accessibility Features

#### Keyboard Support
- `Tab`: {{TAB_BEHAVIOR}}
- `Enter`: {{ENTER_BEHAVIOR}}
- `Space`: {{SPACE_BEHAVIOR}}
- `Escape`: {{ESCAPE_BEHAVIOR}}
- `Arrow Keys`: {{ARROW_BEHAVIOR}}

#### ARIA Attributes
```tsx
<{{COMPONENT_NAME}}
  role="{{ARIA_ROLE}}"
  aria-label="{{ARIA_LABEL}}"
  aria-describedby="{{ARIA_DESCRIBEDBY}}"
  aria-expanded={isExpanded}
  aria-controls="{{ARIA_CONTROLS}}"
/>
```

#### Screen Reader Support
- Descriptive labels for all interactive elements
- Status announcements for dynamic content changes
- Proper heading hierarchy
- Alternative text for images and icons

## Browser Support

### Supported Browsers
{{BROWSER_SUPPORT_MATRIX}}

### Polyfills Required
- {{POLYFILL_1}}: For {{BROWSER_REQUIREMENT_1}}
- {{POLYFILL_2}}: For {{BROWSER_REQUIREMENT_2}}

## Testing

### Test Coverage
- Unit Tests: {{UNIT_TEST_COVERAGE}}%
- Integration Tests: {{INTEGRATION_TEST_COVERAGE}}%
- Accessibility Tests: {{A11Y_TEST_COVERAGE}}%

### Test Files
- `{{COMPONENT_NAME}}.test.tsx`: Unit tests
- `{{COMPONENT_NAME}}.integration.test.tsx`: Integration tests
- `{{COMPONENT_NAME}}.a11y.test.tsx`: Accessibility tests

### Test Examples

#### Unit Test Example
```typescript
import { render, screen } from '@testing-library/react';
import { {{COMPONENT_NAME}} } from './{{COMPONENT_NAME}}';

describe('{{COMPONENT_NAME}}', () => {
  it('renders with required props', () => {
    render(
      <{{COMPONENT_NAME}} {{REQUIRED_PROP}}="{{TEST_VALUE}}" />
    );
    
    expect(screen.getByRole('{{EXPECTED_ROLE}}')).toBeInTheDocument();
  });
  
  it('handles user interaction', async () => {
    const handleAction = jest.fn();
    
    render(
      <{{COMPONENT_NAME}}
        {{REQUIRED_PROP}}="{{TEST_VALUE}}"
        {{EVENT_HANDLER}}={handleAction}
      />
    );
    
    // Simulate user interaction
    await user.click(screen.getByRole('{{INTERACTIVE_ELEMENT}}'));
    
    expect(handleAction).toHaveBeenCalledWith({{EXPECTED_ARGS}});
  });
});
```

## Performance Considerations

### Performance Optimizations
- **Memoization**: {{MEMOIZATION_STRATEGY}}
- **Lazy Loading**: {{LAZY_LOADING_APPROACH}}
- **Bundle Size**: {{BUNDLE_SIZE_TARGET}}
- **Render Optimization**: {{RENDER_OPTIMIZATION}}

### Performance Metrics
- **First Paint**: < {{FIRST_PAINT_TARGET}}ms
- **Time to Interactive**: < {{TTI_TARGET}}ms
- **Bundle Size**: < {{BUNDLE_SIZE_TARGET}}KB
- **Memory Usage**: < {{MEMORY_TARGET}}MB

## Error Handling

### Error Boundaries
```tsx
interface {{COMPONENT_NAME}}ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class {{COMPONENT_NAME}}ErrorBoundary extends Component<
  PropsWithChildren<{}>,
  {{COMPONENT_NAME}}ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <{{ERROR_FALLBACK_COMPONENT}} error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### Error States
- **Loading Error**: When component fails to load data
- **Validation Error**: When user input is invalid
- **Network Error**: When API calls fail
- **Permission Error**: When user lacks required permissions

## Examples

### Complete Example
```tsx
import React, { useState, useCallback } from 'react';
import { {{COMPONENT_NAME}} } from './{{COMPONENT_NAME}}';

function {{COMPONENT_NAME}}Example() {
  const [{{STATE_VAR}}, set{{STATE_VAR}}] = useState({{INITIAL_STATE}});
  
  const handle{{ACTION}} = useCallback(({{ACTION_PARAMS}}) => {
    try {
      // Handle the action
      set{{STATE_VAR}}({{NEW_STATE}});
    } catch (error) {
      console.error('{{COMPONENT_NAME}} error:', error);
    }
  }, []);

  return (
    <div className="{{WRAPPER_CLASS}}">
      <h2>{{COMPONENT_NAME}} Example</h2>
      
      <{{COMPONENT_NAME}}
        {{REQUIRED_PROP}}="{{EXAMPLE_VALUE}}"
        {{OPTIONAL_PROP}}={{{EXAMPLE_OPTIONAL_VALUE}}}
        {{EVENT_HANDLER}}={handle{{ACTION}}}
        className="{{CUSTOM_CLASS}}"
        testId="{{TEST_ID}}"
      />
      
      {{{STATE_VAR}} && (
        <div className="result">
          Result: {JSON.stringify({{STATE_VAR}}, null, 2)}
        </div>
      )}
    </div>
  );
}

export default {{COMPONENT_NAME}}Example;
```

## Migration Guide

### From Previous Version
If migrating from a previous version of this component:

1. **Update Props**: {{PROP_MIGRATION_STEPS}}
2. **Update Styling**: {{STYLE_MIGRATION_STEPS}}  
3. **Update Event Handlers**: {{EVENT_MIGRATION_STEPS}}
4. **Test Changes**: Run existing tests and update as needed

### Breaking Changes
- **Change 1**: Description and migration path
- **Change 2**: Description and migration path

## Troubleshooting

### Common Issues

#### Issue 1: {{COMMON_ISSUE_1}}
**Symptoms**: What users experience
**Cause**: Why it happens
**Solution**:
```tsx
// Code fix or configuration change
```

#### Issue 2: {{COMMON_ISSUE_2}}
**Symptoms**: What users experience
**Cause**: Why it happens
**Solution**:
```tsx
// Code fix or configuration change
```

### Debug Information
```tsx
// Enable debug mode for troubleshooting
<{{COMPONENT_NAME}}
  {{REQUIRED_PROP}}="{{EXAMPLE_VALUE}}"
  debug={true}
  onDebug={(debugInfo) => console.log(debugInfo)}
/>
```

## Related Components

- [{{RELATED_COMPONENT_1}}](./{{RELATED_COMPONENT_1}}.md)
- [{{RELATED_COMPONENT_2}}](./{{RELATED_COMPONENT_2}}.md)
- [{{PARENT_COMPONENT}}](./{{PARENT_COMPONENT}}.md) (parent component)

## Resources

- [Design System Guidelines](../design-system.md)
- [Component Testing Guide](../testing/component-testing.md)
- [Accessibility Guidelines](../accessibility.md)
- [Styling Guide](../styling.md)

---

*Last reviewed: {{LAST_UPDATED}}*
*Component version: {{COMPONENT_VERSION}}*