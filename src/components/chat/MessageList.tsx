import React, { useEffect, useRef } from 'react';
import type { Message } from '../../store/useChatStore';
import { User, Bot, Loader2, AlertCircle, Clock, Wrench } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  streamingMessageId: string | null;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, streamingMessageId }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatProcessingTime = (time?: number) => {
    if (!time) return null;
    return `${(time / 1000).toFixed(2)}s`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.role === 'agent' && (
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
          )}
          
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.role === 'user'
                ? 'bg-gray-200 text-gray-900'
                : 'bg-blue-50 text-gray-900'
            }`}
          >
            {message.error ? (
              <div className="flex items-start gap-2 text-red-600">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{message.error}</p>
                </div>
              </div>
            ) : message.isStreaming && message.id === streamingMessageId ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-gray-500">Thinking...</span>
              </div>
            ) : (
              <>
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                
                {message.role === 'agent' && (
                  <div className="mt-2 pt-2 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(message.timestamp)}
                    </span>
                    
                    {message.processingTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatProcessingTime(message.processingTime)}
                      </span>
                    )}
                    
                    {message.toolsUsed && message.toolsUsed.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Wrench className="w-3 h-3" />
                        {message.toolsUsed.length} tool{message.toolsUsed.length > 1 ? 's' : ''} used
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          
          {message.role === 'user' && (
            <div className="flex-shrink-0 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      ))}
      
      <div ref={bottomRef} />
    </div>
  );
};
