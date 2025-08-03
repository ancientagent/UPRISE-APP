'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('SongSkips', {
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
            skipTime: {
                type: Sequelize.FLOAT,
                allowNull: false,
                comment: 'Time in seconds when song was skipped'
            },
            songDuration: {
                type: Sequelize.FLOAT,
                allowNull: false,
                comment: 'Total duration of the song in seconds'
            },
            skipPercentage: {
                type: Sequelize.FLOAT,
                allowNull: false,
                comment: 'Percentage of song completed before skip'
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
        await queryInterface.addIndex('SongSkips', ['songId', 'tier'], {
            name: 'song_tier_skips_index'
        });

        await queryInterface.addIndex('SongSkips', ['userId', 'tier'], {
            name: 'user_tier_skips_index'
        });

        await queryInterface.addIndex('SongSkips', ['skipPercentage'], {
            name: 'skip_percentage_index'
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('SongSkips');
    }
}; 