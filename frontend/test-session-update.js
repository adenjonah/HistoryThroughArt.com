// Test script for the session updating mechanism
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Testing session updating with:');
console.log('- URL defined:', !!supabaseUrl);
console.log('- Key defined:', !!supabaseKey);

const runTest = async () => {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables');
    return;
  }
  
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
  
  // 1. Create a test session
  console.log('\n--- Creating initial test session ---');
  const userId = `update-test-${Date.now()}`;
  const initialData = {
    user_id: userId,
    session_id: `test-session-${Date.now()}`,
    session_time_sec: 10,
    page_path: '/update-test',
    device_type: 'desktop',
    browser: 'node-test',
    os: 'test',
    referrer: null,
    created_at: new Date().toISOString(),
    last_activity: new Date().toISOString()
  };
  
  let sessionId;
  
  try {
    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/user_sessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(initialData)
    });
    
    const insertData = await insertResponse.json();
    console.log('Initial session created:', insertData);
    
    if (insertData && insertData.length > 0) {
      sessionId = insertData[0].id;
      
      // 2. Update the session by adding time
      console.log('\n--- Updating session with more time ---');
      
      // Call the update_session_duration function
      const functionResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/update_session_duration`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          p_session_id: sessionId,
          p_additional_seconds: 15
        })
      });
      
      const updateResult = await functionResponse.json();
      console.log('Update result:', updateResult);
      
      // 3. Check the final session state
      console.log('\n--- Checking final session state ---');
      const getResponse = await fetch(`${supabaseUrl}/rest/v1/user_sessions?id=eq.${sessionId}`, {
        method: 'GET',
        headers
      });
      
      const finalState = await getResponse.json();
      console.log('Final session state:', finalState);
      
      // 4. Clean up the test session
      console.log('\n--- Cleaning up test session ---');
      const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/user_sessions?id=eq.${sessionId}`, {
        method: 'DELETE',
        headers
      });
      
      console.log('Delete response status:', deleteResponse.status);
      console.log('Test completed successfully!');
    } else {
      console.error('Failed to create initial session');
    }
  } catch (error) {
    console.error('Error during test:', error);
  }
};

runTest(); 