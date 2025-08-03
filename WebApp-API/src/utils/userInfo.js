// const { UserCityPrefrences} = require('../database/models/');

const { User,UserInstruments,Instruments, UserStationPrefrence} = require('../database/models/');
const { runQuery } = require('../utils/dbquery');
const { QueryTypes } = require('sequelize');




//get user Location
const getUserLocation = async ({userId}) => {
    if(!userId) throw new Error('Invalid user id');
    const userPrefrenceLocation = await UserStationPrefrence.findOne({
        where:{
            userId,
            active: true
        }
    });
    return userPrefrenceLocation !== null ? userPrefrenceLocation.stationPrefrence : null;
};

//get user StationType
const getUserStationType = async ({userId}) => {
    if(!userId) throw new Error('Invalid user id');
    const userPrefrenceLocation = await UserStationPrefrence.findOne({
        where:{
            userId,
            active: true
        }
    });
    return userPrefrenceLocation !== null ? userPrefrenceLocation.stationType : null;
};

//get user stations by city
const getUserSwitchStationsByCity = async ({userId}) => {
    if(!userId) throw new Error('Invalid user id');
    const userPrefrenceLocation = await UserStationPrefrence.findOne({
        where:{
            userId,
            stationType:'1' //city
        },
    });
    return userPrefrenceLocation !== null ? userPrefrenceLocation.stationPrefrence : null;
};

//get user stations by State
const getUserSwitchStationsByState = async ({userId}) => {
    if(!userId) throw new Error('Invalid user id');
    const userPrefrenceLocation = await UserStationPrefrence.findOne({
        where:{
            userId,
            stationType:'2' //state
        },
    });
    return userPrefrenceLocation !== null ? userPrefrenceLocation.stationPrefrence : null;
};

//get user genres
const getUserGenres = async ({userId}) => {
    if(!userId) throw new Error('Invalid user id');
    const userGenres = await runQuery(`select g.id ,g."name"  
        from "UserGenrePrefrences" ugp 
        left join "Genres" g 
        on ugp ."genreId" = g.id
        where ugp ."userId" = :userId;`,
    { type:QueryTypes.SELECT, replacements: { userId: userId} });
    if(userGenres.length > 0){
        return userGenres;
    }
    return null;
};

//get user followers
const getUserFollowing = async ({userId}) => {
    if(!userId) throw new Error('Invalid user id');
    const userFollowing = await runQuery(` 
    select  count(*) over() "totalCount",
    case when uf."followeeId" is not null then true else false end as "amiFollowing",
           uf."followeeId" "userId",
           u."userName",u.avatar
from "UserFollows" uf  left join "Users" u on  u.id = uf."followeeId"
where uf."followerId" = :userId
 group by uf."followeeId",u."userName",u.avatar  ; `,
    { type:QueryTypes.SELECT, replacements: { userId: userId}});
    if(userFollowing.length > 0) {
        return userFollowing;
    }
    return 0;
};

//get user following
const getUserFollowers = async ({userId}) => {
    if(!userId) throw new Error('Invalid user id');
    const userFollowers = await runQuery(`
    select  count(*) over() "totalCount",
    case when uf."followerId" is not null then true else false end as "amiFollowing",   
              uf."followerId" "userId",
                u."userName",u.avatar
from "UserFollows" uf  left join "Users" u on  u.id = uf."followerId"
where uf."followeeId" = :userId
    group by uf."followerId",u."userName",u.avatar  ; `,
    { type:QueryTypes.SELECT, replacements: { userId: userId}});
    if(userFollowers.length > 0) {
        return userFollowers;
        //return userFollowers[0].totalCount;
    }
    return 0;
};

//user band follows
const getUserfollowingBands = async(userId) => {
    const user = await User.findOne({
        where:{
            id:userId
        }
    });
    if(!user) throw new Error('user not found');
    const getbands = await runQuery(`select  count(*) over() "totalCount",
    case when ubf."bandId"  is not null then true else false end as "amiFollowing",
     b.id "bandId",b.title,b.logo,
     jsonb_build_object('id',r.id,'name',r."name") as role
    from "Bands" b  left join "UserBandFollows" ubf on b.id = ubf."bandId" 
    left join "Users" u on u.id = b."createdBy"
    left join "Roles" r on r.id = u."roleId"
    where ubf."userId" = :userId`,
    { type:QueryTypes.SELECT,replacements:{ userId: userId}});

    return getbands;
};
//band-follwers-Users 
const bandFollowersUsers = async({bandId}) => {
    const bandFollowers = await runQuery(`
                        select  count(*) over() "totalCount",
                        case when ubf."bandId"  is not null then true else false end as "amiFollowing",
                        u.id "userId" 
              from "UserBandFollows" ubf left join "Users" u 
              on u.id = ubf."userId" 
              where ubf."bandId" = :bandId
              group by u.id,ubf."bandId"  ;`,
    { type:QueryTypes.SELECT, replacements: { bandId}});
    if(bandFollowers.length > 0){
        return bandFollowers;
    }
    return 0;

};
//get instruments list
const getUserInstruments =  async({userId}) => {
    const userInstruments = await UserInstruments.findAll({
        where:{
            userId
        },
    });
    const userInstrumentIds = userInstruments.map((userInstrument) => userInstrument.instrumentId );
    const instruments = await Instruments.findAll({
        where:{
            id:userInstrumentIds
        },
        attributes:['id','name','url']
    });
    return instruments;

};
module.exports = { getUserLocation,
    getUserGenres,
    getUserFollowing,
    getUserFollowers,
    bandFollowersUsers,
    getUserfollowingBands,
    getUserInstruments,
    getUserStationType,
    getUserSwitchStationsByCity,
    getUserSwitchStationsByState
    //getUserPrefrenceCity
};