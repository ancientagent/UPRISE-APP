const axios = require('axios');

async function testSignupAndFeed() {
  try {
    console.log('=== TESTING SIGNUP AND HOME FEED ===');
    
    // Generate a unique email
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    
    // Sign up a new user
    console.log('Creating new user...');
    const signupResponse = await axios.post('http://localhost:3000/auth/signup', {
      firstName: 'Test',
      lastName: 'User',
      userName: `testuser${timestamp}`,
      email: testEmail,
      password: 'Password123!',
      mobile: '1234567890',
      gender: 'PREFER NOT TO SAY',
      role: 'listener'
    }, {
      headers: {
        'client-id': '437920819fa89d19abe380073d28839c',
        'client-secret': '28649120bdf32812f433f428b15ab1a1'
      }
    });
    
    console.log('✅ Signup successful');
    console.log('User data:', signupResponse.data);
    
    // Login with the new user
    console.log('Logging in with new user...');
    const loginResponse = await axios.post('http://localhost:3000/auth/login', {
      email: testEmail,
      password: 'Password123!'
    }, {
      headers: {
        'client-id': '437920819fa89d19abe380073d28839c',
        'client-secret': '28649120bdf32812f433f428b15ab1a1'
      }
    });
    
    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login successful, got token');
    
    // Set user location and genre preferences
    console.log('Setting user location and preferences...');
    await axios.post('http://localhost:3000/auth/user-location', {
      city: 'Austin',
      state: 'Texas',
      country: 'USA',
      zipcode: '78701',
      latitude: 30.2672,
      longitude: -97.7431,
      genreIds: [1, 2], // Assuming these genre IDs exist
      userId: loginResponse.data.data.user.id
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'client-id': '437920819fa89d19abe380073d28839c',
        'client-secret': '28649120bdf32812f433f428b15ab1a1'
      }
    });
    
    console.log('✅ User location and preferences set');
    
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

testSignupAndFeed(); 