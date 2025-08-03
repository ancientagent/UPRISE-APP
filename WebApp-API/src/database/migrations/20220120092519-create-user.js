'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            firstName: Sequelize.STRING,
            lastName: Sequelize.STRING,
            userName : {
                type:Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            mobile: {
                type: Sequelize.STRING,
            },
            gender: {
                type: Sequelize.ENUM,
                values: ['MALE', 'FEMALE', 'PREFER NOT TO SAY'],
            },
            avatar: {
                type: Sequelize.STRING,
            },
            refreshToken: {
                type: Sequelize.STRING,
            },
            roleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            passwordResetToken: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.ENUM,
                values: ['ACTIVE','INACTIVE','BLOCKED'],
                defaultValue:'ACTIVE'
            },
            emailVerificationToken:{
                type:Sequelize.STRING
            },
            onBoardingStatus: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deletedAt: {
                type: Sequelize.DATE,
            },    
        },
        {
            paranoid: true,
        }); 
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('Users');
    },
};
