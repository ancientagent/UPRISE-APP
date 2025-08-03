'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('SongPriority', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            songId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            tier: {
                type: Sequelize.ENUM,
                values: ['CITYWIDE', 'STATEWIDE', 'NATIONAL'],
                allowNull: false,
                defaultValue: 'CITYWIDE'
            },
            timeBasedPriority: {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 1.0,
                comment: 'Priority based on upload time (higher for older songs)'
            },
            communityPriority: {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 0.0,
                comment: 'Priority based on community engagement scores'
            },
            finalPriority: {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 1.0,
                comment: 'Final priority score (percentage of plays per hour)'
            },
            communityThresholdReached: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                comment: 'Whether enough users have heard the song 2-3 times'
            },
            totalUsersHeard: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: 'Total number of unique users who have heard this song'
            },
            requiredUsersThreshold: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: 'Number of users required before switching to community priority'
            },
            lastCalculated: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Add indexes
        await queryInterface.addIndex('SongPriority', ['songId', 'tier'], {
            unique: true,
            name: 'unique_song_tier_priority'
        });

        await queryInterface.addIndex('SongPriority', ['tier', 'finalPriority'], {
            name: 'tier_priority_index'
        });

        await queryInterface.addIndex('SongPriority', ['communityThresholdReached'], {
            name: 'community_threshold_index'
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('SongPriority');
    }
}; 