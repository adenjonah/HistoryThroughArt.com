import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';

// Constants
const USER_ID_KEY = 'history_art_user_id';
const SESSION_START_KEY = 'history_art_session_start';
const LAST_PING_KEY = 'history_art_last_ping';
const ACTIVE_TAB_KEY = 'history_art_active_tab';
const TAB_ID_KEY = 'history_art_tab_id';
const TAB_HEARTBEAT_INTERVAL_MS = 5000; // 5 seconds
// Track periodically (every 30 seconds)
const PING_INTERVAL_MS = 30 * 1000;
// Allowed domains for tracking
const ALLOWED_DOMAINS = ['historythroughart.com', 'www.historythroughart.com'];
// Excluded paths - won't be tracked
const EXCLUDED_PATHS = [
  '/admin',
  '/admin/',
  '/admin/dashboard',
  '/admin/supabase-debug',
  '/admin/settings',
  '/admin/users',
  '/test',
  '/test/',
  '/test-',
  '/debug',
  '/debug/',
  '/debug-',
  '/supabase-debug'
];

/**
 * Check if the current path should be excluded from tracking
 * @returns {boolean} Whether the current path should be excluded
 */
const shouldExcludePath = () => {
  const path = window.location.pathname.toLowerCase();
  
  // Check for exact matches first
  if (EXCLUDED_PATHS.includes(path)) {
    console.log(`TimeTracker: Tracking disabled for excluded path: ${path}`);
    return true;
  }
  
  // Check if path starts with any excluded prefix
  if (EXCLUDED_PATHS.some(prefix => path.startsWith(prefix))) {
    console.log(`TimeTracker: Tracking disabled for excluded path: ${path}`);
    return true;
  }
  
  // Check for keywords in path that indicate non-public pages
  const nonPublicKeywords = ['admin', 'test', 'debug', 'develop', 'dev-'];
  if (nonPublicKeywords.some(keyword => path.includes(keyword))) {
    console.log(`TimeTracker: Tracking disabled for path with excluded keyword: ${path}`);
    return true;
  }
  
  return false;
};

/**
 * Check if the current domain is allowed for tracking
 * @returns {boolean} Whether tracking is allowed
 */
const isTrackingAllowed = () => {
  const hostname = window.location.hostname;
  // Allow tracking only on production domains
  const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('.local');
  const isAllowedDomain = ALLOWED_DOMAINS.includes(hostname);
  
  if (isDevelopment) {
    console.log('TimeTracker: Tracking disabled on local development environment');
    return false;
  }
  
  if (!isAllowedDomain) {
    console.log(`TimeTracker: Tracking disabled on non-production domain: ${hostname}`);
    return false;
  }
  
  // Check if path should be excluded from tracking
  if (shouldExcludePath()) {
    return false;
  }
  
  return true;
};

/**
 * TimeTracker service to handle anonymous user tracking
 */
export const TimeTracker = {
  pingIntervalId: null,
  trackingEnabled: false,
  tabHeartbeatIntervalId: null,
  isActiveTab: false,
  tabId: null,
  
  /**
   * Initialize the time tracker when the app starts
   */
  initialize: () => {
    // Check if tracking is allowed on this domain
    TimeTracker.trackingEnabled = isTrackingAllowed();
    
    // Generate and store user ID if not already present
    if (!localStorage.getItem(USER_ID_KEY)) {
      localStorage.setItem(USER_ID_KEY, uuidv4());
    }
    
    // Generate a unique ID for this tab
    TimeTracker.tabId = uuidv4();
    localStorage.setItem(TAB_ID_KEY, TimeTracker.tabId);
    
    // Start the tab coordination mechanism
    TimeTracker.startTabCoordination();
    
    // Record session start time
    const now = Date.now();
    localStorage.setItem(SESSION_START_KEY, now.toString());
    localStorage.setItem(LAST_PING_KEY, now.toString());
    
    // Add event listeners to track session end
    window.addEventListener('beforeunload', () => {
      // Only record if this is the active tab and not on an excluded path
      if (TimeTracker.isActiveTab && !shouldExcludePath()) {
        TimeTracker.recordSession();
        // Clear active tab record so other tabs can take over
        localStorage.removeItem(ACTIVE_TAB_KEY);
      }
    });
    window.addEventListener('pagehide', () => {
      // Only record if this is the active tab and not on an excluded path
      if (TimeTracker.isActiveTab && !shouldExcludePath()) {
        TimeTracker.recordSession();
      }
    });
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // Only record if this is the active tab and not on an excluded path
        if (TimeTracker.isActiveTab && !shouldExcludePath()) {
          TimeTracker.recordSession();
        }
      } else {
        // When tab becomes visible, try to claim active status
        TimeTracker.tryClaimActiveTab();
      }
    });
    
    // Track page navigation within the app
    window.addEventListener('popstate', () => {
      // For SPAs, check the new path before recording
      if (TimeTracker.isActiveTab && !shouldExcludePath()) {
        TimeTracker.recordSession();
        localStorage.setItem(SESSION_START_KEY, Date.now().toString());
        localStorage.setItem(LAST_PING_KEY, Date.now().toString());
      }
    });

    // Also check for route changes (using MutationObserver)
    TimeTracker.setupRouteChangeListener();
    
    // Log Supabase configuration for debugging
    console.log('TimeTracker: Supabase URL present:', !!supabase.supabaseUrl);
    console.log('TimeTracker: Supabase Key length:', supabase.supabaseKey ? supabase.supabaseKey.length : 0);
    console.log('TimeTracker: Tracking enabled:', TimeTracker.trackingEnabled);
    
    // Test Supabase connection
    if (TimeTracker.trackingEnabled) {
      TimeTracker.testSupabaseConnection();
      
      // Set up periodic tracking
      TimeTracker.startPeriodicTracking();
    } else {
      console.log('TimeTracker: Skipping Supabase connection test and periodic tracking on non-production domain');
    }
    
    // For debugging
    console.log('TimeTracker initialized with user ID:', TimeTracker.getUserId(), 'tab ID:', TimeTracker.tabId);
    console.log('TimeTracker path tracking status:', !shouldExcludePath() ? 
      `Tracking enabled for public path: ${window.location.pathname}` : 
      `Tracking disabled for non-public path: ${window.location.pathname}`);
  },
  
  /**
   * Start tab coordination to avoid duplicate tracking of the same user
   */
  startTabCoordination: () => {
    // Try to claim this tab as the active one for tracking
    TimeTracker.tryClaimActiveTab();
    
    // Set up interval to maintain active tab status and handle tab switching
    TimeTracker.tabHeartbeatIntervalId = setInterval(() => {
      TimeTracker.tryClaimActiveTab();
    }, TAB_HEARTBEAT_INTERVAL_MS);
  },
  
  /**
   * Try to claim this tab as the active one for tracking
   */
  tryClaimActiveTab: () => {
    // Only visible tabs should try to claim active status
    if (document.visibilityState !== 'visible') {
      TimeTracker.isActiveTab = false;
      return;
    }
    
    const now = Date.now();
    const activeTabData = localStorage.getItem(ACTIVE_TAB_KEY);
    
    if (!activeTabData) {
      // No active tab, claim it
      const claim = {
        tabId: TimeTracker.tabId,
        timestamp: now
      };
      localStorage.setItem(ACTIVE_TAB_KEY, JSON.stringify(claim));
      TimeTracker.isActiveTab = true;
      console.log('TimeTracker: This tab claimed active status');
      return;
    }
    
    try {
      const activeTab = JSON.parse(activeTabData);
      const heartbeatAge = now - activeTab.timestamp;
      
      // If this is already the active tab, update the timestamp
      if (activeTab.tabId === TimeTracker.tabId) {
        activeTab.timestamp = now;
        localStorage.setItem(ACTIVE_TAB_KEY, JSON.stringify(activeTab));
        TimeTracker.isActiveTab = true;
        return;
      }
      
      // If the active tab's heartbeat is old (>10 seconds), assume it's inactive
      if (heartbeatAge > 10000) {
        const claim = {
          tabId: TimeTracker.tabId,
          timestamp: now
        };
        localStorage.setItem(ACTIVE_TAB_KEY, JSON.stringify(claim));
        TimeTracker.isActiveTab = true;
        console.log('TimeTracker: This tab took over active status (previous tab inactive)');
        return;
      }
      
      // There's an active tab and it's not this one
      TimeTracker.isActiveTab = false;
    } catch (e) {
      // In case of any error, claim active status to recover
      const claim = {
        tabId: TimeTracker.tabId,
        timestamp: now
      };
      localStorage.setItem(ACTIVE_TAB_KEY, JSON.stringify(claim));
      TimeTracker.isActiveTab = true;
      console.error('TimeTracker: Error in tab coordination, claiming active status', e);
    }
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
      // Only record if this is the active tab and not on an excluded path
      if (!TimeTracker.isActiveTab) {
        console.log('Periodic session tracking ping - skipped (not active tab)');
        return;
      }
      
      // Check if current path should be excluded
      if (shouldExcludePath()) {
        console.log(`Periodic session tracking ping - skipped (excluded path: ${window.location.pathname})`);
        return;
      }
      
      console.log('Periodic session tracking ping - active tab');
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
    // Skip tracking if not on production domain
    if (!TimeTracker.trackingEnabled) {
      console.log('TimeTracker: Skipping session recording on non-production domain');
      return;
    }
    
    // Check if current path should be excluded (for path changes during the session)
    if (shouldExcludePath()) {
      console.log(`TimeTracker: Skipping session recording for excluded path: ${window.location.pathname}`);
      return;
    }
    
    const sessionStart = parseInt(localStorage.getItem(SESSION_START_KEY) || '0');
    if (!sessionStart) return;
    
    const userId = TimeTracker.getUserId();
    if (!userId) return;
    
    const sessionTimeMs = Date.now() - sessionStart;
    const sessionTimeSec = Math.floor(sessionTimeMs / 1000);
    
    // Only record sessions longer than 1 second
    if (sessionTimeSec < 1) return;
    
    console.log(`Recording session: ${sessionTimeSec} seconds on ${window.location.pathname} (public path)`);
    
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
    // Skip tracking if not on production domain
    if (!TimeTracker.trackingEnabled) {
      console.log('TimeTracker: Skipping periodic session recording on non-production domain');
      return;
    }
    
    // Check if current path should be excluded (for path changes during the session)
    if (shouldExcludePath()) {
      console.log('TimeTracker: Skipping periodic session recording for excluded path');
      return;
    }
    
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
    
    if (TimeTracker.tabHeartbeatIntervalId) {
      clearInterval(TimeTracker.tabHeartbeatIntervalId);
      TimeTracker.tabHeartbeatIntervalId = null;
    }
    
    // If this was the active tab, clear that status
    if (TimeTracker.isActiveTab) {
      localStorage.removeItem(ACTIVE_TAB_KEY);
    }
  },

  /**
   * Set up a listener for route changes in a SPA
   */
  setupRouteChangeListener: () => {
    // Create a MutationObserver to watch for DOM changes that might indicate route changes
    const observer = new MutationObserver((mutations) => {
      // If URL has changed, record the previous session and start a new one
      const currentPath = window.location.pathname;
      if (TimeTracker.lastRecordedPath !== currentPath) {
        console.log(`TimeTracker: Detected route change from ${TimeTracker.lastRecordedPath} to ${currentPath}`);
        
        // Record the previous path if it wasn't excluded and this is the active tab
        if (TimeTracker.isActiveTab && TimeTracker.lastRecordedPath && !TimeTracker.isExcludedPath(TimeTracker.lastRecordedPath)) {
          TimeTracker.recordSession();
        }
        
        // Update tracking status based on new path
        TimeTracker.trackingEnabled = isTrackingAllowed();
        
        // Reset session start time for new path
        if (TimeTracker.isActiveTab) {
          localStorage.setItem(SESSION_START_KEY, Date.now().toString());
          localStorage.setItem(LAST_PING_KEY, Date.now().toString());
        }
        
        // Store current path for comparison on next change
        TimeTracker.lastRecordedPath = currentPath;
      }
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document, { 
      subtree: true, 
      childList: true,
      attributeFilter: ['href']
    });
    
    // Store initial path
    TimeTracker.lastRecordedPath = window.location.pathname;
  },

  /**
   * Check if a specific path should be excluded
   * @param {string} path - The path to check
   * @returns {boolean} Whether the path should be excluded
   */
  isExcludedPath: (path) => {
    const lowerPath = path.toLowerCase();
    
    // Check for exact matches
    if (EXCLUDED_PATHS.includes(lowerPath)) {
      return true;
    }
    
    // Check for path prefixes
    if (EXCLUDED_PATHS.some(prefix => lowerPath.startsWith(prefix))) {
      return true;
    }
    
    // Check for keywords
    const nonPublicKeywords = ['admin', 'test', 'debug', 'develop', 'dev-'];
    if (nonPublicKeywords.some(keyword => lowerPath.includes(keyword))) {
      return true;
    }
    
    return false;
  }
}; 