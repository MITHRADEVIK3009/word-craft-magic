import { aiCrew } from './lib/aiAgents';

interface TestResult {
  agent: string;
  action: string;
  success: boolean;
  duration: number;
  error?: string;
  result?: any;
}

async function testAIAgents() {
  console.log('🧪 Starting AI Agents Test Suite...\n');
  const results: TestResult[] = [];
  const startTime = Date.now();

  try {
    // Test AuthAgent
    console.log('🔐 Testing AuthAgent:');
    const authStart = Date.now();
    try {
      const authResult = await aiCrew.executeTask('auth', { 
        action: 'generate_otp', 
        email: 'test@example.com' 
      });
      results.push({
        agent: 'AuthAgent',
        action: 'generate_otp',
        success: true,
        duration: Date.now() - authStart,
        result: authResult
      });
      console.log('✅ Auth Result:', authResult);
    } catch (error) {
      results.push({
        agent: 'AuthAgent',
        action: 'generate_otp',
        success: false,
        duration: Date.now() - authStart,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.error('❌ Auth Error:', error);
    }

    // Test CertificateAgent
    console.log('\n📜 Testing CertificateAgent:');
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
      results.push({
        agent: 'CertificateAgent',
        action: 'create_certificate',
        success: true,
        duration: Date.now() - certStart,
        result: certificateResult
      });
      console.log('✅ Certificate Result:', certificateResult);
    } catch (error) {
      results.push({
        agent: 'CertificateAgent',
        action: 'create_certificate',
        success: false,
        duration: Date.now() - certStart,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.error('❌ Certificate Error:', error);
    }

    // Test AnalyticsAgent
    console.log('\n🧠 Testing AnalyticsAgent:');
    const analyticsStart = Date.now();
    try {
      const analyticsResult = await aiCrew.executeTask('analytics', { 
        action: 'predict_demand', 
        serviceType: 'birth_certificate', 
        timeframe: 'next_week' 
      });
      results.push({
        agent: 'AnalyticsAgent',
        action: 'predict_demand',
        success: true,
        duration: Date.now() - analyticsStart,
        result: analyticsResult
      });
      console.log('✅ Analytics Result:', analyticsResult);
    } catch (error) {
      results.push({
        agent: 'AnalyticsAgent',
        action: 'predict_demand',
        success: false,
        duration: Date.now() - analyticsStart,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.error('❌ Analytics Error:', error);
    }

    // Test CommunityAgent
    console.log('\n🌍 Testing CommunityAgent:');
    const communityStart = Date.now();
    try {
      const communityResult = await aiCrew.executeTask('community', { 
        action: 'translate', 
        text: 'Hello, world!', 
        targetLanguage: 'hi' 
      });
      results.push({
        agent: 'CommunityAgent',
        action: 'translate',
        success: true,
        duration: Date.now() - communityStart,
        result: communityResult
      });
      console.log('✅ Community Result:', communityResult);
    } catch (error) {
      results.push({
        agent: 'CommunityAgent',
        action: 'translate',
        success: false,
        duration: Date.now() - communityStart,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.error('❌ Community Error:', error);
    }

    // Test SystemMonitoringAgent
    console.log('\n🔍 Testing SystemMonitoringAgent:');
    const monitorStart = Date.now();
    try {
      const monitoringResult = await aiCrew.executeTask('monitor', { 
        action: 'health_check' 
      });
      results.push({
        agent: 'SystemMonitoringAgent',
        action: 'health_check',
        success: true,
        duration: Date.now() - monitorStart,
        result: monitoringResult
      });
      console.log('✅ Monitoring Result:', monitoringResult);
    } catch (error) {
      results.push({
        agent: 'SystemMonitoringAgent',
        action: 'health_check',
        success: false,
        duration: Date.now() - monitorStart,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.error('❌ Monitoring Error:', error);
    }

    // Print Test Summary
    const totalDuration = Date.now() - startTime;
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    console.log('\n📊 Test Summary:');
    console.log('----------------');
    console.log(`Total Tests: ${results.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failureCount}`);
    console.log(`Total Duration: ${totalDuration}ms`);
    console.log(`Average Duration: ${Math.round(totalDuration / results.length)}ms`);
    
    // Print Detailed Results
    console.log('\n📝 Detailed Results:');
    console.log('-------------------');
    results.forEach(result => {
      console.log(`\n${result.success ? '✅' : '❌'} ${result.agent} - ${result.action}`);
      console.log(`Duration: ${result.duration}ms`);
      if (result.error) {
        console.log(`Error: ${result.error}`);
      }
      if (result.result) {
        console.log('Result:', result.result);
      }
    });

  } catch (error) {
    console.error('\n❌ Test Suite Failed:', error);
  }
}

// Run tests
testAIAgents().catch(console.error); 