# Contributing to Vantage WebUI

Thank you for your interest in contributing to Vantage WebUI! This guide will help you get started with contributing to our modern React TypeScript application.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Git** for version control

### Fork and Clone

1. **Fork the repository** on GitHub
   - Click the "Fork" button in the top-right corner
   - This creates your own copy of the repository

2. **Clone your fork** to your local machine
   ```bash
   git clone https://github.com/YOUR_USERNAME/vantage-webui.git
   cd vantage-webui
   ```

3. **Add the upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/vantage-webui.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Branch Strategy

We follow a **Git Flow** branching model:

```
main (production-ready)
├── develop (integration branch)
│   ├── feature/your-feature-name
│   ├── bugfix/issue-description
│   └── improvement/enhancement-name
└── hotfix/urgent-fix (direct from main)
```

### Creating a Feature Branch

1. **Update your local repository**
   ```bash
   git checkout develop
   git pull upstream develop
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

   **Branch naming conventions:**
   - `feature/` - New features
   - `bugfix/` - Bug fixes
   - `improvement/` - Enhancements to existing features
   - `docs/` - Documentation updates
   - `refactor/` - Code refactoring
   - `test/` - Adding or updating tests

### Making Changes

1. **Make your changes** following our [code style guidelines](#code-style)
2. **Write or update tests** for your changes
3. **Update documentation** if necessary
4. **Test your changes** thoroughly

   ```bash
   # Run tests
   npm run test
   
   # Run linting
   npm run lint
   
   # Build the project
   npm run build
   ```

### Committing Changes

We use **Conventional Commits** for consistent commit messages:

#### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(chat): add message reactions` |
| `fix` | Bug fix | `fix(auth): resolve token refresh issue` |
| `docs` | Documentation | `docs: update API documentation` |
| `style` | Code style changes | `style: fix indentation in Button component` |
| `refactor` | Code refactoring | `refactor(store): simplify chat state logic` |
| `test` | Adding/updating tests | `test(components): add Button component tests` |
| `chore` | Maintenance tasks | `chore: update dependencies` |

#### Examples

```bash
# Feature addition
git commit -m "feat(dashboard): add real-time health monitoring"

# Bug fix
git commit -m "fix(chat): prevent duplicate messages on rapid send"

# Documentation update
git commit -m "docs(setup): add environment variable examples"

# Breaking change
git commit -m "feat(auth)!: migrate to new authentication API

BREAKING CHANGE: AuthContext API has changed, see migration guide"
```

#### Scope Guidelines

Common scopes in our project:
- `auth` - Authentication related changes
- `chat` - Chat interface and functionality
- `dashboard` - Health and performance dashboards
- `components` - UI component changes
- `store` - State management changes
- `api` - API service changes
- `types` - TypeScript type definitions

### Creating a Pull Request

1. **Push your branch** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub
   - Navigate to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template (see below)

## 📝 Pull Request Guidelines

### PR Template

When creating a pull request, please use this template:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Testing
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] I have tested the changes manually in the browser

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged and published
```

### PR Requirements

Before submitting a PR, ensure:

- [ ] **Tests pass** - All existing and new tests must pass
- [ ] **Linting passes** - Code must follow our ESLint rules
- [ ] **Build succeeds** - The project must build without errors
- [ ] **Documentation updated** - If you've changed APIs or added features
- [ ] **Type safety** - No TypeScript errors
- [ ] **Performance** - No significant performance regressions

### Code Review Process

1. **Automated Checks** - CI/CD pipeline runs automatically
2. **Peer Review** - At least one team member reviews the code
3. **Testing** - Reviewers test the changes manually if needed
4. **Approval** - PR is approved by reviewers
5. **Merge** - Maintainer merges the PR into develop branch

## 💻 Code Style Guidelines

### TypeScript

#### Type Safety First
```typescript
// ✅ Good - Explicit types
interface UserProfile {
  id: string
  email: string
  name: string
  roles: string[]
}

const createUser = (profile: UserProfile): User => {
  // implementation
}

// ❌ Avoid - any types
const createUser = (profile: any): any => {
  // implementation
}
```

#### Naming Conventions
```typescript
// ✅ Good - PascalCase for types/interfaces/components
interface ApiResponse<T> {}
const ButtonComponent: React.FC = () => {}

// ✅ Good - camelCase for variables/functions
const fetchUserData = async (userId: string) => {}
const isAuthenticated = true

// ✅ Good - UPPER_SNAKE_CASE for constants
const API_ENDPOINTS = {
  HEALTH: '/health',
  CHAT: '/chat'
} as const
```

### React Components

#### Function Components
```typescript
// ✅ Good - Proper component structure
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

#### Hooks Usage
```typescript
// ✅ Good - Custom hooks with proper typing
export const useApi<T>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // implementation
  }, [endpoint])

  return { data, loading, error }
}
```

### CSS/Tailwind

#### Utility-First Approach
```jsx
// ✅ Good - Use Tailwind utilities
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

### File Organization

#### Import Order
```typescript
// 1. React and React-related imports
import React, { useState, useEffect, useCallback } from 'react'

// 2. Third-party library imports
import { useRouter } from 'next/router'
import axios from 'axios'

// 3. Internal imports (absolute paths)
import { Button } from '@/components/Button'
import { useAuth } from '@/auth'
import { api } from '@/services/api'
import type { User } from '@/types/api'

// 4. Relative imports
import './Component.css'
```

#### Export Patterns
```typescript
// ✅ Good - Named exports for components
export const Button: React.FC<ButtonProps> = (props) => {}
export const Input: React.FC<InputProps> = (props) => {}

// ✅ Good - Default export for main component in file
// (only when file contains single component)
const Dashboard: React.FC = () => {}
export default Dashboard

// ✅ Good - Re-exports in index files
export { Button } from './Button'
export { Input } from './Input'
export type { ButtonProps, InputProps } from './types'
```

## 🧪 Testing Guidelines

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
    expect(button).toHaveClass('btn-danger')
  })
})
```

#### Store Testing
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

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --coverage

# Run specific test file
npm run test -- Button.test.tsx

# Run tests matching pattern
npm run test -- --testNamePattern="should render"
```

## 📚 Documentation

### Code Documentation

#### JSDoc Comments
```typescript
/**
 * Fetches user profile data from the API
 * @param userId - The unique identifier for the user
 * @param options - Additional fetch options
 * @returns Promise that resolves to user profile data
 * @throws {ApiError} When the API request fails
 * 
 * @example
 * ```typescript
 * const profile = await fetchUserProfile('user-123')
 * console.log(profile.email)
 * ```
 */
export const fetchUserProfile = async (
  userId: string,
  options?: RequestOptions
): Promise<UserProfile> => {
  // implementation
}
```

#### Component Documentation
```typescript
/**
 * A flexible button component with multiple variants and sizes
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = (props) => {
  // implementation
}
```

### README Updates

When adding new features, update relevant documentation:

- **README.md** - Main project overview
- **docs/SETUP.md** - Installation and setup
- **docs/DEVELOPMENT.md** - Development workflow
- **docs/ARCHITECTURE.md** - System architecture
- Component-specific README files

## 🐛 Reporting Issues

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Check the latest version** to see if the issue is resolved
3. **Try to reproduce** the issue with minimal steps

### Issue Template

When reporting bugs, please include:

```markdown
## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear description of what you expected to happen.

## Actual Behavior
A clear description of what actually happened.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- OS: [e.g. macOS 12.0]
- Browser: [e.g. Chrome 95.0]
- Node.js version: [e.g. 18.17.0]
- npm version: [e.g. 8.19.0]

## Additional Context
Add any other context about the problem here.
```

## 🌟 Feature Requests

### Feature Request Template

```markdown
## Feature Description
A clear and concise description of the feature you'd like to see.

## Problem/Use Case
Explain the problem you're trying to solve or the use case for this feature.

## Proposed Solution
Describe the solution you'd like to see implemented.

## Alternatives Considered
Describe any alternative solutions or features you've considered.

## Additional Context
Add any other context, mockups, or examples about the feature request.
```

## 🏆 Recognition

Contributors who make significant contributions will be:

- Added to the project's CONTRIBUTORS.md file
- Mentioned in release notes
- Recognized in team meetings and communications

## 📞 Getting Help

If you need help with contributing:

1. **Check the documentation** in the `docs/` folder
2. **Search existing issues** and discussions
3. **Join our community** channels (if available)
4. **Create a discussion** on GitHub for questions

## 📄 License

By contributing to Vantage WebUI, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to Vantage WebUI!** 🎉

Your contributions help make this project better for everyone. We appreciate your time and effort in improving the codebase, fixing bugs, adding features, and enhancing documentation.
