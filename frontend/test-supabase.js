// A simple script to test Supabase connection
// Run with: node test-supabase.js

const fetch = require('node-fetch');
require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection with:');
console.log('- URL defined:', !!supabaseUrl);
console.log('- Key defined:', !!supabaseKey);
console.log('- URL:', supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : 'undefined');
console.log('- Key (first 5 chars):', supabaseKey ? supabaseKey.substring(0, 5) + '...' : 'undefined');

// Test data
const testData = {
  user_id: `test-${Date.now()}`,
  session_id: `test-session-${Date.now()}`,
  session_time_sec: 5,
  page_path: '/test-script',
  device_type: 'desktop',
  browser: 'node-test',
  os: 'test',
  referrer: null,
  created_at: new Date().toISOString()
};

// Test direct fetch request
async function testDirectFetch() {
  console.log('\n--- Testing direct fetch ---');
  
  // Set up headers with correct format
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
  
  console.log('Headers:', headers);
  
  try {
    // Test INSERT
    console.log('\nTesting INSERT...');
    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/user_sessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(testData)
    });
    
    const insertStatus = insertResponse.status;
    const insertBody = await insertResponse.text();
    
    console.log(`Insert Status: ${insertStatus}`);
    console.log(`Insert Response: ${insertBody}`);
    
    // Test SELECT
    console.log('\nTesting SELECT...');
    const selectResponse = await fetch(`${supabaseUrl}/rest/v1/user_sessions?select=*&limit=1`, {
      method: 'GET',
      headers
    });
    
    const selectStatus = selectResponse.status;
    const selectBody = await selectResponse.text();
    
    console.log(`Select Status: ${selectStatus}`);
    console.log(`Select Response: ${selectBody.substring(0, 200)}...`);
    
  } catch (error) {
    console.error('Error during test:', error);
  }
}

// Run the test
testDirectFetch(); 