import { useState, useEffect } from 'react'
import { Layout } from '@/components'
import { ChatContainer } from '@/components/chat'
import { HealthPage, PerformancePage } from '@/pages'
import { FileText } from 'lucide-react'
import { ProtectedRoute, LoginPage } from '@/auth'
import { UserPreferences as UserPreferencesPage } from '@/auth/UserPreferences'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('chat')

  // Demo content for different sections
  const renderContent = () => {
    switch (activeSection) {
      case 'login':
        return <LoginPage />
      case 'preferences':
        return (
          <ProtectedRoute>
            <UserPreferencesPage />
          </ProtectedRoute>
        )
      case 'chat':
        return (
          <ProtectedRoute>
            <div className="h-[calc(100vh-200px)]">
              <ChatContainer />
            </div>
          </ProtectedRoute>
        )
      case 'performance':
        return (
          <ProtectedRoute>
            <PerformancePage />
          </ProtectedRoute>
        )
      case 'health':
        return (
          <ProtectedRoute>
            <HealthPage />
          </ProtectedRoute>
        )
      case 'docs':
        return (
          <ProtectedRoute>
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-8 h-8 text-purple-600" />
                <h2 className="text-3xl font-bold text-gray-900">Documentation</h2>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h3>
                  <p className="text-gray-700 mb-4">
                    Welcome to the Vantage AI documentation. Here you'll find comprehensive guides and documentation to help you start working with our platform as quickly as possible.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>API Reference</li>
                    <li>Integration Guides</li>
                    <li>Best Practices</li>
                    <li>Troubleshooting</li>
                  </ul>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        )
      default:
        return (
          <ProtectedRoute>
            <div className="h-[calc(100vh-200px)]">
              <ChatContainer />
            </div>
          </ProtectedRoute>
        )
    }
  }

  // Simple URL hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'chat'
      setActiveSection(hash)
    }
    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Render Layout only for authenticated routes (not login page)
  if (activeSection === 'login') {
    return <LoginPage />
  }

  return (
    <Layout>
      {renderContent()}
    </Layout>
  )
}

export default App
