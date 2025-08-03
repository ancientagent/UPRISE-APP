const { UserRadioQueue, UserStationPrefrence } = require('../database/models');
const { runQuery } = require('../utils/dbquery');
const { QueryTypes } = require('sequelize');


const getNextRadioSong = async ({genres,station,userId}) => {
    if(!station) throw Error('station is required');
    const queue = await UserRadioQueue.findOne({
        where:{
            userId:userId,
        }
    });
    if(queue) {
        const song = await runQuery(`
      select * from "UserRadioQueues" urq where urq."userId"=:userId limit 1`,
        {type: QueryTypes.SELECT,replacements: { userId: userId}});
        return song;
    }
    if(!queue) {
        const userStationType = await UserStationPrefrence.findOne({
            where:{
                userId,
                active:true
            }
        });
        if(!userStationType) throw new Error('Invalid station prefrence');
        let query;
        if (userStationType.stationType === '1') {
            query = `lower(s."cityName") = lower('${station}')
            and s."deletedAt" is null and s.live = true and
            s."promotedSong" = 'CITY' and b.status='ACTIVE'`;
        } else if(userStationType.stationType === '2') {
            query = `lower(s."stateName") = lower('${station}')
            and s."deletedAt" is null and s.live = true
            and b.status='ACTIVE' and s."promotedSong" = 'STATE'`;
        }
        else{
            query = `s."deletedAt" is null and s.live = true
            and b.status='ACTIVE' and s."promotedSong" = 'NATIONAL'`;
        }
        const songs = await runQuery(`
    with "songsByCity" as (
                       select  s.* from "Songs" s left join "Bands" b on b.id =s."bandId" 
                       where ${query}
                            ),  
"songByGenres" as ( 
                       select sbc.* from  "songsByCity" sbc 
                       left join "SongGenres" sg 
                       on sbc.id = sg."songId" 
                       where sg."genreId" in (:genres) 
                  ),
"songsByUserPreferences" as (
                       select distinct * from "songByGenres"
                    ), 
"songsWithListenCount" as (
                        select 
                        sbup.id,count(usl."songId") as "listenCount"
                        from  "songsByUserPreferences" sbup
                        left join "UserSongListens" usl
                        on sbup.id = usl."songId"
                        group by sbup.id
     ),
"songsWithUserListenCount" as (
                        select swls.id,count(usl2."userId") as "userListenCount"  from "songsWithListenCount" swls 
                        left join "UserSongListens" usl2
                        on usl2."songId"=swls.id
                        where usl2."userId"=:userId
                        group by usl2."userId",swls.id
                       ), 
"orderByListenCount" as(
                        select swlc.id, swlc."listenCount", coalesce(swuls."userListenCount",0) as "userListenCount"
                        from "songsWithListenCount" swlc 
                        left join "songsWithUserListenCount" swuls on swuls.id=swlc.id 
                        order by swlc."listenCount"
                      ),
"userSongWithTimeStamp" as (
                        select usl."songId" ,usl."userId",coalesce(max(usl."createdAt"), DATE '0001-01-01') as "lastListenTimeStamp" from "UserSongListens" usl
                        where usl."userId"=:userId
                        group by usl."songId",usl."userId"
                        ),
"orderByCreatedBy" as (
                       select *,coalesce(uswts."lastListenTimeStamp", DATE '0001-01-01') as "timeStamp" from "orderByListenCount" as oblc 
                       left join "userSongWithTimeStamp" uswts on uswts."songId"=oblc.id
                       order by oblc."userListenCount" asc,oblc."listenCount" asc
                      )
               select * from "orderByCreatedBy" obcb order by obcb."timeStamp" asc limit 10

`,
        {type: QueryTypes.SELECT,replacements: { genres: genres, userId: userId, station}});
        if(songs.length > 0) {
            for await (const songId of songs) {
                await UserRadioQueue.create({
                    userId: userId,
                    songId: songId.id,
                });
            }
        }
        const song = await runQuery(`
        select * from "UserRadioQueues" urq where urq."userId"=:userId limit 1
        `,
        {type: QueryTypes.SELECT,replacements: { userId: userId}});
        
        return song;
   
    }

};


module.exports = { getNextRadioSong };