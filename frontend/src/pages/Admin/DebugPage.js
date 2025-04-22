import React, { useState, useEffect } from 'react';
import { supabase, testSupabaseConnection } from '../../utils/supabaseClient';

const DebugPage = () => {
  const [connectionTest, setConnectionTest] = useState({ status: 'pending', message: 'Not tested yet', data: null });
  const envVars = {
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL ? 'Defined' : 'Undefined',
    supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Defined' : 'Undefined'
  };
  const [corsTest, setCorsTest] = useState({ status: 'pending', message: 'Not tested yet' });

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
              <div className="flex items-center mb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(connectionTest.status)}`}>
                  {connectionTest.status.toUpperCase()}
                </span>
                <p className="ml-2 text-sm text-gray-600">{connectionTest.message}</p>
              </div>
              
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Run Test Again
              </button>
            </div>
          </div>
          
          {/* CORS Test */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">CORS Test</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center mb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(corsTest.status)}`}>
                  {corsTest.status.toUpperCase()}
                </span>
                <p className="ml-2 text-sm text-gray-600">{corsTest.message}</p>
              </div>
              
              <button
                onClick={runCorsTest}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                disabled={corsTest.status === 'loading'}
              >
                {corsTest.status === 'loading' ? 'Testing...' : 'Test CORS'}
              </button>
            </div>
          </div>
          
          {/* Troubleshooting Guide */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Troubleshooting Steps</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Verify environment variables are properly set in Vercel</li>
                <li>Ensure CORS is configured in Supabase Project Settings → API → CORS</li>
                <li>Add your Vercel domain (https://your-app.vercel.app) to allowed origins</li>
                <li>Check Supabase database is up and running</li>
                <li>Confirm your IP address isn't blocked by Supabase</li>
                <li>Test if the admin dashboard works on localhost but not on Vercel</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage; 