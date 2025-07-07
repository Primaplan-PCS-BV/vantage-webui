# Vantage WebUI

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=FFE033)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, enterprise-grade web interface for the Vantage AI platform. Built with React, TypeScript, and Vite, providing real-time system monitoring, interactive chat capabilities, and comprehensive authentication management.

## 🚀 Purpose

Vantage WebUI serves as the primary frontend interface for the Vantage AI application, offering users:

- **Real-time System Monitoring** - Track application health, performance metrics, and system status
- **Interactive AI Chat** - Communicate with the Vantage AI assistant through a modern chat interface
- **Secure Authentication** - Enterprise-ready auth system with OIDC integration support
- **Performance Analytics** - Detailed insights into system performance and resource utilization

## 🛠️ Tech Stack

### Frontend Framework
- **React 19** - Modern UI library with concurrent features
- **TypeScript** - Type-safe development with enhanced developer experience
- **Vite** - Lightning-fast build tool and development server

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework with custom enterprise color palette
- **Lucide React** - Beautiful, customizable icons
- **Recharts** - Responsive charts and data visualization

### State Management & API
- **Zustand** - Lightweight state management with persistence
- **Axios** - HTTP client for API communication
- **OpenAPI TypeScript** - Auto-generated type-safe API client

### Development & Testing
- **Jest** - Testing framework with React Testing Library
- **ESLint** - Code linting with TypeScript support
- **Puppeteer** - End-to-end testing capabilities

## ✨ Key Features

### 🔐 Authentication System
- **Secure Login** - Email/password authentication with JWT tokens
- **OIDC Integration** - Ready for Keycloak and Azure AD (coming soon)
- **Role-based Access Control** - Protected routes with permission management
- **User Preferences** - Theme selection, profiling settings, and notifications
- **Session Management** - Automatic token refresh and secure logout

### 💬 Interactive Chat Interface
- **Real-time Messaging** - Stream responses from the Vantage AI assistant
- **Persistent Conversations** - Local storage with session management
- **Optimistic UI Updates** - Smooth, responsive user experience
- **Rich Message Support** - Metadata display, timestamps, and processing info
- **Accessibility** - Keyboard navigation and screen reader support

### 📊 Health Dashboard
- **System Status Monitoring** - Real-time health checks for all services
- **Service Cards** - Visual status indicators for API, Database, Network, and Agents
- **Auto-refresh** - Configurable refresh intervals (10s, 30s, 1m, 5m)
- **Error Handling** - Graceful degradation and error state management
- **Debug Mode** - Raw data inspection for development

### 📈 Performance Analytics
- **Key Metrics** - Response time, throughput, error rate, and cache performance
- **Interactive Charts** - Line, area, and pie charts with Recharts
- **Resource Monitoring** - CPU, memory, and database performance tracking
- **Profiling Controls** - Start/stop performance profiling sessions
- **Historical Data** - Time range selection and trend analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend API running on `localhost:8000` (optional for full functionality)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd vantage-webui

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📚 Documentation

### Getting Started
- [**Setup Guide**](docs/SETUP.md) - Complete installation and development setup
- [**Architecture Overview**](docs/ARCHITECTURE.md) - System architecture and implementation details

### Feature Documentation
- [**Chat Interface**](docs/CHAT_INTERFACE.md) - Chat system implementation and usage
- [**Health Validation Guide**](HEALTH_VALIDATION_GUIDE.md) - Step-by-step health dashboard testing

### Development
- [**Component README**](src/components/Layout.README.md) - UI component documentation
- [**Services README**](src/services/README.md) - API services and utilities
- [**Auth README**](src/auth/README.md) - Authentication system documentation

## 🏗️ Project Structure

```
src/
├── auth/           # Authentication system
├── components/     # Reusable UI components
│   ├── chat/      # Chat interface components
│   └── Layout.tsx # Main application layout
├── pages/         # Page components
├── services/      # API services and utilities
├── store/         # Zustand state management
├── types/         # TypeScript type definitions
└── assets/        # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_ENABLE_MOCK_DATA=true
```

### API Endpoints

The application expects the following API endpoints:

- `GET /health` - System health status
- `GET /performance` - Performance metrics
- `POST /chat` - Chat message processing
- `GET /p6/status` - Database connection status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Follow TypeScript strict mode conventions
- Use Tailwind CSS for styling (avoid custom CSS when possible)
- Write tests for new components and features
- Maintain accessibility standards (ARIA labels, keyboard navigation)
- Follow the existing code style and patterns

## 🚀 Deployment

The application is built as a static SPA and can be deployed to any static hosting service:

- **Vercel/Netlify** - Automatic deployment from Git
- **AWS S3 + CloudFront** - Enterprise static hosting
- **Docker** - Containerized deployment (Dockerfile included)

## 📄 License

This project is part of the Vantage AI platform. See the main repository for license information.

---

**Built with ❤️ by the Vantage AI Team**
