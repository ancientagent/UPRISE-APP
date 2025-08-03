'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('SongLikes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false
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
            status: {
                type: Sequelize.ENUM,
                values: ['LIKE', 'NEUTRAL', 'DISLIKE'],
                allowNull: false,
                defaultValue: 'NEUTRAL'
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
        await queryInterface.addIndex('SongLikes', ['userId', 'songId', 'tier'], {
            unique: true,
            name: 'unique_user_song_tier_like'
        });

        await queryInterface.addIndex('SongLikes', ['songId', 'tier'], {
            name: 'song_tier_likes_index'
        });

        await queryInterface.addIndex('SongLikes', ['userId', 'tier'], {
            name: 'user_tier_likes_index'
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('SongLikes');
    }
}; 