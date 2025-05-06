import React, { useState } from 'react';

/**
 * Component to display user statistics
 * @param {Object} props
 * @param {Array} props.userStats - Array of user statistics
 * @param {number} props.totalUsers - Total number of unique users
 * @param {number} props.totalSessions - Total number of sessions
 * @param {number} props.totalTime - Total time in seconds
 */
const UserStats = ({ userStats = [], totalUsers, totalSessions, totalTime }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'total_time_sec',
    direction: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  
  // Filter out test entries and normalize user data
  const normalizeUserStats = (stats) => {
    if (!stats) return [];
    
    return stats
      .filter(user => {
        // Filter out test and permission test entries
        const userId = (user.user_id || '').toLowerCase();
        const isTestEntry = 
          userId.includes('test-') || 
          userId.includes('permissi') ||
          userId === 'anonymous' ||
          user.session_count < 2; // Filter single-session users
        
        return !isTestEntry;
      })
      .map(user => {
        // Generate a consistent but anonymous user identifier
        // Take first 8 chars of the ID as a stable reference
        const shortId = user.user_id ? user.user_id.substring(0, 8) : 'unknown';
        
        return {
          ...user,
          display_id: `User ${shortId}...`
        };
      });
  };
  
  const normalizedUserStats = normalizeUserStats(userStats);
  
  // Sort and filter the data
  const getSortedData = () => {
    const filteredData = normalizedUserStats.filter(user => {
      return searchTerm === '' || 
        user.display_id.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    // Limit to top 20 users by default
    const limitedData = showAll ? 
      filteredData : 
      filteredData.slice(0, 20);
    
    return [...limitedData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };
  
  // Handle column sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Format seconds to readable time
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours}h ${minutes}m ${secs}s`;
  };
  
  // Calculate average session length
  const getAvgSessionLength = (totalTime, sessionCount) => {
    if (!sessionCount) return '0h 0m 0s';
    const avgSeconds = Math.floor(totalTime / sessionCount);
    return formatTime(avgSeconds);
  };
  
  const sortedData = getSortedData();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">User Statistics</h3>
        <p className="text-sm text-gray-500 mb-4">Total time spent per user</p>
        
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-800 font-medium">Unique Users</div>
            <div className="text-2xl font-bold text-blue-900">{totalUsers || normalizedUserStats.length}</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-800 font-medium">Total Sessions</div>
            <div className="text-2xl font-bold text-green-900">{totalSessions || '0'}</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-800 font-medium">Total Time</div>
            <div className="text-2xl font-bold text-purple-900">{formatTime(totalTime || 0)}</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="w-64">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
          >
            {showAll ? 'Show Top 20' : 'Show All Users'}
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('display_id')}
                >
                  User ID
                  {sortConfig.key === 'display_id' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('total_time_sec')}
                >
                  Total Time
                  {sortConfig.key === 'total_time_sec' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('session_count')}
                >
                  Session Count
                  {sortConfig.key === 'session_count' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Session Length
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.display_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(user.total_time_sec)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.session_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getAvgSessionLength(user.total_time_sec, user.session_count)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedData.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No user data available or matching the search criteria.
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-500">
          Showing {sortedData.length} of {normalizedUserStats.length} active users.
          {!showAll && normalizedUserStats.length > 20 && (
            <span> Click "Show All Users" to see all {normalizedUserStats.length} users.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStats; 