const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_USER_EMAIL = 'fourteen@yopmail.com'; // User ID 167
const TEST_USER_PASSWORD = 'Loca$h2682';

let authToken = null;
let userId = null;

async function testCurrentSystemState() {
    console.log('=== CURRENT SYSTEM STATE DIAGNOSTIC ===');
    console.log('Testing all critical endpoints to identify broken functionality');
    
    try {
        // Step 1: Test Login
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
        console.log('Onboarding Status:', loginResponse.data.data.user.onBoardingStatus);
        
        // Step 2: Test User Profile
        console.log('\n👤 STEP 2: Testing User Profile');
        const userResponse = await axios.get(`${BASE_URL}/user/me`, {
            headers: { 
                'Authorization': `Bearer ${authToken}`,
                'client-id': '437920819fa89d19abe380073d28839c',
                'client-secret': '28649120bdf32812f433f428b15ab1a1'
            }
        });
        console.log('✅ User profile retrieved');
        console.log('User has band:', !!userResponse.data.band);
        console.log('User station preference:', userResponse.data.stationPreference);
        
        // Step 3: Test Radio/Song Endpoint
        console.log('\n🎵 STEP 3: Testing Radio/Song Endpoint');
        try {
            const radioResponse = await axios.get(`${BASE_URL}/radio/song`, {
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'client-id': '437920819fa89d19abe380073d28839c',
                    'client-secret': '28649120bdf32812f433f428b15ab1a1'
                }
            });
            console.log('✅ Radio endpoint working');
            console.log('Songs available:', radioResponse.data.songs?.length || 0);
        } catch (error) {
            console.log('❌ Radio endpoint failed:', error.response?.data?.error || error.message);
        }
        
        // Step 4: Test Home Feed
        console.log('\n📰 STEP 4: Testing Home Feed');
        try {
            const feedResponse = await axios.get(`${BASE_URL}/home/feed`, {
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'client-id': '437920819fa89d19abe380073d28839c',
                    'client-secret': '28649120bdf32812f433f428b15ab1a1'
                }
            });
            console.log('✅ Feed endpoint working');
            console.log('Feed items:', feedResponse.data.data?.length || 0);
        } catch (error) {
            console.log('❌ Feed endpoint failed:', error.response?.data?.error || error.message);
        }
        
        // Step 5: Test Events Feed
        console.log('\n📅 STEP 5: Testing Events Feed');
        try {
            const eventsResponse = await axios.get(`${BASE_URL}/home/feed/events?station=Austin`, {
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'client-id': '437920819fa89d19abe380073d28839c',
                    'client-secret': '28649120bdf32812f433f428b15ab1a1'
                }
            });
            console.log('✅ Events endpoint working');
            console.log('Events available:', eventsResponse.data.data?.length || 0);
        } catch (error) {
            console.log('❌ Events endpoint failed:', error.response?.data?.error || error.message);
        }
        
        // Step 6: Test Genre Endpoint
        console.log('\n🎼 STEP 6: Testing Genre Endpoint');
        try {
            const genresResponse = await axios.get(`${BASE_URL}/auth/genres`, {
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'client-id': '437920819fa89d19abe380073d28839c',
                    'client-secret': '28649120bdf32812f433f428b15ab1a1'
                }
            });
            console.log('✅ Genres endpoint working');
            console.log('Genres available:', genresResponse.data.data?.length || 0);
        } catch (error) {
            console.log('❌ Genres endpoint failed:', error.response?.data?.error || error.message);
        }
        
        console.log('\n=== DIAGNOSTIC COMPLETE ===');
        
    } catch (error) {
        console.log('❌ CRITICAL ERROR:', error.response?.data?.error || error.message);
        console.log('System state: BROKEN');
    }
}

testCurrentSystemState(); 