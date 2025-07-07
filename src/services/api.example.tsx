/**
 * Example usage of the API service layer
 * This file demonstrates how to use the typed API functions
 */

import React from 'react';
import {
  postChat,
  getHealth,
  getPerformance,
  monitorChatBurst,
  setNotificationHandler,
  retryRequest,
  ApiError,
  type ChatRequest,
  type ChatResponse,
  type HealthResponse,
} from './api';

// Set up global notification handler (e.g., for use with a toast library)
setNotificationHandler((type, message) => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // In a real app, you might use a toast library like react-toastify:
  // toast[type](message);
});

// Example 1: Send a chat message
async function _sendChatMessage(message: string) {
  try {
    const request: ChatRequest = {
      message,
      session_id: 'user-session-123',
      user_id: 'user-123',
      enable_profiling: false,
    };

    const response: ChatResponse = await postChat(request);
    
    console.log('Chat response:', response.response);
    console.log('Processing time:', response.processing_time);
    console.log('Tools used:', response.tools_used);
    
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('API Error:', error.message);
      console.error('Status:', error.status);
      console.error('Data:', error.data);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

// Example 2: Check API health
async function _checkApiHealth() {
  try {
    const health: HealthResponse = await getHealth();
    console.log('API Status:', health.status);
    console.log('Agent Health:', health.agent_health);
    console.log('Timestamp:', new Date(health.timestamp * 1000).toISOString());
    return health;
  } catch (error) {
    console.error('Failed to check health:', error);
    throw error;
  }
}

// Example 3: Get performance stats with retry
async function _getPerformanceWithRetry() {
  try {
    // Retry the request up to 3 times with exponential backoff
    const stats = await retryRequest(
      () => getPerformance(),
      3, // max retries
      1000 // initial delay (1 second)
    );
    
    console.log('Performance stats:', stats);
    return stats;
  } catch (error) {
    console.error('Failed to get performance stats after retries:', error);
    throw error;
  }
}

// Example 4: Monitor chat burst performance
async function _monitorPerformance(duration: number = 60) {
  try {
    const result = await monitorChatBurst(duration);
    console.log('Burst monitoring result:', result);
    return result;
  } catch (error) {
    console.error('Failed to monitor chat burst:', error);
    throw error;
  }
}

// Example 5: Using the API in a React component
export const ChatExample = () => {
  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState<ChatResponse | null>(null);

  const _handleSubmit = async (message: string) => {
    setLoading(true);
    try {
      const chatResponse = await postChat({
        message,
        user_id: 'default_user',
        enable_profiling: true,
      });
      setResponse(chatResponse);
    } catch (error) {
      // Error is already handled by the global notification handler
      console.error('Chat failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your chat UI here */}
      {loading && <div>Loading...</div>}
      {response && (
        <div>
          <p>{response.response}</p>
          <small>Processing time: {response.processing_time}ms</small>
        </div>
      )}
    </div>
  );
};

// Example usage:
// _sendChatMessage("What's the status of Project Alpha?");
// _checkApiHealth();
// _getPerformanceWithRetry();
// _monitorPerformance(120); // Monitor for 2 minutes
