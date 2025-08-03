'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ArtistProfile extends Model {}

    ArtistProfile.associate = (models) => {
        // One-to-one relationship with User
        ArtistProfile.belongsTo(models.User, { 
            foreignKey: 'userId', 
            as: 'user' 
        });

        // One-to-many relationship with Events (replacing bandId with artistProfileId)
        ArtistProfile.hasMany(models.Events, { 
            foreignKey: 'bandId', // Keep existing foreign key for now
            as: 'events' 
        });

        // One-to-one relationship with BandMembers (replacing bandId with artistProfileId)
        ArtistProfile.hasOne(models.BandMembers, { 
            foreignKey: 'bandId', // Keep existing foreign key for now
            as: 'bandMembers' 
        });
    };

    ArtistProfile.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        cityName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        stateName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        facebook: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        instagram: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        youtube: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        twitter: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        status: {
            type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BLOCKED'),
            defaultValue: 'ACTIVE',
            allowNull: false
        },
        promosEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'ArtistProfile',
        tableName: 'ArtistProfiles',
        timestamps: true,
        indexes: [
            {
                fields: ['userId']
            },
            {
                fields: ['title']
            },
            {
                fields: ['status']
            }
        ]
    });

    // Instance methods
    ArtistProfile.prototype.isActive = function() {
        return this.status === 'ACTIVE';
    };

    ArtistProfile.prototype.canPromote = function() {
        return this.isActive() && this.promosEnabled;
    };

    ArtistProfile.prototype.getSocialLinks = function() {
        const links = {};
        if (this.facebook) links.facebook = this.facebook;
        if (this.instagram) links.instagram = this.instagram;
        if (this.youtube) links.youtube = this.youtube;
        if (this.twitter) links.twitter = this.twitter;
        return links;
    };

    return ArtistProfile;
}; 