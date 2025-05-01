require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Make sure you have REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY set in your environment.');
  process.exit(1);
}

console.log('🔑 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key:', supabaseKey ? 'Defined' : 'Undefined');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAnalyticsUsers() {
  console.log('\n🔍 Testing analytics_users view...');
  
  try {
    const { data, error, status } = await supabase
      .from('analytics_users')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Error accessing analytics_users view:', error.message);
      console.error('   Status:', status);
      return false;
    }
    
    console.log('✅ Successfully queried analytics_users view');
    console.log(`   Found ${data.length} records`);
    if (data.length > 0) {
      console.log('   Sample record:', JSON.stringify(data[0], null, 2));
    }
    return true;
  } catch (err) {
    console.error('❌ Exception accessing analytics_users view:', err.message);
    return false;
  }
}

async function testUserSessions() {
  console.log('\n🔍 Testing user_sessions table...');
  
  try {
    // First check count
    const { count, error: countError } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error counting user_sessions:', countError.message);
      return false;
    }
    
    console.log(`✅ Successfully counted user_sessions: ${count} total records`);
    
    // Now get some actual records
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('❌ Error accessing user_sessions table:', error.message);
      return false;
    }
    
    console.log('✅ Successfully queried user_sessions table');
    console.log(`   Found ${data.length} records`);
    if (data.length > 0) {
      console.log('   Sample record:', JSON.stringify(data[0], null, 2));
    }
    return true;
  } catch (err) {
    console.error('❌ Exception accessing user_sessions table:', err.message);
    return false;
  }
}

async function testAggregations() {
  console.log('\n🔍 Testing aggregation queries...');
  
  try {
    // Get total time
    const { data: totalTimeData, error: totalTimeError } = await supabase
      .from('user_sessions')
      .select('session_time_sec');
    
    if (totalTimeError) {
      console.error('❌ Error fetching session times:', totalTimeError.message);
    } else {
      const totalTime = totalTimeData.reduce((total, session) => {
        return total + (parseInt(session.session_time_sec) || 0);
      }, 0);
      
      console.log(`✅ Total time calculation: ${totalTime} seconds`);
    }
    
    // Get unique users
    const { data: userData, error: userError } = await supabase
      .from('user_sessions')
      .select('user_id');
    
    if (userError) {
      console.error('❌ Error fetching user IDs:', userError.message);
    } else {
      const uniqueUsers = new Set();
      userData.forEach(session => {
        if (session.user_id) {
          uniqueUsers.add(session.user_id);
        }
      });
      
      console.log(`✅ Unique users calculation: ${uniqueUsers.size} users`);
    }
    
    return true;
  } catch (err) {
    console.error('❌ Exception testing aggregations:', err.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Starting analytics data tests...');
  
  const usersViewResult = await testAnalyticsUsers();
  const sessionsTableResult = await testUserSessions();
  const aggregationsResult = await testAggregations();
  
  console.log('\n📊 Test Results Summary:');
  console.log(`   analytics_users view: ${usersViewResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   user_sessions table: ${sessionsTableResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   aggregation queries: ${aggregationsResult ? '✅ PASS' : '❌ FAIL'}`);
  
  // Overall status
  const allPassed = usersViewResult && sessionsTableResult && aggregationsResult;
  console.log(`\n${allPassed ? '✅ All tests passed!' : '❌ Some tests failed.'}`);
  
  process.exit(allPassed ? 0 : 1);
}

// Run all tests
runTests(); 