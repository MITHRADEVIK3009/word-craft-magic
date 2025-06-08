import React, { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

const SupabaseConnectionTest: React.FC = () => {
  const [result, setResult] = useState<string>('Testing connection...');

  useEffect(() => {
    const testConnection = async () => {
      // Use a valid table name: 'profiles'
      const { data, error } = await supabase.from('profiles').select('*').limit(1);
      if (error) {
        setResult(`Connection failed: ${error.message}`);
      } else {
        setResult(`Connection successful! Sample data: ${JSON.stringify(data)}`);
      }
    };
    testConnection();
  }, []);

  return <div style={{ padding: 16, background: '#eee', borderRadius: 8 }}>{result}</div>;
};

export default SupabaseConnectionTest; 