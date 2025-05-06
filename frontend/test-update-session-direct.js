// Test script for the session updating mechanism using direct update
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Testing direct session updating with:');
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
  const testId = Date.now();
  const userId = `direct-update-test-${testId}`;
  const initialData = {
    user_id: userId,
    session_id: `test-session-${testId}`,
    session_time_sec: 10,
    page_path: '/direct-update-test',
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
      
      // 2. Find the session and update it
      console.log('\n--- Finding and updating the session ---');
      
      // First, find the session by user_id and page_path
      const findResponse = await fetch(
        `${supabaseUrl}/rest/v1/user_sessions?user_id=eq.${encodeURIComponent(userId)}&page_path=eq.${encodeURIComponent('/direct-update-test')}&order=created_at.desc&limit=1`, 
        {
          method: 'GET',
          headers
        }
      );
      
      const foundSessions = await findResponse.json();
      console.log('Found sessions:', foundSessions);
      
      if (foundSessions && foundSessions.length > 0) {
        const sessionToUpdate = foundSessions[0];
        const additionalSeconds = 15;
        const newDuration = sessionToUpdate.session_time_sec + additionalSeconds;
        const cappedDuration = Math.min(newDuration, 10800); // 3 hour max
        
        // Update the session duration
        const updateResponse = await fetch(
          `${supabaseUrl}/rest/v1/user_sessions?id=eq.${sessionToUpdate.id}`,
          {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
              session_time_sec: cappedDuration,
              last_activity: new Date().toISOString()
            })
          }
        );
        
        // Try to read the response
        let updateResult;
        try {
          updateResult = await updateResponse.text();
        } catch (e) {
          updateResult = 'Could not read response text';
        }
        
        console.log('Update response status:', updateResponse.status);
        console.log('Update result:', updateResult);
        console.log('Updated duration from', sessionToUpdate.session_time_sec, 'to', cappedDuration);
        
        // Short delay to ensure update is processed
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 3. Check the final session state
        console.log('\n--- Checking final session state ---');
        const getResponse = await fetch(
          `${supabaseUrl}/rest/v1/user_sessions?id=eq.${sessionToUpdate.id}`, 
          {
            method: 'GET',
            headers
          }
        );
        
        const finalState = await getResponse.json();
        console.log('Final session state:', finalState);
      } else {
        console.error('Failed to find the session');
      }
      
      // 4. Clean up the test session
      console.log('\n--- Cleaning up test session ---');
      const deleteResponse = await fetch(
        `${supabaseUrl}/rest/v1/user_sessions?id=eq.${sessionId}`, 
        {
          method: 'DELETE',
          headers
        }
      );
      
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