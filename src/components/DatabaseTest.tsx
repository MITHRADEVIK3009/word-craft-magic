import { useEffect, useState } from 'react';
import { db } from '@/lib/database';

export function DatabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        const isConnected = await db.testConnection();
        setConnectionStatus(isConnected ? 'success' : 'error');
        if (!isConnected) {
          setError('Failed to connect to database');
        }
      } catch (err) {
        setConnectionStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      }
    }

    testConnection();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Database Connection Test</h2>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'testing' ? 'bg-yellow-500' :
            connectionStatus === 'success' ? 'bg-green-500' :
            'bg-red-500'
          }`} />
          <span>
            {connectionStatus === 'testing' ? 'Testing connection...' :
             connectionStatus === 'success' ? 'Connected to database' :
             'Connection failed'}
          </span>
        </div>
        {error && (
          <div className="text-red-500 text-sm">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
} 