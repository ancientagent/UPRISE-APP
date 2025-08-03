/*
  this folder contains re-usable data handling function/methods
*/
const { User, Roles, Band, BandMembers } = require('../database/models/');

const getUserById = async (userId) => {
    if(!userId) throw new Error('Invalid user id');
    const userInfo = await User.findOne({
        paranoid: false,
        where: {
            id: userId,
        },
        attributes: [
            'id',
            'firstName',
            'lastName',
            'userName',
            'email',
            'mobile',
            'gender',
            'avatar',
            'status',
            'onBoardingStatus',
            'about',
            'facebook',
            'instagram',
            'emailVerificationToken',
            'twitter',
            'deletedAt'
        ],
        include: [
            {
                model: Roles,
                as: 'role',
                attributes: ['id', 'name'],
            },
            {
                model: BandMembers,
                as: 'users',
                include: [
                    {
                        model: Band,
                        as: 'band',
                        attributes: ['id', 'title', 'description', 'logo', 'status', 'promosEnabled'],
                    },
                ],
            },
        ],
    });
    if (userInfo === null) throw null;
    
    const userData = userInfo.toJSON();
    
    // Extract band data from BandMembers if it exists
    if (userData.users && userData.users.length > 0 && userData.users[0].band) {
        userData.band = userData.users[0].band;
    }
    
    // Remove the users array since we've extracted the band data
    delete userData.users;
    
    return userData;
};


module.exports = { getUserById };