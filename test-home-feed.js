const axios = require('axios');

async function testHomeFeed() {
  try {
    console.log('=== TESTING HOME FEED ENDPOINT ===');
    
    // First, let's try to login to get a token
    console.log('Attempting to login...');
    const loginResponse = await axios.post('http://localhost:3000/auth/login', {
      email: 'a@yopmail.com',
      password: 'password123'
    }, {
      headers: {
        'client-id': '437920819fa89d19abe380073d28839c',
        'client-secret': '28649120bdf32812f433f428b15ab1a1'
      }
    });
    
    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login successful, got token');
    
    // Now test the home feed endpoint
    console.log('Testing home feed endpoint...');
    const feedResponse = await axios.get('http://localhost:3000/home/feed', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'client-id': '437920819fa89d19abe380073d28839c',
        'client-secret': '28649120bdf32812f433f428b15ab1a1'
      }
    });
    
    console.log('✅ Home feed response received');
    console.log('Response status:', feedResponse.status);
    console.log('Data length:', feedResponse.data.data?.length || 0);
    console.log('First few items:', feedResponse.data.data?.slice(0, 3));
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Error response from server:');
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testHomeFeed(); 