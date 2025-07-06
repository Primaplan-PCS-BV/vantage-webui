# Vantage WebUI Setup

This project was scaffolded with Vite, React, TypeScript, and Tailwind CSS.

## Features

- **Vite** - Lightning fast build tool
- **React 18** with TypeScript
- **Tailwind CSS** - Utility-first CSS framework with:
  - Enterprise color palette (primary, secondary, accent, warning, danger)
  - Dark mode support (`class` strategy)
  - Custom animations and utilities
- **Absolute imports** configured with `@/` prefix

## Absolute Import Aliases

The following aliases are configured in both TypeScript and Vite:

- `@/` - src directory
- `@/components` - React components
- `@/services` - Business logic and API services
- `@/hooks` - Custom React hooks
- `@/utils` - Utility functions
- `@/types` - TypeScript type definitions
- `@/lib` - Third-party library wrappers
- `@/assets` - Static assets
- `@/store` - State management
- `@/api` - API client modules
- `@/config` - Configuration files
- `@/constants` - Application constants
- `@/layouts` - Page layouts
- `@/pages` - Page components

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Color Palette

The project includes a comprehensive enterprise color palette:

- **Primary** - Blue shades for main actions
- **Secondary** - Gray shades for secondary elements
- **Accent** - Green shades for success states
- **Warning** - Yellow/amber shades for warnings
- **Danger** - Red shades for errors
- **Gray** - Neutral grays for UI elements

All colors include shades from 50 (lightest) to 950 (darkest).

## Dark Mode

Dark mode is configured using Tailwind's `class` strategy. Toggle dark mode by adding the `dark` class to the `<html>` element.

## Custom Styles

- Button components with variants (primary, secondary, accent)
- Custom animations (fade-in, slide-in, slide-up)
- Utility classes for hiding scrollbars
- Focus styles for accessibility
