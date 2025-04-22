import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';

// Constants
const USER_ID_KEY = 'history_art_user_id';
const SESSION_START_KEY = 'history_art_session_start';
const LAST_PING_KEY = 'history_art_last_ping';
// Track periodically (every 30 seconds)
const PING_INTERVAL_MS = 30 * 1000;

/**
 * TimeTracker service to handle anonymous user tracking
 */
export const TimeTracker = {
  pingIntervalId: null,
  
  /**
   * Initialize the time tracker when the app starts
   */
  initialize: () => {
    // Generate and store user ID if not already present
    if (!localStorage.getItem(USER_ID_KEY)) {
      localStorage.setItem(USER_ID_KEY, uuidv4());
    }
    
    // Record session start time
    const now = Date.now();
    localStorage.setItem(SESSION_START_KEY, now.toString());
    localStorage.setItem(LAST_PING_KEY, now.toString());
    
    // Add event listeners to track session end
    window.addEventListener('beforeunload', TimeTracker.recordSession);
    window.addEventListener('pagehide', TimeTracker.recordSession); // Works better on iOS and some mobile browsers
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        TimeTracker.recordSession();
      }
    });
    
    // Track page navigation within the app
    window.addEventListener('popstate', () => {
      TimeTracker.recordSession();
      localStorage.setItem(SESSION_START_KEY, Date.now().toString());
      localStorage.setItem(LAST_PING_KEY, Date.now().toString());
    });
    
    // Log Supabase configuration for debugging
    console.log('TimeTracker: Supabase URL present:', !!supabase.supabaseUrl);
    console.log('TimeTracker: Supabase Key length:', supabase.supabaseKey ? supabase.supabaseKey.length : 0);
    
    // Test Supabase connection
    TimeTracker.testSupabaseConnection();
    
    // Set up periodic tracking
    TimeTracker.startPeriodicTracking();
    
    // For debugging
    console.log('TimeTracker initialized with user ID:', TimeTracker.getUserId());
  },
  
  /**
   * Test Supabase connection to diagnose issues
   */
  testSupabaseConnection: async () => {
    try {
      console.log('Testing Supabase connection...');
      
      // First test health/ping endpoint
      const { data: pingData, error: pingError } = await supabase.from('user_sessions').select('id').limit(1);
      
      if (pingError) {
        console.error('Supabase connection test failed:', pingError);
        console.error('Error details:', {
          code: pingError.code,
          message: pingError.message,
          hint: pingError.hint,
          details: pingError.details
        });
      } else {
        console.log('Supabase connection test successful', pingData);
      }
      
      // Try inserting test record
      const testSession = {
        user_id: 'test-connection-' + Date.now(),
        session_time_sec: 1,
        page_path: '/test-connection'
      };
      
      console.log('Attempting test insert with data:', testSession);
      
      const { data: insertData, error: insertError } = await supabase
        .from('user_sessions')
        .insert(testSession)
        .select();
      
      if (insertError) {
        console.error('Supabase test insert failed:', insertError);
        console.error('Insert error details:', {
          code: insertError.code,
          message: insertError.message,
          hint: insertError.hint,
          details: insertError.details
        });
        
        // Log headers for debugging
        console.log('Supabase client settings:', {
          headers: supabase.restClient.headers
        });
      } else {
        console.log('Supabase test insert successful', insertData);
      }
    } catch (error) {
      console.error('Unexpected error testing Supabase connection:', error);
    }
  },
  
  /**
   * Start periodic tracking to save session data regularly
   */
  startPeriodicTracking: () => {
    // Clear any existing interval
    if (TimeTracker.pingIntervalId) {
      clearInterval(TimeTracker.pingIntervalId);
    }
    
    // Set up new interval
    TimeTracker.pingIntervalId = setInterval(() => {
      console.log('Periodic session tracking ping');
      const lastPing = parseInt(localStorage.getItem(LAST_PING_KEY) || '0');
      
      // Record since last ping
      if (lastPing > 0) {
        const now = Date.now();
        const pingDurationSec = Math.floor((now - lastPing) / 1000);
        
        // Only record if it's been more than 5 seconds since last ping
        if (pingDurationSec > 5) {
          TimeTracker.recordSessionWithDuration(pingDurationSec, lastPing);
          localStorage.setItem(LAST_PING_KEY, now.toString());
        }
      }
    }, PING_INTERVAL_MS);
  },
  
  /**
   * Get the current user ID
   * @returns {string} User ID
   */
  getUserId: () => {
    return localStorage.getItem(USER_ID_KEY) || '';
  },
  
  /**
   * Record the current session to Supabase
   */
  recordSession: async () => {
    const sessionStart = parseInt(localStorage.getItem(SESSION_START_KEY) || '0');
    if (!sessionStart) return;
    
    const userId = TimeTracker.getUserId();
    if (!userId) return;
    
    const sessionTimeMs = Date.now() - sessionStart;
    const sessionTimeSec = Math.floor(sessionTimeMs / 1000);
    
    // Only record sessions longer than 1 second
    if (sessionTimeSec < 1) return;
    
    console.log(`Recording session: ${sessionTimeSec} seconds on ${window.location.pathname}`);
    
    try {
      const sessionData = {
        user_id: userId,
        session_time_sec: sessionTimeSec,
        page_path: window.location.pathname
      };
      
      console.log('Sending session data:', sessionData);
      
      const { data, error } = await supabase
        .from('user_sessions')
        .insert(sessionData)
        .select();
      
      if (error) {
        console.error('Error recording session:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          hint: error.hint,
          details: error.details
        });
        
        // Store failed records in localStorage for later retry
        const failedRecords = JSON.parse(localStorage.getItem('failed_sessions') || '[]');
        failedRecords.push({
          ...sessionData,
          timestamp: new Date().toISOString(),
          error: error.message
        });
        localStorage.setItem('failed_sessions', JSON.stringify(failedRecords));
      } else {
        console.log('Session recorded successfully:', data);
      }
      
      // Reset session start time
      localStorage.setItem(SESSION_START_KEY, Date.now().toString());
      localStorage.setItem(LAST_PING_KEY, Date.now().toString());
    } catch (error) {
      console.error('Unexpected error recording session:', error);
    }
  },
  
  /**
   * Record a session with specific duration and timestamp
   * @param {number} durationSec - Duration in seconds 
   * @param {number} timestamp - Timestamp when the session started
   */
  recordSessionWithDuration: async (durationSec, timestamp) => {
    const userId = TimeTracker.getUserId();
    if (!userId) return;
    
    // Only record sessions longer than 1 second
    if (durationSec < 1) return;
    
    console.log(`Recording periodic session: ${durationSec} seconds on ${window.location.pathname}`);
    
    try {
      const sessionData = {
        user_id: userId,
        session_time_sec: durationSec,
        page_path: window.location.pathname,
        created_at: new Date(timestamp).toISOString()
      };
      
      console.log('Sending periodic session data:', sessionData);
      
      const { data, error } = await supabase
        .from('user_sessions')
        .insert(sessionData)
        .select();
      
      if (error) {
        console.error('Error recording periodic session:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          hint: error.hint,
          details: error.details
        });
        
        // Store failed records in localStorage for later retry
        const failedRecords = JSON.parse(localStorage.getItem('failed_sessions') || '[]');
        failedRecords.push({
          ...sessionData,
          timestamp: new Date().toISOString(),
          error: error.message
        });
        localStorage.setItem('failed_sessions', JSON.stringify(failedRecords));
      } else {
        console.log('Periodic session recorded successfully:', data);
      }
    } catch (error) {
      console.error('Unexpected error recording periodic session:', error);
    }
  },
  
  /**
   * Clean up event listeners and intervals
   */
  cleanup: () => {
    window.removeEventListener('beforeunload', TimeTracker.recordSession);
    window.removeEventListener('pagehide', TimeTracker.recordSession);
    window.removeEventListener('visibilitychange', TimeTracker.recordSession);
    
    if (TimeTracker.pingIntervalId) {
      clearInterval(TimeTracker.pingIntervalId);
      TimeTracker.pingIntervalId = null;
    }
  }
}; 