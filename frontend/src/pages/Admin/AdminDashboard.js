import React, { useState, useEffect } from 'react';
import { AuthService } from '../../utils/authService';
import { AnalyticsService } from '../../utils/analyticsService';
import { testSupabaseConnection, supabase } from '../../utils/supabaseClient';
import AdminLogin from '../../components/AdminLogin';
import UserStats from '../../components/UserStats';
import SessionsTable from '../../components/SessionsTable';
import FilterControls from '../../components/FilterControls';
import AnalyticsCharts from '../../components/AnalyticsCharts';
import SessionSummary from '../../components/SessionSummary';

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

  // Toggle state
  const [showTables, setShowTables] = useState(false);

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
        } else {
          // Try direct DB access for debugging
          debugCheckData();
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

  // Debug function to directly check data
  const debugCheckData = async () => {
    try {
      console.log('🔍 DEBUG: Checking user_sessions table directly');
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .limit(5);
      
      if (error) {
        console.error('🔍 DEBUG: Error checking data:', error);
      } else {
        console.log('🔍 DEBUG: First 5 records in user_sessions:', data);
        console.log('🔍 DEBUG: Total records found:', data.length);
        
        if (data.length === 0) {
          console.log('🔍 DEBUG: No data found in user_sessions table. Checking RLS policies...');
          
          // Direct SQL query to check table existence (works only with service role, will fail for normal users)
          const { error: tableError } = await supabase.rpc('check_table_exists', { table_name: 'user_sessions' });
          if (tableError) {
            console.log('🔍 DEBUG: Unable to check table existence:', tableError.message);
            console.log('🔍 DEBUG: This is normal if you are using anonymous or authenticated role without admin privileges');
          }
        }
      }
    } catch (debugError) {
      console.error('🔍 DEBUG: Exception in debug check:', debugError);
    }
  };

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
    if (!isAuthenticated) {
      console.log("Not loading data because user is not authenticated");
      return;
    }
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Loading dashboard data...', new Date().toISOString());
        
        // Get user aggregated stats (doesn't depend on filters)
        console.log('Fetching user stats...');
        const userStatsData = await AnalyticsService.getUserTimeAggregated();
        console.log('User stats loaded:', userStatsData.length, userStatsData);
        setUserStats(userStatsData);
        
        // Get total time (doesn't depend on filters)
        console.log('Fetching total time...');
        const totalTimeData = await AnalyticsService.getTotalTime();
        console.log('Total time loaded:', totalTimeData);
        setTotalTime(totalTimeData);
        
        // Get unique page paths for filter dropdown
        console.log('Fetching page paths...');
        const paths = await AnalyticsService.getUniquePaths();
        console.log('Page paths loaded:', paths.length, paths);
        setPagePaths(paths);
        
        // Get filtered sessions
        console.log('Fetching sessions with filters:', filters);
        const sessionsData = await AnalyticsService.getSessions({
          ...filters,
          pageSize: 1000,  // Process in chunks of 1000
          maxRecords: 100000 // Increase limit to allow more data to be retrieved
        });
        console.log('Sessions loaded:', sessionsData.length, sessionsData);
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

  // Handle data export
  const handleExportData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get all session data with pagination but no limits
      // We'll export everything, but we need to set a reasonable page size
      const allSessions = await AnalyticsService.getSessions({
        pageSize: 1000,  // Reasonable chunk size for processing
        maxRecords: 50000 // Safety limit to prevent browser crashes
      });
      
      if (allSessions.length === 0) {
        setError('No data to export');
        setIsLoading(false);
        return;
      }
      
      console.log(`Exporting ${allSessions.length} sessions`);
      
      // Convert to JSON and create a downloadable file
      const dataStr = JSON.stringify(allSessions, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      // Create download link and trigger click
      const exportName = `analytics_export_${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      linkElement.click();
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export data: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle data import
  const handleImportData = () => {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    
    // Handle file selection
    fileInput.onchange = async (e) => {
      if (!e.target.files || !e.target.files[0]) return;
      
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          setIsLoading(true);
          setError(null);
          
          // Parse the JSON data
          const jsonData = JSON.parse(event.target.result);
          
          // Import the data
          const result = await AnalyticsService.importSessionData(jsonData);
          
          if (result.success) {
            alert(`Successfully imported data: ${result.message}`);
            // Refresh the dashboard to show imported data
            setLastRefresh(new Date());
          } else {
            setError(`Import failed: ${result.message}`);
          }
        } catch (error) {
          console.error('Error importing data:', error);
          setError('Failed to import data: ' + (error.message || 'Unknown error'));
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.readAsText(file);
    };
    
    // Trigger file selection
    fileInput.click();
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

  // Handle manually retrying failed sessions
  const handleRetryFailedSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await AnalyticsService.retryFailedSessions();
      
      if (result.success) {
        alert(result.message);
        // Refresh data
        setLastRefresh(new Date());
      } else {
        setError(`Failed to retry sessions: ${result.message}`);
      }
    } catch (error) {
      console.error('Error retrying failed sessions:', error);
      setError('Failed to retry sessions: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle tables
  const toggleTables = () => {
    setShowTables(!showTables);
  };

  // Debug function with more detailed diagnostics
  const handleDebug = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Running diagnostics...");
      const diagnosticResults = await AnalyticsService.checkDatabaseStatus();
      
      // Display results in a formatted alert
      const resultsText = `
Database Diagnostics:
- Supabase URL: ${diagnosticResults.supabaseUrl}
- Supabase Key: ${diagnosticResults.supabaseKey}
- Connection: ${diagnosticResults.connection}
${diagnosticResults.connectionError ? `- Connection Error: ${diagnosticResults.connectionError}` : ''}
- Table Access: ${diagnosticResults.tableAccess}
${diagnosticResults.tableAccessError ? `- Table Error: ${diagnosticResults.tableAccessError}` : ''}
- Record Count: ${diagnosticResults.recordCount}
`;
      
      alert(resultsText);
      console.log("Diagnostic results:", diagnosticResults);
      
    } catch (error) {
      console.error('Debug error:', error);
      setError('Debug failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated && !isLoading) {
    return (
      <div>
        {renderConnectionStatus()}
        <AdminLogin onLogin={handleLogin} />
        <div className="text-center mt-4">
          <button 
            onClick={() => {
              console.log("Bypassing authentication for testing");
              setIsAuthenticated(true);
            }}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Bypass Authentication (Testing Only)
          </button>
        </div>
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
              <p className="text-xs text-blue-500 mt-1">Note: Only public pages are tracked. Admin, debug, and test pages are excluded.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last refreshed: {formatLastRefresh()}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportData}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={isLoading}
                >
                  Export Data
                </button>
                <button
                  onClick={handleImportData}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  disabled={isLoading}
                >
                  Import Data
                </button>
              </div>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh Data'}
              </button>
              <button
                onClick={handleRetryFailedSessions}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                disabled={isLoading}
              >
                Retry Failed Sessions
              </button>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                onClick={handleDebug}
              >
                Debug
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
                  <p className="text-3xl font-bold text-blue-600">{formatTime(totalTime || 0)}</p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50">
                  <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                  <p className="text-3xl font-bold text-green-600">{userStats ? userStats.length : 0}</p>
                </div>
                <div className="p-4 border rounded-lg bg-purple-50">
                  <h3 className="text-sm font-medium text-gray-500">Total Sessions</h3>
                  <p className="text-3xl font-bold text-purple-600">{sessions ? sessions.length : 0}</p>
                </div>
              </div>
            </div>

            {/* Analytics Charts */}
            <div className="mb-6">
              <AnalyticsCharts sessions={sessions} />
              <div className="text-xs text-gray-500 text-right mt-1">
                Showing charts based on {sessions.length} sessions
              </div>
            </div>

            {/* Toggle Tables Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleTables}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                {showTables ? 'Hide Detailed Tables' : 'Show Detailed Tables'}
              </button>
            </div>

            {/* Filters */}
            <FilterControls
              filters={filters}
              setFilters={setFilters}
              pagePaths={pagePaths}
            />

            {/* Tables - shown/hidden based on toggle */}
            <div className={showTables ? "" : "hidden"}>
              {/* User Stats */}
              <div className="mb-6">
                <UserStats 
                  userStats={userStats}
                  totalUsers={userStats.length}
                  totalSessions={sessions.length}
                  totalTime={totalTime}
                />
              </div>

              {/* Enhanced Session Summary */}
              <SessionSummary sessions={sessions} />

              {/* Sessions Table */}
              <SessionsTable sessions={sessions} />
            </div>

            {/* Hidden debug data */}
            <div style={{ display: 'none' }}>
              <h4>Debug Data (Check console)</h4>
              <div>
                <strong>Total Time:</strong> {totalTime || 0}
              </div>
              <div>
                <strong>Users Count:</strong> {userStats ? userStats.length : 0}
              </div>
              <div>
                <strong>Sessions Count:</strong> {sessions ? sessions.length : 0}
              </div>
              <div>
                <strong>Page Paths:</strong> {pagePaths ? pagePaths.join(', ') : 'None'}
              </div>
              <div>
                <strong>Raw User Stats:</strong> <pre>{JSON.stringify(userStats, null, 2)}</pre>
              </div>
              <div>
                <strong>Raw Sessions:</strong> <pre>{JSON.stringify(sessions?.slice(0, 2), null, 2)}</pre>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 