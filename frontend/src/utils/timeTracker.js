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
    
    // Set up periodic tracking
    TimeTracker.startPeriodicTracking();
    
    // For debugging
    console.log('TimeTracker initialized with user ID:', TimeTracker.getUserId());
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
      await supabase.from('user_sessions').insert({
        user_id: userId,
        session_time_sec: sessionTimeSec,
        page_path: window.location.pathname
      });
      
      // Reset session start time
      localStorage.setItem(SESSION_START_KEY, Date.now().toString());
      localStorage.setItem(LAST_PING_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error recording session:', error);
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
      await supabase.from('user_sessions').insert({
        user_id: userId,
        session_time_sec: durationSec,
        page_path: window.location.pathname,
        created_at: new Date(timestamp).toISOString()
      });
    } catch (error) {
      console.error('Error recording periodic session:', error);
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