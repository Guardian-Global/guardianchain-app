// Simple test for authentication flow
const fetch = require('node-fetch'); // You might need to install this

async function testAuth() {
  console.log('🧪 Testing authentication flow...');
  
  try {
    // Test login
    console.log('1. Testing login...');
    const loginResponse = await fetch('http://localhost:5000/api/login', {
      redirect: 'manual'
    });
    
    console.log('Login status:', loginResponse.status);
    console.log('Login headers:', Object.fromEntries(loginResponse.headers.entries()));
    
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Cookies:', cookies);
    
    if (cookies) {
      // Test authenticated endpoint
      console.log('2. Testing authenticated endpoint...');
      const userResponse = await fetch('http://localhost:5000/api/auth/user', {
        headers: {
          'Cookie': cookies
        }
      });
      
      console.log('User status:', userResponse.status);
      const userData = await userResponse.text();
      console.log('User data:', userData);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAuth();