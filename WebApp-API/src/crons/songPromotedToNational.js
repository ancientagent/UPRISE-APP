/* eslint-disable quotes */
const { Songs } = require('../database/models');
const { Op } = require('sequelize');
const { runQuery } = require('../utils/dbquery');
const timeout = parseInt(process.env.UPLOAD_ASSEST_LIBRARY || (6 * 24 * 60 * 60 * 1000), 10);

const promotedSongToNational = async () => {
    try {
        const songsInCity = await runQuery(`select jsonb_agg(distinct s."stateName")as state from "Songs" s where s.live is true and s."deletedAt" is null and s."promotedSong"= 'STATE'`);
        const states = songsInCity[0][0].state;
        for await (const state of states){
            const songs = await Songs.findAll({
                where:{
                    stateName: state,
                    live:true,
                    deletedAt:null,
                    promotedSong: 'STATE',
                    promotedToStateDate:{
                        [Op.lt]: new Date(Date.now() - timeout),
                    },
                }
            });
            if(songs.length > 0){
                const songIds = songs.map((song)=> song.id);
                const promotionSongs = await runQuery(`  
                select count(s.id) as count,s.* from "Songs" s 
                left join "Votes" v on s.id =v."songId"
                left join "UserSongListens" usl on usl."songId" =s.id 
                 where s.id in (${songIds})
                group by s.id order by count desc`);
                if(promotionSongs.length > 0){
                    const song = promotionSongs[0][0];
                    await Songs.update({
                        promotedSong:'NATIONAL',
                        promotedToNationalDate:Date.now()
                    },
                    {
                        where:{
                            id:song.id
                        }
                    });
                }
            }
        }
    }
    catch(error){
        console.log(`error at message`, error);
    }

};
module.exports = { promotedSongToNational };
