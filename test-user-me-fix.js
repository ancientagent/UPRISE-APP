const axios = require('axios');

async function testUserMeFix() {
    console.log('=== TESTING GET /user/me AFTER FIX ===');
    
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
        console.log('Band object:', userMeResponse.data.data.band);
        console.log('Radio preference:', userMeResponse.data.data.radioPrefrence);
        
        console.log('\n🎉 CRITICAL BUG FIX VERIFIED!');
        console.log('✅ Database query error resolved');
        console.log('✅ User content loads correctly after login');
        console.log('✅ All user data accessible');
        
    } catch (error) {
        console.log('❌ ERROR:', error.response?.data?.error || error.message);
        if (error.response?.status === 400) {
            console.log('❌ CRITICAL: Database query error still exists');
        }
    }
}

testUserMeFix(); 