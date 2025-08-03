'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('🎨 Creating ArtistProfiles table and migrating Bands data...');
    
    try {
      // 1. Create the new ArtistProfiles table
      await queryInterface.createTable('ArtistProfiles', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false
        },
        description: {
          type: Sequelize.STRING
        },
        logo: {
          type: Sequelize.STRING
        },
        facebook: {
          type: Sequelize.STRING
        },
        instagram: {
          type: Sequelize.STRING
        },
        youtube: {
          type: Sequelize.STRING
        },
        twitter: {
          type: Sequelize.STRING
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        status: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'BLOCKED'),
          defaultValue: 'ACTIVE'
        },
        promosEnabled: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
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

      console.log('✅ ArtistProfiles table created successfully');

      // 2. Migrate existing data from Bands table to ArtistProfiles table
      await queryInterface.sequelize.query(`
        INSERT INTO "ArtistProfiles" (
          "title", 
          "description", 
          "logo", 
          "facebook", 
          "instagram", 
          "youtube", 
          "twitter", 
          "userId", 
          "status", 
          "promosEnabled", 
          "createdAt", 
          "updatedAt"
        )
        SELECT 
          "title",
          "description",
          "logo",
          "facebook",
          "instagram",
          "youtube",
          "twitter",
          "createdBy" as "userId",
          "status"::text::"enum_ArtistProfiles_status",
          "promosEnabled",
          "createdAt",
          "updatedAt"
        FROM "Bands"
        WHERE "createdBy" IS NOT NULL
      `);

      console.log('✅ Data migrated from Bands to ArtistProfiles successfully');

      // 3. Add indexes for better performance
      await queryInterface.addIndex('ArtistProfiles', ['userId']);
      await queryInterface.addIndex('ArtistProfiles', ['title']);
      await queryInterface.addIndex('ArtistProfiles', ['status']);

      console.log('✅ Indexes added to ArtistProfiles table');

      // 4. Log migration statistics
      const [migratedCount] = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM "ArtistProfiles"',
        { type: Sequelize.QueryTypes.SELECT }
      );

      console.log(`📊 Migration completed: ${migratedCount.count} artist profiles created`);

    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log('🔄 Rolling back ArtistProfiles migration...');
    
    try {
      // Drop the ArtistProfiles table
      await queryInterface.dropTable('ArtistProfiles');
      console.log('✅ ArtistProfiles table dropped successfully');
    } catch (error) {
      console.error('❌ Rollback failed:', error);
      throw error;
    }
  }
}; 