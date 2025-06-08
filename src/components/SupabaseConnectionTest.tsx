import React, { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { aiCrew } from '../integrations/aiCrew/client';

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

  const handleAIConnectionTest = async () => {
    try {
      const aiResult = await aiCrew.executeTask('auth', { action: 'generate_otp', email: 'user@example.com' });
      setResult(`AI Connection successful! Result: ${aiResult}`);
    } catch (error) {
      setResult(`AI Connection failed: ${error.message}`);
    }
  };

  const systemReport = async () => {
    try {
      const systemReport = await aiCrew.runSystemWideMonitoring();
      setResult(`System Report: ${JSON.stringify(systemReport)}`);
    } catch (error) {
      setResult(`System Report failed: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: 16, background: '#eee', borderRadius: 8 }}>
      {result}
      <button onClick={handleAIConnectionTest}>Test AI Connection</button>
      <button onClick={systemReport}>Get System Report</button>
    </div>
  );
};

export default SupabaseConnectionTest; 