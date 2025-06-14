
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function DatabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [authStatus, setAuthStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<any>({});

  useEffect(() => {
    async function runTests() {
      // Test 1: Database Connection
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error) {
          setConnectionStatus('error');
          setError(`Database connection failed: ${error.message}`);
        } else {
          setConnectionStatus('success');
          setDetails(prev => ({ ...prev, dbConnection: 'Connected successfully' }));
        }
      } catch (err) {
        setConnectionStatus('error');
        setError(`Database connection error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }

      // Test 2: Auth Configuration
      try {
        const { data: session } = await supabase.auth.getSession();
        const { data: user } = await supabase.auth.getUser();
        
        setAuthStatus('success');
        setDetails(prev => ({ 
          ...prev, 
          authStatus: 'Auth system operational',
          currentSession: session.session ? 'Active session found' : 'No active session',
          userStatus: user.user ? `Logged in as: ${user.user.email}` : 'Not logged in'
        }));
      } catch (err) {
        setAuthStatus('error');
        setError(`Auth system error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    runTests();
  }, []);

  const testDatabaseOperations = async () => {
    try {
      // Test multiple table operations
      const results = await Promise.allSettled([
        supabase.from('profiles').select('*').limit(5),
        supabase.from('service_requests').select('*').limit(5)
      ]);

      const profilesResult = results[0];
      const requestsResult = results[1];

      let summary = 'Database Operations Test:\n';
      
      if (profilesResult.status === 'fulfilled') {
        summary += `✓ Profiles table: ${profilesResult.value.data?.length || 0} records accessible\n`;
      } else {
        summary += `✗ Profiles table error: ${profilesResult.reason}\n`;
      }

      if (requestsResult.status === 'fulfilled') {
        summary += `✓ Service requests table: ${requestsResult.value.data?.length || 0} records accessible\n`;
      } else {
        summary += `✗ Service requests table error: ${requestsResult.reason}\n`;
      }

      setDetails(prev => ({ ...prev, operationsTest: summary }));
    } catch (error) {
      setError(`Operations test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testAuthFlow = async () => {
    try {
      // Test signup capability (this will show if signups are disabled)
      const testEmail = `test_${Date.now()}@example.com`;
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'test123456',
        options: { data: { first_name: 'Test', last_name: 'User' } }
      });

      if (error) {
        if (error.message.includes('Signups not allowed')) {
          setDetails(prev => ({ 
            ...prev, 
            signupTest: '⚠️ Signups are DISABLED in Supabase settings. Enable them in Auth > Settings.'
          }));
        } else {
          setDetails(prev => ({ 
            ...prev, 
            signupTest: `Auth test error: ${error.message}`
          }));
        }
      } else {
        setDetails(prev => ({ 
          ...prev, 
          signupTest: '✓ Signup functionality is working (test user created)'
        }));
      }
    } catch (error) {
      setDetails(prev => ({ 
        ...prev, 
        signupTest: `Auth test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg space-y-4">
      <h2 className="text-xl font-bold text-yellow-400 mb-4">System Health Check</h2>
      
      {/* Connection Status */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'testing' ? 'bg-yellow-400 animate-pulse' :
            connectionStatus === 'success' ? 'bg-green-400' :
            'bg-red-400'
          }`} />
          <span className="text-gray-300">
            Database Connection: {
              connectionStatus === 'testing' ? 'Testing...' :
              connectionStatus === 'success' ? 'Connected' :
              'Failed'
            }
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            authStatus === 'testing' ? 'bg-yellow-400 animate-pulse' :
            authStatus === 'success' ? 'bg-green-400' :
            'bg-red-400'
          }`} />
          <span className="text-gray-300">
            Authentication System: {
              authStatus === 'testing' ? 'Testing...' :
              authStatus === 'success' ? 'Operational' :
              'Error'
            }
          </span>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="space-y-2">
        <button 
          onClick={testDatabaseOperations}
          className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Test Database Operations
        </button>
        
        <button 
          onClick={testAuthFlow}
          className="w-full p-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
        >
          Test Authentication Flow
        </button>
      </div>

      {/* Detailed Results */}
      {Object.keys(details).length > 0 && (
        <div className="bg-gray-700 p-4 rounded text-sm">
          <h3 className="text-cyan-400 font-semibold mb-2">Test Results:</h3>
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="mb-2">
              <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <pre className="text-gray-200 whitespace-pre-wrap ml-2">{value}</pre>
            </div>
          ))}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="text-red-400 bg-red-900/20 p-3 rounded">
          <p className="font-semibold">Error Details:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Quick Fix Instructions */}
      <div className="bg-yellow-900/20 border border-yellow-600/50 p-3 rounded">
        <p className="text-yellow-400 font-semibold mb-2">Quick Fixes:</p>
        <ul className="text-yellow-200 text-sm space-y-1">
          <li>• Enable signups in Supabase Dashboard → Auth → Settings</li>
          <li>• Disable email confirmation for easier testing</li>
          <li>• Set proper Site URL and Redirect URLs in Auth settings</li>
          <li>• Create a demo user manually if needed</li>
        </ul>
      </div>
    </div>
  );
}
