'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log('🎸 Creating Demo Scene Content: Austin Punk & Houston Death Metal...');
        
        try {
            // Get genre IDs
            const punkGenre = await queryInterface.sequelize.query(
                'SELECT id FROM "Genres" WHERE name = \'Punk\' LIMIT 1',
                { type: Sequelize.QueryTypes.SELECT }
            );
            
            const metalGenre = await queryInterface.sequelize.query(
                'SELECT id FROM "Genres" WHERE name = \'Rock Music\' LIMIT 1',
                { type: Sequelize.QueryTypes.SELECT }
            );
            
            if (punkGenre.length === 0 || metalGenre.length === 0) {
                console.log('⚠️  Required genres not found. Please run genre seeders first.');
                return;
            }
            
            const punkGenreId = punkGenre[0].id;
            const metalGenreId = metalGenre[0].id;
            console.log(`🎵 Found Punk genre with ID: ${punkGenreId}`);
            console.log(`🎵 Found Rock Music genre with ID: ${metalGenreId} (using for Death Metal)`);

            // ========================================
            // TEST SCENE 1: AUSTIN PUNK SCENE
            // ========================================
            console.log('🏙️  Creating Austin Punk Scene...');

            // 1. Create Austin Punk Artists
            await queryInterface.bulkInsert('Users', [
                {
                    firstName: 'Travis',
                    lastName: 'McGuire',
                    userName: 'travis_capital_chaos',
                    email: 'travis@capitalcitychaos.com',
                    password: '$2b$10$hashedpassword',
                    roleId: 2, // Artist role
                    onBoardingStatus: 2,
                    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                {
                    firstName: 'Riley',
                    lastName: 'Thompson',
                    userName: 'riley_red_river_riot',
                    email: 'riley@redriverriot.com',
                    password: '$2b$10$hashedpassword',
                    roleId: 2, // Artist role
                    onBoardingStatus: 2,
                    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                }
            ], { ignoreDuplicates: true });

            console.log('👥 Created 2 Austin Punk artists');

            // Get the created artist IDs
            const austinArtists = await queryInterface.sequelize.query(
                'SELECT id FROM "Users" WHERE "userName" IN (\'travis_capital_chaos\', \'riley_red_river_riot\') ORDER BY "userName"',
                { type: Sequelize.QueryTypes.SELECT }
            );

            // 2. Create Austin Punk Bands
            await queryInterface.bulkInsert('Bands', [
                {
                    title: 'Capital City Chaos',
                    description: 'Austin\'s premier punk rock band, bringing raw energy and political commentary to the Texas capital.',
                    logo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    facebook: 'https://facebook.com/capitalcitychaos',
                    instagram: 'https://instagram.com/capitalcitychaos',
                    youtube: 'https://youtube.com/capitalcitychaos',
                    twitter: 'https://twitter.com/capitalcitychaos',
                    createdBy: austinArtists[0].id,
                    status: 'ACTIVE',
                    promosEnabled: true,
                    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                {
                    title: 'Red River Riot',
                    description: 'High-energy punk band from Austin, known for their intense live performances and DIY ethic.',
                    logo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                    facebook: 'https://facebook.com/redriverriot',
                    instagram: 'https://instagram.com/redriverriot',
                    youtube: 'https://youtube.com/redriverriot',
                    twitter: 'https://twitter.com/redriverriot',
                    createdBy: austinArtists[1].id,
                    status: 'ACTIVE',
                    promosEnabled: true,
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                }
            ], { ignoreDuplicates: true });

            // Get the created band IDs
            const austinBands = await queryInterface.sequelize.query(
                'SELECT id FROM "Bands" WHERE "title" IN (\'Capital City Chaos\', \'Red River Riot\') ORDER BY "title"',
                { type: Sequelize.QueryTypes.SELECT }
            );

            console.log('🎸 Created 2 Austin Punk bands');

            // 3. Create Austin Punk Songs (3 per band = 6 total)
            await queryInterface.bulkInsert('Songs', [
                // Capital City Chaos songs
                {
                    title: 'State Capitol Riot',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    thumbnail: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    duration: 180.5,
                    cityName: 'Austin',
                    stateName: 'Texas',
                    country: 'USA',
                    uploadedBy: austinArtists[0].id,
                    live: false,
                    bandId: austinBands[0].id,
                    albumId: null,
                    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(),
                    hashValue: 'austin_punk_1_hash',
                    latitude: 30.2672,
                    longitude: -97.7431,
                    promotedSong: 'CITY'
                },
                {
                    title: 'Sixth Street Rebellion',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                    thumbnail: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                    duration: 165.2,
                    cityName: 'Austin',
                    stateName: 'Texas',
                    country: 'USA',
                    uploadedBy: austinArtists[0].id,
                    live: false,
                    bandId: austinBands[0].id,
                    albumId: null,
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(),
                    hashValue: 'austin_punk_2_hash',
                    latitude: 30.2672,
                    longitude: -97.7431,
                    promotedSong: 'CITY'
                },
                {
                    title: 'Keep Austin Weird',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                    thumbnail: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                    duration: 142.8,
                    cityName: 'Austin',
                    stateName: 'Texas',
                    country: 'USA',
                    uploadedBy: austinArtists[0].id,
                    live: false,
                    bandId: austinBands[0].id,
                    albumId: null,
                    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(),
                    hashValue: 'austin_punk_3_hash',
                    latitude: 30.2672,
                    longitude: -97.7431,
                    promotedSong: 'CITY'
                },
                // Red River Riot songs
                {
                    title: 'Barton Springs Breakdown',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
                    thumbnail: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
                    duration: 198.3,
                    cityName: 'Austin',
                    stateName: 'Texas',
                    country: 'USA',
                    uploadedBy: austinArtists[1].id,
                    live: false,
                    bandId: austinBands[1].id,
                    albumId: null,
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(),
                    hashValue: 'austin_punk_4_hash',
                    latitude: 30.2672,
                    longitude: -97.7431,
                    promotedSong: 'CITY'
                },
                {
                    title: 'Zilker Park Chaos',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
                    thumbnail: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
                    duration: 175.6,
                    cityName: 'Austin',
                    stateName: 'Texas',
                    country: 'USA',
                    uploadedBy: austinArtists[1].id,
                    live: false,
                    bandId: austinBands[1].id,
                    albumId: null,
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(),
                    hashValue: 'austin_punk_5_hash',
                    latitude: 30.2672,
                    longitude: -97.7431,
                    promotedSong: 'CITY'
                },
                {
                    title: 'East Side Riot',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
                    thumbnail: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
                    duration: 156.9,
                    cityName: 'Austin',
                    stateName: 'Texas',
                    country: 'USA',
                    uploadedBy: austinArtists[1].id,
                    live: false,
                    bandId: austinBands[1].id,
                    albumId: null,
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(),
                    hashValue: 'austin_punk_6_hash',
                    latitude: 30.2672,
                    longitude: -97.7431,
                    promotedSong: 'CITY'
                }
            ], { ignoreDuplicates: true });

            // Get the created song IDs
            const austinSongs = await queryInterface.sequelize.query(
                'SELECT id FROM "Songs" WHERE "title" IN (\'State Capitol Riot\', \'Sixth Street Rebellion\', \'Keep Austin Weird\', \'Barton Springs Breakdown\', \'Zilker Park Chaos\', \'East Side Riot\') ORDER BY "title"',
                { type: Sequelize.QueryTypes.SELECT }
            );

            console.log('🎵 Created 6 Austin Punk songs');

            // 4. Create Austin Events
            await queryInterface.bulkInsert('Events', [
                {
                    thumbnail: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    eventName: 'Austin Punk Fest 2024',
                    description: 'Annual punk rock festival featuring the best Austin punk bands',
                    startTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                    endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
                    latitude: 30.2672,
                    longitude: -97.7431,
                    location: 'Zilker Park, Austin, TX',
                    cityName: 'Austin',
                    stateName: 'Texas',
                    country: 'USA',
                    bandId: austinBands[0].id,
                    createdBy: austinArtists[0].id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    thumbnail: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                    eventName: 'Red River Riot Live at Mohawk',
                    description: 'Intimate punk show at the legendary Mohawk venue',
                    startTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
                    endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
                    latitude: 30.2672,
                    longitude: -97.7431,
                    location: 'Mohawk, Austin, TX',
                    cityName: 'Austin',
                    stateName: 'Texas',
                    country: 'USA',
                    bandId: austinBands[1].id,
                    createdBy: austinArtists[1].id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ], { ignoreDuplicates: true });

            console.log('🎪 Created 2 Austin events');

            // ========================================
            // TEST SCENE 2: HOUSTON DEATH METAL SCENE
            // ========================================
            console.log('🏙️  Creating Houston Death Metal Scene...');

            // 1. Create Houston Death Metal Artists
            await queryInterface.bulkInsert('Users', [
                {
                    firstName: 'Marcus',
                    lastName: 'Blackwood',
                    userName: 'marcus_bayou_brutality',
                    email: 'marcus@bayoubrutality.com',
                    password: '$2b$10$hashedpassword',
                    roleId: 2, // Artist role
                    onBoardingStatus: 2,
                    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                {
                    firstName: 'Diana',
                    lastName: 'Vega',
                    userName: 'diana_space_city_savagery',
                    email: 'diana@spacecitysavagery.com',
                    password: '$2b$10$hashedpassword',
                    roleId: 2, // Artist role
                    onBoardingStatus: 2,
                    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                }
            ], { ignoreDuplicates: true });

            // Get the created Houston artist IDs
            const houstonArtists = await queryInterface.sequelize.query(
                'SELECT id FROM "Users" WHERE "userName" IN (\'marcus_bayou_brutality\', \'diana_space_city_savagery\') ORDER BY "userName"',
                { type: Sequelize.QueryTypes.SELECT }
            );

            console.log('👥 Created 2 Houston Death Metal artists');

            // 2. Create Houston Death Metal Bands
            await queryInterface.bulkInsert('Bands', [
                {
                    title: 'Bayou Brutality',
                    description: 'Houston\'s most brutal death metal band, inspired by the dark swamps of Texas.',
                    logo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
                    facebook: 'https://facebook.com/bayoubrutality',
                    instagram: 'https://instagram.com/bayoubrutality',
                    youtube: 'https://youtube.com/bayoubrutality',
                    twitter: 'https://twitter.com/bayoubrutality',
                    createdBy: houstonArtists[0].id,
                    status: 'ACTIVE',
                    promosEnabled: true,
                    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                },
                {
                    title: 'Space City Savagery',
                    description: 'Technical death metal from Houston, combining cosmic themes with brutal riffs.',
                    logo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
                    facebook: 'https://facebook.com/spacecitysavagery',
                    instagram: 'https://instagram.com/spacecitysavagery',
                    youtube: 'https://youtube.com/spacecitysavagery',
                    twitter: 'https://twitter.com/spacecitysavagery',
                    createdBy: houstonArtists[1].id,
                    status: 'ACTIVE',
                    promosEnabled: true,
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date()
                }
            ], { ignoreDuplicates: true });

            // Get the created Houston band IDs
            const houstonBands = await queryInterface.sequelize.query(
                'SELECT id FROM "Bands" WHERE "title" IN (\'Bayou Brutality\', \'Space City Savagery\') ORDER BY "title"',
                { type: Sequelize.QueryTypes.SELECT }
            );

            console.log('🎸 Created 2 Houston Death Metal bands');

            // 3. Create Houston Death Metal Songs (3 per band = 6 total)
            await queryInterface.bulkInsert('Songs', [
                // Bayou Brutality songs
                {
                    title: 'Swamp of Despair',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
                    thumbnail: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
                    duration: 245.7,
                    cityName: 'Houston',
                    stateName: 'Texas',
                    country: 'USA',
                    uploadedBy: houstonArtists[0].id,
                    live: false,
                    bandId: houstonBands[0].id,
                    albumId: null,
                    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(),
                    hashValue: 'houston_metal_1_hash',
                    latitude: 29.7604,
                    longitude: -95.3698,
                    promotedSong: 'CITY'
                },
                {
                    title: 'Galveston Bay Massacre',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
                    thumbnail: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
                    duration: 312.4,
                    cityName: 'Houston',
                    stateName: 'Texas',
                    country: 'USA',
                    uploadedBy: houstonArtists[0].id,
                    live: false,
                    bandId: houstonBands[0].id,
                    albumId: null,
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(),
                    hashValue: 'houston_metal_2_hash',
                    latitude: 29.7604,
                    longitude: -95.3698,
                    promotedSong: 'CITY'
                },
                {
                    title: 'Houston Heat Death',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
                    thumbnail: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
                    duration: 278.9,
                    cityName: 'Houston',
                    stateName: 'Texas',
                    country: 'USA',
                    uploadedBy: houstonArtists[0].id,
                    live: false,
                    bandId: houstonBands[0].id,
                    albumId: null,
                    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(),
                    hashValue: 'houston_metal_3_hash',
                    latitude: 29.7604,
                    longitude: -95.3698,
                    promotedSong: 'CITY'
                },
                // Space City Savagery songs
                {
                    title: 'NASA Nightmare',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
                    thumbnail: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
                    duration: 289.2,
                    cityName: 'Houston',
                    stateName: 'Texas',
                    country: 'USA',
                    uploadedBy: houstonArtists[1].id,
                    live: false,
                    bandId: houstonBands[1].id,
                    albumId: null,
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(),
                    hashValue: 'houston_metal_4_hash',
                    latitude: 29.7604,
                    longitude: -95.3698,
                    promotedSong: 'CITY'
                },
                {
                    title: 'Astrodome Apocalypse',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
                    thumbnail: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
                    duration: 334.6,
                    cityName: 'Houston',
                    stateName: 'Texas',
                    country: 'USA',
                    uploadedBy: houstonArtists[1].id,
                    live: false,
                    bandId: houstonBands[1].id,
                    albumId: null,
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(),
                    hashValue: 'houston_metal_5_hash',
                    latitude: 29.7604,
                    longitude: -95.3698,
                    promotedSong: 'CITY'
                },
                {
                    title: 'Medical Center Massacre',
                    song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
                    thumbnail: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
                    duration: 267.3,
                    cityName: 'Houston',
                    stateName: 'Texas',
                    country: 'USA',
                    uploadedBy: houstonArtists[1].id,
                    live: false,
                    bandId: houstonBands[1].id,
                    albumId: null,
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(),
                    hashValue: 'houston_metal_6_hash',
                    latitude: 29.7604,
                    longitude: -95.3698,
                    promotedSong: 'CITY'
                }
            ], { ignoreDuplicates: true });

            // Get the created Houston song IDs
            const houstonSongs = await queryInterface.sequelize.query(
                'SELECT id FROM "Songs" WHERE "title" IN (\'Swamp of Despair\', \'Galveston Bay Massacre\', \'Houston Heat Death\', \'NASA Nightmare\', \'Astrodome Apocalypse\', \'Medical Center Massacre\') ORDER BY "title"',
                { type: Sequelize.QueryTypes.SELECT }
            );

            console.log('🎵 Created 6 Houston Death Metal songs');

            // 4. Create Houston Events
            await queryInterface.bulkInsert('Events', [
                {
                    thumbnail: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
                    eventName: 'Houston Death Metal Fest 2024',
                    description: 'Annual death metal festival featuring the heaviest bands from Houston',
                    startTime: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
                    endTime: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), // 6 hours later
                    latitude: 29.7604,
                    longitude: -95.3698,
                    location: 'Warehouse Live, Houston, TX',
                    cityName: 'Houston',
                    stateName: 'Texas',
                    country: 'USA',
                    bandId: houstonBands[0].id,
                    createdBy: houstonArtists[0].id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    thumbnail: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
                    eventName: 'Space City Savagery at White Oak',
                    description: 'Brutal death metal show at White Oak Music Hall',
                    startTime: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
                    endTime: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
                    latitude: 29.7604,
                    longitude: -95.3698,
                    location: 'White Oak Music Hall, Houston, TX',
                    cityName: 'Houston',
                    stateName: 'Texas',
                    country: 'USA',
                    bandId: houstonBands[1].id,
                    createdBy: houstonArtists[1].id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ], { ignoreDuplicates: true });

            console.log('🎪 Created 2 Houston events');

            // ========================================
            // CREATE SONG-GENRE ASSOCIATIONS
            // ========================================
            console.log('🎼 Creating song-genre associations...');

            // Get all song IDs
            const allSongIds = [...austinSongs.map(s => s.id), ...houstonSongs.map(s => s.id)];
            
            // Create song-genre associations
            const songGenreAssociations = [];
            
            // Austin songs -> Punk genre
            austinSongs.forEach(song => {
                songGenreAssociations.push({
                    songId: song.id,
                    genreId: punkGenreId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            });
            
            // Houston songs -> Metal genre (using Rock Music as proxy)
            houstonSongs.forEach(song => {
                songGenreAssociations.push({
                    songId: song.id,
                    genreId: metalGenreId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            });

            await queryInterface.bulkInsert('SongGenres', songGenreAssociations, { ignoreDuplicates: true });

            console.log('🎼 Created song-genre associations for all 12 songs');

            // ========================================
            // SUMMARY
            // ========================================
            console.log('\n🎉 Demo Scene Content Creation Complete!');
            console.log('==========================================');
            console.log('🏙️  Austin Punk Scene:');
            console.log('   👥 2 Artists');
            console.log('   🎸 2 Bands (Capital City Chaos, Red River Riot)');
            console.log('   🎵 6 Songs (all Punk genre)');
            console.log('   🎪 2 Events');
            console.log('');
            console.log('🏙️  Houston Death Metal Scene:');
            console.log('   👥 2 Artists');
            console.log('   🎸 2 Bands (Bayou Brutality, Space City Savagery)');
            console.log('   🎵 6 Songs (all Metal genre)');
            console.log('   🎪 2 Events');
            console.log('');
            console.log('🎼 Total: 12 songs with genre associations');
            console.log('📍 Perfect for testing location and genre filtering!');

        } catch (error) {
            console.error('❌ Error creating demo scene content:', error);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        console.log('🗑️  Removing Demo Scene Content...');
        
        try {
            // Remove song-genre associations first
            await queryInterface.sequelize.query(
                `DELETE FROM "SongGenres" WHERE "songId" IN (
                    SELECT id FROM "Songs" WHERE "cityName" IN ('Austin', 'Houston') 
                    AND "title" LIKE '%Capitol%' OR "title" LIKE '%Red River%' 
                    OR "title" LIKE '%Bayou%' OR "title" LIKE '%Space City%'
                )`
            );

            // Remove songs
            await queryInterface.sequelize.query(
                `DELETE FROM "Songs" WHERE "cityName" IN ('Austin', 'Houston') 
                AND ("title" LIKE '%Capitol%' OR "title" LIKE '%Red River%' 
                OR "title" LIKE '%Bayou%' OR "title" LIKE '%Space City%')`
            );

            // Remove events
            await queryInterface.sequelize.query(
                `DELETE FROM "Events" WHERE "cityName" IN ('Austin', 'Houston') 
                AND ("eventName" LIKE '%Punk Fest%' OR "eventName" LIKE '%Death Metal%' 
                OR "eventName" LIKE '%Mohawk%' OR "eventName" LIKE '%White Oak%')`
            );

            // Remove bands
            await queryInterface.sequelize.query(
                `DELETE FROM "Bands" WHERE "title" IN (
                    'Capital City Chaos', 'Red River Riot', 
                    'Bayou Brutality', 'Space City Savagery'
                )`
            );

            // Remove artists
            await queryInterface.sequelize.query(
                `DELETE FROM "Users" WHERE "userName" IN (
                    'travis_capital_chaos', 'riley_red_river_riot',
                    'marcus_bayou_brutality', 'diana_space_city_savagery'
                )`
            );

            console.log('✅ Demo Scene Content removed successfully');
        } catch (error) {
            console.error('❌ Error removing demo scene content:', error);
            throw error;
        }
    }
}; 