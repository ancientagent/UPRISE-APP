module.exports = {
    up:async(queryInterface)=>{
        const roles = ['admin', 'artist', 'listener','band_owner','band_admin','band_member'].map((role,i) => ({
            id :i+1, 
            name:role,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
        await queryInterface.bulkInsert('Roles', roles,
            {ignoreDuplicates: ['updatedAt']});
    },
    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Roles', null, {});
    },
};
