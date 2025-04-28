import React, { useState, useEffect } from 'react';
import { sampleSessions, sampleSessionsValidation } from '../utils/testData';
import AnalyticsCharts from './AnalyticsCharts';

/**
 * Test component to validate chart rendering with sample data
 */
const ChartTester = () => {
  const [sessions, setSessions] = useState(sampleSessions);
  const [validation, setValidation] = useState(sampleSessionsValidation);
  const [testResults, setTestResults] = useState({});
  const [showData, setShowData] = useState(false);
  const [showLast24Hours, setShowLast24Hours] = useState(false);
  
  // Calculate sessions in the last 24 hours
  useEffect(() => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setHours(now.getHours() - 24);
    
    const last24HoursSessions = sessions.filter(session => {
      try {
        const sessionDate = new Date(session.created_at);
        return sessionDate >= yesterday;
      } catch (e) {
        return false;
      }
    });
    
    setTestResults({
      totalSessions: sessions.length,
      last24HoursSessions: last24HoursSessions.length,
      totalUsers: validation.totalUsers,
      totalTime: formatTime(validation.totalTime),
      weekdayDistribution: Object.keys(validation.weekdayCounts).map(day => 
        `${getDayName(parseInt(day))}: ${validation.weekdayCounts[day]}`
      ),
    });
  }, [sessions, validation]);
  
  // Format seconds to readable time
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };
  
  // Get weekday name
  const getDayName = (day) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };
  
  // Filter data to only show last 24 hours for testing
  const handleToggleLast24Hours = () => {
    setShowLast24Hours(!showLast24Hours);
    
    if (!showLast24Hours) {
      // Filter to last 24 hours
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setHours(now.getHours() - 24);
      
      const filteredSessions = sampleSessions.filter(session => {
        try {
          const sessionDate = new Date(session.created_at);
          return sessionDate >= yesterday;
        } catch (e) {
          return false;
        }
      });
      
      setSessions(filteredSessions);
    } else {
      // Reset to all sessions
      setSessions(sampleSessions);
    }
  };
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Analytics Charts Test</h1>
        <p className="text-gray-600 mb-4">Testing charts with {sessions.length} sample sessions</p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button 
            onClick={handleToggleLast24Hours}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showLast24Hours ? 'Show All Data' : 'Show Last 24 Hours Only'}
          </button>
          
          <button 
            onClick={() => setShowData(!showData)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {showData ? 'Hide Test Data' : 'Show Test Data'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Total Sessions</h3>
            <p className="text-2xl font-bold text-blue-600">{testResults.totalSessions}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Last 24h Sessions</h3>
            <p className="text-2xl font-bold text-green-600">{testResults.last24HoursSessions}</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-2xl font-bold text-yellow-600">{testResults.totalUsers}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Total Time</h3>
            <p className="text-2xl font-bold text-purple-600">{testResults.totalTime}</p>
          </div>
        </div>
      </div>
      
      {showData && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Test Data</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Page Counts</h3>
              <ul className="space-y-1">
                {Object.entries(validation.pathCounts)
                  .sort((a, b) => b[1] - a[1]) // Sort by count descending
                  .map(([path, count]) => (
                    <li key={path} className="flex justify-between">
                      <span className="font-mono">{path}</span>
                      <span className="font-medium">{count}</span>
                    </li>
                  ))
                }
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Weekday Distribution</h3>
              <ul className="space-y-1">
                {testResults.weekdayDistribution?.map((day, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{day}</span>
                  </li>
                ))}
              </ul>
              
              <h3 className="text-lg font-medium mt-6 mb-2">Duration Distribution</h3>
              <ul className="space-y-1">
                {Object.entries(validation.durationBuckets).map(([bucket, count]) => (
                  <li key={bucket} className="flex justify-between">
                    <span>{bucket}</span>
                    <span className="font-medium">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Sample Sessions (First 5)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">User</th>
                    <th className="px-4 py-2 border">Path</th>
                    <th className="px-4 py-2 border">Time (s)</th>
                    <th className="px-4 py-2 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.slice(0, 5).map(session => (
                    <tr key={session.id}>
                      <td className="px-4 py-2 border font-mono text-xs">{session.id}</td>
                      <td className="px-4 py-2 border font-mono text-xs">{session.user_id}</td>
                      <td className="px-4 py-2 border">{session.page_path}</td>
                      <td className="px-4 py-2 border text-right">{session.session_time_sec}</td>
                      <td className="px-4 py-2 border font-mono text-xs">{new Date(session.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Charts</h2>
        <AnalyticsCharts sessions={sessions} />
      </div>
    </div>
  );
};

export default ChartTester; 