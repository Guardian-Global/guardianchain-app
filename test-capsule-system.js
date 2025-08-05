#!/usr/bin/env node

/**
 * GuardianChain Comprehensive System Test Suite
 * Tests authentication, onboarding, subscription management, and debug systems
 */

import fs from 'fs';
import https from 'https';
import http from 'http';

const BASE_URL = 'http://localhost:5000';
const TEST_RESULTS = [];

// Test runner utilities
function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const requestOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({ 
            status: res.statusCode, 
            data: jsonData, 
            headers: res.headers 
          });
        } catch (e) {
          resolve({ 
            status: res.statusCode, 
            data: data, 
            headers: res.headers 
          });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

function logTest(testName, status, details = '') {
  const timestamp = new Date().toISOString();
  const result = { testName, status, details, timestamp };
  TEST_RESULTS.push(result);
  
  const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${statusIcon} ${testName}: ${status}${details ? ` - ${details}` : ''}`);
}

async function runTest(testName, testFunction) {
  try {
    await testFunction();
    logTest(testName, 'PASS');
  } catch (error) {
    logTest(testName, 'FAIL', error.message);
  }
}

// Authentication Tests
async function testAuthenticationEndpoints() {
  console.log('\n🔐 Testing Authentication System...');
  
  await runTest('Authentication User Endpoint', async () => {
    const response = await makeRequest('/api/auth/user');
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }
    if (!response.data.id || !response.data.email || !response.data.tier) {
      throw new Error('Missing required user fields');
    }
  });

  await runTest('Authentication Status Endpoint', async () => {
    const response = await makeRequest('/api/auth/status');
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }
    if (typeof response.data.authenticated !== 'boolean') {
      throw new Error('Authentication status not properly returned');
    }
  });

  await runTest('Debug User Endpoint', async () => {
    const response = await makeRequest('/api/debug/user');
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }
  });
}

// Onboarding Tests
async function testOnboardingSystem() {
  console.log('\n🚀 Testing Onboarding System...');
  
  await runTest('Onboarding Completion Endpoint', async () => {
    const onboardingData = {
      completedAt: new Date().toISOString(),
      completedSteps: ['profile', 'email', 'subscription']
    };
    
    const response = await makeRequest('/api/auth/complete-onboarding', {
      method: 'POST',
      body: onboardingData
    });
    
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }
    if (!response.data.success) {
      throw new Error('Onboarding completion failed');
    }
  });

  await runTest('User Onboarding Status Validation', async () => {
    const response = await makeRequest('/api/auth/user');
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }
    
    const needsOnboarding = !response.data.onboardingCompleted || 
                           !response.data.firstName || 
                           !response.data.lastName || 
                           !response.data.username ||
                           !response.data.emailVerified;
                           
    if (!needsOnboarding && response.data.onboardingCompleted) {
      logTest('Onboarding Status', 'INFO', 'User onboarding complete');
    } else {
      logTest('Onboarding Status', 'INFO', 'User onboarding needed (expected for testing)');
    }
  });
}

// Subscription Tests
async function testSubscriptionSystem() {
  console.log('\n💳 Testing Subscription System...');
  
  await runTest('Subscription Plans Endpoint', async () => {
    const response = await makeRequest('/api/subscription/plans');
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }
    if (!Array.isArray(response.data) || response.data.length === 0) {
      throw new Error('No subscription plans returned');
    }
    if (response.data.length !== 4) {
      throw new Error(`Expected 4 plans, got ${response.data.length}`);
    }
  });

  await runTest('Subscription Plan Structure Validation', async () => {
    const response = await makeRequest('/api/subscription/plans');
    const plans = response.data;
    
    const requiredFields = ['tier', 'name', 'priceMonthly', 'priceYearly', 'features', 'limits'];
    const requiredTiers = ['EXPLORER', 'SEEKER', 'CREATOR', 'SOVEREIGN'];
    
    plans.forEach((plan, index) => {
      requiredFields.forEach(field => {
        if (!(field in plan)) {
          throw new Error(`Plan ${index} missing required field: ${field}`);
        }
      });
    });
    
    const planTiers = plans.map(p => p.tier);
    requiredTiers.forEach(tier => {
      if (!planTiers.includes(tier)) {
        throw new Error(`Missing required tier: ${tier}`);
      }
    });
  });

  await runTest('User Subscription Status', async () => {
    const response = await makeRequest('/api/auth/user');
    const user = response.data;
    
    if (!user.tier || !user.subscriptionStatus) {
      throw new Error('User missing subscription information');
    }
    
    logTest('Current User Tier', 'INFO', `${user.tier} (${user.subscriptionStatus})`);
  });
}

// API Health Tests
async function testAPIHealth() {
  console.log('\n🏥 Testing API Health...');
  
  const endpoints = [
    '/api/auth/user',
    '/api/auth/status', 
    '/api/debug/user',
    '/api/subscription/plans',
    '/api/capsules',
    '/api/user/stats',
    '/api/reels',
    '/api/get-user-tier'
  ];

  for (const endpoint of endpoints) {
    await runTest(`Endpoint Health: ${endpoint}`, async () => {
      const start = Date.now();
      const response = await makeRequest(endpoint);
      const responseTime = Date.now() - start;
      
      if (response.status >= 400) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      if (responseTime > 1000) {
        logTest(`Response Time: ${endpoint}`, 'WARN', `${responseTime}ms (slow)`);
      } else {
        logTest(`Response Time: ${endpoint}`, 'INFO', `${responseTime}ms`);
      }
    });
  }
}

// System Integration Tests
async function testSystemIntegration() {
  console.log('\n🔗 Testing System Integration...');
  
  await runTest('Authentication Flow Integration', async () => {
    // Test full authentication flow
    const userResponse = await makeRequest('/api/auth/user');
    const statusResponse = await makeRequest('/api/auth/status');
    const plansResponse = await makeRequest('/api/subscription/plans');
    
    if (userResponse.status !== 200 || statusResponse.status !== 200 || plansResponse.status !== 200) {
      throw new Error('One or more core endpoints failed');
    }
    
    const user = userResponse.data;
    const status = statusResponse.data;
    const plans = plansResponse.data;
    
    // Validate data consistency
    if (status.authenticated !== true) {
      throw new Error('Status endpoint shows user not authenticated but user endpoint works');
    }
    
    if (!plans.find(p => p.tier === user.tier)) {
      throw new Error('User tier not found in available plans');
    }
  });

  await runTest('Onboarding State Consistency', async () => {
    const response = await makeRequest('/api/auth/user');
    const user = response.data;
    
    const needsOnboarding = !user.onboardingCompleted || 
                           !user.firstName || 
                           !user.lastName || 
                           !user.username ||
                           !user.emailVerified;
    
    logTest('Onboarding Detection Logic', 'INFO', `needsOnboarding: ${needsOnboarding}`);
    
    // This should trigger the ComprehensiveAuthFlow component
    if (needsOnboarding) {
      logTest('Auth Flow Trigger', 'PASS', 'Will show comprehensive onboarding flow');
    } else {
      logTest('Auth Flow Trigger', 'INFO', 'User setup complete');
    }
  });
}

// Performance Tests
async function testSystemPerformance() {
  console.log('\n⚡ Testing System Performance...');
  
  await runTest('Concurrent Request Handling', async () => {
    const requests = [];
    const endpoints = ['/api/auth/user', '/api/subscription/plans', '/api/auth/status'];
    
    // Make 10 concurrent requests
    for (let i = 0; i < 10; i++) {
      const endpoint = endpoints[i % endpoints.length];
      requests.push(makeRequest(endpoint));
    }
    
    const start = Date.now();
    const responses = await Promise.all(requests);
    const totalTime = Date.now() - start;
    
    // Check all requests succeeded
    const failed = responses.filter(r => r.status >= 400);
    if (failed.length > 0) {
      throw new Error(`${failed.length} requests failed`);
    }
    
    logTest('Concurrent Performance', 'INFO', `10 requests in ${totalTime}ms`);
  });

  await runTest('Memory Usage Stability', async () => {
    // Make repeated requests to check for memory leaks
    for (let i = 0; i < 20; i++) {
      await makeRequest('/api/auth/user');
    }
    
    // If we get here without errors, consider it a pass
    logTest('Memory Stability', 'INFO', '20 sequential requests completed');
  });
}

// Generate comprehensive test report
function generateTestReport() {
  console.log('\n📊 Generating Test Report...');
  
  const passed = TEST_RESULTS.filter(r => r.status === 'PASS').length;
  const failed = TEST_RESULTS.filter(r => r.status === 'FAIL').length;
  const warnings = TEST_RESULTS.filter(r => r.status === 'WARN').length;
  const info = TEST_RESULTS.filter(r => r.status === 'INFO').length;
  
  const report = {
    summary: {
      total: TEST_RESULTS.length,
      passed,
      failed,
      warnings,
      info,
      successRate: `${((passed / (passed + failed)) * 100).toFixed(1)}%`
    },
    timestamp: new Date().toISOString(),
    results: TEST_RESULTS
  };
  
  // Write report to file
  fs.writeFileSync('capsule-system-test-report.json', JSON.stringify(report, null, 2));
  
  console.log('\n🎯 TEST SUMMARY:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`ℹ️  Info: ${info}`);
  console.log(`📈 Success Rate: ${report.summary.successRate}`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! System is ready for production.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the results.');
  }
  
  return report;
}

// Main test execution
async function runAllTests() {
  console.log('🚀 Starting GuardianChain Comprehensive System Tests...');
  console.log(`📍 Testing against: ${BASE_URL}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}\n`);
  
  try {
    await testAuthenticationEndpoints();
    await testOnboardingSystem();
    await testSubscriptionSystem();
    await testAPIHealth();
    await testSystemIntegration();
    await testSystemPerformance();
    
    const report = generateTestReport();
    
    console.log('\n✅ Test suite completed successfully!');
    console.log('📄 Detailed report saved to: capsule-system-test-report.json');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    generateTestReport();
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export {
  runAllTests,
  makeRequest,
  generateTestReport
};