'use strict';
const { Model } = require('sequelize');
const {
    generateAccessToken,
    generateRefreshToken,
} = require('../../utils/jwttokens');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {}

    User.associate = (models) => {
        User.hasOne(models.Roles, {
            foreignKey: 'id',
            sourceKey: 'roleId',
            as: 'role',
        });
        User.hasMany(models.Songs, { foreignKey: 'uploadedBy', as: 'songs' });
        User.hasMany(models.BandMembers,{foreignKey:'userId',as:'users'});
        // One-to-one relationship with ArtistProfile
        User.hasOne(models.ArtistProfile, { 
            foreignKey: 'userId', 
            as: 'artistProfile' 
        });
        //User.hasMany(models.Band,{ foreignKey: 'createdBy', as:'bandDetails'});
    };

    User.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            userName : {
                type:DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            mobile: {
                type: DataTypes.STRING,
            },
            gender: {
                type: DataTypes.ENUM,
                values: ['MALE', 'FEMALE', 'PREFER NOT TO SAY'],
            },
            avatar: {
                type: DataTypes.STRING,
            },
            refreshToken: {
                type: DataTypes.STRING,
            },
            emailVerificationToken: {
                type: DataTypes.STRING
            },
            passwordResetToken: {
                type: DataTypes.STRING,
            },
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM,
                values: ['ACTIVE','INACTIVE','BLOCKED'],
                defaultValue:'ACTIVE'
            },
            onBoardingStatus: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            about: {
                type: DataTypes.STRING,
            },
            facebook: {
                type: DataTypes.STRING,
            },
            twitter: {
                type: DataTypes.STRING,
            },
            instagram: {
                type: DataTypes.STRING,
            },
            fcmToken: {
                type: DataTypes.STRING,
            },
            lastRadioRequestTimestamp: {
                type: DataTypes.DATE,
            },
            createdAt: {   
                type: DataTypes.DATE,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
        },  
        {
            sequelize,
            modelName: 'User',
            paranoid: true,
        });

    User.prototype.generateAccessToken = function () {
        const payload = {
            id: this.id,
            email: this.email,
        };
        return generateAccessToken(payload);
    };

    User.prototype.generateRefreshToken = function () {
        const payload = {
            id: this.id,
            email: this.email,
        };
        return generateRefreshToken(payload);
    }; 
    
    // User.prototype.getLoginInfo = function() {
    //     const loginInfo = {
    //         id: this.id,
    //         firstName:this.firstName,
    //         lastName:this.lastName,
    //         email:this.email,
    //         mobile:this.mobile,
    //         gender:this.gender,
    //         avatar:this.avatar,
    //         status:this.status,
    //         role: {
    //             id: this.role.id,
    //             name: this.role.name,
    //         },
    //     };
    //     return loginInfo;
    // };

    return User;
};
