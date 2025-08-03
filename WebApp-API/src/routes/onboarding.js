const Router = require('express').Router();
const { User } = require('../database/models');
const { clientAuth } = require('../middlewares');

/**
 * @swagger
 * /onboarding/super-genres:
 *   get:
 *     summary: Returns the complete list of super genres with sub-genres
 *     description: Provides a comprehensive list of modern music super genres and their sub-genres for autocomplete functionality during onboarding.
 *     tags:
 *       - Onboarding
 *     responses:
 *       '200':
 *         description: A JSON object containing super genres with their sub-genres.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 super_genres:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "punk"
 *                       name:
 *                         type: string
 *                         example: "Punk"
 *                       aliases:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["punk rock", "punk music"]
 *                       category:
 *                         type: string
 *                         example: "rock"
 *                       sub_genres:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             aliases:
 *                               type: array
 */
Router.get('/super-genres', (req, res) => {
    res.json({
      "super_genres": [
        {
          "id": "punk",
          "name": "Punk",
          "aliases": ["punk rock", "punk music"],
          "category": "rock",
          "sub_genres": [
            { "id": "hardcore-punk", "name": "Hardcore Punk", "aliases": ["hardcore", "hc punk", "hardcore punk"] },
            { "id": "pop-punk", "name": "Pop Punk", "aliases": ["pop punk", "pop-punk", "pop punk rock"] },
            { "id": "post-punk", "name": "Post Punk", "aliases": ["post punk", "post-punk", "post punk rock"] },
            { "id": "crust-punk", "name": "Crust Punk", "aliases": ["crust", "crust punk", "anarcho punk"] },
            { "id": "folk-punk", "name": "Folk Punk", "aliases": ["folk punk", "folk-punk", "acoustic punk"] },
            { "id": "ska-punk", "name": "Ska Punk", "aliases": ["ska punk", "ska-punk", "ska punk rock"] },
            { "id": "street-punk", "name": "Street Punk", "aliases": ["street punk", "oi punk", "working class punk"] },
            { "id": "emo", "name": "Emo", "aliases": ["emo", "emotional hardcore", "emo punk"] },
            { "id": "screamo", "name": "Screamo", "aliases": ["screamo", "screaming emo", "skramz"] }
          ]
        },
        {
          "id": "metal",
          "name": "Metal",
          "aliases": ["heavy metal", "metal music"],
          "category": "rock",
          "sub_genres": [
            { "id": "death-metal", "name": "Death Metal", "aliases": ["death metal", "dm", "brutal death"] },
            { "id": "black-metal", "name": "Black Metal", "aliases": ["black metal", "bm", "atmospheric black metal"] },
            { "id": "thrash-metal", "name": "Thrash Metal", "aliases": ["thrash", "thrash metal", "speed metal"] },
            { "id": "power-metal", "name": "Power Metal", "aliases": ["power metal", "epic metal", "symphonic power"] },
            { "id": "progressive-metal", "name": "Progressive Metal", "aliases": ["prog metal", "progressive metal", "technical metal"] },
            { "id": "doom-metal", "name": "Doom Metal", "aliases": ["doom", "doom metal", "stoner doom"] },
            { "id": "nu-metal", "name": "Nu Metal", "aliases": ["nu metal", "new metal", "rap metal"] },
            { "id": "metalcore", "name": "Metalcore", "aliases": ["metalcore", "melodic metalcore", "hardcore metal"] },
            { "id": "deathcore", "name": "Deathcore", "aliases": ["deathcore", "brutal deathcore", "extreme metal"] },
            { "id": "folk-metal", "name": "Folk Metal", "aliases": ["folk metal", "pagan metal", "celtic metal"] },
            { "id": "industrial-metal", "name": "Industrial Metal", "aliases": ["industrial metal", "industrial rock", "cyber metal"] }
          ]
        },
        {
          "id": "electronic",
          "name": "Electronic",
          "aliases": ["electronic music", "edm", "electronic dance music"],
          "category": "electronic",
          "sub_genres": [
            { "id": "house", "name": "House", "aliases": ["house music", "deep house", "tech house"] },
            { "id": "techno", "name": "Techno", "aliases": ["techno", "detroit techno", "minimal techno"] },
            { "id": "trance", "name": "Trance", "aliases": ["trance", "progressive trance", "uplifting trance"] },
            { "id": "drum-and-bass", "name": "Drum & Bass", "aliases": ["drum and bass", "dnb", "jungle"] },
            { "id": "dubstep", "name": "Dubstep", "aliases": ["dubstep", "bass music", "uk dubstep"] },
            { "id": "ambient", "name": "Ambient", "aliases": ["ambient", "atmospheric", "chillout"] },
            { "id": "industrial", "name": "Industrial", "aliases": ["industrial", "industrial electronic", "ebm"] },
            { "id": "synthwave", "name": "Synthwave", "aliases": ["synthwave", "retrowave", "outrun"] },
            { "id": "breakbeat", "name": "Breakbeat", "aliases": ["breakbeat", "big beat", "breakbeat garage"] },
            { "id": "hardcore", "name": "Hardcore", "aliases": ["hardcore", "gabber", "happy hardcore"] },
            { "id": "trap", "name": "Trap", "aliases": ["trap", "edm trap", "electronic trap"] },
            { "id": "future-bass", "name": "Future Bass", "aliases": ["future bass", "melodic dubstep", "chill trap"] }
          ]
        },
        {
          "id": "hip-hop",
          "name": "Hip Hop",
          "aliases": ["rap", "hip hop", "hiphop"],
          "category": "urban",
          "sub_genres": [
            { "id": "conscious-hip-hop", "name": "Conscious Hip Hop", "aliases": ["conscious rap", "political rap", "message rap"] },
            { "id": "trap-rap", "name": "Trap Rap", "aliases": ["trap rap", "trap music", "atlanta trap"] },
            { "id": "drill", "name": "Drill", "aliases": ["drill", "chicago drill", "uk drill"] },
            { "id": "boom-bap", "name": "Boom Bap", "aliases": ["boom bap", "90s hip hop", "golden age"] },
            { "id": "alternative-hip-hop", "name": "Alternative Hip Hop", "aliases": ["alt hip hop", "experimental rap", "underground"] },
            { "id": "gangsta-rap", "name": "Gangsta Rap", "aliases": ["gangsta rap", "west coast rap", "g-funk"] },
            { "id": "east-coast-rap", "name": "East Coast Rap", "aliases": ["east coast rap", "new york rap", "brooklyn rap"] },
            { "id": "southern-rap", "name": "Southern Rap", "aliases": ["southern rap", "dirty south", "crunk"] },
            { "id": "conscious-rap", "name": "Conscious Rap", "aliases": ["conscious rap", "positive rap", "spiritual rap"] }
          ]
        },
        {
          "id": "rock",
          "name": "Rock",
          "aliases": ["rock music", "rock and roll"],
          "category": "rock",
          "sub_genres": [
            { "id": "classic-rock", "name": "Classic Rock", "aliases": ["classic rock", "70s rock", "classic rock and roll"] },
            { "id": "alternative-rock", "name": "Alternative Rock", "aliases": ["alt rock", "alternative", "indie rock"] },
            { "id": "progressive-rock", "name": "Progressive Rock", "aliases": ["prog rock", "progressive", "art rock"] },
            { "id": "psychedelic-rock", "name": "Psychedelic Rock", "aliases": ["psychedelic", "psychedelic rock", "acid rock"] },
            { "id": "garage-rock", "name": "Garage Rock", "aliases": ["garage rock", "garage punk", "lo-fi rock"] },
            { "id": "blues-rock", "name": "Blues Rock", "aliases": ["blues rock", "blues-rock", "electric blues"] },
            { "id": "folk-rock", "name": "Folk Rock", "aliases": ["folk rock", "folk-rock", "acoustic rock"] },
            { "id": "country-rock", "name": "Country Rock", "aliases": ["country rock", "country-rock", "southern rock"] },
            { "id": "hard-rock", "name": "Hard Rock", "aliases": ["hard rock", "arena rock", "stadium rock"] },
            { "id": "soft-rock", "name": "Soft Rock", "aliases": ["soft rock", "adult contemporary", "yacht rock"] }
          ]
        },
        {
          "id": "jazz",
          "name": "Jazz",
          "aliases": ["jazz music", "jazz"],
          "category": "jazz",
          "sub_genres": [
            { "id": "bebop", "name": "Bebop", "aliases": ["bebop", "bop", "modern jazz"] },
            { "id": "cool-jazz", "name": "Cool Jazz", "aliases": ["cool jazz", "west coast jazz", "chamber jazz"] },
            { "id": "free-jazz", "name": "Free Jazz", "aliases": ["free jazz", "avant-garde jazz", "experimental jazz"] },
            { "id": "fusion", "name": "Fusion", "aliases": ["jazz fusion", "fusion", "jazz rock"] },
            { "id": "smooth-jazz", "name": "Smooth Jazz", "aliases": ["smooth jazz", "contemporary jazz", "lounge jazz"] },
            { "id": "acid-jazz", "name": "Acid Jazz", "aliases": ["acid jazz", "jazz funk", "groove jazz"] },
            { "id": "latin-jazz", "name": "Latin Jazz", "aliases": ["latin jazz", "afro-cuban jazz", "brazilian jazz"] }
          ]
        },
        {
          "id": "pop",
          "name": "Pop",
          "aliases": ["pop music", "popular music"],
          "category": "pop",
          "sub_genres": [
            { "id": "indie-pop", "name": "Indie Pop", "aliases": ["indie pop", "indie-pop", "alternative pop"] },
            { "id": "synth-pop", "name": "Synth Pop", "aliases": ["synth pop", "synthpop", "new wave"] },
            { "id": "dream-pop", "name": "Dream Pop", "aliases": ["dream pop", "dream-pop", "shoegaze pop"] },
            { "id": "electropop", "name": "Electropop", "aliases": ["electropop", "electronic pop", "dance pop"] },
            { "id": "art-pop", "name": "Art Pop", "aliases": ["art pop", "art-pop", "experimental pop"] },
            { "id": "teen-pop", "name": "Teen Pop", "aliases": ["teen pop", "bubblegum pop", "youth pop"] }
          ]
        },
        {
          "id": "country",
          "name": "Country",
          "aliases": ["country music", "country and western"],
          "category": "country",
          "sub_genres": [
            { "id": "outlaw-country", "name": "Outlaw Country", "aliases": ["outlaw country", "outlaw", "rebel country"] },
            { "id": "bluegrass", "name": "Bluegrass", "aliases": ["bluegrass", "traditional bluegrass", "mountain music"] },
            { "id": "alt-country", "name": "Alt Country", "aliases": ["alt country", "alternative country", "americana"] },
            { "id": "country-rock", "name": "Country Rock", "aliases": ["country rock", "country-rock", "southern rock"] },
            { "id": "honky-tonk", "name": "Honky Tonk", "aliases": ["honky tonk", "honky-tonk", "traditional country"] }
          ]
        },
        {
          "id": "folk",
          "name": "Folk",
          "aliases": ["folk music", "traditional folk"],
          "category": "folk",
          "sub_genres": [
            { "id": "contemporary-folk", "name": "Contemporary Folk", "aliases": ["contemporary folk", "modern folk", "singer-songwriter"] },
            { "id": "traditional-folk", "name": "Traditional Folk", "aliases": ["traditional folk", "roots music", "heritage folk"] },
            { "id": "celtic-folk", "name": "Celtic Folk", "aliases": ["celtic folk", "irish folk", "scottish folk"] },
            { "id": "americana", "name": "Americana", "aliases": ["americana", "roots americana", "folk americana"] }
          ]
        },
        {
          "id": "r-b",
          "name": "R&B",
          "aliases": ["r&b", "rhythm and blues", "soul"],
          "category": "urban",
          "sub_genres": [
            { "id": "neo-soul", "name": "Neo Soul", "aliases": ["neo soul", "neo-soul", "contemporary soul"] },
            { "id": "contemporary-r-b", "name": "Contemporary R&B", "aliases": ["contemporary r&b", "modern r&b", "urban contemporary"] },
            { "id": "soul", "name": "Soul", "aliases": ["soul", "soul music", "classic soul"] },
            { "id": "funk", "name": "Funk", "aliases": ["funk", "funk music", "groove funk"] }
          ]
        },
        {
          "id": "reggae",
          "name": "Reggae",
          "aliases": ["reggae", "jamaican music"],
          "category": "world",
          "sub_genres": [
            { "id": "roots-reggae", "name": "Roots Reggae", "aliases": ["roots reggae", "conscious reggae", "rasta reggae"] },
            { "id": "dancehall", "name": "Dancehall", "aliases": ["dancehall", "dance hall", "jamaican dancehall"] },
            { "id": "dub", "name": "Dub", "aliases": ["dub", "dub reggae", "instrumental reggae"] },
            { "id": "ska", "name": "Ska", "aliases": ["ska", "ska music", "jamaican ska"] }
          ]
        },
        {
          "id": "classical",
          "name": "Classical",
          "aliases": ["classical music", "orchestral"],
          "category": "classical",
          "sub_genres": [
            { "id": "baroque", "name": "Baroque", "aliases": ["baroque", "baroque classical", "early classical"] },
            { "id": "romantic", "name": "Romantic", "aliases": ["romantic", "romantic classical", "19th century classical"] },
            { "id": "modern-classical", "name": "Modern Classical", "aliases": ["modern classical", "contemporary classical", "20th century classical"] },
            { "id": "minimalism", "name": "Minimalism", "aliases": ["minimalism", "minimalist classical", "repetitive music"] }
          ]
        }
      ]
    });
});

/**
 * @swagger
 * /onboarding/validate-community:
 *   post:
 *     summary: Checks community status and suggests alternatives
 *     description: Validates if a user's selected community is active, below threshold, or needs to be created.
 *     tags:
 *       - Onboarding
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               genre:
 *                 type: string
 *                 example: "hardcore-punk"
 *               city:
 *                 type: string
 *                 example: "Austin"
 *               state:
 *                 type: string
 *                 example: "Texas"
 *               gps_coordinates:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     example: 30.2672
 *                   longitude:
 *                     type: number
 *                     example: -97.7431
 *     responses:
 *       '200':
 *         description: Returns the community status. Can be 'active' or 'below_threshold'.
 */
Router.post('/validate-community', clientAuth, async (req, res) => {
    const { city, userId } = req.body;

    try {
      if (city && city.toLowerCase() === 'austin') {
        // Only update user status if userId is provided
        if (userId) {
          await User.update({ onBoardingStatus: 'COMMUNITY' }, { where: { id: userId } });
        }
        const response = {
          "status": "active",
          "message": "Great! The Austin Hardcore Punk scene is active and ready for you!",
          "community": {
            "id": "austin-tx-hardcore-punk",
            "name": "Austin Hardcore Punk",
            "artist_count": 12,
            "listener_count": 45
          }
        };
        console.log('--- DEBUG: Backend Response ---', JSON.stringify(response, null, 2));
        res.json(response);
      } else {
        const response = {
          "status": "below_threshold",
          "message": `You're a revolutionary for the ${city || 'your'} scene! Help us reach 15 songs to activate RaDIYo broadcasting.`,
        };
        console.log('--- DEBUG: Backend Response ---', JSON.stringify(response, null, 2));
        res.json(response);
      }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /onboarding/complete:
 *   post:
 *     summary: Marks the user's onboarding as complete
 *     description: Updates the user's `onBoardingStatus` to 'COMPLETED' in the database.
 *     tags:
 *       - Onboarding
 *     security:
 *       - clientAuth: []
 *     responses:
 *       '200':
 *         description: Onboarding status successfully updated.
 */
Router.post('/complete', clientAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        await User.update({ onBoardingStatus: 'COMPLETED' }, { where: { id: userId } });
        res.status(200).json({ status: 'success', message: 'Onboarding completed successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update onboarding status.' });
    }
});

/**
 * @swagger
 * /onboarding/all-genres:
 *   get:
 *     summary: Returns all genres in a flat list format
 *     description: Provides all super genres and sub-genres in a flat list format compatible with existing systems.
 *     tags:
 *       - Onboarding
 *     responses:
 *       '200':
 *         description: A JSON object containing all genres in a flat list.
 */
Router.get('/all-genres', (req, res) => {
    const superGenres = [
        {
          "id": "punk",
          "name": "Punk",
          "aliases": ["punk rock", "punk music"],
          "category": "rock",
          "sub_genres": [
            { "id": "hardcore-punk", "name": "Hardcore Punk", "aliases": ["hardcore", "hc punk", "hardcore punk"] },
            { "id": "pop-punk", "name": "Pop Punk", "aliases": ["pop punk", "pop-punk", "pop punk rock"] },
            { "id": "post-punk", "name": "Post Punk", "aliases": ["post punk", "post-punk", "post punk rock"] },
            { "id": "crust-punk", "name": "Crust Punk", "aliases": ["crust", "crust punk", "anarcho punk"] },
            { "id": "folk-punk", "name": "Folk Punk", "aliases": ["folk punk", "folk-punk", "acoustic punk"] },
            { "id": "ska-punk", "name": "Ska Punk", "aliases": ["ska punk", "ska-punk", "ska punk rock"] },
            { "id": "street-punk", "name": "Street Punk", "aliases": ["street punk", "oi punk", "working class punk"] },
            { "id": "emo", "name": "Emo", "aliases": ["emo", "emotional hardcore", "emo punk"] },
            { "id": "screamo", "name": "Screamo", "aliases": ["screamo", "screaming emo", "skramz"] }
          ]
        },
        {
          "id": "metal",
          "name": "Metal",
          "aliases": ["heavy metal", "metal music"],
          "category": "rock",
          "sub_genres": [
            { "id": "death-metal", "name": "Death Metal", "aliases": ["death metal", "dm", "brutal death"] },
            { "id": "black-metal", "name": "Black Metal", "aliases": ["black metal", "bm", "atmospheric black metal"] },
            { "id": "thrash-metal", "name": "Thrash Metal", "aliases": ["thrash", "thrash metal", "speed metal"] },
            { "id": "power-metal", "name": "Power Metal", "aliases": ["power metal", "epic metal", "symphonic power"] },
            { "id": "progressive-metal", "name": "Progressive Metal", "aliases": ["prog metal", "progressive metal", "technical metal"] },
            { "id": "doom-metal", "name": "Doom Metal", "aliases": ["doom", "doom metal", "stoner doom"] },
            { "id": "nu-metal", "name": "Nu Metal", "aliases": ["nu metal", "new metal", "rap metal"] },
            { "id": "metalcore", "name": "Metalcore", "aliases": ["metalcore", "melodic metalcore", "hardcore metal"] },
            { "id": "deathcore", "name": "Deathcore", "aliases": ["deathcore", "brutal deathcore", "extreme metal"] },
            { "id": "folk-metal", "name": "Folk Metal", "aliases": ["folk metal", "pagan metal", "celtic metal"] },
            { "id": "industrial-metal", "name": "Industrial Metal", "aliases": ["industrial metal", "industrial rock", "cyber metal"] }
          ]
        },
        {
          "id": "electronic",
          "name": "Electronic",
          "aliases": ["electronic music", "edm", "electronic dance music"],
          "category": "electronic",
          "sub_genres": [
            { "id": "house", "name": "House", "aliases": ["house music", "deep house", "tech house"] },
            { "id": "techno", "name": "Techno", "aliases": ["techno", "detroit techno", "minimal techno"] },
            { "id": "trance", "name": "Trance", "aliases": ["trance", "progressive trance", "uplifting trance"] },
            { "id": "drum-and-bass", "name": "Drum & Bass", "aliases": ["drum and bass", "dnb", "jungle"] },
            { "id": "dubstep", "name": "Dubstep", "aliases": ["dubstep", "bass music", "uk dubstep"] },
            { "id": "ambient", "name": "Ambient", "aliases": ["ambient", "atmospheric", "chillout"] },
            { "id": "industrial", "name": "Industrial", "aliases": ["industrial", "industrial electronic", "ebm"] },
            { "id": "synthwave", "name": "Synthwave", "aliases": ["synthwave", "retrowave", "outrun"] },
            { "id": "breakbeat", "name": "Breakbeat", "aliases": ["breakbeat", "big beat", "breakbeat garage"] },
            { "id": "hardcore", "name": "Hardcore", "aliases": ["hardcore", "gabber", "happy hardcore"] },
            { "id": "trap", "name": "Trap", "aliases": ["trap", "edm trap", "electronic trap"] },
            { "id": "future-bass", "name": "Future Bass", "aliases": ["future bass", "melodic dubstep", "chill trap"] }
          ]
        },
        {
          "id": "hip-hop",
          "name": "Hip Hop",
          "aliases": ["rap", "hip hop", "hiphop"],
          "category": "urban",
          "sub_genres": [
            { "id": "conscious-hip-hop", "name": "Conscious Hip Hop", "aliases": ["conscious rap", "political rap", "message rap"] },
            { "id": "trap-rap", "name": "Trap Rap", "aliases": ["trap rap", "trap music", "atlanta trap"] },
            { "id": "drill", "name": "Drill", "aliases": ["drill", "chicago drill", "uk drill"] },
            { "id": "boom-bap", "name": "Boom Bap", "aliases": ["boom bap", "90s hip hop", "golden age"] },
            { "id": "alternative-hip-hop", "name": "Alternative Hip Hop", "aliases": ["alt hip hop", "experimental rap", "underground"] },
            { "id": "gangsta-rap", "name": "Gangsta Rap", "aliases": ["gangsta rap", "west coast rap", "g-funk"] },
            { "id": "east-coast-rap", "name": "East Coast Rap", "aliases": ["east coast rap", "new york rap", "brooklyn rap"] },
            { "id": "southern-rap", "name": "Southern Rap", "aliases": ["southern rap", "dirty south", "crunk"] },
            { "id": "conscious-rap", "name": "Conscious Rap", "aliases": ["conscious rap", "positive rap", "spiritual rap"] }
          ]
        },
        {
          "id": "rock",
          "name": "Rock",
          "aliases": ["rock music", "rock and roll"],
          "category": "rock",
          "sub_genres": [
            { "id": "classic-rock", "name": "Classic Rock", "aliases": ["classic rock", "70s rock", "classic rock and roll"] },
            { "id": "alternative-rock", "name": "Alternative Rock", "aliases": ["alt rock", "alternative", "indie rock"] },
            { "id": "progressive-rock", "name": "Progressive Rock", "aliases": ["prog rock", "progressive", "art rock"] },
            { "id": "psychedelic-rock", "name": "Psychedelic Rock", "aliases": ["psychedelic", "psychedelic rock", "acid rock"] },
            { "id": "garage-rock", "name": "Garage Rock", "aliases": ["garage rock", "garage punk", "lo-fi rock"] },
            { "id": "blues-rock", "name": "Blues Rock", "aliases": ["blues rock", "blues-rock", "electric blues"] },
            { "id": "folk-rock", "name": "Folk Rock", "aliases": ["folk rock", "folk-rock", "acoustic rock"] },
            { "id": "country-rock", "name": "Country Rock", "aliases": ["country rock", "country-rock", "southern rock"] },
            { "id": "hard-rock", "name": "Hard Rock", "aliases": ["hard rock", "arena rock", "stadium rock"] },
            { "id": "soft-rock", "name": "Soft Rock", "aliases": ["soft rock", "adult contemporary", "yacht rock"] }
          ]
        },
        {
          "id": "jazz",
          "name": "Jazz",
          "aliases": ["jazz music", "jazz"],
          "category": "jazz",
          "sub_genres": [
            { "id": "bebop", "name": "Bebop", "aliases": ["bebop", "bop", "modern jazz"] },
            { "id": "cool-jazz", "name": "Cool Jazz", "aliases": ["cool jazz", "west coast jazz", "chamber jazz"] },
            { "id": "free-jazz", "name": "Free Jazz", "aliases": ["free jazz", "avant-garde jazz", "experimental jazz"] },
            { "id": "fusion", "name": "Fusion", "aliases": ["jazz fusion", "fusion", "jazz rock"] },
            { "id": "smooth-jazz", "name": "Smooth Jazz", "aliases": ["smooth jazz", "contemporary jazz", "lounge jazz"] },
            { "id": "acid-jazz", "name": "Acid Jazz", "aliases": ["acid jazz", "jazz funk", "groove jazz"] },
            { "id": "latin-jazz", "name": "Latin Jazz", "aliases": ["latin jazz", "afro-cuban jazz", "brazilian jazz"] }
          ]
        },
        {
          "id": "pop",
          "name": "Pop",
          "aliases": ["pop music", "popular music"],
          "category": "pop",
          "sub_genres": [
            { "id": "indie-pop", "name": "Indie Pop", "aliases": ["indie pop", "indie-pop", "alternative pop"] },
            { "id": "synth-pop", "name": "Synth Pop", "aliases": ["synth pop", "synthpop", "new wave"] },
            { "id": "dream-pop", "name": "Dream Pop", "aliases": ["dream pop", "dream-pop", "shoegaze pop"] },
            { "id": "electropop", "name": "Electropop", "aliases": ["electropop", "electronic pop", "dance pop"] },
            { "id": "art-pop", "name": "Art Pop", "aliases": ["art pop", "art-pop", "experimental pop"] },
            { "id": "teen-pop", "name": "Teen Pop", "aliases": ["teen pop", "bubblegum pop", "youth pop"] }
          ]
        },
        {
          "id": "country",
          "name": "Country",
          "aliases": ["country music", "country and western"],
          "category": "country",
          "sub_genres": [
            { "id": "outlaw-country", "name": "Outlaw Country", "aliases": ["outlaw country", "outlaw", "rebel country"] },
            { "id": "bluegrass", "name": "Bluegrass", "aliases": ["bluegrass", "traditional bluegrass", "mountain music"] },
            { "id": "alt-country", "name": "Alt Country", "aliases": ["alt country", "alternative country", "americana"] },
            { "id": "country-rock", "name": "Country Rock", "aliases": ["country rock", "country-rock", "southern rock"] },
            { "id": "honky-tonk", "name": "Honky Tonk", "aliases": ["honky tonk", "honky-tonk", "traditional country"] }
          ]
        },
        {
          "id": "folk",
          "name": "Folk",
          "aliases": ["folk music", "traditional folk"],
          "category": "folk",
          "sub_genres": [
            { "id": "contemporary-folk", "name": "Contemporary Folk", "aliases": ["contemporary folk", "modern folk", "singer-songwriter"] },
            { "id": "traditional-folk", "name": "Traditional Folk", "aliases": ["traditional folk", "roots music", "heritage folk"] },
            { "id": "celtic-folk", "name": "Celtic Folk", "aliases": ["celtic folk", "irish folk", "scottish folk"] },
            { "id": "americana", "name": "Americana", "aliases": ["americana", "roots americana", "folk americana"] }
          ]
        },
        {
          "id": "r-b",
          "name": "R&B",
          "aliases": ["r&b", "rhythm and blues", "soul"],
          "category": "urban",
          "sub_genres": [
            { "id": "neo-soul", "name": "Neo Soul", "aliases": ["neo soul", "neo-soul", "contemporary soul"] },
            { "id": "contemporary-r-b", "name": "Contemporary R&B", "aliases": ["contemporary r&b", "modern r&b", "urban contemporary"] },
            { "id": "soul", "name": "Soul", "aliases": ["soul", "soul music", "classic soul"] },
            { "id": "funk", "name": "Funk", "aliases": ["funk", "funk music", "groove funk"] }
          ]
        },
        {
          "id": "reggae",
          "name": "Reggae",
          "aliases": ["reggae", "jamaican music"],
          "category": "world",
          "sub_genres": [
            { "id": "roots-reggae", "name": "Roots Reggae", "aliases": ["roots reggae", "conscious reggae", "rasta reggae"] },
            { "id": "dancehall", "name": "Dancehall", "aliases": ["dancehall", "dance hall", "jamaican dancehall"] },
            { "id": "dub", "name": "Dub", "aliases": ["dub", "dub reggae", "instrumental reggae"] },
            { "id": "ska", "name": "Ska", "aliases": ["ska", "ska music", "jamaican ska"] }
          ]
        },
        {
          "id": "classical",
          "name": "Classical",
          "aliases": ["classical music", "orchestral"],
          "category": "classical",
          "sub_genres": [
            { "id": "baroque", "name": "Baroque", "aliases": ["baroque", "baroque classical", "early classical"] },
            { "id": "romantic", "name": "Romantic", "aliases": ["romantic", "romantic classical", "19th century classical"] },
            { "id": "modern-classical", "name": "Modern Classical", "aliases": ["modern classical", "contemporary classical", "20th century classical"] },
            { "id": "minimalism", "name": "Minimalism", "aliases": ["minimalism", "minimalist classical", "repetitive music"] }
          ]
        }
    ];

    // Flatten all genres into a single list
    const allGenres = [];
    let idCounter = 1;

    superGenres.forEach(superGenre => {
        // Add super genre
        allGenres.push({
            id: idCounter++,
            name: superGenre.name,
            super_genre: superGenre.id,
            category: superGenre.category,
            type: "super"
        });

        // Add sub genres
        superGenre.sub_genres.forEach(subGenre => {
            allGenres.push({
                id: idCounter++,
                name: subGenre.name,
                super_genre: superGenre.id,
                category: superGenre.category,
                type: "sub"
            });
        });
    });

    res.json({ data: allGenres });
});

/**
 * @swagger
 * /onboarding/sub-genres/{superGenreId}:
 *   get:
 *     summary: Returns sub-genres for a specific super genre
 *     description: Provides all sub-genres for a given super genre ID.
 *     tags:
 *       - Onboarding
 *     parameters:
 *       - in: path
 *         name: superGenreId
 *         required: true
 *         schema:
 *           type: string
 *         description: The super genre ID (e.g., 'punk', 'metal', 'electronic')
 *     responses:
 *       '200':
 *         description: A JSON object containing sub-genres for the specified super genre.
 */
Router.get('/sub-genres/:superGenreId', (req, res) => {
    const { superGenreId } = req.params;
    
    const superGenres = [
        {
          "id": "punk",
          "name": "Punk",
          "aliases": ["punk rock", "punk music"],
          "category": "rock",
          "sub_genres": [
            { "id": "hardcore-punk", "name": "Hardcore Punk", "aliases": ["hardcore", "hc punk", "hardcore punk"] },
            { "id": "pop-punk", "name": "Pop Punk", "aliases": ["pop punk", "pop-punk", "pop punk rock"] },
            { "id": "post-punk", "name": "Post Punk", "aliases": ["post punk", "post-punk", "post punk rock"] },
            { "id": "crust-punk", "name": "Crust Punk", "aliases": ["crust", "crust punk", "anarcho punk"] },
            { "id": "folk-punk", "name": "Folk Punk", "aliases": ["folk punk", "folk-punk", "acoustic punk"] },
            { "id": "ska-punk", "name": "Ska Punk", "aliases": ["ska punk", "ska-punk", "ska punk rock"] },
            { "id": "street-punk", "name": "Street Punk", "aliases": ["street punk", "oi punk", "working class punk"] },
            { "id": "emo", "name": "Emo", "aliases": ["emo", "emotional hardcore", "emo punk"] },
            { "id": "screamo", "name": "Screamo", "aliases": ["screamo", "screaming emo", "skramz"] }
          ]
        },
        {
          "id": "metal",
          "name": "Metal",
          "aliases": ["heavy metal", "metal music"],
          "category": "rock",
          "sub_genres": [
            { "id": "death-metal", "name": "Death Metal", "aliases": ["death metal", "dm", "brutal death"] },
            { "id": "black-metal", "name": "Black Metal", "aliases": ["black metal", "bm", "atmospheric black metal"] },
            { "id": "thrash-metal", "name": "Thrash Metal", "aliases": ["thrash", "thrash metal", "speed metal"] },
            { "id": "power-metal", "name": "Power Metal", "aliases": ["power metal", "epic metal", "symphonic power"] },
            { "id": "progressive-metal", "name": "Progressive Metal", "aliases": ["prog metal", "progressive metal", "technical metal"] },
            { "id": "doom-metal", "name": "Doom Metal", "aliases": ["doom", "doom metal", "stoner doom"] },
            { "id": "nu-metal", "name": "Nu Metal", "aliases": ["nu metal", "new metal", "rap metal"] },
            { "id": "metalcore", "name": "Metalcore", "aliases": ["metalcore", "melodic metalcore", "hardcore metal"] },
            { "id": "deathcore", "name": "Deathcore", "aliases": ["deathcore", "brutal deathcore", "extreme metal"] },
            { "id": "folk-metal", "name": "Folk Metal", "aliases": ["folk metal", "pagan metal", "celtic metal"] },
            { "id": "industrial-metal", "name": "Industrial Metal", "aliases": ["industrial metal", "industrial rock", "cyber metal"] }
          ]
        },
        {
          "id": "electronic",
          "name": "Electronic",
          "aliases": ["electronic music", "edm", "electronic dance music"],
          "category": "electronic",
          "sub_genres": [
            { "id": "house", "name": "House", "aliases": ["house music", "deep house", "tech house"] },
            { "id": "techno", "name": "Techno", "aliases": ["techno", "detroit techno", "minimal techno"] },
            { "id": "trance", "name": "Trance", "aliases": ["trance", "progressive trance", "uplifting trance"] },
            { "id": "drum-and-bass", "name": "Drum & Bass", "aliases": ["drum and bass", "dnb", "jungle"] },
            { "id": "dubstep", "name": "Dubstep", "aliases": ["dubstep", "bass music", "uk dubstep"] },
            { "id": "ambient", "name": "Ambient", "aliases": ["ambient", "atmospheric", "chillout"] },
            { "id": "industrial", "name": "Industrial", "aliases": ["industrial", "industrial electronic", "ebm"] },
            { "id": "synthwave", "name": "Synthwave", "aliases": ["synthwave", "retrowave", "outrun"] },
            { "id": "breakbeat", "name": "Breakbeat", "aliases": ["breakbeat", "big beat", "breakbeat garage"] },
            { "id": "hardcore", "name": "Hardcore", "aliases": ["hardcore", "gabber", "happy hardcore"] },
            { "id": "trap", "name": "Trap", "aliases": ["trap", "edm trap", "electronic trap"] },
            { "id": "future-bass", "name": "Future Bass", "aliases": ["future bass", "melodic dubstep", "chill trap"] }
          ]
        },
        {
          "id": "hip-hop",
          "name": "Hip Hop",
          "aliases": ["rap", "hip hop", "hiphop"],
          "category": "urban",
          "sub_genres": [
            { "id": "conscious-hip-hop", "name": "Conscious Hip Hop", "aliases": ["conscious rap", "political rap", "message rap"] },
            { "id": "trap-rap", "name": "Trap Rap", "aliases": ["trap rap", "trap music", "atlanta trap"] },
            { "id": "drill", "name": "Drill", "aliases": ["drill", "chicago drill", "uk drill"] },
            { "id": "boom-bap", "name": "Boom Bap", "aliases": ["boom bap", "90s hip hop", "golden age"] },
            { "id": "alternative-hip-hop", "name": "Alternative Hip Hop", "aliases": ["alt hip hop", "experimental rap", "underground"] },
            { "id": "gangsta-rap", "name": "Gangsta Rap", "aliases": ["gangsta rap", "west coast rap", "g-funk"] },
            { "id": "east-coast-rap", "name": "East Coast Rap", "aliases": ["east coast rap", "new york rap", "brooklyn rap"] },
            { "id": "southern-rap", "name": "Southern Rap", "aliases": ["southern rap", "dirty south", "crunk"] },
            { "id": "conscious-rap", "name": "Conscious Rap", "aliases": ["conscious rap", "positive rap", "spiritual rap"] }
          ]
        },
        {
          "id": "rock",
          "name": "Rock",
          "aliases": ["rock music", "rock and roll"],
          "category": "rock",
          "sub_genres": [
            { "id": "classic-rock", "name": "Classic Rock", "aliases": ["classic rock", "70s rock", "classic rock and roll"] },
            { "id": "alternative-rock", "name": "Alternative Rock", "aliases": ["alt rock", "alternative", "indie rock"] },
            { "id": "progressive-rock", "name": "Progressive Rock", "aliases": ["prog rock", "progressive", "art rock"] },
            { "id": "psychedelic-rock", "name": "Psychedelic Rock", "aliases": ["psychedelic", "psychedelic rock", "acid rock"] },
            { "id": "garage-rock", "name": "Garage Rock", "aliases": ["garage rock", "garage punk", "lo-fi rock"] },
            { "id": "blues-rock", "name": "Blues Rock", "aliases": ["blues rock", "blues-rock", "electric blues"] },
            { "id": "folk-rock", "name": "Folk Rock", "aliases": ["folk rock", "folk-rock", "acoustic rock"] },
            { "id": "country-rock", "name": "Country Rock", "aliases": ["country rock", "country-rock", "southern rock"] },
            { "id": "hard-rock", "name": "Hard Rock", "aliases": ["hard rock", "arena rock", "stadium rock"] },
            { "id": "soft-rock", "name": "Soft Rock", "aliases": ["soft rock", "adult contemporary", "yacht rock"] }
          ]
        },
        {
          "id": "jazz",
          "name": "Jazz",
          "aliases": ["jazz music", "jazz"],
          "category": "jazz",
          "sub_genres": [
            { "id": "bebop", "name": "Bebop", "aliases": ["bebop", "bop", "modern jazz"] },
            { "id": "cool-jazz", "name": "Cool Jazz", "aliases": ["cool jazz", "west coast jazz", "chamber jazz"] },
            { "id": "free-jazz", "name": "Free Jazz", "aliases": ["free jazz", "avant-garde jazz", "experimental jazz"] },
            { "id": "fusion", "name": "Fusion", "aliases": ["jazz fusion", "fusion", "jazz rock"] },
            { "id": "smooth-jazz", "name": "Smooth Jazz", "aliases": ["smooth jazz", "contemporary jazz", "lounge jazz"] },
            { "id": "acid-jazz", "name": "Acid Jazz", "aliases": ["acid jazz", "jazz funk", "groove jazz"] },
            { "id": "latin-jazz", "name": "Latin Jazz", "aliases": ["latin jazz", "afro-cuban jazz", "brazilian jazz"] }
          ]
        },
        {
          "id": "pop",
          "name": "Pop",
          "aliases": ["pop music", "popular music"],
          "category": "pop",
          "sub_genres": [
            { "id": "indie-pop", "name": "Indie Pop", "aliases": ["indie pop", "indie-pop", "alternative pop"] },
            { "id": "synth-pop", "name": "Synth Pop", "aliases": ["synth pop", "synthpop", "new wave"] },
            { "id": "dream-pop", "name": "Dream Pop", "aliases": ["dream pop", "dream-pop", "shoegaze pop"] },
            { "id": "electropop", "name": "Electropop", "aliases": ["electropop", "electronic pop", "dance pop"] },
            { "id": "art-pop", "name": "Art Pop", "aliases": ["art pop", "art-pop", "experimental pop"] },
            { "id": "teen-pop", "name": "Teen Pop", "aliases": ["teen pop", "bubblegum pop", "youth pop"] }
          ]
        },
        {
          "id": "country",
          "name": "Country",
          "aliases": ["country music", "country and western"],
          "category": "country",
          "sub_genres": [
            { "id": "outlaw-country", "name": "Outlaw Country", "aliases": ["outlaw country", "outlaw", "rebel country"] },
            { "id": "bluegrass", "name": "Bluegrass", "aliases": ["bluegrass", "traditional bluegrass", "mountain music"] },
            { "id": "alt-country", "name": "Alt Country", "aliases": ["alt country", "alternative country", "americana"] },
            { "id": "country-rock", "name": "Country Rock", "aliases": ["country rock", "country-rock", "southern rock"] },
            { "id": "honky-tonk", "name": "Honky Tonk", "aliases": ["honky tonk", "honky-tonk", "traditional country"] }
          ]
        },
        {
          "id": "folk",
          "name": "Folk",
          "aliases": ["folk music", "traditional folk"],
          "category": "folk",
          "sub_genres": [
            { "id": "contemporary-folk", "name": "Contemporary Folk", "aliases": ["contemporary folk", "modern folk", "singer-songwriter"] },
            { "id": "traditional-folk", "name": "Traditional Folk", "aliases": ["traditional folk", "roots music", "heritage folk"] },
            { "id": "celtic-folk", "name": "Celtic Folk", "aliases": ["celtic folk", "irish folk", "scottish folk"] },
            { "id": "americana", "name": "Americana", "aliases": ["americana", "roots americana", "folk americana"] }
          ]
        },
        {
          "id": "r-b",
          "name": "R&B",
          "aliases": ["r&b", "rhythm and blues", "soul"],
          "category": "urban",
          "sub_genres": [
            { "id": "neo-soul", "name": "Neo Soul", "aliases": ["neo soul", "neo-soul", "contemporary soul"] },
            { "id": "contemporary-r-b", "name": "Contemporary R&B", "aliases": ["contemporary r&b", "modern r&b", "urban contemporary"] },
            { "id": "soul", "name": "Soul", "aliases": ["soul", "soul music", "classic soul"] },
            { "id": "funk", "name": "Funk", "aliases": ["funk", "funk music", "groove funk"] }
          ]
        },
        {
          "id": "reggae",
          "name": "Reggae",
          "aliases": ["reggae", "jamaican music"],
          "category": "world",
          "sub_genres": [
            { "id": "roots-reggae", "name": "Roots Reggae", "aliases": ["roots reggae", "conscious reggae", "rasta reggae"] },
            { "id": "dancehall", "name": "Dancehall", "aliases": ["dancehall", "dance hall", "jamaican dancehall"] },
            { "id": "dub", "name": "Dub", "aliases": ["dub", "dub reggae", "instrumental reggae"] },
            { "id": "ska", "name": "Ska", "aliases": ["ska", "ska music", "jamaican ska"] }
          ]
        },
        {
          "id": "classical",
          "name": "Classical",
          "aliases": ["classical music", "orchestral"],
          "category": "classical",
          "sub_genres": [
            { "id": "baroque", "name": "Baroque", "aliases": ["baroque", "baroque classical", "early classical"] },
            { "id": "romantic", "name": "Romantic", "aliases": ["romantic", "romantic classical", "19th century classical"] },
            { "id": "modern-classical", "name": "Modern Classical", "aliases": ["modern classical", "contemporary classical", "20th century classical"] },
            { "id": "minimalism", "name": "Minimalism", "aliases": ["minimalism", "minimalist classical", "repetitive music"] }
          ]
        }
    ];

    const superGenre = superGenres.find(sg => sg.id === superGenreId);
    
    if (!superGenre) {
        return res.status(404).json({ error: 'Super genre not found' });
    }

    res.json({ 
        super_genre: superGenre,
        sub_genres: superGenre.sub_genres 
    });
});

module.exports = Router;