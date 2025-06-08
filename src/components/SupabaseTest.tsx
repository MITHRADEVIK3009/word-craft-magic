import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    async function testConnection() {
      try {
        // Try to fetch a single row from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);

        if (error) {
          throw error;
        }

        setConnectionStatus('connected');
      } catch (error) {
        setConnectionStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Failed to connect to Supabase');
      }
    }

    testConnection();
  }, []);

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold text-yellow-400 mb-4">Supabase Connection Test</h2>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'checking' ? 'bg-yellow-400 animate-pulse' :
            connectionStatus === 'connected' ? 'bg-green-400' :
            'bg-red-400'
          }`} />
          <span className="text-gray-300">
            {connectionStatus === 'checking' ? 'Checking connection...' :
             connectionStatus === 'connected' ? 'Connected to Supabase' :
             'Connection failed'}
          </span>
        </div>

        {connectionStatus === 'error' && (
          <div className="text-red-400">
            <p className="font-semibold">Error Details:</p>
            <p>{errorMessage}</p>
          </div>
        )}

        {connectionStatus === 'connected' && (
          <div className="text-green-400">
            <p>✅ Successfully connected to Supabase!</p>
          </div>
        )}
      </div>
    </div>
  );
} 