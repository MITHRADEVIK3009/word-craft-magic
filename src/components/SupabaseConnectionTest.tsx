
import React, { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

const SupabaseConnectionTest: React.FC = () => {
  const [result, setResult] = useState<string>('Testing connection...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1);
        if (error) {
          setResult(`Connection failed: ${error.message}`);
        } else {
          setResult(`Connection successful! Found ${data?.length || 0} profiles`);
        }
      } catch (err) {
        setResult(`Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    testConnection();
  }, []);

  const testDatabaseOperations = async () => {
    try {
      // Test basic operations
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);

      const { data: requests, error: requestError } = await supabase
        .from('service_requests')
        .select('*')
        .limit(5);

      if (profileError || requestError) {
        setResult(`Database test failed: ${profileError?.message || requestError?.message}`);
      } else {
        setResult(`Database test successful! Profiles: ${profiles?.length || 0}, Requests: ${requests?.length || 0}`);
      }
    } catch (error) {
      setResult(`Database test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ padding: 16, background: '#eee', borderRadius: 8 }}>
      <h3>Supabase Connection Test</h3>
      <p>{result}</p>
      <button onClick={testDatabaseOperations} style={{ marginTop: 10, padding: '8px 16px' }}>
        Test Database Operations
      </button>
    </div>
  );
};

export default SupabaseConnectionTest;
