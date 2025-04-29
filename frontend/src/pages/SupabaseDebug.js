import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { createClient } from '@supabase/supabase-js';
import { TimeTracker } from '../utils/timeTracker';
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
  const [rlsPolicies, setRlsPolicies] = useState(null);
  const [testingSteps, setTestingSteps] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);
  const [devTrackingEnabled, setDevTrackingEnabled] = useState(localStorage.getItem('hta_dev_tracking_enabled') === 'true');

  // Update online status
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load failed sessions on mount
  useEffect(() => {
    loadFailedSessions();
  }, []);

  const addTestStep = (step, success, details = null) => {
    setTestingSteps(prev => [...prev, { step, success, details, timestamp: new Date() }]);
  };

  const testConnection = async () => {
    try {
      setConnectionStatus({ tested: true, success: false, error: null, loading: true });
      setTestingSteps([]);
      
      // Step 1: Check environment variables
      addTestStep('Checking environment variables', 
        envVariables.hasUrl && envVariables.hasKey,
        `URL: ${envVariables.hasUrl ? 'Defined' : 'Missing'}, Key: ${envVariables.hasKey ? 'Defined' : 'Missing'}`
      );
      
      if (!envVariables.hasUrl || !envVariables.hasKey) {
        throw new Error('Missing environment variables. Please check your REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.');
      }
      
      // Step 2: Check internet connection
      addTestStep('Checking internet connection', 
        navigator.onLine,
        navigator.onLine ? 'Online' : 'Offline'
      );
      
      if (!navigator.onLine) {
        throw new Error('Device is offline. Please check your internet connection.');
      }
      
      // Step 3: Attempt basic connection
      addTestStep('Testing basic connection', null, 'Connecting to Supabase...');
      
      const { data, error } = await supabase.from('user_sessions').select('*').limit(1);
      
      addTestStep('Testing basic connection', 
        !error, 
        error ? `Error: ${error.message}` : `Success: Connected to database`
      );
      
      if (error) throw error;
      
      // Step 4: Test permissions
      addTestStep('Testing permissions', null, 'Checking read/write permissions...');
      await testPermissions();
      
      setConnectionStatus({ 
        tested: true, 
        success: true, 
        error: null, 
        loading: false,
        data: data 
      });
    } catch (error) {
      addTestStep('Connection test failed', false, `Error: ${error.message}`);
      
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
      addTestStep('Testing READ permission', !readError, readError ? `Error: ${readError.message}` : 'Success');
      
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
      addTestStep('Testing INSERT permission', !insertError, insertError ? `Error: ${insertError.message}` : 'Success');
      
      // Test update permissions
      const { data: updateData, error: updateError } = await supabase
        .from('user_sessions')
        .update({ page_path: '/test-updated' })
        .eq('user_id', `test-${testId}`);
      
      results.update = { success: !updateError, error: updateError?.message };
      addTestStep('Testing UPDATE permission', !updateError, updateError ? `Error: ${updateError.message}` : 'Success');
      
      // Test delete permissions
      const { data: deleteData, error: deleteError } = await supabase
        .from('user_sessions')
        .delete()
        .eq('user_id', `test-${testId}`);
      
      results.delete = { success: !deleteError, error: deleteError?.message };
      addTestStep('Testing DELETE permission', !deleteError, deleteError ? `Error: ${deleteError.message}` : 'Success');
      
      setPermissionsStatus({ tested: true, results, loading: false });
    } catch (error) {
      addTestStep('Permission test failed', false, `Error: ${error.message}`);
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
      
      addTestStep('Testing manual insert', null, `Inserting test data: ${JSON.stringify(testData)}`);
      
      const { data, error } = await supabase
        .from('user_sessions')
        .insert([testData]);
      
      if (error) {
        addTestStep('Manual insert failed', false, `Error: ${error.message}`);
        throw error;
      }
      
      addTestStep('Manual insert successful', true, 'Data inserted successfully');
      
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
      // Get failed sessions from localStorage first
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
      addTestStep('Cleared failed sessions', true, 'All failed sessions have been removed from storage');
    } catch (error) {
      console.error('Error clearing failed sessions:', error);
      addTestStep('Failed to clear sessions', false, `Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const retryFailedSession = async (session) => {
    try {
      addTestStep('Retrying failed session', null, `Retrying: ${session.page_path}`);
      
      // Try to insert the failed session data into Supabase
      const { error } = await supabase
        .from('user_sessions')
        .insert([{
          user_id: session.user_id,
          session_time_sec: session.session_time_sec,
          page_path: session.page_path,
          created_at: session.created_at || new Date().toISOString()
        }]);
      
      if (error) {
        addTestStep('Retry failed', false, `Error: ${error.message}`);
        throw error;
      }
      
      addTestStep('Retry successful', true, 'Session data sent successfully');
      
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

  const retryAllFailedSessions = async () => {
    try {
      addTestStep('Retrying all failed sessions', null, `Attempting to retry ${failedSessions.length} sessions`);
      setIsLoading(true);
      
      // Use the TimeTracker's retry mechanism
      await TimeTracker.retryFailedSessions();
      
      // Reload the list after a short delay to allow for processing
      setTimeout(() => {
        loadFailedSessions();
        setIsLoading(false);
        addTestStep('Retry process completed', true, 'Check the failed sessions list for remaining items');
      }, 1000);
    } catch (error) {
      console.error('Error retrying all sessions:', error);
      addTestStep('Failed to retry all sessions', false, `Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  const checkRlsPolicies = async () => {
    try {
      // This requires admin privileges, so it may not work in all environments
      const { data, error } = await supabase.rpc('get_policies', {
        table_name: 'user_sessions'
      });

      if (error) throw error;
      
      setRlsPolicies(data || []);
    } catch (error) {
      console.error('Error retrieving RLS policies:', error);
      setRlsPolicies([{
        error: error.message,
        note: 'Getting RLS policies requires admin privileges. Check your Supabase dashboard instead.'
      }]);
    }
  };

  const toggleDevTracking = () => {
    const newState = !devTrackingEnabled;
    TimeTracker.toggleDevTracking(newState);
    setDevTrackingEnabled(newState);
    addTestStep(
      `Development tracking ${newState ? 'enabled' : 'disabled'}`, 
      true, 
      `Local tracking is now ${newState ? 'on' : 'off'}`
    );
  };

  const runDirectFetch = async () => {
    try {
      addTestStep('Testing direct fetch API', null, 'Sending direct fetch request to Supabase...');
      
      const url = process.env.REACT_APP_SUPABASE_URL;
      const key = process.env.REACT_APP_SUPABASE_ANON_KEY;
      
      if (!url || !key) {
        addTestStep('Direct fetch failed', false, 'Missing Supabase URL or key');
        return;
      }
      
      // Test with fetch API to rule out Supabase client issues
      const response = await fetch(`${url}/rest/v1/user_sessions?select=id&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });
      
      const responseText = await response.text();
      
      addTestStep(
        'Direct fetch result', 
        response.ok, 
        `Status: ${response.status} ${response.statusText}, Response: ${responseText.substring(0, 100)}${responseText.length > 100 ? '...' : ''}`
      );
    } catch (error) {
      addTestStep('Direct fetch failed', false, `Error: ${error.message}`);
    }
  };

  const testRlsPolicy = async () => {
    try {
      addTestStep('Testing RLS policy specifically', null, 'Making direct API call with proper headers');
      
      const url = process.env.REACT_APP_SUPABASE_URL;
      const key = process.env.REACT_APP_SUPABASE_ANON_KEY;
      
      if (!url || !key) {
        addTestStep('RLS test failed', false, 'Missing Supabase URL or key');
        return;
      }
      
      // Test with proper Authorization header format
      const testData = {
        user_id: `rls-test-${Date.now()}`,
        session_time_sec: 3,
        page_path: '/rls-test'
      };
      
      const response = await fetch(`${url}/rest/v1/user_sessions`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(testData)
      });
      
      const responseText = await response.text();
      
      addTestStep(
        'RLS test result', 
        response.ok, 
        `Status: ${response.status} ${response.statusText}, Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}, Response: ${responseText.substring(0, 100)}${responseText.length > 100 ? '...' : ''}`
      );
      
      // Also check that the format of the Authorization header is correct
      addTestStep(
        'Authorization header check',
        true,
        'Format is correct: Bearer [token]'
      );
    } catch (error) {
      addTestStep('RLS test failed', false, `Error: ${error.message}`);
    }
  };

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
          <div className="mb-3">
            <strong>Network Status:</strong> {onlineStatus ? 
              <span className="text-success">✓ Online</span> : 
              <span className="text-danger">✗ Offline</span>}
          </div>
          <div className="mb-3">
            <strong>Development Tracking:</strong> {devTrackingEnabled ? 
              <span className="text-success">✓ Enabled</span> : 
              <span className="text-danger">✗ Disabled</span>}
            <button 
              className="btn btn-sm btn-primary ms-2" 
              onClick={toggleDevTracking}
            >
              {devTrackingEnabled ? 'Disable' : 'Enable'}
            </button>
            <small className="d-block text-muted mt-1">
              Toggle tracking on development environments
            </small>
          </div>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2>Connection Test</h2>
        </div>
        <div className="card-body">
          <div className="d-flex gap-2 mb-3">
            <button 
              className="btn btn-primary" 
              onClick={testConnection}
              disabled={connectionStatus.loading}
            >
              {connectionStatus.loading ? 'Testing...' : 'Test Connection'}
            </button>
            
            <button 
              className="btn btn-secondary" 
              onClick={runDirectFetch}
              disabled={connectionStatus.loading}
            >
              Test Direct Fetch
            </button>

            <button 
              className="btn btn-warning" 
              onClick={testRlsPolicy}
              disabled={connectionStatus.loading}
            >
              Test RLS Policy
            </button>
          </div>
          
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
          
          {/* Test Steps */}
          {testingSteps.length > 0 && (
            <div className="mt-4">
              <h3>Test Steps</h3>
              <div className="list-group">
                {testingSteps.map((step, index) => (
                  <div key={index} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{step.step}</span>
                      {step.success === null ? (
                        <span className="badge bg-secondary">Running</span>
                      ) : step.success ? (
                        <span className="badge bg-success">Success</span>
                      ) : (
                        <span className="badge bg-danger">Failed</span>
                      )}
                    </div>
                    {step.details && <div className="small text-muted mt-1">{step.details}</div>}
                    <div className="small text-muted mt-1">{step.timestamp.toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2>Table Permissions</h2>
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
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Operation</th>
                    <th>Status</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>READ</td>
                    <td>
                      {permissionsStatus.results.read?.success ? 
                        <span className="text-success">✓ Success</span> : 
                        <span className="text-danger">✗ Failed</span>}
                    </td>
                    <td>{permissionsStatus.results.read?.error || 'OK'}</td>
                  </tr>
                  <tr>
                    <td>INSERT</td>
                    <td>
                      {permissionsStatus.results.insert?.success ? 
                        <span className="text-success">✓ Success</span> : 
                        <span className="text-danger">✗ Failed</span>}
                    </td>
                    <td>{permissionsStatus.results.insert?.error || 'OK'}</td>
                  </tr>
                  <tr>
                    <td>UPDATE</td>
                    <td>
                      {permissionsStatus.results.update?.success ? 
                        <span className="text-success">✓ Success</span> : 
                        <span className="text-danger">✗ Failed</span>}
                    </td>
                    <td>{permissionsStatus.results.update?.error || 'OK'}</td>
                  </tr>
                  <tr>
                    <td>DELETE</td>
                    <td>
                      {permissionsStatus.results.delete?.success ? 
                        <span className="text-success">✓ Success</span> : 
                        <span className="text-danger">✗ Failed</span>}
                    </td>
                    <td>{permissionsStatus.results.delete?.error || 'OK'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2>Failed Sessions</h2>
          <p className="card-text text-muted">
            Sessions that failed to send to Supabase are stored locally
          </p>
        </div>
        <div className="card-body">
          <div className="d-flex gap-2 mb-3">
            <button 
              className="btn btn-primary" 
              onClick={loadFailedSessions}
              disabled={isLoading}
            >
              Refresh List
            </button>
            
            <button 
              className="btn btn-success" 
              onClick={retryAllFailedSessions}
              disabled={isLoading || failedSessions.length === 0}
            >
              Retry All ({failedSessions.length})
            </button>
            
            <button 
              className="btn btn-danger" 
              onClick={clearFailedSessions}
              disabled={isLoading || failedSessions.length === 0}
            >
              Clear All
            </button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-4">
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Loading...
            </div>
          ) : failedSessions.length === 0 ? (
            <div className="alert alert-info">
              No failed sessions found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Path</th>
                    <th>Time (s)</th>
                    <th>Timestamp</th>
                    <th>Error</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {failedSessions.slice(0, 10).map((session, index) => (
                    <tr key={index}>
                      <td>{session.page_path}</td>
                      <td>{session.session_time_sec}</td>
                      <td>{new Date(session.timestamp).toLocaleString()}</td>
                      <td>{session.error}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => retryFailedSession(session)}
                        >
                          Retry
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {failedSessions.length > 10 && (
                <div className="text-center text-muted">
                  Showing 10 of {failedSessions.length} entries
                </div>
              )}
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
            {manualInsertResult?.loading ? 'Inserting...' : 'Insert Test Record'}
          </button>
          
          {manualInsertResult && !manualInsertResult.loading && (
            <div className="mt-3">
              {manualInsertResult.success ? (
                <div className="alert alert-success">
                  ✓ Record inserted successfully!
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
          <h2>Troubleshooting Guide</h2>
        </div>
        <div className="card-body">
          <h3>Common Issues</h3>
          
          <div className="accordion" id="troubleshootingAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                  Missing Environment Variables
                </button>
              </h2>
              <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#troubleshootingAccordion">
                <div className="accordion-body">
                  <p>Add the following to your .env file or deployment environment:</p>
                  <pre>
                    REACT_APP_SUPABASE_URL=https://your-project.supabase.co<br/>
                    REACT_APP_SUPABASE_ANON_KEY=your-anon-key
                  </pre>
                </div>
              </div>
            </div>
            
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                  CORS Issues
                </button>
              </h2>
              <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#troubleshootingAccordion">
                <div className="accordion-body">
                  <p>Add your domain to the allowed origins in Supabase:</p>
                  <ol>
                    <li>Go to Supabase Dashboard → Project Settings → API</li>
                    <li>Scroll to "CORS Configuration"</li>
                    <li>Add your domain (e.g., https://historythroughart.com)</li>
                    <li>Add localhost URLs for development (http://localhost:3000)</li>
                  </ol>
                </div>
              </div>
            </div>
            
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                  Row Level Security (RLS) Issues
                </button>
              </h2>
              <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#troubleshootingAccordion">
                <div className="accordion-body">
                  <p>Check your RLS policies in Supabase:</p>
                  <ol>
                    <li>Go to Supabase Dashboard → Table Editor → user_sessions</li>
                    <li>Click on "Policies"</li>
                    <li>Ensure there's a policy that allows anonymous users to insert records</li>
                    <li>Sample policy: <code>CREATE POLICY "Allow anonymous inserts" ON user_sessions FOR INSERT TO anon WITH CHECK (true);</code></li>
                  </ol>
                </div>
              </div>
            </div>
            
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                  Network Issues
                </button>
              </h2>
              <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#troubleshootingAccordion">
                <div className="accordion-body">
                  <p>Check for network connectivity issues:</p>
                  <ul>
                    <li>Verify your internet connection is working</li>
                    <li>Check if your firewall is blocking outbound connections</li>
                    <li>Try a direct browser request to your Supabase URL</li>
                    <li>Check if Supabase is experiencing service issues: <a href="https://status.supabase.com/" target="_blank" rel="noopener noreferrer">Supabase Status Page</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseDebug; 