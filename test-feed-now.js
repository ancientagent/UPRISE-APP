const axios = require('axios');

async function testFeed() {
    try {
        console.log('=== TESTING FEED WITH CORRECT DATABASE ===\n');
        
        // Test the home feed endpoint
        const response = await axios.get('http://localhost:3000/home/feed', {
            headers: {
                'client-id': '437920819fa89d19abe380073d28839c',
                'client-secret': '28649120bdf32812f433f428b15ab1a1',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTY2LCJlbWFpbCI6InRoaXJ0ZWVuQHlvcG1haWwuY29tIiwiaWF0IjoxNzUzNTU4NzE5LCJleHAiOjE3NTM1NTk2MTl9.9Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q'
            }
        });
        
        console.log('Feed response status:', response.status);
        console.log('Feed data:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.error('Error testing feed:', error.response?.data || error.message);
    }
}

testFeed(); 