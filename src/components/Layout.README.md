# Layout Component

A responsive layout component for the Vantage AI web application featuring a sidebar navigation and header with full accessibility support.

## Features

### Responsive Design
- **Desktop**: Fixed sidebar on the left with sticky positioning
- **Mobile**: Collapsible sidebar with hamburger menu
- **Breakpoint**: Responsive at `md` (768px) using Tailwind's breakpoint system

### Navigation Structure
- **Sidebar Navigation**: Contains primary navigation links
  - Chat (with MessageSquare icon)
  - Performance (with BarChart3 icon)
  - Health (with Heart icon)
  - Docs (with FileText icon)
- **Header**: Contains company branding and mobile menu toggle
- **User Section**: Bottom of sidebar shows user profile placeholder

### Accessibility Features

#### ARIA Attributes
- `aria-expanded` on hamburger button indicates sidebar state
- `aria-controls` links hamburger to sidebar
- `aria-label` provides descriptive labels for screen readers
- `aria-current="page"` indicates active navigation item
- `role` attributes for semantic structure

#### Keyboard Navigation
- **Escape key**: Closes mobile sidebar and returns focus to hamburger button
- **Tab navigation**: All interactive elements are keyboard accessible
- **Focus management**: First focusable element in sidebar receives focus when opened on mobile
- **Focus indicators**: Visible focus rings on all interactive elements

#### Screen Reader Support
- Descriptive labels for all interactive elements
- Icons marked with `aria-hidden="true"` to prevent redundant announcements
- Semantic HTML structure with proper heading hierarchy

### Mobile Features
- **Hamburger menu**: Toggle button only visible on mobile
- **Overlay backdrop**: Semi-transparent overlay when sidebar is open
- **Click outside to close**: Clicking overlay or outside sidebar closes it
- **Smooth transitions**: CSS transitions for opening/closing animations

### Styling
- Built with Tailwind CSS utility classes
- Consistent color scheme using Tailwind's gray palette
- Blue accent color for active states and focus indicators
- Smooth hover transitions on navigation items

## Usage

```tsx
import { Layout } from '@/components'

function MyApp() {
  return (
    <Layout>
      {/* Your page content goes here */}
      <h1>Welcome to Vantage AI</h1>
      <p>This content will appear in the main area.</p>
    </Layout>
  )
}
```

## Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | ReactNode | Yes | Content to render in the main area |

## Customization

The component uses standard Tailwind classes and can be customized by:
1. Modifying the color scheme in the component
2. Adjusting breakpoints for different responsive behavior
3. Adding or removing navigation items in the `navigation` array
4. Updating icons from the lucide-react library

## Dependencies

- React (with hooks: useState, useRef, useEffect)
- lucide-react (for icons)
- Tailwind CSS (for styling)

## Browser Support

The component uses modern CSS features and JavaScript APIs:
- CSS Grid and Flexbox
- CSS Custom Properties (for Tailwind)
- ES6+ JavaScript features
- Modern event listeners

Tested and working in all modern browsers (Chrome, Firefox, Safari, Edge).
