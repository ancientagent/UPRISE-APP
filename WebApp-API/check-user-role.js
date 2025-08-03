require('dotenv').config();
const { runQuery } = require('./src/utils/dbquery');
const { QueryTypes } = require('sequelize');

async function checkUserRole() {
    console.log('=== CHECKING USER ROLE ===\n');

    try {
        const userRole = await runQuery(`
            SELECT 
                u.id,
                u."userName",
                u.email,
                u."roleId",
                r.name as role_name
            FROM "Users" u
            LEFT JOIN "Roles" r ON r.id = u."roleId"
            WHERE u."userName" = 'thirteen'
        `, { type: QueryTypes.SELECT });

        console.log('User Role:');
        console.log(JSON.stringify(userRole, null, 2));
        console.log('\n');

        if (userRole.length > 0) {
            const user = userRole[0];
            console.log(`User ID: ${user.id}`);
            console.log(`Role ID: ${user.roleId}`);
            console.log(`Role Name: ${user.role_name}`);
            
            // Check if role is in the allowed list
            const allowedRoles = ['admin', 'listener', 'artist'];
            if (allowedRoles.includes(user.role_name?.toLowerCase())) {
                console.log('✅ User role is allowed for radio access');
            } else {
                console.log('❌ User role is NOT allowed for radio access');
                console.log('Allowed roles:', allowedRoles);
                console.log('User role:', user.role_name);
            }
        }

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

checkUserRole().then(() => {
    console.log('\nCheck complete.');
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 