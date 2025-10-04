/**
 * @template {{COMPONENT_NAME}} Component
 *
 * Purpose: {{COMPONENT_PURPOSE}}
 * Usage: {{USAGE_CONTEXT}}
 *
 * Generated from: templates/code/components/component.template.tsx
 * Created: {{CREATED_DATE}}
 * Author: {{AUTHOR_NAME}}
 */

import React from 'react';
import { {{ADDITIONAL_IMPORTS}} } from '{{IMPORT_PATH}}';

// Type definitions
interface {{COMPONENT_NAME}}Props {
  {{PROP_NAME}}: {{PROP_TYPE}}; // {{PROP_DESCRIPTION}}
  {{OPTIONAL_PROP_NAME}}?: {{OPTIONAL_PROP_TYPE}}; // {{OPTIONAL_PROP_DESCRIPTION}}
  className?: string;
  children?: React.ReactNode;
}

interface {{COMPONENT_NAME}}State {
  {{STATE_PROPERTY}}: {{STATE_TYPE}};
}

/**
 * {{COMPONENT_NAME}} - {{COMPONENT_DESCRIPTION}}
 *
 * @param props - {{COMPONENT_NAME}}Props
 * @returns JSX.Element
 */
export const {{COMPONENT_NAME}}: React.FC<{{COMPONENT_NAME}}Props> = ({
  {{PROP_NAME}},
  {{OPTIONAL_PROP_NAME}} = {{DEFAULT_VALUE}},
  className,
  children,
  ...restProps
}) => {
  // State management
  const [{{STATE_PROPERTY}}, set{{CAPITALIZED_STATE_PROPERTY}}] = React.useState<{{STATE_TYPE}}>({{INITIAL_STATE_VALUE}});

  // Effects
  React.useEffect(() => {
    // {{EFFECT_DESCRIPTION}}
    {{EFFECT_IMPLEMENTATION}}
  }, [{{EFFECT_DEPENDENCIES}}]);

  // Event handlers
  const handle{{EVENT_NAME}} = React.useCallback(({{EVENT_PARAMS}}) => {
    // {{EVENT_HANDLER_DESCRIPTION}}
    {{EVENT_HANDLER_IMPLEMENTATION}}
  }, [{{HANDLER_DEPENDENCIES}}]);

  // Computed values
  const {{COMPUTED_VALUE}} = React.useMemo(() => {
    // {{COMPUTATION_DESCRIPTION}}
    return {{COMPUTATION_LOGIC}};
  }, [{{COMPUTATION_DEPENDENCIES}}]);

  // Conditional rendering logic
  if ({{LOADING_CONDITION}}) {
    return (
      <div className="{{LOADING_CLASS_NAME}}">
        {{LOADING_CONTENT}}
      </div>
    );
  }

  if ({{ERROR_CONDITION}}) {
    return (
      <div className="{{ERROR_CLASS_NAME}}">
        {{ERROR_CONTENT}}
      </div>
    );
  }

  // Main render
  return (
    <div
      className={`{{BASE_CLASS_NAME}} ${className || ''}`}
      {{ADDITIONAL_PROPS}}
      {...restProps}
    >
      <div className="{{HEADER_CLASS_NAME}}">
        {{HEADER_CONTENT}}
      </div>

      <div className="{{MAIN_CLASS_NAME}}">
        {{MAIN_CONTENT}}
        {children}
      </div>

      <div className="{{FOOTER_CLASS_NAME}}">
        {{FOOTER_CONTENT}}
      </div>
    </div>
  );
};

// Default export
export default {{COMPONENT_NAME}};

// Type exports
export type { {{COMPONENT_NAME}}Props, {{COMPONENT_NAME}}State };

/**
 * Usage Example:
 *
 * ```tsx
 * import { {{COMPONENT_NAME}} } from './{{COMPONENT_NAME}}';
 *
 * function App() {
 *   return (
 *     <{{COMPONENT_NAME}}
 *       {{PROP_NAME}}={{EXAMPLE_PROP_VALUE}}
 *       {{OPTIONAL_PROP_NAME}}={{EXAMPLE_OPTIONAL_VALUE}}
 *       className="custom-class"
 *     >
 *       {{EXAMPLE_CHILDREN}}
 *     </{{COMPONENT_NAME}}>
 *   );
 * }
 * ```
 */