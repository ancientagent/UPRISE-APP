const Router = require('express').Router();
const config = require('../config/index');

const { runQuery } = require('../utils/dbquery');
const { QueryTypes, sequelize } = require('sequelize');
const { db } = require('../database/models');


//get all genres
Router.get('/all_genres',async(req,res) => {
    try{
        const genres = await db.query(`SELECT id, name, thumbnail FROM "Genres" WHERE "deletedAt" IS NULL ORDER BY name ASC`, { type: QueryTypes.SELECT });
        res.json({data: { genres } });
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//get popular bands based by upvotes and blasts
Router.get('/most_popular_bands',async(req,res) => {
    try{
        let { currentPage = 1, perPage = 20 } = req.query;
        const bands = await runQuery(`
        with "upvotes" as (
                            select count(v."songId") as upvote,v."songId"  from "Votes" v 
                            where v."type" ='UPVOTE' group by v."songId"
                          ),
             "blasts" as ( 
                           select count(sb."songId")as blast,sb."songId"  from  "SongBlasts" sb 
                           group by sb."songId"
                         ),
        "songsWithAlbumInfo" as (
                           select s."albumId",s."bandId",s.id,
                          coalesce(upv.upvote,0) as upvotes,coalesce (bs.blast,0) as blast,
                          case when(
                                    jsonb_strip_nulls(
                                    jsonb_build_object('id',a.id ,'title',a.title))
                                    )::json::text != '{}'::json::text then(
                                    jsonb_strip_nulls(
                                    jsonb_build_object('id',a.id ,'title',a.title)))
                                else null end as album
                          from "Songs" s 
                          left join "upvotes" upv on upv."songId" = s.id 
                          left join "blasts" bs on bs."songId"=s.id
                          left join "Bands" b on b.id = s."bandId"
                          left join  "Albums" a on a.id = s."albumId"
                          where s."deletedAt" is null and s.live is true and b.status ='ACTIVE'
                        ),

         "albumsInfo" as (
                          select  swa."bandId", sum(swa.upvotes) as upvotes, sum(swa.blast) as blasts
                          from "songsWithAlbumInfo" as swa
                          group by  swa."bandId"
                          )
                     select count(*) over() as "totalCount", 
                     case when ubf."bandId"  is not null then true else false end as "amiFollowingBand",
                     ai.upvotes,ai.blasts,b.id,b.title,b.logo  from "albumsInfo" ai 
                            left join "Bands" b on b.id =ai."bandId" 
                            left join "UserBandFollows" ubf on b.id = ubf."bandId" and ubf."userId" =${req.user.id}
                            where b.status ='ACTIVE'
                            order by ai.upvotes desc,ai.blasts desc 
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

//Trending songs
Router.get('/trending_songs',async(req,res) => {
    try{
        let {currentPage = 1, perPage = 20 } = req.query;
        const trendingSongs = await runQuery(`
        with "upvotes" as (select count(v."songId") as upvote,v."songId"  from "Votes" v 
                           where v."type" ='UPVOTE' group by v."songId"
                  ),
              "blasts" as ( select count(sb."songId")as blast,sb."songId"  from  "SongBlasts" sb 
                             group by sb."songId"
                            )
                         select count(*) over() "totalCount",
                         coalesce(upv.upvote,0) as upvotes,coalesce (bs.blast,0)as blast,
                         case when sf."userId"  is not null then true else false end as "isSongFavorite",
                                s.id,s.title,replace(s.song,
                                    '${config.songUrl.AWS_S3_ENDPOINT}',
                                    '${config.songUrl.CLOUD_FRONT_ENDPOINT}') as song,s.thumbnail,s.duration,s."cityName",s."stateName",
                                jsonb_build_object('id',b.id,'title',b.title) as band,
                          case when(
                               jsonb_strip_nulls(
                                     jsonb_build_object('id',a.id ,'title',a.title))
                                    )::json::text != '{}'::json::text then(
                               jsonb_strip_nulls(
                                      jsonb_build_object('id',a.id ,'title',a.title)))
                                else null end as album
                          from "Songs" s left join "upvotes" upv on upv."songId" = s.id 
                          left join "blasts" bs on bs."songId"=s.id
                          left join "Bands" b on b.id = s."bandId"
                          left join  "Albums" a on a.id = s."albumId"
                          left join "SongFavorites" sf on s.id = sf."songId" and sf."userId"=${req.user.id}
                          where s."deletedAt" is null and b.status='ACTIVE' and s.live is true
                          group by upv.upvote,s.id,bs.blast,b.id,a.id,sf."userId"
                          order by upvotes desc,blast desc
                          offset ${perPage === 'all' ? 0:`${(currentPage-1)*perPage}`} limit ${perPage}
        `,{ type:QueryTypes.SELECT});
        perPage === 'all'?perPage = trendingSongs[0].totalCount:perPage;
        const totalPages = trendingSongs.length > 0 ? Math.ceil(trendingSongs[0].totalCount/perPage) : 0;
        const data = {
            trendingSongs,
            metadata: {
                currentPage: parseInt(currentPage),
                perPage: parseInt(perPage),
                totalPages,
            }
        };
        res.json({data});

    }
    catch(error){
        res.status(400).json({error:error.message});
    }

});

//most popular albums by upvotes and blasts
Router.get('/most_popular_albums',async(req,res) => {
    try{
        let { currentPage = 1, perPage = 20 } = req.query;
        const albums = await runQuery(`
        
  with "upvotes" as (select count(v."songId") as upvote,v."songId"  from "Votes" v 
  where v."type" ='UPVOTE' group by v."songId"
),
"blasts" as ( select count(sb."songId")as blast,sb."songId"  from  "SongBlasts" sb 
    group by sb."songId"
   ),
"songsWithAlbumInfo" as (
                    select s."albumId",s."bandId",s.id,
                    coalesce(upv.upvote,0) as upvotes,coalesce (bs.blast,0) as blast,
                   case when(
                          jsonb_strip_nulls(
                               jsonb_build_object('id',a.id ,'title',a.title))
                                       )::json::text != '{}'::json::text then(
                                jsonb_strip_nulls(
                                 jsonb_build_object('id',a.id ,'title',a.title)))
                    else null end as album
                   from "Songs" s 
                   left join "upvotes" upv on upv."songId" = s.id 
                   left join "blasts" bs on bs."songId"=s.id
                   left join "Bands" b on b.id = s."bandId"
                   left join  "Albums" a on a.id = s."albumId"
                   where s."deletedAt" is null and a.id is not null and s.live is true
                    ),
"albumsInfo" as ( 
                 select swa."albumId", swa."bandId", sum(swa.upvotes) as upvotes, sum(swa.blast) as blasts
                 from "songsWithAlbumInfo" as swa
                 group by swa."albumId", swa."bandId"
                )
              select count(*) over() as "totalCount",ai."bandId",ai.upvotes,ai.blasts,a.id,a.title,a.thumbnail,a.live,
              jsonb_build_object('id',b.id,'title',b.title)as band
              from "albumsInfo" ai 
              left join "Albums" a on a.id =ai."albumId"
              left join "Bands" b on b.id =ai."bandId"
              where a.live is true and a."deletedAt" is null and b.status='ACTIVE'
              order by ai.upvotes desc,ai.blasts desc 
              offset ${perPage === 'all' ? 0:`${(currentPage-1)*perPage}`} limit ${perPage} ;`,
        { type:QueryTypes.SELECT} );
        const data = {
            albums,
        };
        if(albums.length > 0){
            perPage === 'all'?perPage = albums[0].totalCount:perPage;
            const totalPages = albums.length > 0 ? Math.ceil(albums[0].totalCount/perPage) : 0;
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


//most popular genres by upvotes and blasts
Router.get('/most_popular_genres',async(req,res) => {
    try{
        let { currentPage = 1, perPage = 20 } = req.query;
        const genres = await runQuery(`
        with "upvotes" as (
                           select count(v."songId") as upvote,v."songId"  from "Votes" v 
                           where v."type" ='UPVOTE' group by v."songId"
                          ),
            "blasts" as ( 
                         select count(sb."songId")as blast,sb."songId"  from  "SongBlasts" sb 
                         group by sb."songId"
                        ),
           "songsInfo" as (
                           select s."bandId",s.id,
                           coalesce(upv.upvote,0) as upvotes,coalesce (bs.blast,0) as blast
                           from "Songs" s 
                           left join "upvotes" upv on upv."songId" = s.id
                           left join "blasts" bs on bs."songId"=s.id
                           left join "Bands" b on b.id = s."bandId"
                           left join  "Albums" a on a.id = s."albumId"
                           where s."deletedAt" is null and b.status = 'ACTIVE' and s.live is true
                           order by upvotes desc,blast desc
                           ),
 
            "genresList" as (
                          select distinct sg."genreId",g."name",g.thumbnail from   "songsInfo" si
                          left join "SongGenres" sg on sg."songId" = si.id
                          left join "Genres" g on g.id = sg."genreId"
                          ),
            "genres" as (
                         select  gl."genreId" as id,gl.name,gl.thumbnail  from "genresList" as gl
                         )
            select  count(*) over() as "totalCount" ,count(sg2."songId")as "songCount",gs.* from "genres"gs 
            left join "SongGenres" sg2 on sg2."genreId"=gs.id
            group by gs.id,gs."name",gs.thumbnail 
                offset ${perPage === 'all' ? 0:`${(currentPage-1)*perPage}`} limit ${perPage} ;`,
        { type:QueryTypes.SELECT} );
        const data = {
            genres,
        };
        if(genres.length > 0){
            perPage === 'all'?perPage = genres[0].totalCount:perPage;
            const totalPages = genres.length > 0 ? Math.ceil(genres[0].totalCount/perPage) : 0;
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


//get songs by genre
Router.get('/songs_by_genre/:id',async(req,res) => {
    if(!req.params.id) throw new Error('Invalid genre id');
    try{
        const genres = await runQuery(`
        select  count(*) over() as "totalCount",case when sf."userId"  is not null then true else false end as "isSongFavorite",
                s.id,s.title,replace(s.song,
                    '${config.songUrl.AWS_S3_ENDPOINT}',
                    '${config.songUrl.CLOUD_FRONT_ENDPOINT}') as song,s.thumbnail,s.duration,s."cityName",s."stateName",s.live,
                jsonb_build_object('id',a.id,'title',a.title)as album,
                jsonb_build_object('id',b.id,'title',b.title)as band 
                from "Songs" s 
                left join "SongGenres" sg on sg."songId" = s.id 
                left join "Bands" b on b.id =s."bandId" 
                left join "Albums" a on a.id =s."albumId"
                left join "SongFavorites" sf on s.id = sf."songId" and sf."userId"=:userId
               where b.status ='ACTIVE' and sg."genreId" = :genreId and s."deletedAt" is null and s.live is true`,
        { replacements: { genreId: req.params.id,userId:req.user.id }, type:QueryTypes.SELECT} );
        res.json({genres});
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
);


module.exports = Router;