const axios = require('axios');

async function testVeritasSeal() {
  console.log('🧪 Testing DocuSign Veritas Seal Integration');
  console.log('===============================================');

  try {
    // Test the test endpoint to create a sample capsule and seal it
    console.log('Creating and sealing sample capsule...');
    
    const response = await axios.post('http://localhost:5000/api/veritas/test', {}, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    console.log('✅ Success! Response:');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.seal && response.data.seal.envelopeId) {
      console.log(`\n🔒 Veritas Seal Created: ${response.data.seal.envelopeId}`);
      console.log(`📝 Capsule ID: ${response.data.capsule.id}`);
      console.log(`📊 Status: ${response.data.seal.status}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testVeritasSeal();