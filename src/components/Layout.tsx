import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, MessageSquare, BarChart3, Heart, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/auth';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Chat');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  const navigation: NavItem[] = [
    { name: 'Chat', href: '#chat', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Performance', href: '#performance', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Health', href: '#health', icon: <Heart className="w-5 h-5" /> },
    { name: 'Docs', href: '#docs', icon: <FileText className="w-5 h-5" /> },
  ];

  // Close sidebar and user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
      
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        !userMenuRef.current.previousElementSibling?.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
        hamburgerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  // Trap focus within sidebar when open on mobile
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 768) {
      const focusableElements = sidebarRef.current?.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isSidebarOpen]);

  const handleNavClick = (name: string) => {
    setActiveLink(name);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Mobile hamburger menu */}
          <button
            ref={hamburgerRef}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            aria-expanded={isSidebarOpen}
            aria-controls="mobile-sidebar"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>

          {/* Company branding */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
              Vantage AI
            </h1>
          </div>

          {/* Desktop navigation hint */}
          <div className="hidden md:block text-sm text-gray-500">
            <span>Navigation in sidebar</span>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        id="mobile-sidebar"
        className={`fixed top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:sticky md:top-16`}
        aria-label="Main navigation"
      >
        <nav className="p-4" role="navigation">
          <ul className="space-y-2" role="list">
            {navigation.map((item) => (
              <li key={item.name} role="none">
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.name);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeLink === item.name
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  aria-current={activeLink === item.name ? 'page' : undefined}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center" aria-hidden="true">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
            </button>
            
            {/* User dropdown menu */}
            {showUserMenu && (
              <div
                ref={userMenuRef}
                className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
              >
                <a
                  href="#preferences"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowUserMenu(false);
                    window.location.hash = '#preferences';
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Preferences</span>
                </a>
                <button
                  onClick={async () => {
                    await logout();
                    window.location.hash = '#login';
                  }}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-100 transition-colors border-t border-gray-100"
                >
                  <LogOut className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main 
        className="md:ml-64 pt-16 min-h-[calc(100vh-4rem)]"
        role="main"
        aria-label="Main content"
      >
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
