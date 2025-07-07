# Vantage WebUI Setup Guide

Complete installation and development setup guide for the Vantage WebUI project.

## Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher (comes with Node.js)
- **Git** for version control

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd vantage-webui
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# API Configuration
VITE_API_URL=http://localhost:8000

# Feature Flags (optional)
VITE_ENABLE_PROFILING=false
VITE_DEBUG_MODE=true
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

### Required Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` | `https://api.vantage.com` |

### Optional Variables

| Variable | Description | Default | Options |
|----------|-------------|---------|----------|
| `VITE_ENABLE_PROFILING` | Enable performance profiling | `false` | `true`, `false` |
| `VITE_DEBUG_MODE` | Enable debug features | `false` | `true`, `false` |

## Absolute Import Configuration

The project uses absolute imports with the `@/` prefix for cleaner import statements.

### Available Aliases

```typescript
// Instead of: import Button from '../../../components/Button'
// Use: import Button from '@/components/Button'
```

| Alias | Path | Purpose |
|-------|------|----------|
| `@/` | `src/` | Root source directory |
| `@/components` | `src/components/` | React components |
| `@/services` | `src/services/` | Business logic and API services |
| `@/hooks` | `src/hooks/` | Custom React hooks |
| `@/utils` | `src/utils/` | Utility functions |
| `@/types` | `src/types/` | TypeScript type definitions |
| `@/lib` | `src/lib/` | Third-party library wrappers |
| `@/assets` | `src/assets/` | Static assets |
| `@/store` | `src/store/` | State management (Zustand) |
| `@/api` | `src/api/` | API client modules |
| `@/config` | `src/config/` | Configuration files |
| `@/constants` | `src/constants/` | Application constants |
| `@/layouts` | `src/layouts/` | Page layouts |
| `@/pages` | `src/pages/` | Page components |

### Configuration Files

Absolute imports are configured in:
- `vite.config.ts` - Vite resolver aliases
- `tsconfig.app.json` - TypeScript path mapping
- `jest.config.cjs` - Test module name mapping

## Tailwind CSS Workflow

### Development Workflow

1. **Install Tailwind CSS IntelliSense** extension for VS Code
2. Use utility classes directly in JSX
3. Tailwind processes classes automatically during development
4. Hot reloading updates styles instantly

### Custom Color Palette

The project includes a comprehensive enterprise color palette:

```javascript
// Primary (Blue) - Main actions and branding
text-primary-500 bg-primary-600 border-primary-400

// Secondary (Gray) - Secondary elements and text
text-secondary-600 bg-secondary-100 border-secondary-300

// Accent (Green) - Success states and positive actions
text-accent-600 bg-accent-100 border-accent-400

// Warning (Amber) - Caution and warning states
text-warning-600 bg-warning-100 border-warning-400

// Danger (Red) - Error states and destructive actions
text-danger-600 bg-danger-100 border-danger-400
```

### Dark Mode Support

Dark mode uses Tailwind's `class` strategy:

```jsx
// Light mode
<div className="bg-white text-gray-900">

// Dark mode
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

### Custom Animations

```javascript
// Fade in animation
className="animate-fade-in"

// Slide in from left
className="animate-slide-in"

// Slide up from bottom
className="animate-slide-up"
```

### Responsive Design

```javascript
// Mobile-first approach
className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
```

## Type-Safe API Generation

The project uses OpenAPI TypeScript for automatic API type generation.

### Generate API Types

```bash
# Generate types from OpenAPI spec
npm run generate-types
```

This creates `src/types/api.ts` with type-safe API definitions.

### Usage

```typescript
import { components } from '@/types/api'

type HealthStatus = components['schemas']['HealthStatus']
type UserProfile = components['schemas']['UserProfile']
```

## Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues

# API Integration
npm run generate-types   # Generate API types from OpenAPI spec
```

## Browser Support

- **Chrome** 90+
- **Firefox** 90+
- **Safari** 14+
- **Edge** 90+

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Change port in vite.config.ts or use different port
npm run dev -- --port 3000
```

#### Module Resolution Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

#### Hot Reload Not Working
```bash
# Check if files are being watched
# Restart development server
npm run dev
```

### Performance Tips

1. **Use absolute imports** for better tree-shaking
2. **Lazy load components** with React.lazy()
3. **Optimize images** before adding to assets
4. **Use Tailwind's purge** for smaller CSS bundles
5. **Enable source maps** only in development

## Next Steps

1. Read the [Architecture Guide](./ARCHITECTURE.md)
2. Review [Development Guidelines](./DEVELOPMENT.md)
3. Check the [Deployment Guide](./DEPLOYMENT.md)
4. Explore the [Component Library](../src/components/)

## Getting Help

- Check the [troubleshooting section](#troubleshooting)
- Review existing [GitHub issues]()
- Ask questions in team chat
- Refer to the [Contributing Guide](../CONTRIBUTING.md)
