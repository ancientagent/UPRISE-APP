const axios = require('axios');

async function testFeedOnly() {
    console.log('=== TESTING FEED ENDPOINT ONLY ===');
    
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
        console.log('User genres:', user.radioPrefrence.genres);
        
        // Step 2: Test Home Feed
        console.log('\n📰 STEP 2: Test Home Feed');
        const feedResponse = await axios.get('http://localhost:3000/home/feed', {
            headers: { 
                'Authorization': `Bearer ${authToken}`,
                'client-id': '437920819fa89d19abe380073d28839c',
                'client-secret': '28649120bdf32812f433f428b15ab1a1'
            }
        });
        
        console.log('✅ Feed endpoint working');
        console.log('Feed response structure:', Object.keys(feedResponse.data));
        console.log('Feed items:', feedResponse.data.data?.length || 0);
        
        if (feedResponse.data.data && feedResponse.data.data.length > 0) {
            console.log('First feed item:', feedResponse.data.data[0]);
        }
        
        console.log('\n🎉 FEED TEST COMPLETE!');
        
    } catch (error) {
        console.log('❌ ERROR:', error.response?.data?.error || error.message);
    }
}

testFeedOnly(); 