---
version: "1.0.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "accepted"
target_audience: ["developers", "ai-assistants", "frontend-specialist"]
document_type: "adr"
tags: ["frontend", "react", "nextjs", "state-management", "testing"]
---

# ADR-003: Frontend Architecture and State Management

## Status

**ACCEPTED** - 2025-09-17

## Context and Problem Statement

With NextJS selected as our full-stack framework (ADR-001), we need to define the frontend architecture, state management approach, component structure, and testing strategy for the multi-user todo application.

### Requirements
- **Multi-user State Management**: Handle user switching and isolated data
- **Modern React Patterns**: Demonstrate contemporary development practices
- **Template Validation**: Exercise frontend-specialist and test-engineer agents
- **Type Safety**: Comprehensive TypeScript integration
- **Testing Strategy**: Validate component behavior and user workflows
- **Performance**: Optimize for Core Web Vitals and development experience

### Constraints
- Must work within NextJS App Router architecture
- Should balance complexity with educational value
- Cannot over-engineer for simple todo application scope
- Must demonstrate proper separation of concerns

## Decision Drivers

1. **Agent Exercise**: Frontend-specialist and test-engineer validation requirements
2. **Modern Patterns**: Showcase contemporary React development practices
3. **State Complexity**: Multi-user data isolation and management
4. **Learning Value**: Clear, maintainable patterns for template users
5. **Performance**: Optimize bundle size and runtime performance
6. **Testing Coverage**: Comprehensive validation of component behavior

## Considered Options

### State Management Options

#### Option 1: React Built-in (useState + useContext + useReducer) - SELECTED
- **Pros**: No external dependencies, demonstrates native React patterns, sufficient for scope
- **Cons**: More boilerplate for complex operations, manual optimization needed
- **Verdict**: Appropriate complexity for demo app, showcases modern React capabilities

#### Option 2: Zustand
- **Pros**: Lightweight, excellent TypeScript support, minimal boilerplate
- **Cons**: External dependency, may be overkill for simple state needs
- **Verdict**: Good option but adds unnecessary complexity for current scope

#### Option 3: Redux Toolkit
- **Pros**: Industry standard, powerful debugging, predictable state updates
- **Cons**: Significant boilerplate, complex setup, excessive for todo app
- **Verdict**: Over-engineered for template validation goals

### Component Architecture Options

#### Option 1: Hybrid RSC/Client Components (SELECTED)
- **Pros**: Demonstrates modern NextJS patterns, performance benefits, SEO optimization
- **Cons**: Requires careful client/server boundary management
- **Verdict**: Showcases cutting-edge React architecture effectively

#### Option 2: Pure Client Components
- **Pros**: Simpler mental model, traditional React patterns
- **Cons**: Misses opportunity to demonstrate RSC patterns
- **Verdict**: Less educational value for modern development

## Decisions

### State Management Architecture
**React built-in state management with Context + useReducer pattern**

#### Context Structure
```typescript
// Multi-context architecture for separation of concerns
- AuthContext: User authentication and switching
- TodoContext: Todo CRUD operations and filtering
- UIContext: Loading states, notifications, modal management
```

#### State Management Patterns
```typescript
// Custom hooks for business logic encapsulation
const useAuth = () => { /* user management logic */ }
const useTodos = (userId: string) => { /* todo operations */ }
const useLocalStorage = () => { /* persistence layer */ }

// Reducer pattern for complex state transitions
const todoReducer = (state: TodoState, action: TodoAction) => { /* ... */ }
```

### Component Architecture
**Hybrid Server/Client Component Strategy**

#### Server Components (RSC)
- Authentication pages (login/register)
- Static layouts and navigation
- Initial data loading and SEO pages
- User profile and settings pages

#### Client Components
- Interactive todo management
- Real-time form interactions
- Local storage operations
- Dynamic filtering and sorting

### Project Structure
```
app/
├── (auth)/              # Auth route group
│   ├── login/          # Server component pages
│   └── register/
├── dashboard/          # Main application
│   ├── page.tsx       # Server component entry
│   └── components/    # Client components
├── api/               # API routes
└── layout.tsx         # Root layout (RSC)

components/
├── ui/                # Reusable UI components
├── features/          # Feature-specific components
│   ├── auth/         # Authentication components
│   ├── todos/        # Todo management
│   └── users/        # User management
└── providers/         # Context providers

lib/
├── hooks/            # Custom hooks
├── utils/            # Utility functions
├── types/            # TypeScript definitions
└── validations/      # Zod schemas
```

### Styling Strategy
**Tailwind CSS with Component Composition**

```typescript
// Utility-first styling with component patterns
const Button = ({ variant, size, children, ...props }) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium",
        variants[variant],
        sizes[size]
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

### Testing Strategy
**Vitest + Testing Library for Comprehensive Coverage**

#### Testing Layers
```typescript
// Unit Tests - Component behavior
test('todo item toggles completion state', () => {
  render(<TodoItem todo={mockTodo} onToggle={mockToggle} />)
  fireEvent.click(screen.getByRole('checkbox'))
  expect(mockToggle).toHaveBeenCalledWith(mockTodo.id)
})

// Integration Tests - User workflows
test('user can create and complete todos', async () => {
  render(<TodoApp />)
  // Multi-step user interaction testing
})

// Hook Tests - Business logic
test('useTodos manages todo state correctly', () => {
  const { result } = renderHook(() => useTodos('user-123'))
  // Hook behavior validation
})
```

## Rationale

### Why Built-in State Management
1. **Appropriate Complexity**: Todo app state is not complex enough to justify external libraries
2. **Educational Value**: Demonstrates modern React patterns (Context + useReducer)
3. **Performance**: No external bundle overhead, native React optimizations
4. **Template Reference**: Shows how to structure state without dependencies
5. **Agent Exercise**: Frontend-specialist can demonstrate state architecture patterns

### Why Hybrid RSC/Client Strategy
1. **Modern Patterns**: Showcases cutting-edge NextJS App Router capabilities
2. **Performance Benefits**: Server rendering for static content, client for interactivity
3. **SEO Optimization**: Proper server rendering for public pages
4. **Educational Value**: Demonstrates proper client/server boundary decisions
5. **Template Validation**: Exercises frontend-specialist decision-making

### Why Tailwind CSS
1. **Rapid Development**: Utility-first approach accelerates component creation
2. **Consistency**: Design system built into CSS framework
3. **Bundle Optimization**: Automatic unused style elimination
4. **Community Standard**: Wide adoption in modern React applications
5. **Customization**: Easy theming and component composition patterns

## Implementation Details

### Context Provider Architecture
```typescript
// App-level provider composition
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TodoProvider>
        <UIProvider>
          {children}
        </UIProvider>
      </TodoProvider>
    </AuthProvider>
  )
}

// Context with reducer pattern
const TodoContext = createContext<TodoContextType | null>(null)

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState)

  const value = {
    ...state,
    addTodo: (todo: CreateTodo) => dispatch({ type: 'ADD_TODO', payload: todo }),
    toggleTodo: (id: string) => dispatch({ type: 'TOGGLE_TODO', payload: id }),
    deleteTodo: (id: string) => dispatch({ type: 'DELETE_TODO', payload: id }),
  }

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}
```

### Custom Hook Patterns
```typescript
// Business logic encapsulation
export function useTodos(userId: string) {
  const context = useContext(TodoContext)
  if (!context) throw new Error('useTodos must be used within TodoProvider')

  // Filter todos for current user
  const userTodos = context.todos.filter(todo => todo.userId === userId)

  // Memoized operations
  const addTodo = useCallback((todo: CreateTodo) => {
    context.addTodo({ ...todo, userId })
  }, [context.addTodo, userId])

  return {
    todos: userTodos,
    addTodo,
    toggleTodo: context.toggleTodo,
    deleteTodo: context.deleteTodo,
    isLoading: context.isLoading
  }
}
```

### Component Composition Patterns
```typescript
// Feature-based component organization
export function TodoList({ userId }: { userId: string }) {
  const { todos, isLoading } = useTodos(userId)

  if (isLoading) return <TodoListSkeleton />

  return (
    <div className="space-y-2">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  )
}

// Reusable UI components
export function TodoItem({ todo }: { todo: Todo }) {
  const { toggleTodo, deleteTodo } = useTodos(todo.userId)

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => toggleTodo(todo.id)}
          />
          <span className={cn(
            "text-sm",
            todo.completed && "line-through text-muted-foreground"
          )}>
            {todo.title}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteTodo(todo.id)}
        >
          Delete
        </Button>
      </div>
    </Card>
  )
}
```

## Consequences

### Positive
- **Modern React Patterns**: Demonstrates contemporary development practices effectively
- **Type Safety**: Comprehensive TypeScript integration with Context and hooks
- **Performance Optimization**: RSC benefits and proper client/server boundaries
- **Testing Coverage**: Comprehensive component and integration testing capabilities
- **Educational Value**: Clear patterns for developers evaluating the template
- **Agent Exercise**: Meaningful work for frontend-specialist and test-engineer agents

### Negative
- **Context Complexity**: Multiple contexts require careful provider composition
- **RSC Learning Curve**: Client/server boundary decisions add complexity
- **Boilerplate**: More setup than external state management libraries
- **Performance Optimization**: Manual optimization vs automatic library features

### Neutral
- **Bundle Size**: No external state management dependencies, but React overhead
- **Development Experience**: Good tooling but requires understanding of patterns
- **Maintenance**: More custom code vs library abstractions

## Validation and Monitoring

### Success Criteria
- [ ] User switching isolates todo data correctly
- [ ] Component tests cover all user interaction scenarios
- [ ] RSC/Client boundary decisions demonstrate performance benefits
- [ ] Custom hooks provide clean, reusable business logic
- [ ] TypeScript integration eliminates runtime state errors

### Performance Targets
- **Bundle Size**: < 500KB for client-side JavaScript
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Test Coverage**: > 90% component and hook coverage
- **Type Coverage**: 100% TypeScript coverage with strict mode

### Review Triggers
- If state management becomes too complex for template scope
- If RSC patterns prove too difficult for template users
- If testing strategy doesn't adequately cover user workflows
- If performance targets are not met consistently

## Related Decisions
- [ADR-001: NextJS with SQLite for Full-Stack Application](./ADR-001-nextjs-sqlite-fullstack.md)
- [ADR-002: Prisma ORM Selection](./ADR-002-prisma-orm-selection.md)
- [ADR-004: Security Architecture](./ADR-004-security-architecture.md)

## References
- [React Documentation - State Management](https://react.dev/learn/managing-state)
- [NextJS App Router Documentation](https://nextjs.org/docs/app)
- [Frontend-specialist Agent Consultation](#) - Architecture recommendations
- [Testing Library Best Practices](https://testing-library.com/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)