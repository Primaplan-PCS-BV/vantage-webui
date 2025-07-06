# Development Guide

Development workflow, coding standards, and best practices for the Vantage WebUI project.

## 🏗️ Development Workflow

### Branch Strategy

We follow a **Git Flow** branching model:

```
main
├── develop
│   ├── feature/auth-improvements
│   ├── feature/dashboard-charts
│   └── feature/user-preferences
├── release/v1.0.0
└── hotfix/urgent-security-fix
```

#### Branch Types

| Branch Type | Purpose | Naming Convention | Example |
|-------------|---------|-------------------|---------|
| `main` | Production-ready code | `main` | `main` |
| `develop` | Integration branch | `develop` | `develop` |
| `feature/*` | New features | `feature/description` | `feature/chat-interface` |
| `bugfix/*` | Bug fixes | `bugfix/description` | `bugfix/auth-token-refresh` |
| `hotfix/*` | Critical production fixes | `hotfix/description` | `hotfix/security-vulnerability` |
| `release/*` | Release preparation | `release/version` | `release/v1.2.0` |

#### Workflow Steps

1. **Start a Feature**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Work on Feature**
   ```bash
   # Make changes
   git add .
   git commit -m "feat: add user authentication"
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Target: `develop` branch
   - Fill out PR template
   - Request code review
   - Ensure CI passes

4. **Merge to Develop**
   ```bash
   # After approval
   git checkout develop
   git pull origin develop
   git branch -d feature/your-feature-name
   ```

## 📝 Code Standards

### TypeScript Guidelines

#### Strict Type Safety
```typescript
// ✅ Good - Explicit types
interface UserProfile {
  id: string
  email: string
  name: string
  roles: string[]
}

const user: UserProfile = {
  id: '123',
  email: 'user@example.com',
  name: 'John Doe',
  roles: ['user']
}

// ❌ Avoid - any types
const user: any = { /* ... */ }
```

#### Naming Conventions
```typescript
// ✅ Good - PascalCase for types/interfaces
interface ApiResponse<T> {
  data: T
  status: number
}

// ✅ Good - camelCase for variables/functions
const fetchUserData = async (userId: string): Promise<UserProfile> => {
  // implementation
}

// ✅ Good - UPPER_SNAKE_CASE for constants
const API_ENDPOINTS = {
  HEALTH: '/health',
  PERFORMANCE: '/performance'
} as const
```

#### Function Components
```typescript
// ✅ Good - Props interface
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### React Best Practices

#### Component Structure
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react'
import { SomeApi } from '@/services/api'
import { Button } from '@/components/Button'

// 2. Types/Interfaces
interface ComponentProps {
  // props definition
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 4. State
  const [state, setState] = useState<StateType>(initialState)
  
  // 5. Effects
  useEffect(() => {
    // effect logic
  }, [dependency])
  
  // 6. Event handlers
  const handleClick = useCallback(() => {
    // handler logic
  }, [dependency])
  
  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

#### Custom Hooks
```typescript
// ✅ Good - Custom hook with proper typing
export const useApi<T>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await api.get<T>(endpoint)
        setData(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint])

  return { data, loading, error }
}
```

### CSS/Tailwind Guidelines

#### Utility-First Approach
```jsx
// ✅ Good - Utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h1 className="text-xl font-semibold text-gray-900">Title</h1>
  <button className="px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md">
    Action
  </button>
</div>

// ❌ Avoid - Custom CSS when utilities exist
<div className="custom-header">
  <h1 className="custom-title">Title</h1>
  <button className="custom-button">Action</button>
</div>
```

#### Responsive Design
```jsx
// ✅ Good - Mobile-first responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <div key={item.id} className="p-4 bg-white rounded-lg">
      {/* content */}
    </div>
  ))}
</div>
```

#### Component Variants
```typescript
// ✅ Good - Variant-based styling
const buttonVariants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  danger: 'bg-danger-600 hover:bg-danger-700 text-white'
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium ${buttonVariants[variant]}`}
      {...props}
    />
  )
}
```

## 🧪 Testing Strategy

### Testing Framework Setup

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --coverage
```

### Unit Testing

#### Component Testing
```typescript
// Button.test.tsx
import { render, fireEvent, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies correct variant styles', () => {
    render(<Button variant="danger">Delete</Button>)
    const button = screen.getByText('Delete')
    expect(button).toHaveClass('bg-danger-600')
  })
})
```

#### Custom Hook Testing
```typescript
// useApi.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useApi } from './useApi'

// Mock the API
jest.mock('@/services/api')

describe('useApi Hook', () => {
  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' }
    ;(api.get as jest.Mock).mockResolvedValue({ data: mockData })

    const { result } = renderHook(() => useApi<typeof mockData>('/test'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBeNull()
  })
})
```

### Store Testing (Zustand)
```typescript
// useChatStore.test.ts
import { act, renderHook } from '@testing-library/react'
import { useChatStore } from './useChatStore'

describe('Chat Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useChatStore.getState().clearMessages()
  })

  it('adds messages correctly', () => {
    const { result } = renderHook(() => useChatStore())

    act(() => {
      result.current.addMessage({
        id: '1',
        text: 'Hello',
        role: 'user',
        timestamp: new Date()
      })
    })

    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0].text).toBe('Hello')
  })
})
```

### Integration Testing

#### API Integration
```typescript
// api.integration.test.ts
import { api } from '@/services/api'

describe('API Integration', () => {
  it('fetches health status', async () => {
    const response = await api.getHealth()
    expect(response).toHaveProperty('status')
    expect(['healthy', 'degraded', 'unhealthy']).toContain(response.status)
  })
})
```

## 🔍 Code Quality Tools

### ESLint Configuration

Our ESLint setup includes:
- TypeScript support
- React hooks rules
- React refresh rules
- Accessibility rules (future enhancement)

#### Running ESLint
```bash
# Check for linting issues
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

#### Custom Rules
```javascript
// eslint.config.js additions
rules: {
  // Prevent unused variables (except those prefixed with _)
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  
  // Warn about any types
  '@typescript-eslint/no-explicit-any': 'warn',
  
  // Enforce consistent return types
  '@typescript-eslint/explicit-function-return-type': 'off',
}
```

### Prettier Integration

Future enhancement: Add Prettier for code formatting
```bash
# Install Prettier (when added)
npm install --save-dev prettier

# Format code
npm run format
```

### Pre-commit Hooks

Future enhancement: Add Husky for pre-commit hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "git add"]
  }
}
```

## 📦 Useful NPM Scripts

### Development Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing Scripts
```bash
# Run all tests
npm run test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test -- --coverage

# Run specific test file
npm run test -- Button.test.tsx

# Run tests matching pattern
npm run test -- --testNamePattern="should render"
```

### Quality Scripts
```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint -- --fix

# Type check without building
npx tsc --noEmit

# Check for outdated dependencies
npm outdated

# Update dependencies (careful!)
npm update
```

### API Integration Scripts
```bash
# Generate TypeScript types from OpenAPI spec
npm run generate-types

# Generate types from specific endpoint
npm run generate-types -- http://localhost:8000/openapi.json
```

### Build Analysis
```bash
# Analyze bundle size (future enhancement)
npm run build:analyze

# Check bundle for unused dependencies
npx depcheck
```

## 🚀 Storybook Integration (Planned)

Future enhancement: Component documentation and testing

### Setup (When Added)
```bash
# Install Storybook
npx storybook@latest init

# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

### Story Example
```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}
```

## 🛠️ Development Tools

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-jest"
  ]
}
```

### VS Code Settings
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### Browser Developer Tools

#### React Developer Tools
- Install React DevTools browser extension
- Use for debugging component state and props

#### Performance Profiling
```javascript
// Enable React profiling in development
import { unstable_trace as trace } from 'scheduler/tracing'

trace('ComponentName render', performance.now(), () => {
  // component logic
})
```

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)

### Testing Resources
- [Testing Library Docs](https://testing-library.com/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Patterns](https://react-testing-examples.com/)

### Code Quality
- [ESLint Rules](https://eslint.org/docs/latest/rules/)
- [TypeScript ESLint](https://typescript-eslint.io/rules/)
- [Clean Code Principles](https://clean-code-javascript.github.io/)

## 🤝 Getting Help

1. **Check Documentation** - Start with this guide and architecture docs
2. **Search Issues** - Look for existing GitHub issues
3. **Ask in Chat** - Use team communication channels
4. **Pair Programming** - Schedule sessions with team members
5. **Code Review** - Request feedback on pull requests

Remember: No question is too small, and collaboration makes us all better developers! 🚀
