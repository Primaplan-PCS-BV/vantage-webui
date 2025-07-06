import React from 'react';
import { useAuth } from './AuthContext';
import { Settings, Sun, Moon, Monitor, Activity } from 'lucide-react';

export const UserPreferences: React.FC = () => {
  const { preferences, updatePreferences } = useAuth();

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updatePreferences({ theme });
  };

  const handleProfilingChange = (enabled: boolean) => {
    updatePreferences({
      defaultProfiling: {
        enabled,
        level: preferences.defaultProfiling?.level || 'basic'
      }
    });
  };

  const handleProfilingLevelChange = (level: 'basic' | 'detailed' | 'full') => {
    updatePreferences({
      defaultProfiling: {
        enabled: preferences.defaultProfiling?.enabled || true,
        level
      }
    });
  };

  const handleNotificationChange = (type: 'email' | 'inApp', enabled: boolean) => {
    updatePreferences({
      notifications: {
        email: type === 'email' ? enabled : (preferences.notifications?.email || false),
        inApp: type === 'inApp' ? enabled : (preferences.notifications?.inApp || false)
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Settings className="h-6 w-6 text-gray-400 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">User Preferences</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Theme</h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                  preferences.theme === 'light'
                    ? 'border-purple-600 bg-purple-50 text-purple-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                  preferences.theme === 'dark'
                    ? 'border-purple-600 bg-purple-50 text-purple-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                  preferences.theme === 'system'
                    ? 'border-purple-600 bg-purple-50 text-purple-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Monitor className="h-4 w-4 mr-2" />
                System
              </button>
            </div>
          </div>

          {/* Profiling Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              <Activity className="inline h-4 w-4 mr-2" />
              Default Profiling
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="profiling-enabled"
                  checked={preferences.defaultProfiling?.enabled || false}
                  onChange={(e) => handleProfilingChange(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="profiling-enabled" className="ml-2 text-sm text-gray-700">
                  Enable profiling by default
                </label>
              </div>
              
              {preferences.defaultProfiling?.enabled && (
                <div className="ml-6 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Profiling Level
                  </label>
                  <select
                    value={preferences.defaultProfiling?.level || 'basic'}
                    onChange={(e) => handleProfilingLevelChange(e.target.value as any)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                  >
                    <option value="basic">Basic</option>
                    <option value="detailed">Detailed</option>
                    <option value="full">Full</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="email-notifications"
                  checked={preferences.notifications?.email || false}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="email-notifications" className="ml-2 text-sm text-gray-700">
                  Email notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inapp-notifications"
                  checked={preferences.notifications?.inApp || false}
                  onChange={(e) => handleNotificationChange('inApp', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="inapp-notifications" className="ml-2 text-sm text-gray-700">
                  In-app notifications
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Preferences are automatically saved locally and will sync with the server once connected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
