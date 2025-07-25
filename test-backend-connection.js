const axios = require('axios');

async function testBackendConnection() {
  try {
    console.log('=== TESTING BACKEND CONNECTION ===');
    
    // Test if backend is running
    const response = await axios.get('http://localhost:3000/health', { timeout: 5000 });
    console.log('✅ Backend is running');
    console.log('Response:', response.data);
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend is not running on port 3000');
    } else if (error.response) {
      console.log('✅ Backend is running but health endpoint not found');
      console.log('Status:', error.response.status);
    } else {
      console.log('❌ Error connecting to backend:', error.message);
    }
  }
}

testBackendConnection(); 