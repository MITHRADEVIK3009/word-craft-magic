import { aiCrew } from './lib/aiAgents';

async function testAIAgents() {
  console.log('🧪 Starting AI Agents Test Suite...\n');

  try {
    // Test AuthAgent
    console.log('🔐 Testing AuthAgent:');
    const authResult = await aiCrew.executeTask('auth', { 
      action: 'generate_otp', 
      email: 'test@example.com' 
    });
    console.log('✅ Auth Result:', authResult);

    // Test CertificateAgent
    console.log('\n📜 Testing CertificateAgent:');
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
    console.log('✅ Certificate Result:', certificateResult);

    // Test AnalyticsAgent
    console.log('\n🧠 Testing AnalyticsAgent:');
    const analyticsResult = await aiCrew.executeTask('analytics', { 
      action: 'predict_demand', 
      serviceType: 'birth_certificate', 
      timeframe: 'next_week' 
    });
    console.log('✅ Analytics Result:', analyticsResult);

    // Test CommunityAgent
    console.log('\n🌍 Testing CommunityAgent:');
    const communityResult = await aiCrew.executeTask('community', { 
      action: 'translate', 
      text: 'Hello, world!', 
      targetLanguage: 'hi' 
    });
    console.log('✅ Community Result:', communityResult);

    // Test SystemMonitoringAgent
    console.log('\n🔍 Testing SystemMonitoringAgent:');
    const monitoringResult = await aiCrew.executeTask('monitor', { 
      action: 'health_check' 
    });
    console.log('✅ Monitoring Result:', monitoringResult);

    console.log('\n✨ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

// Run tests
testAIAgents().catch(console.error); 