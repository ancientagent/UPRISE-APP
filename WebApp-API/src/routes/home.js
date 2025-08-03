const Router = require('express').Router();
const moment = require('moment-timezone');
const _ = require('lodash');
const config = require('../config/index');

// const { notificationTypes } = require('../utils/types/notificationTypes');
const {  UserStationPrefrence } = require('../database/models');
const { runQuery } = require('../utils/dbquery');
const { QueryTypes } = require('sequelize');

// Events by location (for frontend compatibility)
Router.get('/events/:location', async(req,res) => {
    try{
        if(!req.user.id) throw new Error('Invalid user id');
        const { location } = req.params;
        if(!location) throw new Error('Invalid location name');
        
        const userStationType = await UserStationPrefrence.findOne({
            where:{
                userId:req.user.id,
                active:true
            }
        });
        if(!userStationType) throw new Error('Invalid station prefrence');
        
        let query;
        if (userStationType.stationType === '1') {
            query = `e."deletedAt" is null and b.status ='ACTIVE' 
            and lower(e."cityName") = lower('${location}')`;
        } else if(userStationType.stationType === '2') {
            query = `e."deletedAt" is null and b.status ='ACTIVE'
             and lower(e."stateName") = lower('${location}')`;
        }
        else{
            query = `e."deletedAt" is null and b.status ='ACTIVE'`;
        }
        
        let events = await runQuery(`
        select  case when uce."eventId" is  null then false else true end as "addToCalender",
        e.id ,e.thumbnail,e."eventName",e.description,e."cityName" as city,
        e."startTime" ,e."endTime" ,e."location",
        jsonb_build_object('id',b.id,'title',b.title) as band  
        from "Events" e 
        left join "Bands" b on b.id = e."bandId"
          left join "UserCalenderEvents" uce on uce."eventId" = e.id and uce."userId" =${req.user.id}
         where ${query}
         order by e."createdAt" desc`,
        { type:QueryTypes.SELECT});
        
        var now = new Date();
        let utcCurrentDate  = moment(now).format();
        let futureEvents = [];
        let pastEvents = [];
        for await(const event of events){
            if(moment(event.startTime) > moment(utcCurrentDate)){
                futureEvents.push(event);
            }
        }
        for await(const event of events){
            if(moment(event.startTime) < moment(utcCurrentDate)){
                pastEvents.push(event);
            }
        }
        events = [...futureEvents,...pastEvents];
        res.json({data:events});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

// Promos by location (for frontend compatibility)
Router.get('/promos/:location', async (req, res) => {
    try{
        if(!req.user.id) throw new Error('Invalid user id');
        const { location } = req.params;
        if(!location) throw new Error('Invalid location name');
        
        const userStationType = await UserStationPrefrence.findOne({
            where:{
                userId:req.user.id,
                active:true
            }
        });
        if(!userStationType) throw new Error('Invalid station prefrence');
        
        let query;
        if (userStationType.stationType === '1') {
            query =` am.live is true and lower(am."city") = lower('${location}')`;
        } else if(userStationType.stationType === '2') {
            query = `am.live is true and lower(am."state") = lower('${location}')`;
        }
        else{
            query = `am.live is true`;
        }
        
        const promos = await runQuery(`
        select * from "AdsManagements" am  where ${query}    
        order by am."createdAt" desc 
        `, { type:QueryTypes.SELECT});
        res.json({data: promos});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

Router.get('/feed/events',async(req,res) => {
    try{
        console.log('=== GET /home/feed/events DIAGNOSTIC START ===');
        console.log('User ID from request:', req.user.id);
        
        if(!req.user.id) throw new Error('Invalid user id');
        
        const userStationType = await UserStationPrefrence.findOne({
            where:{
                userId:req.user.id,
                active:true
            }
        });
        
        if(!userStationType) {
            console.log('❌ NO ACTIVE STATION PREFERENCE FOUND for user ID:', req.user.id);
            throw new Error('Invalid station prefrence');
        }
        
        const stationPref = userStationType.stationPrefrence;
        const city = stationPref.split(' ')[0]; // Extracts "Austin"

        console.log('✅ Station preference found:', {
            id: userStationType.id,
            userId: userStationType.userId,
            cityName: userStationType.cityName,
            stateName: userStationType.stateName,
            stationType: userStationType.stationType,
            active: userStationType.active
        });

        // Get user's genre preferences for genre filtering
        const userGenres = await runQuery(`
            SELECT "genreId" FROM "UserGenrePrefrences" 
            WHERE "userId" = :userId
        `, { 
            replacements: { userId: req.user.id }, 
            type: QueryTypes.SELECT 
        });
        const genreIds = userGenres.map(g => g.genreId);

        // Build genre filter for events (filter events where band has songs matching user's genres)
        const eventGenreFilter = genreIds.length > 0 ? `AND EXISTS (
            SELECT 1 FROM "Songs" bandSongs 
            JOIN "SongGenres" sg ON sg."songId" = bandSongs.id 
            WHERE bandSongs."bandId" = e."bandId" 
            AND sg."genreId" IN (${genreIds.join(',')})
            AND bandSongs."deletedAt" IS NULL 
            AND bandSongs.live = true
        )` : '';

        let query;
        if (userStationType.stationType === '1') {
            query = `e."deletedAt" is null and b.status ='ACTIVE' 
            and lower(e."cityName") = lower('${city}')`;
        } else if(userStationType.stationType === '2') {
            const state = stationPref.split(' ')[1];
            query = `e."deletedAt" is null and b.status ='ACTIVE'
             and lower(e."stateName") = lower('${state}')`;
        }
        else{
            // eslint-disable-next-line quotes
            query = `e."deletedAt" is null and b.status ='ACTIVE'`;
        }
        let events = await runQuery(`
        select  case when uce."eventId" is  null then false else true end as "addToCalender",
        e.id ,e.thumbnail,e."eventName",e.description,e."cityName" as city,
        e."startTime" ,e."endTime" ,e."location",
        jsonb_build_object('id',b.id,'title',b.title) as band  
        from "Events" e 
        left join "Bands" b on b.id = e."bandId"
          left join "UserCalenderEvents" uce on uce."eventId" = e.id and uce."userId" =${req.user.id}
         where ${query}
         ${eventGenreFilter}
         order by e."createdAt" desc`,
        { type:QueryTypes.SELECT});
        var now = new Date();
        let utcCurrentDate  = moment(now).format();
        let futureEvents = [];
        let pastEvents = [];
        for await(const event of events){
            if(moment(event.startTime) > moment(utcCurrentDate)){
                futureEvents.push(event);
            }
        }
        for await(const event of events){
            if(moment(event.startTime) < moment(utcCurrentDate)){
                pastEvents.push(event);
            }
        }
        events = [...futureEvents,...pastEvents];
        console.log('Events found:', events.length);
        console.log('=== GET /home/feed/events DIAGNOSTIC COMPLETE ===');
        res.json({data:events});
    }
    catch(error){
        console.log('=== GET /home/feed/events DIAGNOSTIC ERROR ===');
        console.log('Error message:', error.message);
        console.log('Error stack:', error.stack);
        console.log('User ID:', req.user?.id);
        res.status(400).json({error:error.message});
    }
});


Router.get('/feed',async(req,res) => {
    try{
        console.log('=== GET /home/feed DIAGNOSTIC START ===');
        console.log('User ID from request:', req.user.id);
        
        // Get user station preference for location filtering
        const userStationType = await UserStationPrefrence.findOne({
            where:{
                userId:req.user.id,
                active:true
            }
        });
        
        if(!userStationType) {
            console.log('❌ NO ACTIVE STATION PREFERENCE FOUND for user ID:', req.user.id);
            
            // Check if there are any inactive preferences
            const inactivePreferences = await UserStationPrefrence.findAll({
                where: {
                    userId: req.user.id
                }
            });
            console.log('Inactive station preferences found:', inactivePreferences.length);
            
            throw new Error('Invalid station prefrence');
        }
        
        const stationPref = userStationType.stationPrefrence; // e.g., "Austin Texas Punk Uprise"
        const city = stationPref.split(' ')[0]; // Extracts "Austin"

        console.log('✅ Station preference found:', {
            id: userStationType.id,
            userId: userStationType.userId,
            cityName: userStationType.cityName,
            stateName: userStationType.stateName,
            stationType: userStationType.stationType,
            active: userStationType.active
        });

        // Get user's genre preferences for genre filtering
        const userGenres = await runQuery(`
            SELECT "genreId" FROM "UserGenrePrefrences" 
            WHERE "userId" = :userId
        `, { 
            replacements: { userId: req.user.id }, 
            type: QueryTypes.SELECT 
        });
        const genreIds = userGenres.map(g => g.genreId);
        console.log('User genre IDs:', genreIds);
        
        // Build genre filter condition
        const genreFilter = genreIds.length > 0 ? `AND EXISTS (
            SELECT 1 FROM "SongGenres" sg 
            WHERE sg."songId" = s.id 
            AND sg."genreId" IN (${genreIds.join(',')})
        )` : '';

        console.log('Fetching notification-based songs...');
        let songsData = await runQuery(`
        select n."type",n."createdAt",n."referenceId",
        jsonb_build_object('isSongFavorite',case when sf."userId"  is not null then true else false end ,
            'id',s.id ,'title',s.title ,'song',replace(s.song,
                '${config.songUrl.AWS_S3_ENDPOINT}',
                '${config.songUrl.CLOUD_FRONT_ENDPOINT}'),'thumbnail',s.thumbnail ,'duration',s.duration ,'cityName',s."cityName",
        'stateName',s."stateName" ,'bandId',s."bandId" ) as song,
        jsonb_build_object('id',b.id,'title',b.title,'logo',b.logo) as band,
         jsonb_build_object('id',u.id,'firstName',u."firstName",'lastName',u."lastName",
                                              'userName',u."userName",'email',u.email,'avatar',u.avatar,
                                              'roleId',u."roleId",'about',u.about,
                                               'facebook',u.facebook,'instagram',u.instagram,
                                                'twitter',u.twitter,
                                                'role',jsonb_build_object('id',r.id,'name',r."name")
                                             ) as initiator
        from "Notifications" n 
        left join "Songs" s on n."referenceId" = s.id  and s."deletedAt" is null
        left join "SongFavorites" sf on s.id = sf."songId" and sf."userId" = :userId 
        left join "Bands" b on b.id = s."bandId"
        left join "Users" u on u.id =n."initiatorId"
        left join "Roles" r on r.id = u."roleId"
        where n."type" in('UPVOTE_SONG','UPLOAD_SONG','BLAST_SONG') and b.status ='ACTIVE' 
        and s.live is true and n."receiverId" = :userId 
        ${userStationType.stationType === '1' ? `and lower(s."cityName") = lower('${city}')` : ''}
        ${userStationType.stationType === '2' ? `and lower(s."stateName") = lower('${userStationType.stationPrefrence}')` : ''}
        ${genreFilter}
        order by n."createdAt" desc`,
        { type:QueryTypes.SELECT,replacements:{userId:req.user.id}});
        console.log('Notification-based songs count (with genre filter):', songsData.length);

        // If no songs found with genre filter, try without genre filter
        if (songsData.length === 0 && genreIds.length > 0) {
            console.log('No songs found with genre filter, trying without genre filter...');
            songsData = await runQuery(`
            select n."type",n."createdAt",n."referenceId",
            jsonb_build_object('isSongFavorite',case when sf."userId"  is not null then true else false end ,
                'id',s.id ,'title',s.title ,'song',replace(s.song,
                    '${config.songUrl.AWS_S3_ENDPOINT}',
                    '${config.songUrl.CLOUD_FRONT_ENDPOINT}'),'thumbnail',s.thumbnail ,'duration',s.duration ,'cityName',s."cityName",
            'stateName',s."stateName" ,'bandId',s."bandId" ) as song,
            jsonb_build_object('id',b.id,'title',b.title,'logo',b.logo) as band,
             jsonb_build_object('id',u.id,'firstName',u."firstName",'lastName',u."lastName",
                                                  'userName',u."userName",'email',u.email,'avatar',u.avatar,
                                                  'roleId',u."roleId",'about',u.about,
                                                   'facebook',u.facebook,'instagram',u.instagram,
                                                    'twitter',u.twitter,
                                                    'role',jsonb_build_object('id',r.id,'name',r."name")
                                                 ) as initiator
            from "Notifications" n 
            left join "Songs" s on n."referenceId" = s.id  and s."deletedAt" is null
            left join "SongFavorites" sf on s.id = sf."songId" and sf."userId" = :userId 
            left join "Bands" b on b.id = s."bandId"
            left join "Users" u on u.id =n."initiatorId"
            left join "Roles" r on r.id = u."roleId"
            where n."type" in('UPVOTE_SONG','UPLOAD_SONG','BLAST_SONG') and b.status ='ACTIVE' 
            and s.live is true and n."receiverId" = :userId 
            ${userStationType.stationType === '1' ? `and lower(s."cityName") = lower('${city}')` : ''}
            ${userStationType.stationType === '2' ? `and lower(s."stateName") = lower('${userStationType.stationPrefrence}')` : ''}
            order by n."createdAt" desc`,
            { type:QueryTypes.SELECT,replacements:{userId:req.user.id}});
            console.log('Notification-based songs count (without genre filter):', songsData.length);
        }

        // Build genre filter for events (filter events where band has songs matching user's genres)
        const eventGenreFilter = genreIds.length > 0 ? `AND EXISTS (
            SELECT 1 FROM "Songs" bandSongs 
            JOIN "SongGenres" sg ON sg."songId" = bandSongs.id 
            WHERE bandSongs."bandId" = e."bandId" 
            AND sg."genreId" IN (${genreIds.join(',')})
            AND bandSongs."deletedAt" IS NULL 
            AND bandSongs.live = true
        )` : '';

        console.log('Fetching notification-based events...');
        let events = await runQuery(`
        select   n."type",n."createdAt",n."referenceId",
        jsonb_build_object('addtoCalender',case when uce."eventId" is  null then false else true end,
                 'id',e.id ,'thumbnail',e.thumbnail,'eventName',e."eventName" ,
                 'description',e.description ,'startTime',e."startTime",
                'endTime',e."endTime" ,'location',e."location",'cityName',e."cityName",'stateName',e."stateName",
                'bandId',e."bandId" ) as event,
                jsonb_build_object('id',u.id,'firstName',u."firstName",'lastName',u."lastName",
                                   'userName',u."userName",'email',u.email,'avatar',u.avatar,
                                   'roleId',u."roleId",'about',u.about,
                                   'facebook',u.facebook,'instagram',u.instagram,
                                   'twitter',u.twitter
                                  ) as initiator,
              jsonb_build_object('id',b.id,'title',b.title,'logo',b.logo) as band
                  from "Notifications" n 
              left join "Events" e on e.id = n."referenceId"  and e."deletedAt" is null 
              left join "UserCalenderEvents" uce on uce."eventId" = e.id and uce."userId" = :userId 
              left join "Bands" b on b.id = e."bandId"
              left join "Users" u on n."initiatorId" = u.id 
              where n."type" in('ADD_EVENT') and b.status ='ACTIVE' and n."receiverId" = :userId 
              ${userStationType.stationType === '1' ? `and lower(e."cityName") = lower('${city}')` : ''}
              ${userStationType.stationType === '2' ? `and lower(e."stateName") = lower('${userStationType.stationPrefrence}')` : ''}
              ${eventGenreFilter}
              order by n."createdAt" desc`,
        { type:QueryTypes.SELECT,replacements:{userId:req.user.id}});
        console.log('Notification-based events count (with genre filter):', events.length);

        // If no events found with genre filter, try without genre filter
        if (events.length === 0 && genreIds.length > 0) {
            console.log('No events found with genre filter, trying without genre filter...');
            events = await runQuery(`
            select   n."type",n."createdAt",n."referenceId",
            jsonb_build_object('addtoCalender',case when uce."eventId" is  null then false else true end,
                     'id',e.id ,'thumbnail',e.thumbnail,'eventName',e."eventName" ,
                     'description',e.description ,'startTime',e."startTime",
                    'endTime',e."endTime" ,'location',e."location",'cityName',e."cityName",'stateName',e."stateName",
                    'bandId',e."bandId" ) as event,
                    jsonb_build_object('id',u.id,'firstName',u."firstName",'lastName',u."lastName",
                                       'userName',u."userName",'email',u.email,'avatar',u.avatar,
                                       'roleId',u."roleId",'about',u.about,
                                       'facebook',u.facebook,'instagram',u.instagram,
                                       'twitter',u.twitter
                                      ) as initiator,
                  jsonb_build_object('id',b.id,'title',b.title,'logo',b.logo) as band
                      from "Notifications" n 
                  left join "Events" e on e.id = n."referenceId"  and e."deletedAt" is null 
                  left join "UserCalenderEvents" uce on uce."eventId" = e.id and uce."userId" = :userId 
                  left join "Bands" b on b.id = e."bandId"
                  left join "Users" u on n."initiatorId" = u.id 
                  where n."type" in('ADD_EVENT') and b.status ='ACTIVE' and n."receiverId" = :userId 
                  ${userStationType.stationType === '1' ? `and lower(e."cityName") = lower('${city}')` : ''}
                  ${userStationType.stationType === '2' ? `and lower(e."stateName") = lower('${userStationType.stationPrefrence}')` : ''}
                  order by n."createdAt" desc`,
            { type:QueryTypes.SELECT,replacements:{userId:req.user.id}});
            console.log('Notification-based events count (without genre filter):', events.length);
        }

        console.log('Fetching user follows data...');
        const userFollowsData = await runQuery(`
        select n."type",n."createdAt",n."referenceId",jsonb_build_object('id',u.id,'firstName',u."firstName",'lastName',u."lastName",
                                             'userName',u."userName",'email',u.email,'avatar',u.avatar,
                                             'about',u.about,'facebook',u.facebook,'instagram',u.instagram,
                                             'twitter',u.twitter,
                                             'role',jsonb_build_object('id',r.id,'name',r."name")
                                            ) as initiator
         from "Notifications" n left join "Users" u on u.id =n."referenceId"
         left join "Roles" r on r.id =u."roleId" 
         where n."type" in ('FOLLOW_USER') and n."receiverId" = :userId and u."deletedAt" is null
          order by n."createdAt" desc`,
        { type:QueryTypes.SELECT,replacements:{userId:req.user.id}});
        console.log('User follows data count:', userFollowsData.length);

        // Combine all notification data (songs, events, user follows)
        let feed = [...songsData,...events,...userFollowsData];
        
        // Sort by creation date (newest first)
        feed = _.orderBy(feed, [(item) => {
            return moment(item.createdAt);
        }], ['desc']);
        
        console.log('Final notification feed count:', feed.length);
        console.log('Feed contains only notifications - no direct songs/events');
        console.log('=== GET /home/feed DIAGNOSTIC COMPLETE ===');
       
        res.json({data: feed});
    }
    catch(error){
        console.log('=== GET /home/feed DIAGNOSTIC ERROR ===');
        console.log('Error message:', error.message);
        console.log('Error stack:', error.stack);
        console.log('User ID:', req.user?.id);
        res.status(400).json({error:error.message});
    }
});



//New Releases
Router.get('/new-releases', async (req, res) => {
    try{
        // Get user's genre preferences for genre filtering
        const userGenres = await runQuery(`
            SELECT "genreId" FROM "UserGenrePrefrences" 
            WHERE "userId" = :userId
        `, { 
            replacements: { userId: req.user.id }, 
            type: QueryTypes.SELECT 
        });
        const genreIds = userGenres.map(g => g.genreId);

        // Build genre filter for new releases
        const newReleasesGenreFilter = genreIds.length > 0 ? `AND EXISTS (
            SELECT 1 FROM "SongGenres" sg 
            WHERE sg."songId" = s.id 
            AND sg."genreId" IN (${genreIds.join(',')})
        )` : '';

        const newReleases = await runQuery(`
        select case when sf."userId"  is not null then true else false end as "isSongFavorite" ,
        s.id,s.title,replace(s.song,
            '${config.songUrl.AWS_S3_ENDPOINT}',
            '${config.songUrl.CLOUD_FRONT_ENDPOINT}') as song,s.thumbnail,s.duration,s."cityName",s."stateName",s.live,
        jsonb_build_object('id',a.id,'title',a.title) as album,
        jsonb_build_object('id',b.id,'title',b.title)as band from "Songs" s
        left join "Albums" a on a.id = s."albumId"
        left join "Bands" b on b.id = s."bandId"
        left join "SongFavorites" sf on s.id = sf."songId" and sf."userId" =:userId
        where b.status='ACTIVE' and s."deletedAt" is null and s.live is true
        ${newReleasesGenreFilter}
        order by s."createdAt" desc limit 20
        `, { type:QueryTypes.SELECT,replacements:{userId:req.user.id}});
        res.json({data: newReleases});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//Recommended Radio Stations
Router.get('/recommended-radio-stations', async (req, res) => {
    try{
        let states = await runQuery(`
        with "popularSongs" as ( 
                            select count(usl."songId") as "songCount",s.id,s."stateName" from "Songs" s 
                            left join "UserSongListens" usl on usl."songId"=s.id
                            left join "Bands" b on b.id = s."bandId"
                            where s."deletedAt" is null  and b.status ='ACTIVE' and s.live is true
                            group by  usl."songId",s.id 
                            order by count(usl."songId") desc
                          ),
    "uniqueStates" as(    select count(ps."songCount"),ps."stateName" from "popularSongs" ps
                          group by  ps."stateName"
                          order by count(ps."songCount") desc limit 20
                    )
        select jsonb_agg(us."stateName") as states from "uniqueStates" us 
         `, { type:QueryTypes.SELECT});
        if(states.length > 0){
            states = states[0].states;
        }

        res.json({states});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);

//Recommended Radio Stations by cities
Router.get('/recommended-radio-stations/:state', async (req, res) => {
    //if(!req.params.state) throw new Error('State is required');
    try{
        const { state }  = req.params;
        if(!state) throw new Error('State is required');
        const radioStations = await runQuery(`
        select case when sf."userId"  is not null then true else false end  as "isSongFavorite",
               s.id,s.title,replace(s.song,
                '${config.songUrl.AWS_S3_ENDPOINT}',
                '${config.songUrl.CLOUD_FRONT_ENDPOINT}') as song,s.thumbnail,s.duration,s."cityName",s."stateName",s.live,
               jsonb_build_object('id',b.id,'title',b.title) as band,
               case when (
                json_strip_nulls(json_build_object(
                     'id',a.id,
                     'title',a.title
                    ))
                )::json::text != '{}'::json::text then (
                        json_build_object(
                     'id',a.id,
                     'title',a.title
                    )
                ) else null end as album  from "Songs" s 
               left join "Bands" b on b.id =s."bandId"
               left join "Albums" a on a.id =s."albumId"
               left join "SongFavorites" sf on s.id = sf."songId" and sf."userId" =:userId
               where b.status ='ACTIVE'and s."deletedAt" is null and s.live is true and lower(s."stateName") = lower(:state);
        `, { type:QueryTypes.SELECT,replacements:{userId:req.user.id,state:state}});
        res.json({data: radioStations});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);

//home feed promos
Router.get('/promos', async (req, res) => {
    try{
        if(!req.user.id) throw new Error('Invalid user id');
        const userStationType = await UserStationPrefrence.findOne({
            where:{
                userId:req.user.id,
                active:true
            }
        });
        if(!userStationType) throw new Error('Invalid station prefrence');

        // Get user's genre preferences for genre filtering
        const userGenres = await runQuery(`
            SELECT "genreId" FROM "UserGenrePrefrences" 
            WHERE "userId" = :userId
        `, { 
            replacements: { userId: req.user.id }, 
            type: QueryTypes.SELECT 
        });
        const genreIds = userGenres.map(g => g.genreId);

        // Build genre filter for promos (filter promos where associated band has songs matching user's genres)
        const promoGenreFilter = genreIds.length > 0 ? `AND EXISTS (
            SELECT 1 FROM "Songs" bandSongs 
            JOIN "SongGenres" sg ON sg."songId" = bandSongs.id 
            WHERE bandSongs."bandId" = am."bandId" 
            AND sg."genreId" IN (${genreIds.join(',')})
            AND bandSongs."deletedAt" IS NULL 
            AND bandSongs.live = true
        )` : '';

        let query;

        if (userStationType.stationType === '1') {
            query =` am.live is true and lower(am."city") = lower('${userStationType.stationPrefrence}')`;
           
        } else if(userStationType.stationType === '2') {
            query = `am.live is true and lower(am."state") = lower('${userStationType.stationPrefrence}')`;
        }
        else{
            // eslint-disable-next-line quotes
            query = `am.live is true`;
        }
        let { state } = req.query;
        if(!state) throw new Error('Invalid state name');
        const promos = await runQuery(`
        select * from "AdsManagements" am  where ${query}    
        ${promoGenreFilter}
        order by am."createdAt" desc 
        `, { type:QueryTypes.SELECT});
        res.json({data: promos});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);



module.exports = Router;
