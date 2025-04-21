import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';

// Constants
const USER_ID_KEY = 'history_art_user_id';
const SESSION_START_KEY = 'history_art_session_start';

/**
 * TimeTracker service to handle anonymous user tracking
 */
export const TimeTracker = {
  /**
   * Initialize the time tracker when the app starts
   */
  initialize: () => {
    // Generate and store user ID if not already present
    if (!localStorage.getItem(USER_ID_KEY)) {
      localStorage.setItem(USER_ID_KEY, uuidv4());
    }
    
    // Record session start time
    localStorage.setItem(SESSION_START_KEY, Date.now().toString());
    
    // Add beforeunload event to track session end
    window.addEventListener('beforeunload', TimeTracker.recordSession);
    
    // Track page navigation within the app
    window.addEventListener('popstate', () => {
      TimeTracker.recordSession();
      localStorage.setItem(SESSION_START_KEY, Date.now().toString());
    });
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
    
    try {
      await supabase.from('user_sessions').insert({
        user_id: userId,
        session_time_sec: sessionTimeSec,
        page_path: window.location.pathname
      });
    } catch (error) {
      console.error('Error recording session:', error);
    }
  },
  
  /**
   * Clean up event listeners
   */
  cleanup: () => {
    window.removeEventListener('beforeunload', TimeTracker.recordSession);
  }
}; 