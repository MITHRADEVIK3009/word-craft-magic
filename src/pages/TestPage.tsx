import { useState } from 'react';
import { aiCrew } from '@/lib/aiAgents';
import { SupabaseTest } from '@/components/SupabaseTest';

export default function TestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test AuthAgent
      const authResult = await aiCrew.executeTask('auth', { 
        action: 'generate_otp', 
        email: 'test@example.com' 
      });
      setTestResults(prev => [...prev, { agent: 'AuthAgent', result: authResult }]);

      // Test CertificateAgent
      const certificateResult = await aiCrew.executeTask('certificate', { 
        action: 'create_certificate', 
        certificateData: { 
          id: '123', 
          type: 'birth',
          userId: 'user123',
          issueDate: new Date(),
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        }, 
        document: { 
          content: 'Sample document',
          type: 'birth_certificate'
        } 
      });
      setTestResults(prev => [...prev, { agent: 'CertificateAgent', result: certificateResult }]);

      // Test AnalyticsAgent
      const analyticsResult = await aiCrew.executeTask('analytics', { 
        action: 'predict_demand', 
        serviceType: 'birth_certificate', 
        timeframe: 'next_week' 
      });
      setTestResults(prev => [...prev, { agent: 'AnalyticsAgent', result: analyticsResult }]);

      // Test CommunityAgent
      const communityResult = await aiCrew.executeTask('community', { 
        action: 'translate', 
        text: 'Hello, world!', 
        targetLanguage: 'hi' 
      });
      setTestResults(prev => [...prev, { agent: 'CommunityAgent', result: communityResult }]);

      // Test SystemMonitoringAgent
      const monitoringResult = await aiCrew.executeTask('monitor', { 
        action: 'health_check' 
      });
      setTestResults(prev => [...prev, { agent: 'SystemMonitoringAgent', result: monitoringResult }]);

    } catch (error) {
      setTestResults(prev => [...prev, { error: error instanceof Error ? error.message : 'Unknown error' }]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-8">System Tests</h1>
        
        {/* Supabase Connection Test */}
        <div className="mb-8">
          <SupabaseTest />
        </div>

        <h2 className="text-2xl font-bold text-yellow-400 mb-4">AI Agents Test Suite</h2>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="mb-8 bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </button>

        <div className="space-y-6">
          {testResults.map((result, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg">
              {result.error ? (
                <div className="text-red-400">
                  <h3 className="text-xl font-semibold mb-2">❌ Test Failed</h3>
                  <p>{result.error}</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                    ✅ {result.agent}
                  </h3>
                  <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 