'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log('🎸 Creating Texas Punk Community with multiple cities...');
        
        try {
            // Get the punk genre ID
            const punkGenre = await queryInterface.sequelize.query(
                'SELECT id FROM "Genres" WHERE name = \'Punk\' LIMIT 1',
                { type: Sequelize.QueryTypes.SELECT }
            );
            
            if (punkGenre.length === 0) {
                console.log('⚠️  Punk genre not found. Please run genre seeders first.');
                return;
            }
            
            const punkGenreId = punkGenre[0].id;
            console.log(`🎵 Found Punk genre with ID: ${punkGenreId}`);

            // 1. Create ARTISTS from different Texas cities
            const artists = await queryInterface.bulkInsert('Users', [
                {
                    firstName: 'Jake',
                    lastName: 'Morrison',
                    userName: 'jake_houston_punk',
                    email: 'jake.morrison@email.com',
                    password: '$2b$10$hashedpassword',
                    roleId: 2, // Artist role
                    onBoardingStatus: 2,
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                {
                    firstName: 'Maria',
                    lastName: 'Rodriguez',
                    userName: 'maria_dallas_punk',
                    email: 'maria.rodriguez@email.com',
                    password: '$2b$10$hashedpassword',
                    roleId: 2, // Artist role
                    onBoardingStatus: 2,
                    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                {
                    firstName: 'Tommy',
                    lastName: 'Chen',
                    userName: 'tommy_austin_punk',
                    email: 'tommy.chen@email.com',
                    password: '$2b$10$hashedpassword',
                    roleId: 2, // Artist role
                    onBoardingStatus: 2,
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                }
            ], { returning: true, ignoreDuplicates: true });

            console.log('👥 Created 3 artists from different Texas cities');

            // 2. Create NON-ARTIST LISTENERS from various Texas cities
            const listeners = await queryInterface.bulkInsert('Users', [
                {
                    firstName: 'Sarah',
                    lastName: 'Johnson',
                    userName: 'sarah_houston_listener',
                    email: 'sarah.johnson@email.com',
                    password: '$2b$10$hashedpassword',
                    roleId: 3, // Listener role
                    onBoardingStatus: 2,
                    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                {
                    firstName: 'Mike',
                    lastName: 'Williams',
                    userName: 'mike_houston_listener',
                    email: 'mike.williams@email.com',
                    password: '$2b$10$hashedpassword',
                    roleId: 3, // Listener role
                    onBoardingStatus: 2,
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                {
                    firstName: 'Lisa',
                    lastName: 'Davis',
                    userName: 'lisa_dallas_listener',
                    email: 'lisa.davis@email.com',
                    password: '$2b$10$hashedpassword',
                    roleId: 3, // Listener role
                    onBoardingStatus: 2,
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                {
                    firstName: 'Carlos',
                    lastName: 'Martinez',
                    userName: 'carlos_austin_listener',
                    email: 'carlos.martinez@email.com',
                    password: '$2b$10$hashedpassword',
                    roleId: 3, // Listener role
                    onBoardingStatus: 2,
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                }
            ], { returning: true, ignoreDuplicates: true });

            console.log('👂 Created 4 non-artist listeners from Texas cities');

            // Get user IDs for station preferences
            const allUsers = await queryInterface.sequelize.query(
                'SELECT id, email FROM "Users" WHERE email IN (\'jake.morrison@email.com\', \'maria.rodriguez@email.com\', \'tommy.chen@email.com\', \'sarah.johnson@email.com\', \'mike.williams@email.com\', \'lisa.davis@email.com\', \'carlos.martinez@email.com\')',
                { type: Sequelize.QueryTypes.SELECT }
            );

            const userMap = allUsers.reduce((acc, user) => {
                acc[user.email] = user.id;
                return acc;
            }, {});

            // 3. Create STATION PREFERENCES for different Texas cities
            await queryInterface.bulkInsert('UserStationPrefrences', [
                // Houston Artists & Listeners
                {
                    userId: userMap['jake.morrison@email.com'],
                    stationPrefrence: 'Houston',
                    stationType: '1', // CITYWIDE
                    active: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    userId: userMap['sarah.johnson@email.com'],
                    stationPrefrence: 'Houston',
                    stationType: '1', // CITYWIDE
                    active: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    userId: userMap['mike.williams@email.com'],
                    stationPrefrence: 'Houston',
                    stationType: '1', // CITYWIDE
                    active: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                // Dallas Artists & Listeners
                {
                    userId: userMap['maria.rodriguez@email.com'],
                    stationPrefrence: 'Dallas',
                    stationType: '1', // CITYWIDE
                    active: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    userId: userMap['lisa.davis@email.com'],
                    stationPrefrence: 'Dallas',
                    stationType: '1', // CITYWIDE
                    active: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                // Austin Artists & Listeners
                {
                    userId: userMap['tommy.chen@email.com'],
                    stationPrefrence: 'Austin',
                    stationType: '1', // CITYWIDE
                    active: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    userId: userMap['carlos.martinez@email.com'],
                    stationPrefrence: 'Austin',
                    stationType: '1', // CITYWIDE
                    active: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ], { ignoreDuplicates: true });

            console.log('🏙️ Created station preferences for Houston, Dallas, and Austin');

            // 4. Create GENRE PREFERENCES for all users (all punk)
            const genrePreferences = [];
            Object.values(userMap).forEach(userId => {
                genrePreferences.push({
                    userId: userId,
                    genreId: punkGenreId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            });

            await queryInterface.bulkInsert('UserGenrePrefrences', genrePreferences, { ignoreDuplicates: true });
            console.log('🎵 Created punk genre preferences for all users');

            // 5. Create BANDS from different cities
            await queryInterface.bulkInsert('Bands', [
                {
                    title: 'Houston Havoc',
                    description: 'Aggressive punk band from Houston\'s underground scene',
                    createdBy: userMap['jake.morrison@email.com'],
                    status: 'ACTIVE',
                    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                {
                    title: 'Dallas Destruction',
                    description: 'Fast-paced punk rock from Deep Ellum, Dallas',
                    createdBy: userMap['maria.rodriguez@email.com'],
                    status: 'ACTIVE',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                {
                    title: 'Austin Anarchy',
                    description: 'East Austin punk collective with DIY ethics',
                    createdBy: userMap['tommy.chen@email.com'],
                    status: 'ACTIVE',
                    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                }
            ], { ignoreDuplicates: true });

            console.log('🎸 Created bands from Houston, Dallas, and Austin');

            // Get band IDs
            const bands = await queryInterface.sequelize.query(
                'SELECT id, title FROM "Bands" WHERE title IN (\'Houston Havoc\', \'Dallas Destruction\', \'Austin Anarchy\')',
                { type: Sequelize.QueryTypes.SELECT }
            );

            const bandMap = bands.reduce((acc, band) => {
                acc[band.title] = band.id;
                return acc;
            }, {});

            // 6. Create SONGS from different cities (showing geographic distribution)
            await queryInterface.bulkInsert('Songs', [
                // Houston Songs
                {
                    title: 'Houston Heat',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    bandId: bandMap['Houston Havoc'],
                    cityName: 'Houston',
                    stateName: 'Texas',
                    live: true,
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                {
                    title: 'Bayou Rebellion',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                    bandId: bandMap['Houston Havoc'],
                    cityName: 'Houston',
                    stateName: 'Texas',
                    live: true,
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                // Dallas Songs
                {
                    title: 'Deep Ellum Nights',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                    bandId: bandMap['Dallas Destruction'],
                    cityName: 'Dallas',
                    stateName: 'Texas',
                    live: true,
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                {
                    title: 'Cowtown Chaos',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
                    bandId: bandMap['Dallas Destruction'],
                    cityName: 'Dallas',
                    stateName: 'Texas',
                    live: true,
                    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                // Austin Songs
                {
                    title: 'Keep Austin Weird',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
                    bandId: bandMap['Austin Anarchy'],
                    cityName: 'Austin',
                    stateName: 'Texas',
                    live: true,
                    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                {
                    title: 'South By Punk',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
                    bandId: bandMap['Austin Anarchy'],
                    cityName: 'Austin',
                    stateName: 'Texas',
                    live: true,
                    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
                    updatedAt: new Date()
                }
            ], { ignoreDuplicates: true });

            console.log('🎵 Created songs from Houston, Dallas, and Austin');

            // 7. Create EVENTS in different cities
            await queryInterface.bulkInsert('Events', [
                {
                    eventName: 'Houston Punk Fest',
                    description: 'Underground punk festival in Houston warehouse district',
                    startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                    endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
                    location: 'Warehouse District, Houston, TX',
                    bandId: bandMap['Houston Havoc'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    eventName: 'Dallas DIY Show',
                    description: 'All-ages punk show in Deep Ellum',
                    startTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                    endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
                    location: 'Deep Ellum Art Co., Dallas, TX',
                    bandId: bandMap['Dallas Destruction'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    eventName: 'Austin Punk Collective',
                    description: 'Monthly punk showcase at local venue',
                    startTime: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                    endTime: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
                    location: 'Red River District, Austin, TX',
                    bandId: bandMap['Austin Anarchy'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ], { ignoreDuplicates: true });

            console.log('📅 Created events in Houston, Dallas, and Austin');

            // 8. Create COMMUNITY INTERACTIONS (votes, follows, etc.)
            const songs = await queryInterface.sequelize.query(
                'SELECT id FROM "Songs" WHERE title IN (\'Houston Heat\', \'Deep Ellum Nights\', \'Keep Austin Weird\')',
                { type: Sequelize.QueryTypes.SELECT }
            );

            if (songs.length > 0) {
                // Create some votes across cities
                await queryInterface.bulkInsert('Votes', [
                    {
                        userId: userMap['sarah.johnson@email.com'], // Houston listener
                        songId: songs[0].id, // Houston song
                        type: 'UPVOTE',
                        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        updatedAt: new Date()
                    },
                    {
                        userId: userMap['lisa.davis@email.com'], // Dallas listener
                        songId: songs[1].id, // Dallas song
                        type: 'UPVOTE',
                        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                        updatedAt: new Date()
                    },
                    {
                        userId: userMap['carlos.martinez@email.com'], // Austin listener
                        songId: songs[2].id, // Austin song
                        type: 'UPVOTE',
                        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
                        updatedAt: new Date()
                    }
                ], { ignoreDuplicates: true });

                console.log('👍 Created community votes for local songs');
            }

            // 9. Create FEED NOTIFICATIONS showing cross-city activity
            await queryInterface.bulkInsert('Notifications', [
                {
                    receiverId: userMap['sarah.johnson@email.com'],
                    initiatorId: userMap['jake.morrison@email.com'],
                    type: 'song_upload',
                    referenceId: songs[0].id, // Houston Heat
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                {
                    receiverId: userMap['lisa.davis@email.com'],
                    initiatorId: userMap['maria.rodriguez@email.com'],
                    type: 'song_upload',
                    referenceId: songs[1].id, // Deep Ellum Nights
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                {
                    receiverId: userMap['carlos.martinez@email.com'],
                    initiatorId: userMap['tommy.chen@email.com'],
                    type: 'event_created',
                    referenceId: bandMap['Austin Anarchy'], // Band reference for event
                    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
                    updatedAt: new Date()
                }
            ], { ignoreDuplicates: true });

            console.log('📬 Created feed notifications for community activity');

            console.log('✅ Successfully created Texas Punk Community!');
            console.log('   📍 Cities: Houston, Dallas, Austin');
            console.log('   🎸 Artists: 3 bands with unique city identities');
            console.log('   👂 Listeners: 4 non-artist users distributed across cities');
            console.log('   🎵 Songs: 6 punk tracks with geographic distribution');
            console.log('   📅 Events: 3 upcoming shows in different cities');
            console.log('   👥 Community: Votes, follows, and feed activity');

        } catch (error) {
            console.error('❌ Error creating Texas Punk Community:', error);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        // Clean up in reverse order
        await queryInterface.bulkDelete('Notifications', null, {});
        await queryInterface.bulkDelete('Votes', null, {});
        await queryInterface.bulkDelete('Events', null, {});
        await queryInterface.bulkDelete('Songs', null, {});
        await queryInterface.bulkDelete('Bands', null, {});
        await queryInterface.bulkDelete('UserGenrePrefrences', null, {});
        await queryInterface.bulkDelete('UserStationPrefrences', null, {});
        await queryInterface.bulkDelete('Users', { 
            email: { 
                [Sequelize.Op.in]: [
                    'jake.morrison@email.com',
                    'maria.rodriguez@email.com', 
                    'tommy.chen@email.com',
                    'sarah.johnson@email.com',
                    'mike.williams@email.com',
                    'lisa.davis@email.com',
                    'carlos.martinez@email.com'
                ]
            }
        }, {});
    }
}; 