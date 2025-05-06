// Simple test script for direct inserts and queries
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Testing Supabase basic operations:');
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
  
  const testId = Date.now();
  const userId = `basic-test-${testId}`;
  
  try {
    // 1. Insert data
    console.log('\n--- Inserting test data ---');
    const insertData = {
      user_id: userId,
      session_id: `test-session-${testId}`,
      session_time_sec: 10,
      page_path: '/basic-test',
      device_type: 'desktop',
      browser: 'node-test',
      os: 'test',
      referrer: null,
      created_at: new Date().toISOString(),
      last_activity: new Date().toISOString()
    };
    
    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/user_sessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(insertData)
    });
    
    console.log('Insert response status:', insertResponse.status);
    
    let insertResult;
    try {
      insertResult = await insertResponse.json();
      console.log('Insert result:', insertResult);
    } catch (e) {
      console.error('Could not parse insert response:', e);
    }
    
    // 2. Query the data
    console.log('\n--- Querying data ---');
    const queryResponse = await fetch(
      `${supabaseUrl}/rest/v1/user_sessions?user_id=eq.${encodeURIComponent(userId)}`, 
      {
        method: 'GET',
        headers
      }
    );
    
    console.log('Query response status:', queryResponse.status);
    
    let queryResult;
    try {
      queryResult = await queryResponse.json();
      console.log('Query result:', queryResult);
    } catch (e) {
      console.error('Could not parse query response:', e);
    }
    
    // 3. Delete the test data
    console.log('\n--- Cleaning up test data ---');
    if (queryResult && queryResult.length > 0) {
      const deleteResponse = await fetch(
        `${supabaseUrl}/rest/v1/user_sessions?id=eq.${queryResult[0].id}`, 
        {
          method: 'DELETE',
          headers
        }
      );
      
      console.log('Delete response status:', deleteResponse.status);
    } else {
      console.log('No data to delete');
    }
    
    console.log('\nTest completed!');
  } catch (error) {
    console.error('Error during test:', error);
  }
};

runTest(); 