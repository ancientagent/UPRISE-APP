'use strict';
module.exports = { async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BandGalleries', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        bandId: {
            type: Sequelize.STRING
        },
        mediaURL:{
            type: Sequelize.STRING
        },
        mediaType:{
            type: Sequelize.STRING
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
    await queryInterface.dropTable('BandGalleries');
}
};