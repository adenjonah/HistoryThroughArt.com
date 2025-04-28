/**
 * Test data for analytics charts testing
 * Contains realistic session data patterns
 */

// Helper to generate dates
const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// Helper to generate random time between min and max
const randomTime = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Create sample sessions spread across the last 14 days
// with realistic patterns (more traffic on weekdays, varying session lengths)
export const generateSampleSessions = (count = 2000) => {
  const paths = ['/', '/about', '/exhibit', '/calendar', '/artgallery', '/flashcards', '/tutorial', '/test-connection'];
  const sessions = [];
  
  // Create a realistic distribution across paths and time
  // More sessions on popular pages and during weekdays
  for (let i = 0; i < count; i++) {
    // Create distribution with more recent sessions
    const daysBack = Math.floor(Math.pow(Math.random(), 2) * 14); // Weighted towards recent days
    
    // Create time of day weighting (more sessions during daytime)
    const hour = Math.floor(6 + Math.random() * 18) % 24; // More sessions 6am-11pm
    const minute = Math.floor(Math.random() * 60);
    
    const date = new Date();
    date.setDate(date.getDate() - daysBack);
    date.setHours(hour, minute, 0, 0);
    
    // Create a day of week weighting (more on weekdays)
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    if ((dayOfWeek === 0 || dayOfWeek === 6) && Math.random() > 0.3) {
      // Skip 70% of weekend sessions (creates weekday emphasis)
      i--; 
      continue;
    }
    
    // Path weighting (more sessions on main pages)
    let pathIndex;
    const rand = Math.random();
    if (rand < 0.5) {
      // 50% chance of homepage
      pathIndex = 0;
    } else if (rand < 0.8) {
      // 30% chance of other main pages
      pathIndex = Math.floor(Math.random() * 4) + 1;
    } else {
      // 20% chance of less visited pages
      pathIndex = Math.floor(Math.random() * 3) + 5;
    }
    
    // Session duration weighting (most sessions short, some longer)
    let sessionTime;
    const timeRand = Math.random();
    if (timeRand < 0.6) {
      // 60% of sessions are short (10s-2m)
      sessionTime = randomTime(10, 120);
    } else if (timeRand < 0.9) {
      // 30% are medium (2m-10m)
      sessionTime = randomTime(120, 600);
    } else {
      // 10% are long (10m-30m)
      sessionTime = randomTime(600, 1800);
    }
    
    // Create unique user IDs with some repeat visitors
    let userId;
    if (i < 100) {
      // First 100 sessions are from first 10 users (repeat visitors)
      userId = `test-user-${Math.floor(i / 10) + 1}`;
    } else {
      // Rest are mostly unique with some repeats
      userId = `test-user-${Math.floor(Math.random() * 150) + 11}`;
    }
    
    sessions.push({
      id: `test-session-${i + 1}`,
      user_id: userId,
      session_time_sec: sessionTime,
      page_path: paths[pathIndex],
      created_at: date.toISOString()
    });
  }
  
  return sessions;
};

// Generate 2000 sample sessions
export const sampleSessions = generateSampleSessions(2000);

// Test function to validate chart calculations
export const validateChartData = (sessions) => {
  // Results object to store validation metrics
  const results = {
    totalSessions: sessions.length,
    totalUsers: new Set(sessions.map(s => s.user_id)).size,
    totalTime: sessions.reduce((sum, s) => sum + (s.session_time_sec || 0), 0),
    pathCounts: {},
    weekdayCounts: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0},
    durationBuckets: {
      '0-10s': 0,
      '10-30s': 0,
      '30-60s': 0,
      '1-2m': 0,
      '2-5m': 0, 
      '5-10m': 0,
      '10-30m': 0,
      '30m+': 0
    },
  };
  
  // Count sessions by path
  sessions.forEach(session => {
    // Count by path
    const path = session.page_path || 'unknown';
    if (!results.pathCounts[path]) {
      results.pathCounts[path] = 0;
    }
    results.pathCounts[path]++;
    
    // Count by weekday
    try {
      const date = new Date(session.created_at);
      const day = date.getDay();
      results.weekdayCounts[day]++;
    } catch (e) {
      console.error("Error processing date for weekday count:", e);
    }
    
    // Count by duration
    const duration = session.session_time_sec || 0;
    if (duration < 10) {
      results.durationBuckets['0-10s']++;
    } else if (duration < 30) {
      results.durationBuckets['10-30s']++;
    } else if (duration < 60) {
      results.durationBuckets['30-60s']++;
    } else if (duration < 120) {
      results.durationBuckets['1-2m']++;
    } else if (duration < 300) {
      results.durationBuckets['2-5m']++;
    } else if (duration < 600) {
      results.durationBuckets['5-10m']++;
    } else if (duration < 1800) {
      results.durationBuckets['10-30m']++;
    } else {
      results.durationBuckets['30m+']++;
    }
  });
  
  return results;
};

// Export validation metrics for the sample data
export const sampleSessionsValidation = validateChartData(sampleSessions); 