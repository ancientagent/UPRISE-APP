require('dotenv').config();
const { User, UserStationPrefrence, UserGenrePrefrences, Genres, Locations } = require('./src/database/models/');

async function fixStationPreferences() {
    console.log('=== FIXING STATION PREFERENCES ===\n');

    try {
        // Test users to fix
        const testUsers = ['thirteen', 'fourteen', 'lmnop'];
        
        for (const userName of testUsers) {
            console.log(`🔍 Processing user: ${userName}`);
            
            // Find user
            const user = await User.findOne({ where: { userName } });
            if (!user) {
                console.log(`❌ User ${userName} not found, skipping...`);
                continue;
            }
            
            console.log(`✅ Found user: ${userName} (ID: ${user.id})`);
            
            // Get user's location
            const location = await Locations.findOne({
                where: { userId: user.id },
                order: [['createdAt', 'DESC']]
            });
            
            if (!location) {
                console.log(`❌ No location found for ${userName}, skipping...`);
                continue;
            }
            
            const { city, state } = location;
            console.log(`📍 Location: ${city}, ${state}`);
            
            // Get user's primary genre
            const userGenres = await UserGenrePrefrences.findAll({
                where: { userId: user.id },
                order: [['createdAt', 'ASC']],
                limit: 1
            });
            
            let primaryGenreName = 'Music'; // Default fallback
            if (userGenres.length > 0) {
                const genre = await Genres.findByPk(userGenres[0].genreId);
                if (genre) {
                    primaryGenreName = genre.name;
                    console.log(`🎵 Primary genre: ${primaryGenreName}`);
                } else {
                    console.log(`⚠️ Genre not found for ID ${userGenres[0].genreId}, using default: ${primaryGenreName}`);
                }
            } else {
                console.log(`⚠️ No genres found, using default: ${primaryGenreName}`);
            }
            
            // Create the full community identifier
            const communityIdentifier = `${city} ${state} ${primaryGenreName} Uprise`;
            console.log(`🏠 Community identifier: "${communityIdentifier}"`);
            
            // Update or create station preference
            const [stationPref, created] = await UserStationPrefrence.findOrCreate({
                where: { userId: user.id, active: true },
                defaults: {
                    userId: user.id,
                    stationPrefrence: communityIdentifier,
                    stationType: '1',
                    active: true
                }
            });
            
            if (!created) {
                // Update existing record
                stationPref.stationPrefrence = communityIdentifier;
                await stationPref.save();
                console.log(`✅ Updated existing station preference`);
            } else {
                console.log(`✅ Created new station preference`);
            }
            
            console.log(`✅ Fixed station preference for ${userName}\n`);
        }
        
        console.log('=== STATION PREFERENCES FIXED ===');
        
        // Verify the fixes
        console.log('\n🔍 VERIFICATION - Current station preferences:');
        for (const userName of testUsers) {
            const user = await User.findOne({ where: { userName } });
            if (user) {
                const stationPref = await UserStationPrefrence.findOne({
                    where: { userId: user.id, active: true }
                });
                if (stationPref) {
                    console.log(`${userName}: "${stationPref.stationPrefrence}"`);
                } else {
                    console.log(`${userName}: No active station preference`);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ ERROR:', error);
    }
}

fixStationPreferences().then(() => {
    console.log('\nScript complete.');
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 