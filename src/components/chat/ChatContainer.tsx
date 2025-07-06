import React, { useCallback, useEffect } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { postChat } from '../../services/api';
import type { ChatRequest } from '../../services/api';
import { RotateCcw, Settings } from 'lucide-react';

export const ChatContainer: React.FC = () => {
  const {
    messages,
    sessionId,
    userPreferences,
    isLoading,
    streamingMessageId,
    addMessage,
    updateMessage,
    setStreamingMessageId,
    setLoading,
    resetSession,
  } = useChatStore();

  // Handle sending messages
  const handleSendMessage = useCallback(async (content: string) => {
    // Add user message with optimistic UI
    const userMessage = {
      role: 'user' as const,
      content,
    };
    addMessage(userMessage);

    // Create agent message placeholder for streaming
    const agentMessage = {
      role: 'agent' as const,
      content: '',
      isStreaming: true,
    };
    
    // Add message and get back the created message with its ID
    const createdAgentMessage = addMessage(agentMessage);
    const agentMessageId = createdAgentMessage.id;
    
    setStreamingMessageId(agentMessageId);
    setLoading(true);

    try {
      // Prepare request
      const request: ChatRequest = {
        message: content,
        session_id: sessionId,
        user_id: userPreferences.userId || 'default_user',
        enable_profiling: userPreferences.enableProfiling || false,
      };

      // Call API
      const startTime = Date.now();
      const response = await postChat(request);
      const endTime = Date.now();

      // Update agent message with response
      updateMessage(agentMessageId, {
        content: response.response,
        isStreaming: false,
        toolsUsed: response.tools_used,
        processingTime: response.processing_time || (endTime - startTime),
      });

      // Update session ID if changed
      if (response.session_id !== sessionId) {
        useChatStore.getState().setSessionId(response.session_id);
      }
    } catch (error) {
      // Update message with error
      updateMessage(agentMessageId, {
        isStreaming: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setStreamingMessageId(null);
      setLoading(false);
    }
  }, [sessionId, userPreferences, addMessage, updateMessage, setStreamingMessageId, setLoading]);

  // Load initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        role: 'agent',
        content: 'Hello! I\'m the Vantage AI assistant. How can I help you today?',
      });
    }
  }, []); // Only run once on mount

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Vantage Chat</h2>
          <p className="text-sm text-gray-500">AI-powered assistance</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetSession}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList 
        messages={messages} 
        streamingMessageId={streamingMessageId} 
      />

      {/* Input */}
      <MessageInput 
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder={isLoading ? "Waiting for response..." : "Type your message..."}
      />
    </div>
  );
};
