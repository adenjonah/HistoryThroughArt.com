import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Debug message for deployment troubleshooting
console.log('Supabase initialization:');
console.log('- URL defined:', !!supabaseUrl);
console.log('- Key defined:', !!supabaseAnonKey);

// Throw error if environment variables are not defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration error: Environment variables missing');
  console.error(`URL: ${supabaseUrl ? 'Defined' : 'Undefined'}`);
  console.error(`Key: ${supabaseAnonKey ? 'Defined' : 'Undefined'}`);
}

// Create the Supabase client with additional options
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
);

// Export a function to test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    // Use a simpler query without aggregation
    const { data, error } = await supabase
      .from('user_sessions')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Supabase connection test successful');
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection exception:', error);
    return { success: false, error: error.message };
  }
}; 