import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
  toolsUsed?: unknown[];
  processingTime?: number;
  isStreaming?: boolean;
  error?: string;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  enableProfiling?: boolean;
  userId?: string;
}

interface ChatState {
  messages: Message[];
  sessionId: string;
  userPreferences: UserPreferences;
  isLoading: boolean;
  streamingMessageId: string | null;
  
  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'> & { id?: string }) => Message;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setStreamingMessageId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setSessionId: (sessionId: string) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  clearMessages: () => void;
  resetSession: () => void;
}

const generateSessionId = () => uuidv4();

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      sessionId: generateSessionId(),
      userPreferences: {
        theme: 'system',
        enableProfiling: false,
        userId: 'default_user'
      },
      isLoading: false,
      streamingMessageId: null,

      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: message.id ?? uuidv4(),   // only generate when caller did not provide one
          timestamp: Date.now(),
        };
        set((state) => ({
          messages: [
            ...state.messages,
            newMessage,
          ],
        }));
        return newMessage;
      },

      updateMessage: (id, updates) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        })),

      setStreamingMessageId: (id) =>
        set({ streamingMessageId: id }),

      setLoading: (loading) =>
        set({ isLoading: loading }),

      setSessionId: (sessionId) =>
        set({ sessionId }),

      updateUserPreferences: (preferences) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            ...preferences,
          },
        })),

      clearMessages: () =>
        set({ messages: [] }),

      resetSession: () =>
        set({
          messages: [],
          sessionId: generateSessionId(),
          isLoading: false,
          streamingMessageId: null,
        }),
    }),
    {
      name: 'vantage-chat-storage',
      partialize: (state) => ({
        messages: state.messages,
        sessionId: state.sessionId,
        userPreferences: state.userPreferences,
      }),
    }
  )
);
