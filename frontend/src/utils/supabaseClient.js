import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Debug message for deployment troubleshooting
console.log('Supabase initialization:');
console.log('- URL defined:', !!supabaseUrl);
console.log('- Key defined:', !!supabaseAnonKey);
console.log('- URL:', supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : 'undefined');
console.log('- Key (first 5 chars):', supabaseAnonKey ? supabaseAnonKey.substring(0, 5) + '...' : 'undefined');

// Throw error if environment variables are not defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration error: Environment variables missing');
  console.error(`URL: ${supabaseUrl ? 'Defined' : 'Undefined'}`);
  console.error(`Key: ${supabaseAnonKey ? 'Defined' : 'Undefined'}`);
}

// Custom fetch handler to log detailed request/response info
const customFetch = async (url, options = {}) => {
  // Log full headers for debugging
  const headersObj = Object.fromEntries(
    options.headers ? [...options.headers.entries()] : []
  );
  
  // Check for proper authorization header format
  const authHeader = headersObj['Authorization'];
  const hasProperAuthFormat = authHeader && authHeader.startsWith('Bearer ');
  
  console.log('Supabase API request:', {
    url: url.toString(),
    method: options.method,
    headers: headersObj,
    authHeaderValid: hasProperAuthFormat
  });
  
  if (!hasProperAuthFormat) {
    console.warn('Supabase API request has invalid Authorization header format. Should be: "Bearer [token]"');
  }
  
  try {
    const response = await fetch(url, options);
    
    // Clone the response so we can both log it and return it
    const clonedResponse = response.clone();
    
    // Try to parse and log the response for debugging
    try {
      const responseText = await clonedResponse.text();
      console.log('Supabase API response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText.substring(0, 500) + (responseText.length > 500 ? '...' : '')
      });
    } catch (error) {
      console.log('Could not parse response for logging:', error);
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Create the Supabase client with additional options
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    },
    global: {
      fetch: customFetch
    },
    // Additional options for debugging
    debug: true
  }
);

// Add the URL and key to the supabase object for debugging
supabase.supabaseUrl = supabaseUrl;
supabase.supabaseKey = supabaseAnonKey;

// Export a function to test table permissions
export const testTablePermissions = async () => {
  console.log('Testing table permissions...');
  
  try {
    // 1. Try a simple select
    console.log('Testing SELECT permission...');
    const { data: selectData, error: selectError } = await supabase
      .from('user_sessions')
      .select('id')
      .limit(1);
    
    if (selectError) {
      console.error('SELECT test failed:', selectError);
    } else {
      console.log('SELECT test successful:', selectData);
    }
    
    // 2. Try an insert
    console.log('Testing INSERT permission...');
    const testRecord = {
      user_id: 'permission-test-' + Date.now(),
      session_time_sec: 1,
      page_path: '/permission-test'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_sessions')
      .insert(testRecord);
    
    if (insertError) {
      console.error('INSERT test failed:', insertError);
      console.error('Error details:', {
        code: insertError.code,
        message: insertError.message,
        hint: insertError.hint || 'No hint provided',
        details: insertError.details || 'No details provided'
      });
    } else {
      console.log('INSERT test successful:', insertData);
    }
    
    // Return comprehensive test results
    return {
      select: {
        success: !selectError,
        error: selectError ? selectError.message : null
      },
      insert: {
        success: !insertError,
        error: insertError ? insertError.message : null
      }
    };
  } catch (error) {
    console.error('Permission test error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Export a function to test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('user_sessions')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        hint: error.hint || 'No hint provided',
        details: error.details || 'No details provided'
      });
      
      // Also test if it's a CORS issue
      console.log('Testing if this is a CORS issue...');
      try {
        const response = await fetch(supabaseUrl + '/rest/v1/user_sessions?select=id&limit=1', {
          method: 'GET',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`
          }
        });
        
        console.log('Direct fetch response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
      } catch (corsError) {
        console.error('CORS test failed:', corsError);
      }
      
      return { success: false, error: error.message };
    }
    
    console.log('Supabase connection test successful:', data);
    
    // Also test permissions
    const permissions = await testTablePermissions();
    
    return { 
      success: true, 
      data,
      permissions
    };
  } catch (error) {
    console.error('Supabase connection exception:', error);
    return { success: false, error: error.message };
  }
}; 