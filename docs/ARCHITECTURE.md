# Vantage WebUI Architecture

## System Overview

Vantage WebUI is a modern, enterprise-grade React application built with TypeScript, providing a comprehensive interface for AI system monitoring, chat interactions, and performance analytics. The architecture follows modern frontend best practices with a focus on scalability, maintainability, and type safety.

### Key Design Principles

- **Type Safety First** - Comprehensive TypeScript usage with strict mode
- **Component-Driven Development** - Reusable, composable UI components
- **State Management** - Centralized state with Zustand for predictable data flow
- **Performance Optimized** - Code splitting, lazy loading, and optimized builds
- **Developer Experience** - Hot reloading, absolute imports, and comprehensive tooling
- **Enterprise Ready** - Authentication, security, and monitoring capabilities

## 📁 Project Structure (Folder Anatomy)

```
vantage-webui/
├── 📄 Configuration Files
│   ├── package.json              # Dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── vite.config.ts            # Vite build configuration
│   ├── tailwind.config.ts        # Tailwind CSS configuration
│   ├── eslint.config.js          # ESLint rules and settings
│   ├── jest.config.cjs           # Jest testing configuration
│   └── .env.example              # Environment variables template
│
├── 📁 docs/                      # Documentation
│   ├── SETUP.md                  # Installation and setup guide
│   ├── DEVELOPMENT.md            # Development workflow
│   ├── DEPLOYMENT.md             # Deployment instructions
│   ├── ARCHITECTURE.md           # This file - system architecture
│   └── CHAT_INTERFACE.md         # Chat system documentation
│
├── 📁 src/                       # Source code
│   ├── 🏗️ Core Application
│   │   ├── main.tsx               # Application entry point
│   │   ├── App.tsx                # Root component with routing
│   │   └── vite-env.d.ts          # Vite type definitions
│   │
│   ├── 🔐 auth/                   # Authentication system
│   │   ├── AuthContext.tsx        # Auth state management
│   │   ├── LoginPage.tsx          # Login interface
│   │   ├── ProtectedRoute.tsx     # Route protection
│   │   ├── UserPreferences.tsx    # User settings
│   │   ├── index.ts               # Module exports
│   │   └── README.md              # Auth documentation
│   │
│   ├── 🧩 components/             # Reusable UI components
│   │   ├── Layout.tsx             # Main application layout
│   │   ├── Button.tsx             # Button component with variants
│   │   ├── chat/                  # Chat-specific components
│   │   │   ├── ChatContainer.tsx  # Main chat interface
│   │   │   ├── MessageInput.tsx   # Message input form
│   │   │   ├── MessageList.tsx    # Message display list
│   │   │   └── index.ts           # Chat module exports
│   │   ├── Layout.README.md       # Layout documentation
│   │   └── index.ts               # Component exports
│   │
│   ├── 📄 pages/                  # Page components
│   │   ├── ChatPage.tsx           # AI chat interface
│   │   ├── HealthPage.tsx         # System health monitoring
│   │   ├── PerformancePage.tsx    # Performance analytics
│   │   └── index.ts               # Page exports
│   │
│   ├── 🔄 services/               # Business logic and API
│   │   ├── api.ts                 # Main API client
│   │   ├── api.example.tsx        # API usage examples
│   │   └── README.md              # Service documentation
│   │
│   ├── 🗃️ store/                  # State management (Zustand)
│   │   ├── useChatStore.ts        # Chat state management
│   │   └── __tests__/             # Store tests
│   │       └── useChatStore.test.ts
│   │
│   ├── 🏷️ types/                  # TypeScript definitions
│   │   └── api.ts                 # Generated API types
│   │
│   └── 🎨 assets/                 # Static assets
│       └── (images, fonts, etc.)
│
├── 📁 Public Files
│   ├── index.html                 # HTML template
│   └── vite.svg                   # Favicon
│
└── 📁 Generated/Build Files
    ├── dist/                      # Production build output
    ├── node_modules/              # Dependencies
    └── coverage/                  # Test coverage reports
```

### Module Organization

#### Core Application (`src/`)
- **main.tsx** - Application bootstrap with providers
- **App.tsx** - Root component with routing configuration
- **vite-env.d.ts** - Vite-specific type definitions

#### Authentication Module (`src/auth/`)
- **Modular design** - Self-contained authentication system
- **Context API** - Global auth state management
- **Route protection** - Secure route access control
- **User preferences** - Settings and theme management

#### Component Library (`src/components/`)
- **Reusable components** - Shared UI elements
- **Composable design** - Components can be combined
- **Variant support** - Multiple styles and sizes
- **TypeScript props** - Fully typed component interfaces

#### Page Components (`src/pages/`)
- **Feature-based pages** - Each page represents a major feature
- **Lazy loading ready** - Prepared for code splitting
- **Route-mapped** - Direct correlation to application routes

#### Services Layer (`src/services/`)
- **API abstraction** - Centralized API communication
- **Error handling** - Consistent error management
- **Type-safe** - Generated types from OpenAPI specs

#### State Management (`src/store/`)
- **Zustand stores** - Lightweight state management
- **Persistent state** - Local storage integration
- **Modular stores** - Feature-specific state containers

#### Type Definitions (`src/types/`)
- **Generated types** - Auto-generated from OpenAPI
- **Custom types** - Application-specific interfaces
- **Strict typing** - Comprehensive type coverage

## 🏗️ System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │    Pages    │  │ Components  │  │    Auth     │              │
│  │             │  │             │  │             │              │
│  │ • ChatPage  │  │ • Layout    │  │ • Context   │              │
│  │ • HealthPage│  │ • Button    │  │ • Login     │              │
│  │ • PerfPage  │  │ • Chat/*    │  │ • Protected │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│         │                 │                 │                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                State Management (Zustand)                  ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         ││
│  │  │ Chat Store  │  │ Auth Store  │  │ App Store   │         ││
│  │  │ • Messages  │  │ • User      │  │ • Theme     │         ││
│  │  │ • History   │  │ • Token     │  │ • Settings  │         ││
│  │  │ • Status    │  │ • Prefs     │  │ • Errors    │         ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘         ││
│  └─────────────────────────────────────────────────────────────┘│
│         │                                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   Services Layer                            ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         ││
│  │  │   API       │  │   Utils     │  │   Types     │         ││
│  │  │ • HTTP      │  │ • Helpers   │  │ • Generated │         ││
│  │  │ • WebSocket │  │ • Formatters│  │ • Custom    │         ││
│  │  │ • Auth      │  │ • Validators│  │ • Interfaces│         ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘         ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                               │
                    ┌─────────────────────┐
                    │     Network Layer   │
                    │                     │
                    │ • HTTP/HTTPS        │
                    │ • WebSocket         │
                    │ • Error Handling    │
                    │ • Retry Logic       │
                    └─────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Health    │  │ Performance │  │    Chat     │              │
│  │             │  │             │  │             │              │
│  │ • Status    │  │ • Metrics   │  │ • Messages  │              │
│  │ • Services  │  │ • Analytics │  │ • History   │              │
│  │ • Monitoring│  │ • Profiling │  │ • AI Engine │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## 🗃️ State Management with Zustand

### Overview

Vantage WebUI uses Zustand for state management, providing a lightweight, TypeScript-friendly alternative to Redux. Zustand offers:

- **Minimal boilerplate** - Simple store creation and usage
- **TypeScript support** - Full type safety out of the box
- **Persistent state** - Local storage integration
- **Devtools support** - Redux DevTools compatibility
- **Modular design** - Multiple focused stores

### Store Architecture

#### Chat Store (`src/store/useChatStore.ts`)

```typescript
interface ChatState {
  // State
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  
  // Actions
  addMessage: (message: ChatMessage) => void
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void
  clearMessages: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      messages: [],
      isLoading: false,
      error: null,
      
      // Actions implementation
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      
      updateMessage: (id, updates) => set((state) => ({
        messages: state.messages.map(msg => 
          msg.id === id ? { ...msg, ...updates } : msg
        )
      })),
      
      clearMessages: () => set({ messages: [] }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error })
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ messages: state.messages })
    }
  )
)
```

#### Future Stores (Planned)

```typescript
// Auth Store (future enhancement)
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

// App Store (future enhancement)
interface AppState {
  theme: 'light' | 'dark' | 'system'
  sidebar: { collapsed: boolean }
  notifications: Notification[]
  setTheme: (theme: AppState['theme']) => void
  toggleSidebar: () => void
  addNotification: (notification: Notification) => void
}
```

### Store Usage Patterns

#### Component Usage
```typescript
// Using the store in components
const ChatContainer: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    addMessage 
  } = useChatStore()
  
  const handleSendMessage = useCallback((text: string) => {
    const message: ChatMessage = {
      id: uuid(),
      text,
      role: 'user',
      timestamp: new Date()
    }
    addMessage(message)
  }, [addMessage])
  
  return (
    <div>
      <MessageList messages={messages} />
      <MessageInput 
        onSend={handleSendMessage} 
        disabled={isLoading} 
      />
    </div>
  )
}
```

#### Selective State Subscription
```typescript
// Subscribe to specific state slices
const messages = useChatStore(state => state.messages)
const isLoading = useChatStore(state => state.isLoading)

// Use shallow comparison for object selections
const { messages, addMessage } = useChatStore(
  useShallow(state => ({ 
    messages: state.messages, 
    addMessage: state.addMessage 
  }))
)
```

### State Persistence

```typescript
// Persistent store configuration
const useChatStore = create<ChatState>()(
  persist(
    storeImplementation,
    {
      name: 'chat-storage',                    // LocalStorage key
      partialize: (state) => ({                // Selective persistence
        messages: state.messages
      }),
      version: 1,                              // Schema versioning
      migrate: (persistedState, version) => { // Migration logic
        if (version === 0) {
          // Migrate from v0 to v1
          return {
            ...persistedState,
            newField: 'defaultValue'
          }
        }
        return persistedState
      }
    }
  )
)
```

## Authentication Implementation

### Auth Module Structure (`src/auth/`)

- ✅ Created dedicated auth module with all authentication-related components
- ✅ Exported all necessary types and components through index.ts

### AuthContext Implementation

- ✅ React Context API for global auth state management
- ✅ User object with id, email, name, and roles
- ✅ JWT token placeholder storage
- ✅ User preferences management (theme, profiling, notifications)
- ✅ Automatic theme application (light/dark/system)
- ✅ localStorage persistence for auth state and preferences
- ✅ Loading and error states
- ✅ TODO comments for future OIDC integration

### ProtectedRoute Component

- ✅ Guards routes requiring authentication
- ✅ Shows loading spinner during auth check
- ✅ Redirects to login page when not authenticated
- ✅ Role-based access control support
- ✅ Access denied page for insufficient permissions

### Login Page

- ✅ Clean, responsive login form
- ✅ Email/password fields (placeholder accepts any credentials)
- ✅ Loading states and error handling
- ✅ Disabled OIDC buttons with "Coming Soon" label
- ✅ Placeholder for Azure AD and Keycloak integration

### User Preferences Page

- ✅ Theme selection (Light/Dark/System)
- ✅ Default profiling settings (enabled/disabled, level)
- ✅ Notification preferences (email, in-app)
- ✅ Auto-save to localStorage
- ✅ Note about future backend sync

### Layout Integration

- ✅ Updated Layout component to use auth context
- ✅ User menu dropdown with preferences and logout
- ✅ Dynamic user avatar with initials
- ✅ Logout functionality redirects to login page

### App Integration

- ✅ Wrapped app with AuthProvider
- ✅ Protected all routes except login page
- ✅ Added preferences route
- ✅ Login page renders without Layout

### Future OIDC Integration Points

#### Keycloak
- Login endpoint: `/api/auth/oidc/keycloak/login`
- Callback handler: `/api/auth/oidc/keycloak/callback`
- Configuration needed: Client ID, Realm, Auth URL

#### Azure AD
- Login endpoint: `/api/auth/oidc/azure/login`
- Callback handler: `/api/auth/oidc/azure/callback`
- Configuration needed: Tenant ID, Client ID, Redirect URI

#### Backend API Endpoints (TODO)
- `POST /api/auth/login` - Traditional authentication
- `POST /api/auth/logout` - Logout and invalidate token
- `GET /api/auth/user` - Get current user details
- `PUT /api/users/:id/preferences` - Update user preferences
- `POST /api/auth/refresh` - Refresh JWT token

### Security Considerations

- Current implementation is for development only
- Production requirements:
  - Secure HTTP-only cookies for tokens
  - CSRF protection
  - Rate limiting on auth endpoints
  - Proper password hashing (bcrypt/argon2)
  - Token refresh mechanism
  - Session management
  - XSS protection

## Health & Performance Dashboard Implementation

### Components Created

#### 1. HealthPage (`src/pages/HealthPage.tsx`)

**Features:**
- Status badges showing healthy/degraded/unhealthy states
- Service monitoring for API Services, Agent Health, Database, and Network
- Real-time health data fetching from `/health` and `/p6/status` endpoints
- Auto-refresh functionality with configurable intervals (10s, 30s, 1m, 5m)
- Manual refresh button
- Color-coded status indicators with icons
- Responsive grid layout for service cards
- Last update timestamp display
- Development mode: raw data viewer for debugging

#### 2. PerformancePage (`src/pages/PerformancePage.tsx`)

**Features:**
- Key metrics display (Response Time, Throughput, Error Rate, Cache Hit Rate)
- Real-time performance data from `/performance` endpoint
- Interactive charts using Recharts.js:
  - Line charts for response time trends
  - Dual-axis line chart for throughput & error rate
  - Area chart for resource usage (CPU & Memory)
  - Pie chart for tool usage distribution
- Statistics tables for:
  - Agent statistics (total, active, idle)
  - Cache statistics (hit rate, entries, memory usage)
  - Database statistics (connections, query times, slow queries)
- Performance profiling controls (start/stop)
- Time range selector (1h, 6h, 24h, 7d)
- Auto-refresh with configurable intervals
- Trend indicators with up/down arrows

### Technical Implementation

#### Data Fetching
- Uses the existing service layer (`src/services/api.ts`)
- Implements proper error handling and loading states
- Supports mock data generation for development/testing
- Type-safe API calls with TypeScript interfaces

#### UI/UX Features
- Responsive design using Tailwind CSS
- Smooth animations and transitions
- Consistent color scheme across components
- Accessibility considerations with proper ARIA labels
- Loading spinners and error messages

#### State Management
- React hooks (useState, useEffect, useCallback)
- Efficient re-rendering with proper dependencies
- Auto-refresh timer management with cleanup

#### Charts Configuration
- Recharts library for data visualization
- Responsive containers that adapt to screen size
- Custom color palette for consistent theming
- Interactive tooltips and legends
- Multiple chart types for different data representations

### Integration Points

#### Modified Files
1. `src/App.tsx` - Added routing for Health and Performance pages
2. `src/components/Button.tsx` - Added "danger" variant and className prop
3. `src/pages/index.ts` - Created exports for new pages

#### API Endpoints Used
- `GET /health` - System health status
- `GET /p6/status` - Database connection status
- `GET /performance` - Performance metrics
- `POST /performance/profile/start` - Start profiling
- `POST /performance/profile/stop` - Stop profiling

### Usage

#### Navigation
- Access Health page: `http://localhost:5173/#health`
- Access Performance page: `http://localhost:5173/#performance`

#### Features
1. **Auto-refresh**: Toggle checkbox to enable/disable automatic data refresh
2. **Refresh Interval**: Select from dropdown (10s, 30s, 1m, 5m)
3. **Manual Refresh**: Click refresh button for immediate update
4. **Profiling**: Start/stop performance profiling sessions
5. **Time Range**: Select data viewing period (Performance page)

## Health Dashboard Validation Guide

### Prerequisites
1. Ensure the development server is running: `npm run dev`
2. Open your browser to `http://localhost:5174`

### Step-by-Step Validation

#### 1. Access the Health Page
- Open your browser to `http://localhost:5174/#health`
- **Expected**: The Health page loads with "System Health" header and service cards
- **✅ Pass**: Service cards are displayed with status badges
- **❌ Fail**: Page doesn't load or no service cards visible

#### 2. Verify Service Cards and Status Badges
Look for the following elements:
- Service cards in a grid layout
- Each card should have:
  - Service name (e.g., "API Services", "Agent Health", "Database", "Network")
  - Status badge with colors (green, yellow, red, gray)
  - Icon (checkmark, warning, X, etc.)
  - Status message

**Expected services:**
- API Services
- Agent Health  
- Database (P6)
- Network

#### 3. Test Auto-refresh Functionality

##### 3.1 Enable Auto-refresh
- Look for "Auto-refresh:" checkbox in the top-right
- **✅ Pass**: Checkbox is present and can be toggled
- If unchecked, click to enable it

##### 3.2 Set 10-second Interval
- After enabling auto-refresh, find the dropdown with time intervals
- Select "10s" from the dropdown
- **✅ Pass**: Dropdown shows options: 10s, 30s, 1m, 5m

##### 3.3 Monitor Network Requests
- Open Browser DevTools (F12)
- Go to **Network** tab
- Clear existing requests
- Wait and observe periodic requests every 10 seconds
- **✅ Pass**: Requests to `/health` and `/p6/status` occur every 10 seconds
- **Note**: `/p6/status` may return 404 - this is expected and should be handled gracefully

#### 4. Test Manual Refresh Button
- Look for the "Refresh" button (with spinning icon)
- Click the button
- **✅ Pass**: Button triggers immediate network requests to `/health` and `/p6/status`
- **✅ Pass**: Button shows loading state (spinning icon) during refresh

#### 5. Simulate Success/Failure Status

##### 5.1 Override Fetch Function
- Open Browser DevTools → **Console** tab
- Paste and execute this command:
```javascript
window.fetch = () => Promise.resolve(new Response(JSON.stringify({status:'UNHEALTHY'}), {
  headers: { 'Content-Type': 'application/json' }
}));
```

##### 5.2 Trigger Refresh
- Click the Manual Refresh button
- **✅ Pass**: Service cards update to show unhealthy status
- **✅ Pass**: Status badges change color to red
- **✅ Pass**: Icons change to error/warning icons
- **✅ Pass**: Overall system status updates to "unhealthy"

##### 5.3 Test Different Statuses
Try these additional overrides:
```javascript
// Healthy status
window.fetch = () => Promise.resolve(new Response(JSON.stringify({status:'healthy'})));

// Degraded status  
window.fetch = () => Promise.resolve(new Response(JSON.stringify({status:'degraded'})));
```

#### 6. Test Debug/Raw Data Mode

##### 6.1 Find Debug Section
- Scroll to bottom of the page
- Look for a collapsible section labeled "Raw Health Data (Development Only)"
- **✅ Pass**: Debug section is present in development mode

##### 6.2 Expand Debug Data
- Click on the debug section to expand it
- **✅ Pass**: Shows raw JSON data from health and P6 status endpoints
- **✅ Pass**: Data is properly formatted and readable

#### 7. Error Handling Validation

##### 7.1 Network Error Simulation
- In DevTools → Console, simulate network error:
```javascript
window.fetch = () => Promise.reject(new Error('Network error'));
```
- Click Manual Refresh
- **✅ Pass**: Error message appears
- **✅ Pass**: Service cards show "unhealthy" or "connection failed" status

##### 7.2 Restore Normal Function
```javascript
// Restore normal fetch behavior
location.reload();
```

### Validation Checklist

#### ✅ Service Cards Display
- [ ] Service cards are visible in grid layout
- [ ] Each card has service name, status badge, icon
- [ ] Status badges show appropriate colors
- [ ] Icons reflect service status

#### ✅ Auto-refresh Functionality  
- [ ] Auto-refresh checkbox present and functional
- [ ] 10-second interval option available
- [ ] Periodic network requests occur at set interval
- [ ] Requests target `/health` and `/p6/status` endpoints

#### ✅ Manual Refresh
- [ ] Manual refresh button present
- [ ] Button triggers immediate network requests
- [ ] Loading state visible during refresh

#### ✅ Status Simulation
- [ ] Fetch override successfully changes UI
- [ ] Status colors update appropriately
- [ ] Icons change based on status
- [ ] Overall system status reflects individual services

#### ✅ Debug Mode
- [ ] Raw data section available in development
- [ ] Debug data displays JSON from endpoints
- [ ] Data is properly formatted

#### ✅ Error Handling
- [ ] Network errors handled gracefully
- [ ] 404 responses (P6 status) don't break the UI
- [ ] Error states displayed to user

### Expected Network Behavior

#### Successful Requests
- `GET /health` → Returns health data with agent status
- `GET /p6/status` → May return 404 (expected) or P6 database info

#### Auto-refresh Pattern
- Every 10 seconds when enabled
- Both endpoints called in parallel
- Failed requests don't break auto-refresh cycle

### Success Criteria
- All service cards display with status information
- Auto-refresh works with 10-second intervals  
- Manual refresh triggers immediate updates
- Status simulation updates UI appropriately
- Debug data is accessible and formatted
- Error states are handled gracefully

### Troubleshooting

#### No Service Cards Visible
- Check if backend API is running
- Verify `/health` endpoint responds
- Check browser console for errors

#### Auto-refresh Not Working
- Verify checkbox is enabled
- Check Network tab for periodic requests
- Ensure interval is set correctly

#### Status Not Updating
- Clear browser cache
- Check fetch override is applied correctly
- Verify Manual Refresh triggers requests

#### Debug Section Missing
- Ensure running in development mode
- Check that `import.meta.env.DEV` is true
- Verify health data is loaded

## Future Enhancements

### Authentication
- Complete OIDC integration (Keycloak, Azure AD)
- Implement secure token storage
- Add session management
- Implement proper logout flow

### Health & Performance
- WebSocket support for real-time updates
- Historical data comparison
- Alert thresholds and notifications
- Export functionality for charts/data
- Dark mode support
- More detailed drill-down views

### Testing
- Unit tests for all components
- Integration tests for API endpoints
- End-to-end testing for user flows
- Performance testing for large datasets
