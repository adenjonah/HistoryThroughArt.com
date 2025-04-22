import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import '../App.css';

const SupabaseDebug = () => {
  const [connectionStatus, setConnectionStatus] = useState({ tested: false, success: false, error: null });
  const [permissionsStatus, setPermissionsStatus] = useState({ tested: false, results: {} });
  const [envVariables, setEnvVariables] = useState({
    url: process.env.REACT_APP_SUPABASE_URL || '',
    key: process.env.REACT_APP_SUPABASE_ANON_KEY ? '**********' : '',
    hasUrl: !!process.env.REACT_APP_SUPABASE_URL,
    hasKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY
  });
  const [manualInsertResult, setManualInsertResult] = useState(null);
  const [failedSessions, setFailedSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    try {
      setConnectionStatus({ tested: true, success: false, error: null, loading: true });
      const { data, error } = await supabase.from('user_sessions').select('*').limit(1);
      
      if (error) throw error;
      
      setConnectionStatus({ 
        tested: true, 
        success: true, 
        error: null, 
        loading: false,
        data: data 
      });
    } catch (error) {
      setConnectionStatus({ 
        tested: true, 
        success: false, 
        error: error.message, 
        loading: false 
      });
    }
  };

  const testPermissions = async () => {
    setPermissionsStatus({ tested: true, results: {}, loading: true });
    const results = {};
    
    try {
      // Test read permissions
      const { data: readData, error: readError } = await supabase
        .from('user_sessions')
        .select('*')
        .limit(1);
      
      results.read = { success: !readError, error: readError?.message };
      
      // Test insert permissions
      const testId = new Date().getTime().toString();
      const { data: insertData, error: insertError } = await supabase
        .from('user_sessions')
        .insert([{ 
          user_id: `test-${testId}`,
          session_time_sec: 1,
          page_path: '/test-permissions'
        }]);
      
      results.insert = { success: !insertError, error: insertError?.message };
      
      // Test update permissions
      const { data: updateData, error: updateError } = await supabase
        .from('user_sessions')
        .update({ page_path: '/test-updated' })
        .eq('user_id', `test-${testId}`);
      
      results.update = { success: !updateError, error: updateError?.message };
      
      // Test delete permissions
      const { data: deleteData, error: deleteError } = await supabase
        .from('user_sessions')
        .delete()
        .eq('user_id', `test-${testId}`);
      
      results.delete = { success: !deleteError, error: deleteError?.message };
      
      setPermissionsStatus({ tested: true, results, loading: false });
    } catch (error) {
      setPermissionsStatus({ 
        tested: true, 
        results: { ...results, generalError: error.message }, 
        loading: false 
      });
    }
  };

  const testManualInsert = async () => {
    setManualInsertResult({ loading: true });
    try {
      const testId = new Date().getTime().toString();
      const testData = {
        user_id: `manual-test-${testId}`,
        session_time_sec: 5,
        page_path: '/manual-insert-test'
      };
      
      const { data, error } = await supabase
        .from('user_sessions')
        .insert([testData]);
      
      if (error) throw error;
      
      setManualInsertResult({ 
        success: true, 
        data: testData,
        error: null,
        loading: false
      });
    } catch (error) {
      setManualInsertResult({ 
        success: false, 
        error: error.message,
        loading: false
      });
    }
  };

  const loadFailedSessions = async () => {
    setIsLoading(true);
    try {
      // Try to get failed sessions from localStorage first
      const storedSessions = localStorage.getItem('failed_sessions');
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions);
        setFailedSessions(parsedSessions || []);
      } else {
        setFailedSessions([]);
      }
    } catch (error) {
      console.error('Error loading failed sessions:', error);
      setFailedSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFailedSessions = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem('failed_sessions');
      setFailedSessions([]);
    } catch (error) {
      console.error('Error clearing failed sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const retryFailedSession = async (session) => {
    try {
      // Try to insert the failed session data into Supabase
      const { error } = await supabase
        .from('user_sessions')
        .insert([{
          user_id: session.user_id,
          session_time_sec: session.session_time_sec,
          page_path: session.page_path,
          created_at: session.created_at || new Date().toISOString()
        }]);
      
      if (error) throw error;
      
      // If successful, update the failed sessions in localStorage
      const storedSessions = JSON.parse(localStorage.getItem('failed_sessions') || '[]');
      const updatedSessions = storedSessions.filter(s => 
        s.user_id !== session.user_id || 
        s.timestamp !== session.timestamp
      );
      localStorage.setItem('failed_sessions', JSON.stringify(updatedSessions));
      
      // Refresh the list
      await loadFailedSessions();
    } catch (error) {
      console.error('Error retrying session:', error);
    }
  };

  useEffect(() => {
    // You can optionally auto-run tests on page load
    // testConnection();
  }, []);

  return (
    <div className="container mt-4 p-4">
      <h1>Supabase Debug Console</h1>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2>Environment Variables</h2>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <strong>Supabase URL:</strong> {envVariables.hasUrl ? 
              <span className="text-success">✓ Set</span> : 
              <span className="text-danger">✗ Missing</span>}
          </div>
          <div className="mb-3">
            <strong>Supabase Key:</strong> {envVariables.hasKey ? 
              <span className="text-success">✓ Set</span> : 
              <span className="text-danger">✗ Missing</span>}
          </div>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2>Connection Test</h2>
        </div>
        <div className="card-body">
          <button 
            className="btn btn-primary mb-3" 
            onClick={testConnection}
            disabled={connectionStatus.loading}
          >
            {connectionStatus.loading ? 'Testing...' : 'Test Connection'}
          </button>
          
          {connectionStatus.tested && (
            <div className="mt-3">
              {connectionStatus.success ? (
                <div className="alert alert-success">
                  ✓ Connection successful!
                </div>
              ) : (
                <div className="alert alert-danger">
                  ✗ Connection failed: {connectionStatus.error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2>Permissions Test</h2>
        </div>
        <div className="card-body">
          <button 
            className="btn btn-primary mb-3" 
            onClick={testPermissions}
            disabled={permissionsStatus.loading}
          >
            {permissionsStatus.loading ? 'Testing...' : 'Test Permissions'}
          </button>
          
          {permissionsStatus.tested && !permissionsStatus.loading && (
            <div className="mt-3">
              <h4>Results:</h4>
              <ul className="list-group">
                {Object.entries(permissionsStatus.results).map(([operation, result]) => (
                  <li key={operation} className="list-group-item">
                    <strong>{operation.toUpperCase()}:</strong> {' '}
                    {result.success ? (
                      <span className="text-success">✓ Permitted</span>
                    ) : (
                      <span className="text-danger">✗ Denied: {result.error}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2>Manual Insert Test</h2>
        </div>
        <div className="card-body">
          <button 
            className="btn btn-primary mb-3" 
            onClick={testManualInsert}
            disabled={manualInsertResult?.loading}
          >
            {manualInsertResult?.loading ? 'Inserting...' : 'Test Manual Insert'}
          </button>
          
          {manualInsertResult && !manualInsertResult.loading && (
            <div className="mt-3">
              {manualInsertResult.success ? (
                <div className="alert alert-success">
                  ✓ Insert successful!
                  <pre className="mt-2">{JSON.stringify(manualInsertResult.data, null, 2)}</pre>
                </div>
              ) : (
                <div className="alert alert-danger">
                  ✗ Insert failed: {manualInsertResult.error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2>Failed Sessions</h2>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <button 
              className="btn btn-primary me-2" 
              onClick={loadFailedSessions}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load Failed Sessions'}
            </button>
            
            <button 
              className="btn btn-danger" 
              onClick={clearFailedSessions}
              disabled={isLoading || failedSessions.length === 0}
            >
              Clear Failed Sessions
            </button>
          </div>
          
          {failedSessions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Page Path</th>
                    <th>Duration</th>
                    <th>Timestamp</th>
                    <th>Error</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {failedSessions.map((session, index) => (
                    <tr key={index}>
                      <td>{session.user_id}</td>
                      <td>{session.page_path}</td>
                      <td>{session.session_time_sec}s</td>
                      <td>{new Date(session.timestamp).toLocaleString()}</td>
                      <td>{session.error}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-warning"
                          onClick={() => retryFailedSession(session)}
                        >
                          Retry
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              {isLoading ? 'Loading sessions...' : 'No failed sessions found.'}
            </div>
          )}
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2>Troubleshooting Tips</h2>
        </div>
        <div className="card-body">
          <ul className="list-group">
            <li className="list-group-item">
              <strong>Missing Environment Variables:</strong> Check that your .env file or environment has REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY correctly set.
            </li>
            <li className="list-group-item">
              <strong>Connection Errors:</strong> Verify your Supabase instance is running and accessible. Check network connectivity and firewall settings.
            </li>
            <li className="list-group-item">
              <strong>Permission Errors:</strong> Review your Supabase Row-Level Security (RLS) policies and make sure they're correctly configured for the user_sessions table.
            </li>
            <li className="list-group-item">
              <strong>Failed Sessions:</strong> Sessions that fail to send to Supabase are stored in localStorage under 'failed_sessions'. You can retry sending them using the tools above.
            </li>
            <li className="list-group-item">
              <strong>Additional Logging:</strong> Check the browser console for detailed logs from the timeTracker.js and supabaseClient.js files.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SupabaseDebug; 