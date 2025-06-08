import { useState } from 'react';
import { aiCrew } from '@/lib/aiAgents';
import { SupabaseTest } from '@/components/SupabaseTest';

interface TestResult {
  agent: string;
  action: string;
  success: boolean;
  duration: number;
  error?: string;
  result?: any;
}

export default function TestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testMetrics, setTestMetrics] = useState<{
    totalDuration: number;
    successCount: number;
    failureCount: number;
  } | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setTestMetrics(null);
    const startTime = Date.now();
    
    try {
      // Test AuthAgent
      const authStart = Date.now();
      try {
        const authResult = await aiCrew.executeTask('auth', { 
          action: 'generate_otp', 
          email: 'test@example.com' 
        });
        setTestResults(prev => [...prev, {
          agent: 'AuthAgent',
          action: 'generate_otp',
          success: true,
          duration: Date.now() - authStart,
          result: authResult
        }]);
      } catch (error) {
        setTestResults(prev => [...prev, {
          agent: 'AuthAgent',
          action: 'generate_otp',
          success: false,
          duration: Date.now() - authStart,
          error: error instanceof Error ? error.message : 'Unknown error'
        }]);
      }

      // Test CertificateAgent
      const certStart = Date.now();
      try {
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
        setTestResults(prev => [...prev, {
          agent: 'CertificateAgent',
          action: 'create_certificate',
          success: true,
          duration: Date.now() - certStart,
          result: certificateResult
        }]);
      } catch (error) {
        setTestResults(prev => [...prev, {
          agent: 'CertificateAgent',
          action: 'create_certificate',
          success: false,
          duration: Date.now() - certStart,
          error: error instanceof Error ? error.message : 'Unknown error'
        }]);
      }

      // Test AnalyticsAgent
      const analyticsStart = Date.now();
      try {
        const analyticsResult = await aiCrew.executeTask('analytics', { 
          action: 'predict_demand', 
          serviceType: 'birth_certificate', 
          timeframe: 'next_week' 
        });
        setTestResults(prev => [...prev, {
          agent: 'AnalyticsAgent',
          action: 'predict_demand',
          success: true,
          duration: Date.now() - analyticsStart,
          result: analyticsResult
        }]);
      } catch (error) {
        setTestResults(prev => [...prev, {
          agent: 'AnalyticsAgent',
          action: 'predict_demand',
          success: false,
          duration: Date.now() - analyticsStart,
          error: error instanceof Error ? error.message : 'Unknown error'
        }]);
      }

      // Test CommunityAgent
      const communityStart = Date.now();
      try {
        const communityResult = await aiCrew.executeTask('community', { 
          action: 'translate', 
          text: 'Hello, world!', 
          targetLanguage: 'hi' 
        });
        setTestResults(prev => [...prev, {
          agent: 'CommunityAgent',
          action: 'translate',
          success: true,
          duration: Date.now() - communityStart,
          result: communityResult
        }]);
      } catch (error) {
        setTestResults(prev => [...prev, {
          agent: 'CommunityAgent',
          action: 'translate',
          success: false,
          duration: Date.now() - communityStart,
          error: error instanceof Error ? error.message : 'Unknown error'
        }]);
      }

      // Test SystemMonitoringAgent
      const monitorStart = Date.now();
      try {
        const monitoringResult = await aiCrew.executeTask('monitor', { 
          action: 'health_check' 
        });
        setTestResults(prev => [...prev, {
          agent: 'SystemMonitoringAgent',
          action: 'health_check',
          success: true,
          duration: Date.now() - monitorStart,
          result: monitoringResult
        }]);
      } catch (error) {
        setTestResults(prev => [...prev, {
          agent: 'SystemMonitoringAgent',
          action: 'health_check',
          success: false,
          duration: Date.now() - monitorStart,
          error: error instanceof Error ? error.message : 'Unknown error'
        }]);
      }

      // Calculate metrics
      const totalDuration = Date.now() - startTime;
      const successCount = testResults.filter(r => r.success).length;
      const failureCount = testResults.filter(r => !r.success).length;
      
      setTestMetrics({
        totalDuration,
        successCount,
        failureCount
      });

    } catch (error) {
      console.error('Test suite failed:', error);
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
        
        {/* Test Metrics */}
        {testMetrics && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">Test Metrics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded">
                <p className="text-gray-400">Total Duration</p>
                <p className="text-2xl font-bold text-yellow-400">{testMetrics.totalDuration}ms</p>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <p className="text-gray-400">Successful Tests</p>
                <p className="text-2xl font-bold text-green-400">{testMetrics.successCount}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <p className="text-gray-400">Failed Tests</p>
                <p className="text-2xl font-bold text-red-400">{testMetrics.failureCount}</p>
              </div>
            </div>
          </div>
        )}

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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-yellow-400">
                  {result.success ? '✅' : '❌'} {result.agent}
                </h3>
                <span className="text-gray-400">{result.duration}ms</span>
              </div>
              
              <div className="mb-2">
                <span className="text-gray-400">Action:</span>
                <span className="ml-2 text-gray-300">{result.action}</span>
              </div>

              {result.error ? (
                <div className="text-red-400">
                  <p className="font-semibold">Error:</p>
                  <p>{result.error}</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-400 mb-2">Result:</p>
                  <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 