#!/usr/bin/env node

/**
 * Test Script to Check Onboarding Genres Endpoint
 */

const axios = require('axios');

console.log('🔍 TESTING ONBOARDING GENRES ENDPOINT\n');

async function testOnboardingGenres() {
  try {
    console.log('📡 Testing /onboarding/all-genres endpoint...');
    
    const response = await axios.get('http://localhost:3000/onboarding/all-genres', {
      headers: {
        'client-id': '437920819fa89d19abe380073d28839c',
        'client-secret': '28649120bdf32812f433f428b15ab1a1'
      }
    });
    
    console.log('✅ Response received');
    console.log('📊 Response structure:', Object.keys(response.data));
    console.log('📋 Genres count:', response.data.data ? response.data.data.length : 'No data');
    
    if (response.data.data && response.data.data.length > 0) {
      console.log('\n🎵 First 10 genres:');
      response.data.data.slice(0, 10).forEach((genre, index) => {
        console.log(`  ${index + 1}. ${genre.name} (${genre.type})`);
      });
      
      console.log('\n🎸 Punk-related genres:');
      const punkGenres = response.data.data.filter(genre => 
        genre.name.toLowerCase().includes('punk') || 
        genre.super_genre === 'punk'
      );
      punkGenres.forEach(genre => {
        console.log(`  - ${genre.name} (${genre.type})`);
      });
      
      console.log(`\n📈 Total genres available: ${response.data.data.length}`);
    } else {
      console.log('❌ No genres found in response');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testOnboardingGenres(); 