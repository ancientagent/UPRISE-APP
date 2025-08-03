const Router = require('express').Router();
const config = require('../config/index');

const {  UserStationPrefrence, Roles } = require('../database/models');
const { runQuery } = require('../utils/dbquery');
const { QueryTypes } = require('sequelize');



//get most played songs
Router.get('/most_played_songs',async(req,res) => {
    try{
        let { state,currentPage = 1, perPage = 20 } = req.query;
        if(!state) throw new Error('Invalid state name');
        let songs = await runQuery(`
        select count(*) over() "totalCount",count(usl."songId") as "songCount",s.id,
               case when sf."userId"  is not null then true else false end as "isSongFavorite",
               s.title,replace(s.song,
                '${config.songUrl.AWS_S3_ENDPOINT}',
                '${config.songUrl.CLOUD_FRONT_ENDPOINT}') as song,s.thumbnail,s.duration,s."cityName",s."stateName",
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
                ) else null end as album,
               jsonb_build_object('id',b.id,'title',b.title) as band  from "Songs" s 
                   left join "UserSongListens" usl on usl."songId"= s.id
                   left join "Albums" a on a.id = s."albumId"
                   left join "Bands" b on b.id = s."bandId"
                    left join "SongFavorites" sf on s.id = sf."songId" and sf."userId"= :userId
                   where s."deletedAt" is null and s.live is true and b.status='ACTIVE' and lower(s."stateName") = lower('${state}')
                   group by  usl."songId",s.id,a.id,b.id,sf."userId" 
                   order by count(usl."songId") desc  
               offset ${perPage === 'all' ? 0:`${(currentPage-1)*perPage}`} limit ${perPage}`,
        { type:QueryTypes.SELECT,replacements: { userId: req.user.id}});
        const data = {
            songs,
        };
        if(songs.length > 0){
            perPage === 'all'?perPage =songs[0].totalCount:perPage;
            const totalPages = songs.length > 0 ? Math.ceil(songs[0].totalCount/perPage) : 0;
            data.metadata = {
                currentPage: parseInt(currentPage),
                perPage: parseInt(perPage),
                totalPages,
            };
        }
        else{
            data.metadata = {
                currentPage: parseInt(currentPage),
                perPage: parseInt(perPage),
                totalPages:0,
            };
        }
        return res.json({data});
    }
    catch(error){
        return res.status(400).json({error:error.message});
    }
});


//get most popular bands depends on most popular  upvotes, blasts,song listens
Router.get('/most_popular_bands',async(req,res) => {
    try{
        let { state,currentPage = 1, perPage = 20 } = req.query;
        if(!state) throw new Error('Invalid state name');
        const bands = await runQuery(`    with "popularSongs" as(select count(*) over() "totalCount",count(usl."songId") as "songCount",s.id,
        case when sf."userId"  is not null then true else false end as "isSongFavorite",
        s.title,s.song,s.thumbnail,s.duration,s."cityName",s."stateName",s."bandId"  from "Songs" s 
            left join "UserSongListens" usl on usl."songId"= s.id
            left join "Albums" a on a.id = s."albumId"
            left join "Bands" b on b.id = s."bandId"
             left join "SongFavorites" sf on s.id = sf."songId" and sf."userId"=${req.user.id}
            where s."deletedAt" is null and s.live is true and b.status='ACTIVE' and lower(s."stateName") = lower('${state}')
            group by  usl."songId",s.id,a.id,b.id,sf."userId" 
            order by count(usl."songId") desc)
            select distinct b.id ,
            count(*) over() "totalCount",count(*) as "songCount",
 case when ubf."bandId"  is not null then true else false end as "amiFollowingBand",
b.title,b.description,b.logo,b."createdAt" from "popularSongs" ps 
left join public."Bands" b on b.id= ps."bandId"
 left join "UserBandFollows" ubf on b.id = ubf."bandId" 
   group by b.id,ubf."bandId"
      offset ${perPage === 'all' ? 0:`${(currentPage-1)*perPage}`} limit ${perPage} ;`,
        { type:QueryTypes.SELECT} );
        const data = {
            bands,
        };
        if(bands.length > 0){
            perPage === 'all'?perPage = bands[0].totalCount:perPage;
            const totalPages = bands.length > 0 ? Math.ceil(bands[0].totalCount/perPage) : 0;
            data.metadata = {
                currentPage: parseInt(currentPage),
                perPage: parseInt(perPage),
                totalPages,
            };
        }
        else{
            data.metadata = {
                currentPage: parseInt(currentPage),
                perPage: parseInt(perPage),
                totalPages:0,
            };  
        }
        res.json({data});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }

});


//get most Rated songs
Router.get('/most_rated_songs',async(req,res) => {
    try{
        let { state,currentPage = 1, perPage = 20 } = req.query;
        if(!state) throw new Error('Invalid state name');
        const ratedSongs = await runQuery(`
        with "upvotes" as (select count(v."songId") as upvote,v."songId"  from "Votes" v 
                            where v."type" ='UPVOTE' group by v."songId"
                          ),
             "blasts" as ( select count(sb."songId")as blast,sb."songId"  from  "SongBlasts" sb 
                            group by sb."songId"
                          )
                          select count(*) over() "totalCount",coalesce(upv.upvote,0) as upvotes,coalesce (bs.blast,0)as blast,
                          case when sf."userId"  is not null then true else false end as "isSongFavorite",
                                 s.id,s.title,replace(s.song,
                                    '${config.songUrl.AWS_S3_ENDPOINT}',
                                    '${config.songUrl.CLOUD_FRONT_ENDPOINT}') as song,s.thumbnail,s.duration,s."cityName",s."stateName",s."createdAt",
                                 jsonb_build_object('id',b.id,'title',b.title) as band
                                 from "Songs" s left join "upvotes" upv 
                                 on upv."songId" = s.id 
                                left join "blasts" bs on bs."songId"=s.id
                                left join "Bands" b on b.id = s."bandId"
                                left join "SongFavorites" sf on s.id = sf."songId" and sf."userId"=${req.user.id}
                                where s."deletedAt" is null and s.live is true and b.status ='ACTIVE' and lower(s."stateName") = lower('${state}')
                                group by upv.upvote,s.id,bs.blast,b.id,sf."userId"
                                 order by upvotes desc,blast desc
                                 offset ${perPage === 'all' ? 0:`${(currentPage-1)*perPage}`} limit ${perPage} `,
        { type:QueryTypes.SELECT});
        const data = {
            ratedSongs,
        };
        if(ratedSongs.length > 0){
            perPage === 'all'?perPage = ratedSongs[0].totalCount:perPage;
            const totalPages = ratedSongs.length > 0 ? Math.ceil(ratedSongs[0].totalCount/perPage) : 0;
            data.metadata = {
                currentPage: parseInt(currentPage),
                perPage: parseInt(perPage),
                totalPages,
            };
        }
        else{
            data.metadata = {
                currentPage: parseInt(currentPage),
                perPage: parseInt(perPage),
                totalPages:0,
            }; 
        }
        res.json({data});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});


//onboarding users in city state national
Router.get('/users', async(req,res) => {
    try {
        if(!req.user.id) throw new Error('Invalid user id');
        const userStationType = await UserStationPrefrence.findOne({
            where:{
                userId:req.user.id,
                active:true
            }
        });
        if(!userStationType) throw new Error('Invalid station prefrence');
        let query;
        let values;
        let groupBy ;
        if (userStationType.stationType === '1') {
            values = 'l.city,u."roleId",r.name';
            query = `u."deletedAt" is null and u.status ='ACTIVE' 
            and lower(l.city) = lower('${userStationType.stationPrefrence}')`;
            groupBy = 'group by l.city,u."roleId",r.name'; 
        } else if(userStationType.stationType === '2') {
            values = 'l.state,u."roleId",r.name';
            query = `u."deletedAt" is null and u.status ='ACTIVE'
             and lower(l.state) = lower('${userStationType.stationPrefrence}')`;
            groupBy = 'group by l.state,u."roleId",r.name';
        }
        else{
            values = 'l.country,u."roleId",r.name';
            // eslint-disable-next-line quotes
            query = `u."deletedAt" is null and u.status ='ACTIVE' and l.country ='USA'`;
            groupBy = 'group by l.country,u."roleId",r.name';
        }
        const artistRole = await Roles.findOne({
            where:{
                name:'artist'
            }
        }); 
        const listenerRole = await Roles.findOne({
            where:{
                name:'listener'
            }
        }); 
        const roles = [artistRole.id,listenerRole.id];
        const users = [];
        for await (const role of roles){
            if(role === 2) {
                const artistusers = await runQuery(`
        select count(*),${values} from "Users" u 
        left join "Locations" l 
                on u.id =l."userId" 
       left join "Roles" r
                on u."roleId" = r.id
         where ${query} and u."roleId"=${role}
         ${groupBy}
        `,
                { type:QueryTypes.SELECT});
                if(artistusers.length > 0){
                    users.push(...artistusers);
                }
                else{
                    const key = userStationType.stationType === '1' ? 'city' : 'state';
                    let obj = {
                        count: 0,
                        [key]: userStationType.stationPrefrence,
                        roleId: 2,
                        name:artistRole.name

                    };
                    users.push(obj);
                }
            }
            if(role === 3) {
                const listenerusers = await runQuery(`
        select count(*),${values} from "Users" u 
        left join "Locations" l 
                on u.id =l."userId" 
        left join "Roles" r
               on u."roleId" = r.id
         where ${query} and u."roleId"=${role}
         ${groupBy}
        `,
                { type:QueryTypes.SELECT});
                if(listenerusers.length > 0){
                    users.push(...listenerusers);
                }else{
                    const key = userStationType.stationType === '1' ? 'city' : 'state';
                    let obj = {
                        count: 0,
                        [key]:userStationType.stationPrefrence,
                        roleId: 3,
                        name:listenerRole.name
                    };
                    users.push(obj);
                }
            }
        }
        const count = users.map((user) => user.count);
        const zeroTest = (element) => {
            return element === 0;
        };
        var allZeros = count.every(zeroTest);
        if(allZeros){
            return res.json({users :[]});
        }else{
            return res.json({users});
        }
        // res.json({users});

    }
    catch(error){
        res.status(400).json({error:error.message});
    }
} );



//Events per year in the city state national
Router.get('/events', async(req,res) => {
    try {
        if(!req.user.id) throw new Error('Invalid user id');
        const userStationType = await UserStationPrefrence.findOne({
            where:{
                userId:req.user.id,
                active:true
            }
        });
        if(!userStationType) throw new Error('Invalid station prefrence');
        let query;
        if (userStationType.stationType === '1') {
            query = `e."deletedAt" is null and
             lower(e."cityName") = lower('${userStationType.stationPrefrence}')`;
        } else if(userStationType.stationType === '2') {
            query = `e."deletedAt" is null and
             lower(e."stateName") = lower('${userStationType.stationPrefrence}')`;
        }
        else{
            // eslint-disable-next-line quotes
            query = 'e."deletedAt" is null';
        }
        let events = await runQuery(`
        with months as (SELECT
            DATE_TRUNC('month',e."startTime")
              AS  "monthFormat",
            COUNT(id) AS count
     from "Events" e 
     where ${query}
     GROUP BY DATE_TRUNC('month',e."startTime")) 
     select ms."monthFormat",ms.count AS "count" from months ms`);
        events = events[0];
        for await (const event of events){
            const dates = event.monthFormat.toLocaleString('default', { month: 'short' });
            event.month = dates;
        }
        let eventMonths = events.map((event) => event.month);
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
   
        var today = new Date();
        var date;
        let months =[];
        // var year;
        for(var i = 12; i > 0; i -= 1) {
            date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            let monthsName = monthNames[date.getMonth()];
            // year = d.getFullYear();
            months.push(monthsName);
        }
        let data=[];
        months.forEach(async(month) => {
            const check = eventMonths.includes(month);
            if(check){
                events.map((event)=>{
                    if(event.month === month){
                        data.push(event.count);
                    }
                });
            }
            else{
                data.push(0);
            }
        });
        data = {
            months,
            data
        };

        res.json({data});

    }
    catch(error){
        res.status(400).json({error:error.message});
    }
} );


// Radio stations in state and nation only
Router.get('/radio_stations', async(req,res) => {
    try {
        if(!req.user.id) throw new Error('Invalid user id');
        const userStationType = await UserStationPrefrence.findOne({
            where:{
                userId:req.user.id,
                active:true
            }
        });
        if(!userStationType) throw new Error('Invalid station prefrence');
        let query;
        let select;
        if(userStationType.stationType === '2') {
            query = `and s."promotedSong" ='STATE' and lower(s."stateName") = lower('${userStationType.stationPrefrence}')`;
            select = 'select distinct ps."cityName", count(ps."cityName") from  "popularSongs" ps group by ps."cityName" order by count desc';
        }
        if(userStationType.stationType === '2' || userStationType.stationType === '3'){
            let stations = await runQuery(`
        with "popularSongs" as(
            select count(*) over() "totalCount",count(usl."songId") as "songCount",s.id,
                    s."cityName" ,s."stateName",s.country,s."bandId",s."promotedSong" 
                    from "Songs" s
                    left join "SongGenres" sg on sg."songId" = s.id
                    left join  "Genres" g on sg."genreId" = g.id
                    left join "UserSongListens" usl on usl."songId"= s.id
                    left join "SongBlasts" sb on sb."songId" =s.id
                    left join "Votes" v on v."songId" = s.id and v."type" = 'UPVOTE'
                    left join "Bands" b on b.id = s."bandId"
               where s."deletedAt" is null and s.live is true and b.status='ACTIVE' ${userStationType.stationType === '2' ? `${query}` : ''}
            group by  usl."songId",s.id,b.id 
            order by count(usl."songId") desc
           )
           ${userStationType.stationType === '2' ? `${select}` : 
        'select distinct ps."stateName", count(ps."stateName") from  "popularSongs" ps group by ps."stateName" order by count desc'
}
        `);
            stations = stations[0];
            let data ={};
            data.count = stations.length;
            if(stations.length > 0){
                data.station = userStationType.stationType === '2' ? stations[0].cityName : stations[0].stateName;
            }
            if(data.count === 0){
                data = null;
            }   
            return res.json({data});
        }else{
            return res.json({data:null});
        }
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
} );


//number of bands had events in the city only
Router.get('/bands', async(req,res) => {
    try {
        if(!req.user.id) throw new Error('Invalid user id');
        const userStationType = await UserStationPrefrence.findOne({
            where:{
                userId:req.user.id,
                active:true
            }
        });
        if(!userStationType) throw new Error('Invalid station prefrence');
        if(userStationType.stationType === '1') {
            let eventDates = await runQuery(`with months as (select
            distinct b.id,
            DATE_TRUNC('month',e."startTime")
              AS  "monthCount",
            COUNT(b.id) AS count
           from "Events" e 
           left join "Bands" b on b.id =e."bandId"  
           where lower(e."cityName") = lower('${userStationType.stationPrefrence}') and b.status = 'ACTIVE'
     GROUP BY DATE_TRUNC('month',e."startTime"),b.id), 
     "eventMonths" as (select distinct ms."monthCount",ms.count AS "Month" from months ms)
     select distinct ems."monthCount",ems.count from "eventMonths" ems group by ems."monthCount"`);
            eventDates = eventDates[0];
            for await (const event of eventDates){
                const dates = event.monthCount.toLocaleString('default', { month: 'short' });
                event.month = dates;
            }
            let eventMonths = eventDates.map((event) => event.month);
            const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
   
            var today = new Date();
            var date;
            let months =[];
            // var year;
            for(var i = 6; i > 0; i -= 1) {
                date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                let monthsName = monthNames[date.getMonth()];
                // year = d.getFullYear();
                months.push(monthsName);
            }
            let data=[];
            months.forEach(async(month) => {
                const check = eventMonths.includes(month);
                if(check){
                    eventDates.map((event)=>{
                        if(event.month === month){
                            data.push(event.count);
                        }
                    });
                }
                else{
                    data.push(0);
                }
            });
            data = {
                months,
                data
            };
            res.json({data});
        }
        else{
            return res.json({data:[]});
        }
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
} );



//popular artist in city state national
Router.get('/artist', async(req,res) => {
    try {
        if(!req.user.id) throw new Error('Invalid user id');
        const userStationType = await UserStationPrefrence.findOne({
            where:{
                userId:req.user.id,
                active:true
            }
        });
        if(!userStationType) throw new Error('Invalid station prefrence');
        let query;

        if (userStationType.stationType === '1') {
            query =`s."deletedAt" is null and s.live is true and b.status ='ACTIVE'
            and s."promotedSong" ='CITY' and lower(s."cityName") = lower('${userStationType.stationPrefrence}')`;
           
        } else if (userStationType.stationType === '2') {
            query = ` s."deletedAt" is null and s.live is true and b.status ='ACTIVE'
            and s."promotedSong" ='STATE' and lower(s."stateName") = lower('${userStationType.stationPrefrence}')`;
        }
        else{
            // eslint-disable-next-line quotes
            query = `s."deletedAt" is null and s.live is true and b.status = 'ACTIVE'`;

        }
        let artist = await runQuery(`
        with "upvotes" as (select count(v."songId") as upvote,v."songId"  from "Votes" v 
                            where v."type" ='UPVOTE' group by v."songId"
                          ),
             "blasts" as ( select count(sb."songId")as blast,sb."songId"  from  "SongBlasts" sb 
                            group by sb."songId"
                          )
                          select count(usl."songId") as "songCount",coalesce(upv.upvote,0) as upvotes,coalesce (bs.blast,0)as blast,
                                 s."cityName",s."stateName",
                                 jsonb_build_object('id',b.id,'title',b.title) as band,
                                 u."firstName",u."lastName",u."userName",u.avatar
                                 from "Songs" s 
                                 left join "UserSongListens" usl on usl."songId"= s.id
                                 left join "upvotes" upv on upv."songId" = s.id 
                                left join "blasts" bs on bs."songId"=s.id
                                left join "Bands" b on b.id = s."bandId"
                                left join "SongGenres" sg on sg."songId" =s.id 
                                left join "Genres" g on sg."genreId" =g.id
                                left join "Users" u on u.id =b."createdBy"  
                                where ${query}
                                group by upv.upvote,s.id,bs.blast,b.id,usl."songId",u."firstName",u."lastName",u."userName",u.avatar
                                 order by upvotes desc,blast desc limit 1`);
        artist = artist[0][0];
        artist = !artist ? artist = null : artist;
        res.json({artist});
    

    }
    catch(error){
        res.status(400).json({error:error.message});
    }
} );

// genre prefrence
Router.get('/genres', async(req,res) => {
    try {
        if(!req.user.id) throw new Error('Invalid user id');
        const userStationType = await UserStationPrefrence.findOne({
            where:{
                userId:req.user.id,
                active:true
            }
        });
        if(!userStationType) throw new Error('Invalid station prefrence');
        let query;

        if (userStationType.stationType === '1') {
            query =`s."deletedAt" is null and s.live is true and b.status ='ACTIVE'
            and s."promotedSong" ='CITY' and lower(s."cityName") = lower('${userStationType.stationPrefrence}')`;
           
        } else if (userStationType.stationType === '2') {
            query = ` s."deletedAt" is null and s.live is true and b.status ='ACTIVE'
            and s."promotedSong" ='STATE' and lower(s."stateName") = lower('${userStationType.stationPrefrence}')`;
        }
        else{
            // eslint-disable-next-line quotes
            query = `s."deletedAt" is null and s.live is true and b.status = 'ACTIVE'`;
        }
        let data = await runQuery(`with "genres" as( select g.id genre_id,g."name",count(usl."songId") as "songCount",
        s.id,s.title,s.thumbnail,s.duration,s."cityName",s."stateName",s."createdAt",
        jsonb_build_object('id',b.id,'title',b.title) as band
        from "Songs" s 
        left join "UserSongListens" usl on usl."songId"= s.id 
       left join "Bands" b on b.id = s."bandId"
       left join "SongGenres" sg on sg."songId" =s.id 
       left join "Genres" g on sg."genreId" =g.id
       where ${query}
       group by s.id,b.id,usl."songId",g.id
        ),
   "tt" as (
    select count(*), "name", genre_id from genres gs group by gs.genre_id, gs."name"
   ),
   "pp" as  (
   select *, sum("count") over(), round(("count" * 100) / sum("count") over(), 2)  as "percentage" from tt order by "percentage" desc
   )
   select "genre", sum("percentage") from (
       select 
           case 
               when rn <=5 then "name"
               else 'others'
           end as genre,
           *
       from (
           select *, row_number() over(order by "percentage" desc) as rn from "pp"
       ) sb2
   ) ft group by "genre";`);
        data = data[0];
        if(data.length > 0){
            const getIndex = data.findIndex(x => x.genre === 'others');
            const dataIndex = data.length;
            data.splice(dataIndex, 0, data.splice(getIndex, 1)[0]);
        }
        res.json({data});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
} );


// popular artist per genre
Router.get('/artist_per_genre', async(req,res) => {
    try {
        if(!req.user.id) throw new Error('Invalid user id');
        const userStationType = await UserStationPrefrence.findOne({
            where:{
                userId:req.user.id,
                active:true
            }
        });
        if(!userStationType) throw new Error('Invalid station prefrence');
        let query;

        if (userStationType.stationType === '1') {
            query =`s."deletedAt" is null and s.live is true and b.status ='ACTIVE'
            and s."promotedSong" ='CITY' and lower(s."cityName") = lower('${userStationType.stationPrefrence}')`;
           
        } else if (userStationType.stationType === '2') {
            query = ` s."deletedAt" is null and s.live is true and b.status ='ACTIVE'
            and s."promotedSong" ='STATE' and lower(s."stateName") = lower('${userStationType.stationPrefrence}')`;
        }
        else{
            // eslint-disable-next-line quotes
            query = `s."deletedAt" is null and s.live is true and b.status = 'ACTIVE'`;
        }
        let data =  await runQuery(`
        with "genres" as( select g.id genre_id,g."name",count(usl."songId") as "songCount",
        s.id,s.title,replace(s.song,
           '${config.songUrl.AWS_S3_ENDPOINT}',
           '${config.songUrl.CLOUD_FRONT_ENDPOINT}') as song,s.thumbnail,s.duration,s."cityName",s."stateName",s."createdAt",
        jsonb_build_object('id',b.id,'title',b.title) as band
        from "Songs" s 
        left join "UserSongListens" usl on usl."songId"= s.id 
       left join "Bands" b on b.id = s."bandId"
       left join "SongGenres" sg on sg."songId" =s.id 
       left join "Genres" g on sg."genreId" =g.id
       where ${query}
       group by s.id,b.id,usl."songId",g.id
        ),
   "tt" as (
    select count(*), "name", genre_id from genres gs group by gs.genre_id, gs."name"
   ),
   "pp" as  (
   select *, sum("count") over(), round(("count" * 100) / sum("count") over(), 2)  as "percentage" from tt order by "percentage" desc
   ),   
   "bandSongCountByGenre" as (
   select b.id band_id, count(s.id) as "songCount", sg."genreId" from "Bands" b 
   left join "Songs" s on s."bandId" = b.id and s.live is true
   left join "SongGenres" sg on sg."songId" = s.id
   group by b.id, sg."genreId"
  ),
  "topBands" as (
     select * from (
    select 
    band_id, 
    "genreId",
    "songCount",
    row_number () over(partition by "genreId" order by "songCount" desc) as rn
  from "bandSongCountByGenre"
  ) as x where x.rn < 2
  ),
  "bbc" as (select * from "topBands" where "genreId" in (select "genre_id" from "pp" limit 4)),
   "gnrs" as (select g2.name,band_id,"genreId" ,g2.thumbnail  from "bbc" left join "Genres" g2 on g2.id = "genreId"),
   "bnds" as (select name,band_id,"genreId",b2."createdBy",thumbnail   from "gnrs" left join public."Bands" b2 on b2.id = band_id)
   select name,band_id,"genreId","createdBy", u."userName" as artist,thumbnail  from "bnds" left join "Users" u on "createdBy" = u.id`);
        data = data[0];
        data = data.length > 0 ? data : data = [];
        res.json({data});
        
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
} );
module.exports = Router;