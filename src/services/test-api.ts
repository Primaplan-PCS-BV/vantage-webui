/**
 * Simple test script to verify API service functionality
 * Run with: npx tsx src/services/test-api.ts
 */

import { getHealth, ApiError } from './api';

async function testApiConnection() {
  console.log('Testing API connection...');
  
  try {
    const health = await getHealth();
    console.log('✅ API is healthy!');
    console.log('Status:', health.status);
    console.log('Agent Health:', JSON.stringify(health.agent_health, null, 2));
    console.log('Timestamp:', new Date(health.timestamp * 1000).toISOString());
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('❌ API Error:', error.message);
      console.error('Status Code:', error.status);
      console.error('Response Data:', error.data);
    } else {
      console.error('❌ Unexpected error:', error);
    }
  }
}

// Run the test
testApiConnection();
