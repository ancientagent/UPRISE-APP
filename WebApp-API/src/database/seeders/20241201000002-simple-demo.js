'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log('🎯 Creating simple demo content for community dashboard...');
        
        try {
            // Check if we have a user with onBoardingStatus = 2 
            const users = await queryInterface.sequelize.query(
                'SELECT id FROM "Users" WHERE "onBoardingStatus" = 2 LIMIT 1',
                { type: Sequelize.QueryTypes.SELECT }
            );
            
            if (users.length === 0) {
                console.log('⚠️  No completed user found. Please complete onboarding first.');
                return;
            }
            
            const userId = users[0].id;
            console.log(`📱 Using user ID: ${userId}`);
            
            // Get Punk genre ID (from your onboarding selection)
            const punkGenre = await queryInterface.sequelize.query(
                'SELECT id FROM "Genres" WHERE name = \'Punk\' LIMIT 1',
                { type: Sequelize.QueryTypes.SELECT }
            );
            
            if (punkGenre.length === 0) {
                console.log('⚠️  Punk genre not found. Please run genre seeders first.');
                return;
            }
            
            const genreId = punkGenre[0].id;
            console.log(`🎸 Using Punk genre ID: ${genreId}`);
            
            // 1. Create a simple demo band (bands don't have location - songs do)
            await queryInterface.bulkInsert('Bands', [
                {
                    title: 'Austin Underground',
                    description: 'Local punk band from East Austin',
                    createdBy: userId,
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                    updatedAt: new Date()
                }
            ], { ignoreDuplicates: true });
            
            // Get the band ID
            const bands = await queryInterface.sequelize.query(
                'SELECT id FROM "Bands" WHERE title = \'Austin Underground\' LIMIT 1',
                { type: Sequelize.QueryTypes.SELECT }
            );
            
            if (bands.length === 0) {
                console.log('⚠️  Failed to create band');
                return;
            }
            
            const bandId = bands[0].id;
            console.log(`🎤 Created band ID: ${bandId}`);
            
            // 2. Create demo songs
            await queryInterface.bulkInsert('Songs', [
                {
                    title: 'City Nights',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    duration: 180,
                    live: true,
                    cityName: 'Austin',
                    stateName: 'Texas',
                    promotedSong: 'CITY',
                    bandId: bandId,
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                    updatedAt: new Date()
                },
                {
                    title: 'Underground Scene',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                    duration: 210,
                    live: true,
                    cityName: 'Austin',
                    stateName: 'Texas',
                    promotedSong: 'CITY',
                    bandId: bandId,
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                    updatedAt: new Date()
                }
            ], { ignoreDuplicates: true });
            
            // Get song IDs
            const songs = await queryInterface.sequelize.query(
                'SELECT id FROM "Songs" WHERE "bandId" = :bandId ORDER BY id',
                { 
                    type: Sequelize.QueryTypes.SELECT,
                    replacements: { bandId: bandId }
                }
            );
            
            console.log(`🎵 Created ${songs.length} songs`);
            
            // 3. Link songs to Punk genre
            if (songs.length > 0) {
                const songGenres = songs.map(song => ({
                    songId: song.id,
                    genreId: genreId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }));
                
                await queryInterface.bulkInsert('SongGenres', songGenres, { 
                    ignoreDuplicates: true 
                });
                console.log(`🔗 Linked songs to Punk genre`);
            }
            
            // 4. Create demo event
            const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
            await queryInterface.bulkInsert('Events', [
                {
                    eventName: 'Austin Underground Live Show',
                    description: 'Intimate punk show at local venue. Come support the scene!',
                    location: 'East Austin Venue, Austin, TX',
                    startTime: futureDate,
                    endTime: new Date(futureDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
                    cityName: 'Austin',
                    stateName: 'Texas',
                    bandId: bandId,
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                    updatedAt: new Date()
                }
            ], { ignoreDuplicates: true });
            
            console.log(`📅 Created demo event`);
            
            // 5. Create feed notifications
            if (songs.length > 0) {
                const notifications = [
                    {
                        type: 'UPLOAD_SONG',
                        initiatorId: userId,
                        receiverId: userId,
                        referenceId: songs[0].id,
                        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        updatedAt: new Date()
                    },
                    {
                        type: 'UPLOAD_SONG',
                        initiatorId: userId,
                        receiverId: userId,
                        referenceId: songs[1] ? songs[1].id : songs[0].id,
                        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                        updatedAt: new Date()
                    }
                ];
                
                await queryInterface.bulkInsert('Notifications', notifications, { 
                    ignoreDuplicates: true 
                });
                console.log(`📬 Created feed notifications`);
            }
            
            console.log('✅ Simple demo content created successfully!');
            console.log('🎯 Your community dashboard should now show:');
            console.log('   - Band: Austin Underground');
            console.log('   - 2 punk songs in Austin scene');
            console.log('   - 1 upcoming event');
            console.log('   - Feed activity notifications');
            console.log('🚀 Launch your app to see the populated content!');
            
        } catch (error) {
            console.error('❌ Error creating demo content:', error.message);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        try {
            // Clean up demo content
            await queryInterface.sequelize.query(
                'DELETE FROM "Notifications" WHERE type IN (\'UPLOAD_SONG\', \'ADD_EVENT\')'
            );
            await queryInterface.sequelize.query(
                'DELETE FROM "Events" WHERE "eventName" = \'Austin Underground Live Show\''
            );
            await queryInterface.sequelize.query(
                'DELETE FROM "SongGenres" WHERE "songId" IN (SELECT id FROM "Songs" WHERE title IN (\'City Nights\', \'Underground Scene\'))'
            );
            await queryInterface.sequelize.query(
                'DELETE FROM "Songs" WHERE title IN (\'City Nights\', \'Underground Scene\')'
            );
            await queryInterface.sequelize.query(
                'DELETE FROM "Bands" WHERE title = \'Austin Underground\''
            );
            
            console.log('✅ Demo content removed successfully!');
            
        } catch (error) {
            console.error('❌ Error removing demo content:', error.message);
            throw error;
        }
    }
}; 