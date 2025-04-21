import React, { useState, useEffect } from 'react';
import { AuthService } from '../../utils/authService';
import { AnalyticsService } from '../../utils/analyticsService';
import AdminLogin from '../../components/AdminLogin';
import UserStats from '../../components/UserStats';
import SessionsTable from '../../components/SessionsTable';
import FilterControls from '../../components/FilterControls';

/**
 * Admin Dashboard for analytics
 */
const AdminDashboard = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data state
  const [userStats, setUserStats] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [pagePaths, setPagePaths] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  
  // Filter state
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    pagePath: '',
    minSessionLength: ''
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await AuthService.isAuthenticated();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Load data when authenticated or filters change
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Get user aggregated stats (doesn't depend on filters)
        const userStatsData = await AnalyticsService.getUserTimeAggregated();
        setUserStats(userStatsData);
        
        // Get total time (doesn't depend on filters)
        const totalTimeData = await AnalyticsService.getTotalTime();
        setTotalTime(totalTimeData);
        
        // Get unique page paths for filter dropdown
        const paths = await AnalyticsService.getUniquePaths();
        setPagePaths(paths);
        
        // Get filtered sessions
        const sessionsData = await AnalyticsService.getSessions(filters);
        setSessions(sessionsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [isAuthenticated, filters]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Handle successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Format seconds to readable time
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours}h ${minutes}m ${secs}s`;
  };

  // Show login page if not authenticated
  if (!isAuthenticated && !isLoading) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-500">View and analyze user session data</p>
            </div>
            <div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-500">Loading data...</div>
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h3 className="text-sm font-medium text-gray-500">Total Time Spent</h3>
                  <p className="text-3xl font-bold text-blue-600">{formatTime(totalTime)}</p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50">
                  <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                  <p className="text-3xl font-bold text-green-600">{userStats.length}</p>
                </div>
                <div className="p-4 border rounded-lg bg-purple-50">
                  <h3 className="text-sm font-medium text-gray-500">Total Sessions</h3>
                  <p className="text-3xl font-bold text-purple-600">{sessions.length}</p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <FilterControls
              filters={filters}
              setFilters={setFilters}
              pagePaths={pagePaths}
            />

            {/* User Stats */}
            <div className="mb-6">
              <UserStats userStats={userStats} />
            </div>

            {/* Sessions Table */}
            <SessionsTable sessions={sessions} />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 