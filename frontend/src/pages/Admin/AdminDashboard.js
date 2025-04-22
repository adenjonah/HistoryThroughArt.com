import React, { useState, useEffect } from 'react';
import { AuthService } from '../../utils/authService';
import { AnalyticsService } from '../../utils/analyticsService';
import { testSupabaseConnection } from '../../utils/supabaseClient';
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
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({ tested: false, success: false, message: '' });
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
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

  // Debug environment variables
  useEffect(() => {
    console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL ? 'Defined' : 'Undefined');
    console.log('Supabase Key:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Defined' : 'Undefined');
    
    // Test Supabase connection
    const testConnection = async () => {
      try {
        const result = await testSupabaseConnection();
        setConnectionStatus({
          tested: true,
          success: result.success,
          message: result.success ? 'Connected to Supabase' : `Connection failed: ${result.error}`
        });
        
        if (!result.success) {
          setError(`Supabase connection failed: ${result.error}`);
        }
      } catch (err) {
        setConnectionStatus({
          tested: true,
          success: false,
          message: `Connection test error: ${err.message}`
        });
        setError(`Supabase connection test error: ${err.message}`);
      }
    };
    
    testConnection();
  }, []);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        const authenticated = await AuthService.isAuthenticated();
        console.log('Authentication result:', authenticated);
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Auth check error:', error);
        setError('Authentication check failed: ' + (error.message || 'Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Load data when authenticated or filters change or force refresh
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Loading dashboard data...', new Date().toISOString());
        
        // Get user aggregated stats (doesn't depend on filters)
        const userStatsData = await AnalyticsService.getUserTimeAggregated();
        console.log('User stats loaded:', userStatsData.length);
        setUserStats(userStatsData);
        
        // Get total time (doesn't depend on filters)
        const totalTimeData = await AnalyticsService.getTotalTime();
        console.log('Total time loaded:', totalTimeData);
        setTotalTime(totalTimeData);
        
        // Get unique page paths for filter dropdown
        const paths = await AnalyticsService.getUniquePaths();
        console.log('Page paths loaded:', paths.length);
        setPagePaths(paths);
        
        // Get filtered sessions
        const sessionsData = await AnalyticsService.getSessions(filters);
        console.log('Sessions loaded:', sessionsData.length);
        setSessions(sessionsData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Data loading failed: ' + (error.message || 'Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [isAuthenticated, filters, lastRefresh]);

  // Handle manual refresh
  const handleRefresh = () => {
    setLastRefresh(new Date());
  };

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

  // Format the last refresh time
  const formatLastRefresh = () => {
    return lastRefresh.toLocaleTimeString();
  };

  // Show database connection status for debugging
  const renderConnectionStatus = () => {
    if (!connectionStatus.tested) {
      return (
        <div className="bg-gray-50 border-l-4 border-gray-300 p-4 mb-6">
          <p className="text-sm text-gray-700">Testing database connection...</p>
        </div>
      );
    }
    
    if (connectionStatus.success) {
      return (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="text-sm text-green-700">{connectionStatus.message}</p>
        </div>
      );
    }
    
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <p className="text-sm text-red-700">{connectionStatus.message}</p>
      </div>
    );
  };

  // Show login page if not authenticated
  if (!isAuthenticated && !isLoading) {
    return (
      <div>
        {renderConnectionStatus()}
        <AdminLogin onLogin={handleLogin} />
      </div>
    );
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
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last refreshed: {formatLastRefresh()}
              </div>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh Data'}
              </button>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {renderConnectionStatus()}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

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