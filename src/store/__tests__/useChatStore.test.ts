import { renderHook, act } from '@testing-library/react';
import { useChatStore } from '../useChatStore';

describe('useChatStore', () => {
  beforeEach(() => {
    // Clear store between tests
    useChatStore.setState({
      messages: [],
      sessionId: '',
      userPreferences: {
        theme: 'system',
        enableProfiling: false,
        userId: 'default_user'
      },
      isLoading: false,
      streamingMessageId: null,
    });
  });

  it('should add messages correctly', () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Hello, AI!'
      });
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe('Hello, AI!');
    expect(result.current.messages[0].role).toBe('user');
    expect(result.current.messages[0].id).toBeDefined();
    expect(result.current.messages[0].timestamp).toBeDefined();
  });

  it('should update messages correctly', () => {
    const { result } = renderHook(() => useChatStore());

    // Add a message first
    act(() => {
      result.current.addMessage({
        role: 'agent',
        content: '',
        isStreaming: true
      });
    });

    const messageId = result.current.messages[0].id;

    // Update the message
    act(() => {
      result.current.updateMessage(messageId, {
        content: 'Hello! How can I help you?',
        isStreaming: false,
        processingTime: 1500
      });
    });

    expect(result.current.messages[0].content).toBe('Hello! How can I help you?');
    expect(result.current.messages[0].isStreaming).toBe(false);
    expect(result.current.messages[0].processingTime).toBe(1500);
  });

  it('should reset session correctly', () => {
    const { result } = renderHook(() => useChatStore());

    // Add some messages
    act(() => {
      result.current.addMessage({ role: 'user', content: 'Test 1' });
      result.current.addMessage({ role: 'agent', content: 'Response 1' });
      result.current.setLoading(true);
    });

    const oldSessionId = result.current.sessionId;

    // Reset session
    act(() => {
      result.current.resetSession();
    });

    expect(result.current.messages).toHaveLength(0);
    expect(result.current.sessionId).not.toBe(oldSessionId);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.streamingMessageId).toBe(null);
  });

  it('should update user preferences', () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.updateUserPreferences({
        theme: 'dark',
        enableProfiling: true,
        userId: 'test-user-123'
      });
    });

    expect(result.current.userPreferences.theme).toBe('dark');
    expect(result.current.userPreferences.enableProfiling).toBe(true);
    expect(result.current.userPreferences.userId).toBe('test-user-123');
  });

  it('should handle streaming message update regression test', () => {
    const { result } = renderHook(() => useChatStore());

    // Step 1: Add a streaming message with specific ID
    act(() => {
      result.current.addMessage({
        id: 'x',
        role: 'agent',
        content: '',
        isStreaming: true
      });
    });

    // Verify the message was added correctly
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].id).toBe('x');
    expect(result.current.messages[0].role).toBe('agent');
    expect(result.current.messages[0].content).toBe('');
    expect(result.current.messages[0].isStreaming).toBe(true);

    // Step 2: Update the message content and streaming status
    act(() => {
      result.current.updateMessage('x', {
        content: 'hello',
        isStreaming: false
      });
    });

    // Step 3: Verify the store contains the updated content
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].id).toBe('x');
    expect(result.current.messages[0].content).toBe('hello');
    expect(result.current.messages[0].isStreaming).toBe(false);
    expect(result.current.messages[0].role).toBe('agent');
  });
});
