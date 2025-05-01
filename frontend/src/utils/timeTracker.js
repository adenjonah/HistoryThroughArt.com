import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';
import Cookies from 'js-cookie';
import { UAParser } from 'ua-parser-js';

// Constants
const CLIENT_ID_KEY = 'hta_client_id';
const SESSION_ID_KEY = 'hta_session_id';
const SESSION_START_KEY = 'hta_session_start';
const LAST_PING_KEY = 'hta_last_ping';
const ACTIVE_TAB_KEY = 'hta_active_tab';
const TAB_ID_KEY = 'hta_tab_id';
const FAILED_SESSIONS_KEY = 'failed_sessions';
const COOKIE_EXPIRY_DAYS = 365; // 1 year
const TAB_HEARTBEAT_INTERVAL_MS = 5000; // 5 seconds
// Track periodically (every 30 seconds)
const PING_INTERVAL_MS = 30 * 1000;
// Retry failed sessions every 2 minutes
const RETRY_INTERVAL_MS = 2 * 60 * 1000;
// Max retries for failed sessions
const MAX_RETRIES = 5;
// Max failed sessions to store (prevent localStorage overflow)
const MAX_FAILED_SESSIONS = 100;
// Maximum session duration in seconds (3 hours)
const MAX_SESSION_DURATION = 10800;
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
  '/admin/chart-test',
  '/test',
  '/test/',
  '/test-',
  '/debug',
  '/debug/',
  '/debug-',
  '/supabase-debug',
  '/permission-test'
];

// User agent parser for device information
const uaParser = new UAParser();
const userAgentInfo = uaParser.getResult();

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
  const nonPublicKeywords = ['admin', 'test', 'debug', 'develop', 'dev-', 'permission'];
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
  // Allow local development for testing
  const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('.local');
  const isAllowedDomain = ALLOWED_DOMAINS.includes(hostname);
  
  // Always allow tracking in production domains
  if (isAllowedDomain) {
    // Check if path should be excluded from tracking
    if (shouldExcludePath()) {
      return false;
    }
    return true;
  }
  
  // For development environments, only track if explicitly enabled via localStorage
  if (isDevelopment) {
    const devTrackingEnabled = localStorage.getItem('hta_dev_tracking_enabled') === 'true';
    if (devTrackingEnabled) {
      console.log('TimeTracker: Development tracking enabled via localStorage flag');
      return !shouldExcludePath();
    } else {
      console.log('TimeTracker: Tracking disabled on local development environment');
      return false;
    }
  }
  
  console.log(`TimeTracker: Tracking disabled on non-production domain: ${hostname}`);
  return false;
};

/**
 * Add a failed session to localStorage for later retry
 * @param {Object} sessionData - The session data that failed to send
 * @param {string} errorMessage - The error message
 */
const addFailedSession = (sessionData, errorMessage) => {
  try {
    // Get existing failed sessions
    const failedRecords = JSON.parse(localStorage.getItem(FAILED_SESSIONS_KEY) || '[]');
    
    // Add new failed session with timestamp and retry count
    failedRecords.push({
      ...sessionData,
      timestamp: new Date().toISOString(),
      error: errorMessage,
      retryCount: 0
    });
    
    // Limit the number of stored failed sessions to prevent localStorage overflow
    const limitedRecords = failedRecords.slice(-MAX_FAILED_SESSIONS);
    
    // Store updated list
    localStorage.setItem(FAILED_SESSIONS_KEY, JSON.stringify(limitedRecords));
    
    console.log(`TimeTracker: Added failed session to retry queue (${limitedRecords.length} queued)`);
  } catch (error) {
    console.error('TimeTracker: Error storing failed session:', error);
  }
};

/**
 * TimeTracker service to handle anonymous user tracking
 */
export const TimeTracker = {
  pingIntervalId: null,
  retryIntervalId: null,
  trackingEnabled: false,
  tabHeartbeatIntervalId: null,
  isActiveTab: false,
  tabId: null,
  lastRecordedPath: null,
  isOnline: navigator.onLine,
  
  /**
   * Initialize the time tracker when the app starts
   */
  initialize: () => {
    // Check if tracking is allowed on this domain
    TimeTracker.trackingEnabled = isTrackingAllowed();
    
    // Generate and store client ID if not already present
    TimeTracker.ensureClientId();
    
    // Generate a session ID for this browser session
    TimeTracker.ensureSessionId();
    
    // Generate a unique ID for this tab
    TimeTracker.tabId = uuidv4();
    localStorage.setItem(TAB_ID_KEY, TimeTracker.tabId);
    
    // Start the tab coordination mechanism
    TimeTracker.startTabCoordination();
    
    // Record session start time
    const now = Date.now();
    localStorage.setItem(SESSION_START_KEY, now.toString());
    localStorage.setItem(LAST_PING_KEY, now.toString());
    
    // Set up online/offline detection
    window.addEventListener('online', () => {
      console.log('TimeTracker: Device is now online. Will retry sending failed sessions.');
      TimeTracker.isOnline = true;
      // Try to send any failed sessions immediately when coming online
      if (TimeTracker.isActiveTab) {
        TimeTracker.retryFailedSessions();
      }
    });
    
    window.addEventListener('offline', () => {
      console.log('TimeTracker: Device is now offline. Sessions will be queued for later.');
      TimeTracker.isOnline = false;
    });
    
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
      // Set up periodic tracking
      TimeTracker.startPeriodicTracking();
      
      // Set up retry mechanism for failed sessions
      TimeTracker.startRetryMechanism();
    } else {
      console.log('TimeTracker: Skipping Supabase connection test and periodic tracking on non-production domain');
    }
    
    // For debugging
    console.log('TimeTracker initialized with client ID:', TimeTracker.getClientId(), 'tab ID:', TimeTracker.tabId);
    console.log('TimeTracker path tracking status:', !shouldExcludePath() ? 
      `Tracking enabled for public path: ${window.location.pathname}` : 
      `Tracking disabled for non-public path: ${window.location.pathname}`);
    
    // Store initial path
    TimeTracker.lastRecordedPath = window.location.pathname;
  },
  
  /**
   * Ensure a client ID exists (creates one if needed)
   */
  ensureClientId: () => {
    // Check for a client ID in cookie first (more persistent)
    let clientId = Cookies.get(CLIENT_ID_KEY);
    
    // Fall back to localStorage
    if (!clientId) {
      clientId = localStorage.getItem(CLIENT_ID_KEY);
    }
    
    // Create a new client ID if none exists
    if (!clientId) {
      clientId = `hta_${uuidv4()}`;
      // Store in both cookies and localStorage for redundancy
      Cookies.set(CLIENT_ID_KEY, clientId, { expires: COOKIE_EXPIRY_DAYS, sameSite: 'strict' });
      localStorage.setItem(CLIENT_ID_KEY, clientId);
    }
    
    // Ensure both storage mechanisms have the same ID
    Cookies.set(CLIENT_ID_KEY, clientId, { expires: COOKIE_EXPIRY_DAYS, sameSite: 'strict' });
    localStorage.setItem(CLIENT_ID_KEY, clientId);
    
    return clientId;
  },
  
  /**
   * Ensure a session ID exists for this browser session
   */
  ensureSessionId: () => {
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    
    if (!sessionId) {
      sessionId = `sess_${uuidv4()}`;
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    
    return sessionId;
  },
  
  /**
   * Get the current client ID (persistent user identifier)
   * @returns {string} Client ID
   */
  getClientId: () => {
    // Try cookie first
    const cookieId = Cookies.get(CLIENT_ID_KEY);
    if (cookieId) return cookieId;
    
    // Fall back to localStorage
    return localStorage.getItem(CLIENT_ID_KEY) || '';
  },
  
  /**
   * Get the current session ID (browser session identifier)
   * @returns {string} Session ID
   */
  getSessionId: () => {
    return sessionStorage.getItem(SESSION_ID_KEY) || '';
  },
  
  /**
   * Get or create a current active session ID for the current page
   * @returns {string} The current active session record ID
   */
  getCurrentPageSessionId: () => {
    // Check if we have a current session ID for this page
    const currentPath = window.location.pathname;
    const storageKey = `hta_current_session_${currentPath}`;
    let sessionRecordId = localStorage.getItem(storageKey);
    
    // If no current session ID for this page, create one
    if (!sessionRecordId) {
      sessionRecordId = `sess_${Date.now()}`;
      localStorage.setItem(storageKey, sessionRecordId);
    }
    
    return sessionRecordId;
  },
  
  /**
   * Reset the current page session tracking
   * This should be called when navigating to a new page
   */
  resetCurrentPageSession: () => {
    const currentPath = window.location.pathname;
    const previousPath = TimeTracker.lastRecordedPath;
    
    // Clear the session record ID for the previous path
    if (previousPath && previousPath !== currentPath) {
      const storageKey = `hta_current_session_${previousPath}`;
      localStorage.removeItem(storageKey);
    }
    
    // Update last recorded path
    TimeTracker.lastRecordedPath = currentPath;
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
      // Check if the active tab claim is still valid
      const activeTab = JSON.parse(activeTabData);
      
      // If the last heartbeat was too long ago, the tab is probably closed
      if (now - activeTab.timestamp > TAB_HEARTBEAT_INTERVAL_MS * 2) {
        // Claim for this tab
        const claim = {
          tabId: TimeTracker.tabId,
          timestamp: now
        };
        localStorage.setItem(ACTIVE_TAB_KEY, JSON.stringify(claim));
        TimeTracker.isActiveTab = true;
        console.log('TimeTracker: This tab claimed active status (previous tab expired)');
        return;
      }
      
      // If this is already the active tab, just update the timestamp
      if (activeTab.tabId === TimeTracker.tabId) {
        activeTab.timestamp = now;
        localStorage.setItem(ACTIVE_TAB_KEY, JSON.stringify(activeTab));
        TimeTracker.isActiveTab = true;
        return;
      }
      
      // Another tab is active, update our status
      TimeTracker.isActiveTab = false;
    } catch (error) {
      // If there's an error, assume no active tab and claim it
      console.error('TimeTracker: Error parsing active tab data:', error);
      const claim = {
        tabId: TimeTracker.tabId,
        timestamp: now
      };
      localStorage.setItem(ACTIVE_TAB_KEY, JSON.stringify(claim));
      TimeTracker.isActiveTab = true;
    }
  },
  
  /**
   * Start periodic tracking
   */
  startPeriodicTracking: () => {
    // Clear any existing interval
    if (TimeTracker.pingIntervalId) {
      clearInterval(TimeTracker.pingIntervalId);
    }
    
    // Set up interval to track periodically
    TimeTracker.pingIntervalId = setInterval(() => {
      // Only record if this is the active tab, tracking is enabled, and not on excluded path
      if (TimeTracker.isActiveTab && TimeTracker.trackingEnabled && !shouldExcludePath()) {
        TimeTracker.recordPing();
      }
    }, PING_INTERVAL_MS);
    
    console.log('TimeTracker: Started periodic tracking with interval', PING_INTERVAL_MS, 'ms');
  },
  
  /**
   * Start retry mechanism for failed sessions
   */
  startRetryMechanism: () => {
    // Clear any existing interval
    if (TimeTracker.retryIntervalId) {
      clearInterval(TimeTracker.retryIntervalId);
    }
    
    // Set up interval to retry failed sessions
    TimeTracker.retryIntervalId = setInterval(() => {
      // Only retry if this is the active tab and we're online
      if (TimeTracker.isActiveTab && TimeTracker.isOnline) {
        TimeTracker.retryFailedSessions();
      }
    }, RETRY_INTERVAL_MS);
    
    console.log('TimeTracker: Started retry mechanism with interval', RETRY_INTERVAL_MS, 'ms');
  },
  
  /**
   * Record a periodic ping
   */
  recordPing: async () => {
    if (!TimeTracker.trackingEnabled || shouldExcludePath()) {
      return;
    }
    
    try {
      const now = Date.now();
      const lastPing = parseInt(localStorage.getItem(LAST_PING_KEY) || '0', 10);
      
      // Calculate time since last ping
      const timeSincePing = now - lastPing;
      
      // Only record if enough time has passed (at least 5 seconds)
      if (timeSincePing < 5000) {
        return;
      }
      
      // Record a ping with the time elapsed
      const durationSec = Math.floor(timeSincePing / 1000);
      
      // Update last ping time
      localStorage.setItem(LAST_PING_KEY, now.toString());
      
      // Try to update existing session first, fall back to creating a new one
      await TimeTracker.updateOrCreateSession(durationSec, lastPing);
    } catch (error) {
      console.error('TimeTracker: Error recording ping:', error);
    }
  },
  
  /**
   * Check if a path should be excluded from tracking
   * @param {string} path - The path to check
   * @returns {boolean} Whether the path should be excluded
   */
  isExcludedPath: (path) => {
    if (!path) return true;
    
    // Convert to lowercase for case-insensitive comparison
    const lowerPath = path.toLowerCase();
    
    // Check for exact matches
    if (EXCLUDED_PATHS.includes(lowerPath)) {
      return true;
    }
    
    // Check if path starts with any excluded prefix
    if (EXCLUDED_PATHS.some(prefix => lowerPath.startsWith(prefix))) {
      return true;
    }
    
    // Check for keywords in path
    const nonPublicKeywords = ['admin', 'test', 'debug', 'develop', 'dev-', 'permission'];
    if (nonPublicKeywords.some(keyword => lowerPath.includes(keyword))) {
      return true;
    }
    
    return false;
  },
  
  /**
   * Record a session
   */
  recordSession: async () => {
    // Skip tracking if disabled or on excluded path
    if (!TimeTracker.trackingEnabled || shouldExcludePath()) {
      return;
    }
    
    // Get session data
    const sessionStart = parseInt(localStorage.getItem(SESSION_START_KEY) || '0', 10);
    const now = Date.now();
    
    // Calculate session duration in seconds
    const sessionDuration = Math.floor((now - sessionStart) / 1000);
    
    // Only record if the session is long enough (at least 1 second)
    if (sessionDuration < 1) {
      console.log('TimeTracker: Session too short, not recording');
      return;
    }
    
    // Enforce maximum session duration
    const cappedDuration = Math.min(sessionDuration, MAX_SESSION_DURATION);
    if (sessionDuration > MAX_SESSION_DURATION) {
      console.log(`TimeTracker: Session duration (${sessionDuration}s) exceeds maximum allowed (${MAX_SESSION_DURATION}s), capping at maximum`);
    }
    
    try {
      await TimeTracker.recordSessionWithDuration(cappedDuration, sessionStart);
    } catch (error) {
      console.error('TimeTracker: Error recording session:', error);
    }
  },
  
  /**
   * Record a session with specific duration
   * @param {number} durationSec - The session duration in seconds
   * @param {number} timestamp - The timestamp of the session start
   */
  recordSessionWithDuration: async (durationSec, timestamp) => {
    // Skip tracking if disabled or on excluded path
    if (!TimeTracker.trackingEnabled || shouldExcludePath()) {
      return;
    }
    
    // Check required data
    const clientId = TimeTracker.getClientId();
    const sessionId = TimeTracker.getSessionId();
    const currentPath = window.location.pathname;
    
    if (!clientId || !sessionId) {
      console.error('TimeTracker: Missing client ID or session ID, cannot record session');
      return;
    }
    
    // Skip recording zero-duration sessions
    if (durationSec <= 0) {
      console.log('TimeTracker: Zero duration session, not recording');
      return;
    }
    
    // Skip test sessions - check both path and user ID
    if (
      clientId.toLowerCase().includes('test') || 
      clientId.toLowerCase().includes('rls-test') || 
      clientId.toLowerCase().includes('permission') ||
      currentPath.toLowerCase().includes('test') ||
      currentPath.toLowerCase().includes('rls-test') ||
      currentPath.toLowerCase().includes('permission')
    ) {
      console.log('TimeTracker: Skipping test session recording for:', { clientId, path: currentPath });
      return;
    }
    
    // Enforce maximum session duration
    if (durationSec > MAX_SESSION_DURATION) {
      console.log(`TimeTracker: Session duration (${durationSec}s) exceeds maximum allowed (${MAX_SESSION_DURATION}s), capping at maximum`);
      durationSec = MAX_SESSION_DURATION;
    }
    
    // Don't record if offline
    if (!TimeTracker.isOnline) {
      console.log('TimeTracker: Device is offline, queueing session for later');
      const sessionData = {
        user_id: clientId,
        session_id: sessionId,
        session_time_sec: durationSec,
        page_path: currentPath,
        device_type: userAgentInfo.device.type || 'desktop',
        browser: userAgentInfo.browser.name || 'unknown',
        os: userAgentInfo.os.name || 'unknown',
        referrer: document.referrer || null,
        created_at: new Date(timestamp).toISOString(),
        last_activity: new Date().toISOString()
      };
      
      addFailedSession(sessionData, 'Device offline');
      return;
    }
    
    try {
      const sessionData = {
        user_id: clientId,
        session_id: sessionId,
        session_time_sec: durationSec,
        page_path: currentPath,
        device_type: userAgentInfo.device.type || 'desktop',
        browser: userAgentInfo.browser.name || 'unknown',
        os: userAgentInfo.os.name || 'unknown',
        referrer: document.referrer || null,
        created_at: new Date(timestamp).toISOString(),
        last_activity: new Date().toISOString()
      };
      
      console.log('TimeTracker: Sending session data:', sessionData);
      
      const { data, error } = await supabase
        .from('user_sessions')
        .insert(sessionData)
        .select();
      
      if (error) {
        console.error('TimeTracker: Error recording session:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          hint: error.hint,
          details: error.details
        });
        
        // Store failed record for later retry
        addFailedSession(sessionData, error.message);
      } else {
        console.log('TimeTracker: Session recorded successfully:', data);
        
        // Store the session ID for future updates
        const storageKey = `hta_current_session_${currentPath}`;
        if (data && data.length > 0) {
          localStorage.setItem(storageKey, data[0].id);
        }
      }
    } catch (error) {
      console.error('TimeTracker: Unexpected error recording session:', error);
      
      // Store failed record for later retry
      const sessionData = {
        user_id: clientId,
        session_id: sessionId,
        session_time_sec: durationSec,
        page_path: currentPath,
        device_type: userAgentInfo.device.type || 'desktop',
        browser: userAgentInfo.browser.name || 'unknown',
        os: userAgentInfo.os.name || 'unknown',
        referrer: document.referrer || null,
        created_at: new Date(timestamp).toISOString(),
        last_activity: new Date().toISOString()
      };
      
      addFailedSession(sessionData, error.message);
    }
  },
  
  /**
   * Retry sending failed sessions
   */
  retryFailedSessions: async () => {
    // Only proceed if online
    if (!TimeTracker.isOnline) {
      console.log('TimeTracker: Device is offline, cannot retry failed sessions now');
      return;
    }
    
    try {
      // Get failed sessions from localStorage
      const failedSessions = JSON.parse(localStorage.getItem(FAILED_SESSIONS_KEY) || '[]');
      
      if (failedSessions.length === 0) {
        return; // No failed sessions to retry
      }
      
      console.log(`TimeTracker: Retrying ${failedSessions.length} failed sessions`);
      
      // Track which sessions were successfully sent
      const successfulIds = [];
      const updatedFailedSessions = [];
      
      // Process each failed session
      for (const session of failedSessions) {
        // Skip sessions that have been retried too many times
        if (session.retryCount >= MAX_RETRIES) {
          console.log(`TimeTracker: Session exceeded max retries, dropping:`, session);
          continue;
        }
        
        try {
          // Increment retry count
          session.retryCount = (session.retryCount || 0) + 1;
          
          // Check if this is an update to an existing session
          if (session.is_update && session.current_page_session_id) {
            // Try to update an existing session by finding it first
            const { data: existingSessions, error: findError } = await supabase
              .from('user_sessions')
              .select('id, session_time_sec')
              .eq('user_id', session.user_id)
              .eq('page_path', session.page_path)
              .order('created_at', { ascending: false })
              .limit(1);
            
            if (!findError && existingSessions && existingSessions.length > 0) {
              // Found an existing session, update it
              const existingSession = existingSessions[0];
              const newDuration = existingSession.session_time_sec + session.session_time_sec;
              
              // Enforce maximum session duration
              const cappedDuration = Math.min(newDuration, MAX_SESSION_DURATION);
              
              // Update the session
              const { error: updateError } = await supabase
                .from('user_sessions')
                .update({ 
                  session_time_sec: cappedDuration,
                  last_activity: new Date().toISOString()
                })
                .eq('id', existingSession.id);
              
              if (updateError) {
                console.error(`TimeTracker: Failed to update session (attempt ${session.retryCount}/${MAX_RETRIES}):`, updateError);
                updatedFailedSessions.push(session);
              } else {
                console.log('TimeTracker: Successfully updated session');
                successfulIds.push(session.timestamp);
              }
            } else {
              // No existing session found, create a new one
              const { error: insertError } = await supabase
                .from('user_sessions')
                .insert({
                  user_id: session.user_id,
                  session_id: session.session_id,
                  session_time_sec: session.session_time_sec,
                  page_path: session.page_path,
                  device_type: session.device_type,
                  browser: session.browser,
                  os: session.os,
                  referrer: session.referrer,
                  created_at: session.created_at,
                  last_activity: new Date().toISOString()
                });
              
              if (insertError) {
                console.error(`TimeTracker: Failed to retry session (attempt ${session.retryCount}/${MAX_RETRIES}):`, insertError);
                updatedFailedSessions.push(session);
              } else {
                console.log('TimeTracker: Successfully created session');
                successfulIds.push(session.timestamp);
              }
            }
          } else {
            // Normal insert - not an update
            const { error } = await supabase
              .from('user_sessions')
              .insert({
                user_id: session.user_id,
                session_id: session.session_id,
                session_time_sec: session.session_time_sec,
                page_path: session.page_path,
                device_type: session.device_type,
                browser: session.browser,
                os: session.os,
                referrer: session.referrer,
                created_at: session.created_at,
                last_activity: session.last_activity || session.created_at
              });
            
            if (error) {
              console.error(`TimeTracker: Failed to retry session (attempt ${session.retryCount}/${MAX_RETRIES}):`, error);
              // Keep in the failed sessions list with updated retry count
              updatedFailedSessions.push(session);
            } else {
              console.log('TimeTracker: Successfully retried session');
              // Mark as successful to remove from the list
              successfulIds.push(session.timestamp);
            }
          }
        } catch (error) {
          console.error('TimeTracker: Error retrying session:', error);
          // Keep in the failed sessions list with updated retry count
          updatedFailedSessions.push(session);
        }
      }
      
      // Update the localStorage with remaining failed sessions
      localStorage.setItem(FAILED_SESSIONS_KEY, JSON.stringify(updatedFailedSessions));
      
      // Log results
      const successCount = failedSessions.length - updatedFailedSessions.length;
      console.log(`TimeTracker: Retry complete. ${successCount} sessions recovered, ${updatedFailedSessions.length} still pending.`);
    } catch (error) {
      console.error('TimeTracker: Error in retry process:', error);
    }
  },
  
  /**
   * Get count of failed sessions
   * @returns {number} Count of failed sessions
   */
  getFailedSessionsCount: () => {
    try {
      const failedSessions = JSON.parse(localStorage.getItem(FAILED_SESSIONS_KEY) || '[]');
      return failedSessions.length;
    } catch (error) {
      console.error('TimeTracker: Error getting failed sessions count:', error);
      return 0;
    }
  },
  
  /**
   * Setup listener for route changes in SPA
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
          
          // Reset the current page session tracking
          TimeTracker.resetCurrentPageSession();
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
   * Clean up and stop tracking
   */
  cleanup: () => {
    // Clear intervals
    if (TimeTracker.pingIntervalId) {
      clearInterval(TimeTracker.pingIntervalId);
      TimeTracker.pingIntervalId = null;
    }
    
    if (TimeTracker.tabHeartbeatIntervalId) {
      clearInterval(TimeTracker.tabHeartbeatIntervalId);
      TimeTracker.tabHeartbeatIntervalId = null;
    }
    
    if (TimeTracker.retryIntervalId) {
      clearInterval(TimeTracker.retryIntervalId);
      TimeTracker.retryIntervalId = null;
    }
    
    // Record final session if active
    if (TimeTracker.isActiveTab && !shouldExcludePath()) {
      TimeTracker.recordSession();
    }
    
    console.log('TimeTracker: Cleaned up and stopped');
  },
  
  /**
   * Toggle tracking in development mode
   * @param {boolean} enabled - Whether to enable tracking
   */
  toggleDevTracking: (enabled) => {
    localStorage.setItem('hta_dev_tracking_enabled', enabled ? 'true' : 'false');
    console.log(`TimeTracker: Development tracking ${enabled ? 'enabled' : 'disabled'}`);
    TimeTracker.trackingEnabled = enabled && !shouldExcludePath();
    return TimeTracker.trackingEnabled;
  },
  
  /**
   * Update an existing session or create a new one if no active session exists
   * @param {number} durationSec - The duration to add to the session
   * @param {number} timestamp - The timestamp of this update
   */
  updateOrCreateSession: async (durationSec, timestamp) => {
    // Skip tracking if disabled or on excluded path
    if (!TimeTracker.trackingEnabled || shouldExcludePath()) {
      return;
    }
    
    // Skip recording zero-duration sessions
    if (durationSec <= 0) {
      console.log('TimeTracker: Zero duration session, not recording');
      return;
    }
    
    // Get the current page session ID
    const currentPageSessionId = TimeTracker.getCurrentPageSessionId();
    const clientId = TimeTracker.getClientId();
    const sessionId = TimeTracker.getSessionId();
    
    if (!clientId || !sessionId) {
      console.error('TimeTracker: Missing client ID or session ID, cannot record session');
      return;
    }
    
    // Don't record if offline
    if (!TimeTracker.isOnline) {
      console.log('TimeTracker: Device is offline, queueing session update for later');
      const sessionData = {
        user_id: clientId,
        session_id: sessionId,
        current_page_session_id: currentPageSessionId,
        session_time_sec: durationSec,
        page_path: window.location.pathname,
        device_type: userAgentInfo.device.type || 'desktop',
        browser: userAgentInfo.browser.name || 'unknown',
        os: userAgentInfo.os.name || 'unknown',
        referrer: document.referrer || null,
        created_at: new Date(timestamp).toISOString(),
        is_update: true
      };
      
      addFailedSession(sessionData, 'Device offline');
      return;
    }
    
    try {
      // First try to find an existing session to update
      const { data: existingSessions, error: findError } = await supabase
        .from('user_sessions')
        .select('id, session_time_sec')
        .eq('user_id', clientId)
        .eq('page_path', window.location.pathname)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (findError) {
        console.error('TimeTracker: Error finding existing session:', findError);
        // Fall back to creating a new session
        await TimeTracker.recordSessionWithDuration(durationSec, timestamp);
        return;
      }
      
      if (existingSessions && existingSessions.length > 0) {
        // Found an existing session, update it
        const existingSession = existingSessions[0];
        const newDuration = existingSession.session_time_sec + durationSec;
        
        // Enforce maximum session duration
        const cappedDuration = Math.min(newDuration, MAX_SESSION_DURATION);
        
        console.log(`TimeTracker: Updating existing session (ID: ${existingSession.id}) from ${existingSession.session_time_sec}s to ${cappedDuration}s`);
        
        const { data: updateData, error: updateError } = await supabase
          .from('user_sessions')
          .update({ 
            session_time_sec: cappedDuration,
            last_activity: new Date().toISOString()
          })
          .eq('id', existingSession.id);
        
        if (updateError) {
          console.error('TimeTracker: Error updating session:', updateError);
          // If update fails, try creating a new record
          await TimeTracker.recordSessionWithDuration(durationSec, timestamp);
        } else {
          console.log('TimeTracker: Session updated successfully:', updateData);
        }
      } else {
        // No existing session found, create a new one
        console.log('TimeTracker: No existing session found, creating new one');
        await TimeTracker.recordSessionWithDuration(durationSec, timestamp);
      }
    } catch (error) {
      console.error('TimeTracker: Unexpected error updating session:', error);
      // Fall back to creating a new session
      await TimeTracker.recordSessionWithDuration(durationSec, timestamp);
    }
  }
}; 