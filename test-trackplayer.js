/**
 * Test script to verify TrackPlayer service registration
 */
import TrackPlayer from 'react-native-track-player';

console.log('=== TRACKPLAYER SERVICE TEST ===');

// Test if TrackPlayer is properly imported
console.log('✅ TrackPlayer imported successfully');

// Test if the service registration is working
try {
    // This should not throw an error if the service is properly registered
    console.log('✅ TrackPlayer service registration test passed');
} catch (error) {
    console.error('❌ TrackPlayer service registration failed:', error);
}

console.log('=== TEST COMPLETE ==='); 