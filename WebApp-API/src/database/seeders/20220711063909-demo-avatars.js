'use strict';

module.exports = { 
    up:async(queryInterface)=> {
        const avatarRecords = [
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_4.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_3.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_2.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_10.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_1.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_5.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_6.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_7.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_8.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_9.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_11.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_12.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_13.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_14.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_15.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_16.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_17.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_18.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_19.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_20.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_21.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_22.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_23.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_24.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_25.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_26.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_27.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_28.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_29.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_30.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_31.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_32.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_33.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_34.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_35.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_36.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_37.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_38.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_39.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_40.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_41.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_42.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_43.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_44.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_45.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_46.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_47.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_48.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_49.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_50.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_51.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_52.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_53.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_54.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_55.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_56.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_57.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_58.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_59.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_60.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_61.png',
            'https://ur-stage.s3.amazonaws.com/avatars/avatar_62.png',
        ].map((url,i) => {
            // (id, url, created, updated);
            return `(${i+1}, '${url}', now(), now())`;
        }).join(',');
        const query = ` insert into avatars values ${avatarRecords}
        on conflict(id) 
        do update 
        set url= excluded.url, "updatedAt" = excluded."updatedAt";
        `;
        await queryInterface.sequelize.query(query);
    },
  
    down: async (queryInterface) => {
        await queryInterface.bulkDelete('avatars', null, {});
    },
    // async down (queryInterface, Sequelize) {
    // /**
    //  * Add commands to revert seed here.
    //  *
    //  * Example:
    //  * await queryInterface.bulkDelete('People', null, {});
    //  */
    //     await queryInterface.bulkDelete('Roles', null, {});
    // }
};
