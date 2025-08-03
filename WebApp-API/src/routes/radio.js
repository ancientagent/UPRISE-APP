const Router = require('express').Router();

const config = require('../config/index');
const { User,UserGenrePrefrences,UserRadioQueue , UserStationPrefrence} = require('../database/models/');
const { runQuery } = require('../utils/dbquery');
const { QueryTypes } = require('sequelize');
const fairPlayAlgorithm = require('../utils/fairPlayAlgorithm');
const logger = require('../utils/logger');

// Helper function to convert state abbreviations to full names
function getFullStateName(abbreviation) {
    const stateMap = {
        'TX': 'Texas',
        'CA': 'California',
        'NY': 'New York',
        // Add more as needed
    };
    return stateMap[abbreviation] || abbreviation;
}

// Helper function to get state abbreviation from full name
function getStateAbbreviation(fullName) {
    const stateMap = {
        'Texas': 'TX',
        'California': 'CA',
        'New York': 'NY',
        // Add more as needed
    };
    return stateMap[fullName] || fullName;
}

//radio play with next song using Fair Play algorithm
Router.get('/song',async(req,res) => {
    try{
        console.log('[RADIO.JS TRACE 1] Endpoint hit. Location param:', req.params.location);
        console.log('=== GET /radio/song DIAGNOSTIC START ===');
        console.log('User ID from request:', req.user.id);
        
        if(!req.user.id) throw new Error('Invalid user id');
        
        const user = await User.findOne({
            where:{
                id:req.user.id
            }
        });
        if(!user) throw new Error('user not found');
        
        console.log('✅ User found:', { id: user.id, email: user.email });
        
        const lastRadioRequestTimestamp = user.lastRadioRequestTimestamp;
        const now = new Date();
        const diff = now - lastRadioRequestTimestamp;
        const diffMinutes = Math.floor((diff / 1000) / 60);
        if(diffMinutes > 60){
            await UserRadioQueue.destroy({
                where:{
                    userId:user.id 
                }
            });
        }
        
        const userGenres = await UserGenrePrefrences.findAll({
            where:{
                userId:user.id
            }
        });
        console.log('User genres found:', userGenres.length, userGenres.map(g => g.genreId));
        
        if(!userGenres) throw new Error('user genres not found');
        const genreIds = userGenres.map(genre => genre.genreId);  
        if(genreIds.length === 0) throw new Error('you must have choose atlest one genre');
        
        console.log('Genre IDs for filtering:', genreIds);
        
        const userStationPrefrence = await UserStationPrefrence.findOne({
            where :{
                userId:user.id,
                active:true 
            }
        });
        console.log('[RADIO.JS TRACE 2] User station preference found:', userStationPrefrence);
        
        if(!userStationPrefrence) {
            console.log('❌ NO ACTIVE STATION PREFERENCE FOUND for user ID:', user.id);
            throw new Error('user station prefrence not found');
        }
        
        console.log('✅ Station preference found:', {
            id: userStationPrefrence.id,
            stationPrefrence: userStationPrefrence.stationPrefrence,
            stationType: userStationPrefrence.stationType,
            active: userStationPrefrence.active
        });
        
        // Determine tier based on station preference
        const tierMapping = {
            '1': 'CITYWIDE',
            '2': 'STATEWIDE', 
            '3': 'NATIONAL'
        };
        const tier = tierMapping[userStationPrefrence.stationType] || 'CITYWIDE';
        
        console.log('🎯 Tier determined:', tier, 'from station type:', userStationPrefrence.stationType);
        
        // TEMPORARY BYPASS: Simplified query instead of Fair Play Algorithm
        console.log('🔍 TEMPORARY BYPASS: Using simplified query instead of Fair Play algorithm');
        
        // Parse station preference to extract city, state, and genre
        // Station format: "Austin Texas Punk Uprise" or "Austin TX Punk Uprise" or legacy "Austin"
        let cityFilter = '';
        let stateFilter = '';
        
        const stationParts = userStationPrefrence.stationPrefrence.split(' ');
        console.log('🔍 Parsing station preference:', userStationPrefrence.stationPrefrence);
        console.log('🔍 Station parts:', stationParts);
        
        if (stationParts.length >= 4 && stationParts[stationParts.length - 1] === 'Uprise') {
            // New format: "Austin Texas Punk Uprise" or "Austin TX Punk Uprise"
            const city = stationParts[0];
            const state = stationParts[1];
            const genre = stationParts[2];
            console.log('[RADIO.JS TRACE 3] Parsed location data:', { city, state, genre });
            
            console.log('✅ Parsed new format - City:', city, 'State:', state, 'Genre:', genre);
            
            cityFilter = `AND lower(s."cityName") = lower('${city}')`;
            // Handle both full state names and abbreviations
            stateFilter = `AND (lower(s."stateName") = lower('${state}') OR lower(s."stateName") = lower('${getFullStateName(state)}') OR lower(s."stateName") = lower('${getStateAbbreviation(state)}'))`;
            
        } else {
            // Legacy format: just city name like "Austin"
            const city = userStationPrefrence.stationPrefrence;
            console.log('✅ Using legacy format - City:', city);
            console.log('[RADIO.JS TRACE 3] Parsed location data:', { city, state: '', genre: '' });
            
            cityFilter = `AND lower(s."cityName") = lower('${city}')`;
            // No state filter for legacy format
        }
        
        // Build location filter based on station preference
        // CORRECT LOGIC: Songs are tagged with artist's city/state and genre
        // Available to users with same city/state and genre preferences
        let locationFilter = cityFilter + stateFilter;
        
        // Build genre filter
        const genreFilter = genreIds.length > 0 ? `AND EXISTS (
            SELECT 1 FROM "SongGenres" sg 
            WHERE sg."songId" = s.id 
            AND sg."genreId" IN (${genreIds.join(',')})
        )` : '';
        
        // Simplified query: Get one random song that matches user's preferences
        const simplifiedQuery = `
            SELECT s.id, s.title, s."promotedSong"
            FROM "Songs" s
            LEFT JOIN "Bands" b ON b.id = s."bandId"
            WHERE s."deletedAt" IS NULL 
            AND s.live = true 
            AND b.status = 'ACTIVE'
            AND s.id NOT IN (
                SELECT DISTINCT usl."songId" 
                FROM "UserSongListens" usl 
                WHERE usl."userId" = :userId
                AND usl."createdAt" > NOW() - INTERVAL '24 hours'
            )
            ${locationFilter}
            ${genreFilter}
            ORDER BY RANDOM() 
            LIMIT 1
        `;
        
        console.log('🔍 EXECUTING SIMPLIFIED QUERY:');
        console.log(simplifiedQuery);
        console.log('🔍 QUERY PARAMETERS:', { userId: user.id });
        console.log('🔍 LOCATION FILTER:', locationFilter);
        console.log('🔍 GENRE FILTER:', genreFilter);
        console.log('🔍 USER STATION:', userStationPrefrence.stationPrefrence);
        console.log('🔍 USER GENRES:', genreIds);
        
        console.log('[RADIO.JS TRACE 4] Building final song query...');
        let RadioSong = await runQuery(simplifiedQuery, { 
            type: QueryTypes.SELECT, 
            replacements: { userId: user.id } 
        });
        
        RadioSong = RadioSong[0]; // Get the first (and only) result
        
        console.log('[RADIO.JS TRACE 5] Song found:', RadioSong);
        console.log('🎵 Simplified query result:', RadioSong ? 'Song found' : 'No song found');
        if (RadioSong) {
            console.log('✅ Song details:', {
                id: RadioSong.id,
                title: RadioSong.title,
                promotedSong: RadioSong.promotedSong
            });
        } else {
            console.log('❌ NO SONG FOUND in simplified query!');
            console.log('Location filter:', locationFilter);
            console.log('Genre filter:', genreFilter);
            console.log('User genres:', genreIds);
            console.log('User station:', userStationPrefrence.stationPrefrence);
        }
        
        if(RadioSong) {
            // Get detailed song information with user engagement status
            RadioSong = await runQuery(`
            with "songDetails" as(select s.id "songId" ,s.title ,
                                  replace(s.song,
                                       '${config.songUrl.AWS_S3_ENDPOINT}',
                                       '${config.songUrl.CLOUD_FRONT_ENDPOINT}') as url,
                                  s.thumbnail,s.duration ,
                                  s."cityName" ,s."stateName" ,s."bandId"  from "Songs" s
                                  where s.id = :songId
                                 ),
                "songGenres" as(select sd.*,case when(
                                 json_strip_nulls(json_agg(json_build_object(
                                                        'id', g.id,
                                                        'genre_name', g.name
                                 ))))::json::text != '[{}]'::json::text 
                                 then(
                                      jsonb_strip_nulls(jsonb_agg(jsonb_build_object(
                                                        'id', g.id,
                                                        'genre_name', g.name
                                ))))else null end as genres 
                                from "songDetails" sd 
                                left join "SongGenres" sg on sg."songId"= sd."songId"
                                left join "Genres" g on sg."genreId"=g.id 
                                group by sd."songId",sd.title,sd.url,sd.thumbnail,sd.duration,
                                         sd."cityName" ,sd."stateName" ,sd."bandId"),                
                "bandFollow" as (select case when ubf."bandId"  is  null then false else true end as "amIFollowingBand",
                                        sgs.*
                                from "songGenres" sgs left join public."UserBandFollows" ubf
                                on ubf."bandId" = sgs."bandId" and ubf."userId" = :userId
                                ),
                "bandDetails" as (select  bf.*,
                                 jsonb_build_object('id',b.id,'title',b.title) as band  
                                 from "bandFollow" bf left join public."Bands" b 
                                  on b.id =bf ."bandId" 
                                  ),
                "songFav" as   (select  case when sf."songId" is  null then false else true end as "isSongFavourited",
                                 bd.*
                                from "bandDetails" bd left join public."SongFavorites" sf
                                on sf."songId" =bd."songId" and sf."userId" = :userId
                                ),
                "userUpvote" as (select  case when v."songId" is  null then false else true end as "isSongUpvote",
                                 sf.* 
                                 from "songFav" sf left join "Votes" v on v."songId"=sf."songId"
                                 and v."type"='UPVOTE' and v."userId" = :userId and v.tier = :tier
                                ),
                "downVoteSong" as ( select case when v."songId" is  null then false else true end as "isSongDownvote",
                                    uu.* 
                                  from "userUpvote" uu left join "Votes" v  on v."songId"= uu."songId"
                                  and v."type"='DOWNVOTE' and v."userId" = :userId and v.tier = :tier
                                  ),
                "blastSong" as (select  case when  sb."songId" is  null then false else true end as "isSongBlasted",
                                 dvs.*
                                from "downVoteSong" dvs left join "SongBlasts" sb
                                on dvs ."songId" =sb."songId"  and sb."userId"= :userId
                                ),
                "songLikeStatus" as (select sl.status as "songLikeStatus",
                                 bls.*
                                from "blastSong" bls left join "SongLikes" sl
                                on bls."songId" = sl."songId" and sl."userId" = :userId and sl.tier = :tier
                                ),
                "songReport" as (select case when  r."referenceId"  is  null then false else true end as "isSongReport",
                                sls.* from "songLikeStatus" sls left join "Reports" r on r."referenceId" =sls."songId" 
                                and r."type" ='SONG' and r."userId" =:userId
                                )
                                select * from "songReport" sr`,
            { type:QueryTypes.SELECT, replacements: { songId: RadioSong.id, userId: user.id, tier: tier} });
            
            RadioSong = RadioSong[0];
            if(RadioSong) {
                await User.update({
                    lastRadioRequestTimestamp: new Date()
                },{
                    where:{
                        id:user.id,
                    }
                });
            }
            logger.info(`${user.id} radio song ${RadioSong.songId} in ${tier} tier`);
            return res.status(200).json({data:RadioSong});
            
        }else{
            throw new Error('No songs are available in the current station, please change your city in preferences to listen for more music');
        }
    }
    catch(error){
        console.error('[RADIO.JS TRACE FAILED] Error in endpoint:', error);
        res.status(400).json({error:error.message});
    }
}
);

//Avaliable cities
Router.get('/avaliable-states', async(req,res) => {
    try{
        let search = (req.query.search || '').toLowerCase();

        const states = await runQuery(`
        with "songStates" as( select distinct s."stateName" as state from "Songs" s where s.live is true and s."deletedAt" is null),
        "eventStates" as(select distinct e."stateName" as state from "Events" e ),
         "states" as (select * from "songStates" ss
                     union
                     select * from "eventStates" es)
                     select * from "states" s where lower(s.state) like lower('%${search}%')`,
        { type:QueryTypes.SELECT, replacements: { search: search} });
        res.json({data:states});
    }
    catch(error){
        res.json({error:error.message});
    }

});
module.exports = Router;