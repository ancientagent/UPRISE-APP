const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_USER_EMAIL = 'thirteen@yopmail.com'; // User ID 166 with onboarding status 2
const TEST_USER_PASSWORD = 'password123'; // Default password

let authToken = null;
let userId = null;

async function testContentDeliveryPipeline() {
    console.log('=== CONTENT DELIVERY PIPELINE DIAGNOSTIC ===');
    console.log('Testing complete user flow: Login → User Profile → Radio → Feed');
    
    try {
        // Step 1: Login and get authentication token
        console.log('\n🔐 STEP 1: Testing Login');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: TEST_USER_EMAIL,
            password: TEST_USER_PASSWORD,
            clientId: '437920819fa89d19abe380073d28839c',
            clientSecret: '28649120bdf32812f433f428b15ab1a1'
        });
        
        authToken = loginResponse.data.data.accessToken;
        userId = loginResponse.data.data.user.id;
        console.log('✅ Login successful');
        console.log('User ID:', userId);
        console.log('Token received:', authToken ? 'Yes' : 'No');
        
        // Step 2: Test GET /user/me endpoint
        console.log('\n👤 STEP 2: Testing GET /user/me');
        const userMeResponse = await axios.get(`${BASE_URL}/user/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'client-id': '437920819fa89d19abe380073d28839c',
                'client-secret': '28649120bdf32812f433f428b15ab1a1'
            }
        });
        
        const userData = userMeResponse.data.data;
        console.log('✅ GET /user/me successful');
        console.log('User data keys:', Object.keys(userData));
        console.log('Band object:', userData.band);
        console.log('Radio preference:', userData.radioPrefrence);
        console.log('Onboarding status:', userData.onBoardingStatus);
        
        // Step 3: Test GET /radio/song endpoint
        console.log('\n🎵 STEP 3: Testing GET /radio/song');
        const radioResponse = await axios.get(`${BASE_URL}/radio/song`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'client-id': '437920819fa89d19abe380073d28839c',
                'client-secret': '28649120bdf32812f433f428b15ab1a1'
            }
        });
        
        const radioData = radioResponse.data.data;
        console.log('✅ GET /radio/song successful');
        console.log('Radio song found:', radioData ? 'Yes' : 'No');
        if (radioData) {
            console.log('Song title:', radioData.song?.title);
            console.log('Band:', radioData.band?.title);
        }
        
        // Step 4: Test GET /home/feed endpoint
        console.log('\n📰 STEP 4: Testing GET /home/feed');
        const feedResponse = await axios.get(`${BASE_URL}/home/feed`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'client-id': '437920819fa89d19abe380073d28839c',
                'client-secret': '28649120bdf32812f433f428b15ab1a1'
            }
        });
        
        const feedData = feedResponse.data.data;
        console.log('✅ GET /home/feed successful');
        console.log('Feed items found:', feedData.length);
        console.log('Feed item types:', feedData.map(item => item.type));
        
        // Step 5: Test GET /home/feed/events endpoint
        console.log('\n📅 STEP 5: Testing GET /home/feed/events');
        const eventsResponse = await axios.get(`${BASE_URL}/home/feed/events?station=Austin`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'client-id': '437920819fa89d19abe380073d28839c',
                'client-secret': '28649120bdf32812f433f428b15ab1a1'
            }
        });
        
        const eventsData = eventsResponse.data.data;
        console.log('✅ GET /home/feed/events successful');
        console.log('Events found:', eventsData.length);
        
        // Step 6: Summary
        console.log('\n🎯 DIAGNOSTIC SUMMARY');
        console.log('✅ Login: Working');
        console.log('✅ User Profile: Working');
        console.log('✅ Radio Player: Working');
        console.log('✅ Home Feed: Working');
        console.log('✅ Events Feed: Working');
        console.log('\n🎉 ALL ENDPOINTS FUNCTIONAL - CONTENT DELIVERY PIPELINE RESTORED');
        
    } catch (error) {
        console.log('\n❌ DIAGNOSTIC FAILED');
        console.log('Error:', error.message);
        if (error.response) {
            console.log('Response status:', error.response.status);
            console.log('Response data:', error.response.data);
        }
        console.log('Error stack:', error.stack);
    }
}

// Run the diagnostic
testContentDeliveryPipeline(); 