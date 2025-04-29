import React, { useState, useEffect } from 'react';
import { supabase, testSupabaseConnection } from '../../utils/supabaseClient';
import { TimeTracker } from '../../utils/timeTracker';

const DebugPage = () => {
  const [connectionTest, setConnectionTest] = useState({ status: 'pending', message: 'Not tested yet', data: null });
  const [envVars, setEnvVars] = useState({
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL ? 'Defined' : 'Undefined',
    supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Defined' : 'Undefined'
  });
  const [corsTest, setCorsTest] = useState({ status: 'pending', message: 'Not tested yet' });
  const [trackingStats, setTrackingStats] = useState({
    enabled: false,
    failedSessions: 0,
    isActiveTab: false,
    devModeEnabled: localStorage.getItem('hta_dev_tracking_enabled') === 'true'
  });
  
  // Update tracking stats periodically
  useEffect(() => {
    const updateTrackingStats = () => {
      setTrackingStats({
        enabled: TimeTracker.trackingEnabled,
        failedSessions: TimeTracker.getFailedSessionsCount(),
        isActiveTab: TimeTracker.isActiveTab,
        devModeEnabled: localStorage.getItem('hta_dev_tracking_enabled') === 'true'
      });
    };
    
    updateTrackingStats();
    
    const interval = setInterval(updateTrackingStats, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Test Supabase connection
    const runConnectionTest = async () => {
      try {
        setConnectionTest({ status: 'loading', message: 'Testing connection...', data: null });
        const result = await testSupabaseConnection();
        
        setConnectionTest({
          status: result.success ? 'success' : 'error',
          message: result.success ? 'Connection successful' : `Connection failed: ${result.error}`,
          data: result.data
        });
      } catch (error) {
        setConnectionTest({
          status: 'error',
          message: `Test error: ${error.message}`,
          data: null
        });
      }
    };

    runConnectionTest();
  }, []);

  // Test CORS
  const runCorsTest = async () => {
    try {
      setCorsTest({ status: 'loading', message: 'Testing CORS...' });
      
      // Simple query to test CORS
      const { error } = await supabase
        .from('user_sessions')
        .select('id')
        .limit(1);
        
      if (error) {
        setCorsTest({
          status: 'error',
          message: `CORS test failed: ${error.message}`
        });
      } else {
        setCorsTest({
          status: 'success',
          message: 'CORS test passed successfully'
        });
      }
    } catch (error) {
      setCorsTest({
        status: 'error',
        message: `CORS test error: ${error.message}`
      });
    }
  };

  // Toggle development tracking
  const toggleDevTracking = () => {
    const newState = !trackingStats.devModeEnabled;
    const enabled = TimeTracker.toggleDevTracking(newState);
    
    setTrackingStats({
      ...trackingStats,
      devModeEnabled: newState,
      enabled: enabled
    });
  };

  // Retry failed sessions
  const retryFailedSessions = async () => {
    try {
      await TimeTracker.retryFailedSessions();
      // Update stats after a short delay
      setTimeout(() => {
        setTrackingStats({
          ...trackingStats,
          failedSessions: TimeTracker.getFailedSessionsCount()
        });
      }, 1000);
    } catch (error) {
      console.error('Error retrying failed sessions:', error);
    }
  };
  
  // Force record session now (for testing)
  const recordTestSession = async () => {
    try {
      await TimeTracker.recordSessionWithDuration(5, Date.now() - 5000);
      // Update stats after a short delay
      setTimeout(() => {
        setTrackingStats({
          ...trackingStats,
          failedSessions: TimeTracker.getFailedSessionsCount()
        });
      }, 1000);
    } catch (error) {
      console.error('Error recording test session:', error);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'loading': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Supabase Debug Page</h1>
          <p className="text-gray-600 mb-6">Use this page to diagnose connection issues with Supabase</p>
          
          {/* Environment Variables */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Environment Variables</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">REACT_APP_SUPABASE_URL</p>
                  <p className={`mt-1 text-sm ${envVars.supabaseUrl === 'Defined' ? 'text-green-600' : 'text-red-600'}`}>
                    {envVars.supabaseUrl}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">REACT_APP_SUPABASE_ANON_KEY</p>
                  <p className={`mt-1 text-sm ${envVars.supabaseKey === 'Defined' ? 'text-green-600' : 'text-red-600'}`}>
                    {envVars.supabaseKey}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Connection Test */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Connection Test</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex space-x-2 mb-4">
                <button 
                  onClick={() => testSupabaseConnection().then(result => {
                    setConnectionTest({
                      status: result.success ? 'success' : 'error',
                      message: result.success ? 'Connection successful' : `Connection failed: ${result.error}`,
                      data: result.data
                    });
                  })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={connectionTest.status === 'loading'}
                >
                  {connectionTest.status === 'loading' ? 'Testing...' : 'Test Connection'}
                </button>
                
                <button 
                  onClick={runCorsTest}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={corsTest.status === 'loading'}
                >
                  {corsTest.status === 'loading' ? 'Testing CORS...' : 'Test CORS'}
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Connection Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(connectionTest.status)}`}>
                    {connectionTest.message}
                  </span>
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">CORS Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(corsTest.status)}`}>
                    {corsTest.message}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tracking Debug */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tracking Debug</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tracking Enabled</p>
                  <p className={`mt-1 text-sm ${trackingStats.enabled ? 'text-green-600' : 'text-red-600'}`}>
                    {trackingStats.enabled ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Tab</p>
                  <p className={`mt-1 text-sm ${trackingStats.isActiveTab ? 'text-green-600' : 'text-yellow-600'}`}>
                    {trackingStats.isActiveTab ? 'Yes (recording data)' : 'No (passive)'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Failed Sessions</p>
                  <p className={`mt-1 text-sm ${trackingStats.failedSessions === 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trackingStats.failedSessions}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Dev Mode Tracking</p>
                  <p className={`mt-1 text-sm ${trackingStats.devModeEnabled ? 'text-green-600' : 'text-red-600'}`}>
                    {trackingStats.devModeEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={toggleDevTracking}
                  className={`px-4 py-2 ${trackingStats.devModeEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  {trackingStats.devModeEnabled ? 'Disable Dev Tracking' : 'Enable Dev Tracking'}
                </button>
                
                <button 
                  onClick={retryFailedSessions}
                  disabled={trackingStats.failedSessions === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Retry Failed ({trackingStats.failedSessions})
                </button>
                
                <button 
                  onClick={recordTestSession}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Record Test Session
                </button>
              </div>
            </div>
          </div>
          
          {/* Troubleshooting Steps */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Troubleshooting Steps</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <ol className="list-decimal pl-4 space-y-2">
                <li>
                  <strong>Check Environment Variables:</strong> Ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set correctly.
                </li>
                <li>
                  <strong>Verify CORS Settings:</strong> In your Supabase dashboard, go to Settings → API and ensure your domain is in the allowed origins.
                </li>
                <li>
                  <strong>Check Internet Connection:</strong> Make sure your device is online and can reach the Supabase API.
                </li>
                <li>
                  <strong>Check RLS Policies:</strong> Ensure your Row Level Security policies allow anonymous inserts to the user_sessions table.
                </li>
                <li>
                  <strong>Try in Incognito Mode:</strong> This can help identify if browser extensions are interfering with requests.
                </li>
              </ol>
              
              <div className="mt-4">
                <a 
                  href="/admin/supabase-debug" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Go to Advanced Supabase Debug Console →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage; 