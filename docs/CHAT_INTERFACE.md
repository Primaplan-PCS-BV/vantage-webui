# Chat Interface MVP Documentation

## Overview

The Chat Interface MVP provides a modern, responsive chat experience for interacting with the Vantage AI assistant. It features real-time messaging, streaming responses, local persistence, and optimistic UI updates.

## Components

### 1. **MessageList** (`src/components/chat/MessageList.tsx`)

Renders the conversation history with distinct styling for user and agent messages.

**Features:**
- User/agent message bubbles with different styling
- Streaming loader animation for pending responses
- Error state display
- Metadata display (timestamp, processing time, tools used)
- Auto-scroll to bottom on new messages

**Props:**
```typescript
interface MessageListProps {
  messages: Message[];
  streamingMessageId: string | null;
}
```

### 2. **MessageInput** (`src/components/chat/MessageInput.tsx`)

Provides the input interface for users to compose and send messages.

**Features:**
- Auto-expanding textarea
- Send on Enter (Shift+Enter for new line)
- File drop zone placeholder (visual only, for future implementation)
- Attachment button (placeholder for future file upload)
- Disabled state during message processing

**Props:**
```typescript
interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}
```

### 3. **ChatContainer** (`src/components/chat/ChatContainer.tsx`)

The main orchestrator component that manages the chat state and coordinates between the UI and API.

**Features:**
- Integrates with Zustand store for state management
- Handles API calls to the backend
- Optimistic UI updates
- Error handling
- Session management
- Reset conversation functionality

## State Management

### Zustand Store (`src/store/useChatStore.ts`)

The chat state is managed using Zustand with persistence to localStorage.

**State Structure:**
```typescript
interface ChatState {
  messages: Message[];
  sessionId: string;
  userPreferences: UserPreferences;
  isLoading: boolean;
  streamingMessageId: string | null;
}
```

**Key Actions:**
- `addMessage`: Adds a new message to the conversation
- `updateMessage`: Updates an existing message (for streaming responses)
- `setStreamingMessageId`: Tracks which message is currently streaming
- `setLoading`: Controls loading state
- `resetSession`: Clears conversation and generates new session ID

## Persistence

Messages and session data are automatically persisted to localStorage using Zustand's persist middleware. This ensures conversations are retained across browser sessions until server-side persistence is implemented.

**Persisted Data:**
- Message history
- Session ID
- User preferences

## API Integration

The chat interface integrates with the backend through the `postChat` function:

```typescript
const request: ChatRequest = {
  message: content,
  session_id: sessionId,
  user_id: userPreferences.userId || 'default_user',
  enable_profiling: userPreferences.enableProfiling || false,
};

const response = await postChat(request);
```

## Usage

To use the chat interface in your application:

```typescript
import { ChatContainer } from '@/components/chat';

function App() {
  return (
    <div className="h-[600px]">
      <ChatContainer />
    </div>
  );
}
```

## Styling

The interface uses Tailwind CSS classes for styling:
- User messages: Gray background, right-aligned
- Agent messages: Blue background, left-aligned
- Responsive design with max-width constraints
- Smooth animations for loading states

## Future Enhancements

1. **File Uploads**: Implement actual file upload functionality when backend supports it
2. **Message Reactions**: Add ability to rate or react to messages
3. **Message History Search**: Add search functionality for conversation history
4. **Typing Indicators**: Show when the agent is processing
5. **Rich Message Content**: Support for markdown, code blocks, etc.
6. **Voice Input**: Add speech-to-text capabilities
7. **Export Conversations**: Allow users to export chat history

## Performance Considerations

- Messages are rendered efficiently using React's reconciliation
- Auto-scroll uses `scrollIntoView` with smooth behavior
- Textarea auto-resize is throttled to prevent performance issues
- Local storage operations are batched by Zustand

## Accessibility

- Keyboard navigation support
- ARIA labels for interactive elements
- Focus management for input field
- Screen reader friendly message structure
