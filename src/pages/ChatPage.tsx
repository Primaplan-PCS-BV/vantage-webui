import React from 'react';
import { ChatContainer } from '../components/chat';

export const ChatPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Vantage AI Assistant
            </h1>
            <p className="text-lg text-gray-600">
              Your intelligent partner for project insights
            </p>
          </div>
          
          <div className="h-[700px]">
            <ChatContainer />
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>
              Messages are saved locally and will persist across sessions.
              Press Ctrl+Enter for new lines, Enter to send.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
