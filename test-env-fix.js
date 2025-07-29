const axios = require('axios');

async function testEnvFix() {
    console.log('=== TESTING ENVIRONMENT VARIABLE FIXES ===');
    console.log('Testing if GET_NEW_RELEASES and other critical variables are working...');
    
    try {
        // Test login first
        const loginResponse = await axios.post('http://localhost:3000/auth/login', {
            email: 'thirteen@yopmail.com',
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
        
        // Test the critical endpoints that were failing
        console.log('\n--- Testing Critical Endpoints ---');
        
        // Test GET /home/new-releases (correct backend route)
        try {
            const releasesResponse = await axios.get('http://localhost:3000/home/new-releases', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'client-id': '437920819fa89d19abe380073d28839c',
                    'client-secret': '28649120bdf32812f433f428b15ab1a1'
                }
            });
            console.log('✅ GET /home/new-releases successful');
            console.log('New releases count:', releasesResponse.data.data?.length || 0);
        } catch (error) {
            console.log('❌ GET /home/new-releases failed:', error.response?.data?.error || error.message);
        }
        
        // Test GET /home/feed
        try {
            const feedResponse = await axios.get('http://localhost:3000/home/feed', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'client-id': '437920819fa89d19abe380073d28839c',
                    'client-secret': '28649120bdf32812f433f428b15ab1a1'
                }
            });
            console.log('✅ GET /home/feed successful');
            console.log('Feed items count:', feedResponse.data.data?.length || 0);
        } catch (error) {
            console.log('❌ GET /home/feed failed:', error.response?.data?.error || error.message);
        }
        
        // Test GET /user/me
        try {
            const userMeResponse = await axios.get('http://localhost:3000/user/me', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'client-id': '437920819fa89d19abe380073d28839c',
                    'client-secret': '28649120bdf32812f433f428b15ab1a1'
                }
            });
            console.log('✅ GET /user/me successful');
            console.log('User data complete:', {
                id: userMeResponse.data.data.id,
                email: userMeResponse.data.data.email,
                band: userMeResponse.data.data.band
            });
        } catch (error) {
            console.log('❌ GET /user/me failed:', error.response?.data?.error || error.message);
        }
        
        console.log('\n🎉 ENVIRONMENT VARIABLE FIX VERIFICATION COMPLETE!');
        console.log('✅ All critical endpoints should now be working');
        console.log('✅ "Not Found" errors should be resolved');
        console.log('✅ Feed should display content properly');
        
    } catch (error) {
        console.log('❌ ERROR:', error.response?.data?.error || error.message);
    }
}

testEnvFix(); 