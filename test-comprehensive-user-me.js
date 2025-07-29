const axios = require('axios');

async function testComprehensiveUserMe() {
    console.log('=== COMPREHENSIVE USER/ME TEST ===');
    
    try {
        // Step 1: Login
        console.log('\n🔐 STEP 1: Login');
        const loginResponse = await axios.post('http://localhost:3000/auth/login', {
            email: 'fourteen@yopmail.com',
            password: 'Loca$h2682',
            clientId: '437920819fa89d19abe380073d28839c',
            clientSecret: '28649120bdf32812f433f428b15ab1a1'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'client-id': '437920819fa89d19abe380073d28839c',
                'client-secret': '28649120bdf32812f433f428b15ab1a1'
            }
        });
        
        const authToken = loginResponse.data.data.accessToken;
        const user = loginResponse.data.data.user;
        
        console.log('✅ Login successful');
        console.log('User ID:', user.id);
        
        // Step 2: Test GET /user/me endpoint
        console.log('\n👤 STEP 2: Test GET /user/me endpoint');
        const userMeResponse = await axios.get('http://localhost:3000/user/me', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'client-id': '437920819fa89d19abe380073d28839c',
                'client-secret': '28649120bdf32812f433f428b15ab1a1'
            }
        });
        
        console.log('✅ GET /user/me successful');
        console.log('User data keys:', Object.keys(userMeResponse.data.data));
        
        // Step 3: Test Radio endpoint (uses UserStationPrefrence)
        console.log('\n🎵 STEP 3: Test Radio endpoint');
        const radioResponse = await axios.get('http://localhost:3000/radio/song', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'client-id': '437920819fa89d19abe380073d28839c',
                'client-secret': '28649120bdf32812f433f428b15ab1a1'
            }
        });
        
        console.log('✅ Radio endpoint successful');
        console.log('Songs available:', radioResponse.data.songs?.length || 0);
        
        // Step 4: Test Home Feed endpoint (uses UserStationPrefrence)
        console.log('\n📰 STEP 4: Test Home Feed endpoint');
        const feedResponse = await axios.get('http://localhost:3000/home/feed', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'client-id': '437920819fa89d19abe380073d28839c',
                'client-secret': '28649120bdf32812f433f428b15ab1a1'
            }
        });
        
        console.log('✅ Home Feed endpoint successful');
        console.log('Feed items:', feedResponse.data.data?.length || 0);
        
        // Step 5: Test Statistics endpoint (uses UserStationPrefrence)
        console.log('\n📊 STEP 5: Test Statistics endpoint');
        const statsResponse = await axios.get('http://localhost:3000/statistics/users', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'client-id': '437920819fa89d19abe380073d28839c',
                'client-secret': '28649120bdf32812f433f428b15ab1a1'
            }
        });
        
        console.log('✅ Statistics endpoint successful');
        console.log('Statistics data received');
        
        console.log('\n🎉 COMPREHENSIVE TEST COMPLETE!');
        console.log('✅ All UserStationPrefrence queries working correctly');
        console.log('✅ No database column errors');
        console.log('✅ All endpoints functioning properly');
        
    } catch (error) {
        console.log('❌ ERROR:', error.response?.data?.error || error.message);
        if (error.response?.status === 400) {
            console.log('❌ CRITICAL: Database query error still exists');
            console.log('Error details:', error.response?.data);
        }
    }
}

testComprehensiveUserMe(); 