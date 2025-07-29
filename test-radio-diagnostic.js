const axios = require('axios');

async function testRadioDiagnostic() {
    console.log('=== RADIO ENDPOINT DIAGNOSTIC ===');
    
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
        
        // Step 2: Test Radio endpoint
        console.log('\n🎵 STEP 2: Test Radio endpoint');
        const radioResponse = await axios.get('http://localhost:3000/radio/song', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'client-id': '437920819fa89d19abe380073d28839c',
                'client-secret': '28649120bdf32812f433f428b15ab1a1'
            }
        });
        
        console.log('✅ Radio endpoint successful');
        console.log('Response status:', radioResponse.status);
        console.log('Response data:', radioResponse.data);
        
    } catch (error) {
        console.log('❌ ERROR:', error.response?.data?.error || error.message);
        if (error.response?.status === 400) {
            console.log('❌ Radio endpoint error details:', error.response?.data);
        }
    }
}

testRadioDiagnostic(); 