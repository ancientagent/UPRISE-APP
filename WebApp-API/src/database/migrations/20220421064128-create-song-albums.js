'use strict';
module.exports = { 
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('SongAlbums', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            songId: {
                type: Sequelize.INTEGER
            },
            albumId:{
                type:Sequelize.INTEGER
            },
            bandId:{
                type:Sequelize.INTEGER
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
    },
    async down(queryInterface) {
        await queryInterface.dropTable('SongAlbums');
    }
};