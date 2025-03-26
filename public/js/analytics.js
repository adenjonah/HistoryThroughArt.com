class TimeTracker {
  constructor() {
    this.pageLoadTime = Date.now();
    this.currentPage = window.location.pathname;
    this.sessionStart = Date.now();
    this.pageHistory = [];
    this.isActive = true;
    this.eventQueue = [];
    this.flushInterval = 10000; // 10 seconds
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Set up regular data flushing
    this.setupDataFlushing();
  }
  
  setupEventListeners() {
    // Track page changes (for SPA)
    window.addEventListener('popstate', this.handlePageChange.bind(this));
    
    // Track when user leaves/returns to the page
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Track user activity (throttled)
    document.addEventListener('click', this.resetInactivityTimer.bind(this));
    document.addEventListener('keypress', this.resetInactivityTimer.bind(this));
    
    // Throttle mousemove and scroll events
    let throttleTimer;
    const throttleEvents = (event) => {
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          throttleTimer = null;
          this.resetInactivityTimer(event);
        }, 500); // Throttle to once every 500ms
      }
    };
    
    document.addEventListener('mousemove', throttleEvents);
    document.addEventListener('scroll', throttleEvents);
    
    // Track when user leaves the site
    window.addEventListener('beforeunload', this.handleUnload.bind(this));
    
    // Set inactivity timer
    this.inactivityTimer = setTimeout(this.handleInactivity.bind(this), 60000); // 1 minute
  }
  
  setupDataFlushing() {
    // Regularly send data to reduce data loss
    this.flushInterval = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flushEvents();
      }
    }, this.flushInterval);
  }
  
  handlePageChange() {
    const timeSpent = Date.now() - this.pageLoadTime;
    
    // Log the previous page visit
    this.pageHistory.push({
      page: this.currentPage,
      timeSpent: timeSpent,
      timestamp: new Date().toISOString()
    });
    
    // Queue the analytics event
    this.queueEvent({
      event: 'page_view_time',
      page: this.currentPage,
      timeSpent: timeSpent
    });
    
    // Update current page and reset timer
    this.currentPage = window.location.pathname;
    this.pageLoadTime = Date.now();
  }
  
  handleVisibilityChange() {
    if (document.hidden) {
      // User left the page
      this.isActive = false;
      clearTimeout(this.inactivityTimer);
      
      // Calculate time spent on current page so far
      const timeSpent = Date.now() - this.pageLoadTime;
      
      // Queue intermediate data
      this.queueEvent({
        event: 'page_inactive',
        page: this.currentPage,
        timeSpent: timeSpent
      });
      
      // Flush events when page becomes hidden
      this.flushEvents();
    } else {
      // User returned to the page
      this.isActive = true;
      this.pageLoadTime = Date.now(); // Reset timer
      this.resetInactivityTimer();
    }
  }
  
  resetInactivityTimer() {
    if (!this.isActive) {
      this.isActive = true;
      this.pageLoadTime = Date.now(); // Reset page timer on return from inactivity
    }
    
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(this.handleInactivity.bind(this), 60000); // 1 minute
  }
  
  handleInactivity() {
    this.isActive = false;
    
    // Calculate time spent on current page so far
    const timeSpent = Date.now() - this.pageLoadTime;
    
    // Queue data about inactivity
    this.queueEvent({
      event: 'user_inactive',
      page: this.currentPage,
      timeSpent: timeSpent
    });
    
    // Flush events when user becomes inactive
    this.flushEvents();
  }
  
  handleUnload() {
    // Clear flush interval
    clearInterval(this.flushInterval);
    
    // Calculate final time on current page
    const timeSpent = Date.now() - this.pageLoadTime;
    const totalSessionTime = Date.now() - this.sessionStart;
    
    // Send final analytics before page unloads
    const finalEvent = {
      event: 'session_end',
      page: this.currentPage,
      timeSpent: timeSpent,
      totalSessionTime: totalSessionTime,
      pageHistory: this.pageHistory
    };
    
    // Use sendBeacon for reliable delivery when page is unloading
    const data = this.prepareAnalyticsData(finalEvent);
    navigator.sendBeacon('/api/analytics', JSON.stringify(data));
  }
  
  queueEvent(data) {
    this.eventQueue.push(data);
    
    // Auto-flush if queue gets too large
    if (this.eventQueue.length >= 10) {
      this.flushEvents();
    }
  }
  
  flushEvents() {
    if (this.eventQueue.length === 0) return;
    
    const events = [...this.eventQueue];
    this.eventQueue = [];
    
    // Prepare batch data
    const batchData = {
      event: 'batch',
      events: events.map(event => this.prepareAnalyticsData(event, false))
    };
    
    // Add session ID to the batch itself
    const finalData = this.prepareAnalyticsData(batchData, false);
    
    // Send the data
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finalData)
    }).catch(error => {
      console.error('Failed to send analytics:', error);
      // Re-add events to queue on failure
      this.eventQueue = [...events, ...this.eventQueue];
    });
  }
  
  prepareAnalyticsData(data, addIds = true) {
    const preparedData = { ...data };
    
    // Add timestamp if not present
    if (!preparedData.timestamp) {
      preparedData.timestamp = new Date().toISOString();
    }
    
    if (addIds) {
      // Add visitor ID (anonymous identifier)
      preparedData.visitorId = this.getVisitorId();
      
      // Add session ID
      preparedData.sessionId = this.getSessionId();
    }
    
    return preparedData;
  }
  
  getVisitorId() {
    // Get or create persistent visitor ID (using localStorage)
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = this.generateUUID();
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  }
  
  getSessionId() {
    // Get or create session ID (using sessionStorage)
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = this.generateUUID();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }
  
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Initialize the tracker
document.addEventListener('DOMContentLoaded', () => {
  window.timeTracker = new TimeTracker();
  
  // Record initial page view
  setTimeout(() => {
    if (window.timeTracker) {
      window.timeTracker.queueEvent({
        event: 'page_load',
        page: window.location.pathname,
        referrer: document.referrer || null
      });
    }
  }, 1000);
}); 