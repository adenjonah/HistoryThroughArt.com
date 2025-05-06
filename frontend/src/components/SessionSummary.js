import React, { useMemo } from 'react';

/**
 * Component to show a detailed summary of session data
 * @param {Object} props
 * @param {Array} props.sessions - Array of session data
 */
const SessionSummary = ({ sessions = [] }) => {
  // Calculate statistics
  const stats = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return {
        uniqueVisitors: 0,
        totalTime: 0,
        avgSessionTime: 0,
        uniquePages: 0,
        sessionsPerUser: 0,
        timePerUser: 0,
        pagesPerSession: 0,
        returningUsers: 0,
        returningRate: 0
      };
    }

    // Get unique users and pages
    const userIds = new Set();
    const pagePaths = new Set();
    const userSessions = {};
    const userPageCounts = {};
    let totalTime = 0;

    // Process all sessions
    sessions.forEach(session => {
      if (!session) return;
      
      const userId = session.user_id;
      const pagePath = session.page_path;
      const sessionTime = parseInt(session.session_time_sec) || 0;
      
      if (userId) {
        userIds.add(userId);
        
        // Count sessions per user
        userSessions[userId] = (userSessions[userId] || 0) + 1;
        
        // Track unique pages per user
        if (!userPageCounts[userId]) {
          userPageCounts[userId] = new Set();
        }
        if (pagePath) {
          userPageCounts[userId].add(pagePath);
        }
      }
      
      if (pagePath) {
        pagePaths.add(pagePath);
      }
      
      totalTime += sessionTime;
    });

    // Count returning users (users with more than 1 session)
    const returningUsers = Object.values(userSessions).filter(count => count > 1).length;
    const returningRate = userIds.size > 0 ? (returningUsers / userIds.size) * 100 : 0;

    // Calculate averages
    const avgSessionTime = sessions.length > 0 ? totalTime / sessions.length : 0;
    const sessionsPerUser = userIds.size > 0 ? sessions.length / userIds.size : 0;
    const timePerUser = userIds.size > 0 ? totalTime / userIds.size : 0;
    
    // Calculate average pages per session
    let totalPageVisits = 0;
    Object.values(userPageCounts).forEach(pages => {
      totalPageVisits += pages.size;
    });
    const pagesPerSession = sessions.length > 0 ? totalPageVisits / sessions.length : 0;

    return {
      uniqueVisitors: userIds.size,
      totalTime,
      avgSessionTime,
      uniquePages: pagePaths.size,
      sessionsPerUser,
      timePerUser,
      pagesPerSession,
      returningUsers,
      returningRate
    };
  }, [sessions]);

  // Format time from seconds to readable format
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-4">Session Summary</h3>
        <p className="text-sm text-gray-500 mb-4">Detailed statistics based on {sessions.length} sessions</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-800 font-medium">Unique Visitors</div>
            <div className="text-2xl font-bold text-blue-900">{stats.uniqueVisitors}</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-800 font-medium">Sessions per User</div>
            <div className="text-2xl font-bold text-green-900">{stats.sessionsPerUser.toFixed(1)}</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-800 font-medium">Average Session</div>
            <div className="text-2xl font-bold text-purple-900">{formatTime(stats.avgSessionTime)}</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-yellow-800 font-medium">Unique Pages</div>
            <div className="text-2xl font-bold text-yellow-900">{stats.uniquePages}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-sm text-indigo-800 font-medium">Time per User</div>
            <div className="text-2xl font-bold text-indigo-900">{formatTime(stats.timePerUser)}</div>
          </div>
          
          <div className="bg-pink-50 p-4 rounded-lg">
            <div className="text-sm text-pink-800 font-medium">Pages per Session</div>
            <div className="text-2xl font-bold text-pink-900">{stats.pagesPerSession.toFixed(1)}</div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-red-800 font-medium">Returning Visitors</div>
            <div className="text-2xl font-bold text-red-900">
              {stats.returningUsers} ({stats.returningRate.toFixed(1)}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionSummary; 