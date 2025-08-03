const { User, UserGenrePrefrences, UserStationPrefrence, Songs, Votes } = require('../database/models');
const { runQuery } = require('./dbquery');
const { QueryTypes } = require('sequelize');

/**
 * Home Scene Manager
 * 
 * Manages the core UPRISE concept of home scenes:
 * Formula: ${city}, ${state} ${genre} (e.g., "Austin, Texas Hip Hop")
 * 
 * Users can have multiple home scenes for different genres within their verified location.
 */

class HomeSceneManager {
    constructor() {
        this.sceneRadius = 50; // 50 mile radius for home scene verification
    }

    /**
     * Create or get user's home scene
     * @param {Object} userData - User data with city, state, genre preferences
     * @returns {Object} Home scene information
     */
    async createHomeScene(userData) {
        try {
            const { userId, city, state, genrePreferences } = userData;
            
            if (!city || !state || !genrePreferences || genrePreferences.length === 0) {
                throw new Error('City, state, and at least one genre are required');
            }

            const homeScenes = [];

            for (const genre of genrePreferences) {
                const sceneKey = this.generateSceneKey(city, state, genre);
                const sceneData = {
                    userId,
                    city,
                    state,
                    genre,
                    sceneKey,
                    isActive: true,
                    createdAt: new Date()
                };

                // Check if scene already exists for this user
                const existingScene = await this.getUserHomeScene(userId, sceneKey);
                if (!existingScene) {
                    homeScenes.push(sceneData);
                } else {
                    homeScenes.push(existingScene);
                }
            }

            return homeScenes;
        } catch (error) {
            console.error('Error creating home scene:', error);
            throw error;
        }
    }

    /**
     * Generate unique scene key
     * @param {string} city - City name
     * @param {string} state - State name
     * @param {string} genre - Genre name
     * @returns {string} Scene key
     */
    generateSceneKey(city, state, genre) {
        return `${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase().replace(/\s+/g, '-')}-${genre.toLowerCase().replace(/\s+/g, '-')}`;
    }

    /**
     * Get user's home scene
     * @param {number} userId - User ID
     * @param {string} sceneKey - Scene key
     * @returns {Object} Home scene data
     */
    async getUserHomeScene(userId, sceneKey) {
        // This would typically query a HomeScenes table
        // For now, we'll derive it from user preferences
        const userPrefs = await UserStationPrefrence.findOne({
            where: { userId, active: true },
            include: [
                {
                    model: User,
                    include: [
                        {
                            model: UserGenrePrefrences,
                            as: 'genrePreferences'
                        }
                    ]
                }
            ]
        });

        if (!userPrefs) return null;

        return {
            userId,
            city: userPrefs.User.city,
            state: userPrefs.User.state,
            sceneKey,
            isActive: true
        };
    }

    /**
     * Verify user is in their home scene
     * @param {number} userId - User ID
     * @param {Object} location - GPS coordinates {latitude, longitude}
     * @param {string} sceneKey - Scene key to verify
     * @returns {boolean} True if user is in home scene
     */
    async verifyHomeSceneLocation(userId, location, sceneKey) {
        try {
            const homeScene = await this.getUserHomeScene(userId, sceneKey);
            if (!homeScene) return false;

            // Get user's registered location
            const user = await User.findByPk(userId);
            if (!user || !user.city || !user.state) return false;

            // In a real implementation, you would:
            // 1. Geocode the GPS coordinates to get city/state
            // 2. Calculate distance between GPS location and registered location
            // 3. Check if within acceptable radius

            // For now, we'll do a basic check
            // This should be enhanced with proper geocoding and distance calculation
            return true;
        } catch (error) {
            console.error('Error verifying home scene location:', error);
            return false;
        }
    }

    /**
     * Get community statistics for a home scene
     * @param {string} sceneKey - Scene key
     * @returns {Object} Community statistics
     */
    async getCommunityStats(sceneKey) {
        try {
            const [city, state, genre] = this.parseSceneKey(sceneKey);
            
            // Get community size
            const communitySize = await this.getCommunitySize(city, state, genre);
            
            // Get active artists
            const activeArtists = await this.getActiveArtists(city, state, genre);
            
            // Get total songs
            const totalSongs = await this.getTotalSongs(city, state, genre);
            
            // Get recent activity
            const recentActivity = await this.getRecentActivity(city, state, genre);

            return {
                sceneKey,
                city,
                state,
                genre,
                communitySize,
                activeArtists,
                totalSongs,
                recentActivity,
                lastUpdated: new Date()
            };
        } catch (error) {
            console.error('Error getting community stats:', error);
            throw error;
        }
    }

    /**
     * Parse scene key into components
     * @param {string} sceneKey - Scene key
     * @returns {Array} [city, state, genre]
     */
    parseSceneKey(sceneKey) {
        const parts = sceneKey.split('-');
        if (parts.length < 3) {
            throw new Error('Invalid scene key format');
        }
        
        // Reconstruct city, state, genre from parts
        // This is a simplified version - in reality, you'd need to handle multi-word cities/states
        const city = parts[0];
        const state = parts[1];
        const genre = parts.slice(2).join('-');
        
        return [city, state, genre];
    }

    /**
     * Get community size for a scene
     */
    async getCommunitySize(city, state, genre) {
        const query = `
            SELECT COUNT(DISTINCT u.id) as community_size
            FROM "Users" u
            JOIN "UserGenrePrefrences" ugp ON u.id = ugp."userId"
            JOIN "Genres" g ON ugp."genreId" = g.id
            WHERE LOWER(u.city) = LOWER(:city)
            AND LOWER(u.state) = LOWER(:state)
            AND LOWER(g.name) = LOWER(:genre)
        `;
        
        const result = await runQuery(query, {
            type: QueryTypes.SELECT,
            replacements: { city, state, genre }
        });
        
        return result[0]?.community_size || 0;
    }

    /**
     * Get active artists in a scene
     */
    async getActiveArtists(city, state, genre) {
        const query = `
            SELECT COUNT(DISTINCT b.id) as active_artists
            FROM "Bands" b
            JOIN "Songs" s ON b.id = s."bandId"
            JOIN "SongGenres" sg ON s.id = sg."songId"
            JOIN "Genres" g ON sg."genreId" = g.id
            WHERE LOWER(s."cityName") = LOWER(:city)
            AND LOWER(s."stateName") = LOWER(:state)
            AND LOWER(g.name) = LOWER(:genre)
            AND b.status = 'ACTIVE'
            AND s.live = true
            AND s."deletedAt" IS NULL
        `;
        
        const result = await runQuery(query, {
            type: QueryTypes.SELECT,
            replacements: { city, state, genre }
        });
        
        return result[0]?.active_artists || 0;
    }

    /**
     * Get total songs in a scene
     */
    async getTotalSongs(city, state, genre) {
        const query = `
            SELECT COUNT(s.id) as total_songs
            FROM "Songs" s
            JOIN "SongGenres" sg ON s.id = sg."songId"
            JOIN "Genres" g ON sg."genreId" = g.id
            WHERE LOWER(s."cityName") = LOWER(:city)
            AND LOWER(s."stateName") = LOWER(:state)
            AND LOWER(g.name) = LOWER(:genre)
            AND s.live = true
            AND s."deletedAt" IS NULL
        `;
        
        const result = await runQuery(query, {
            type: QueryTypes.SELECT,
            replacements: { city, state, genre }
        });
        
        return result[0]?.total_songs || 0;
    }

    /**
     * Get recent activity in a scene
     */
    async getRecentActivity(city, state, genre) {
        const query = `
            SELECT 
                COUNT(v.id) as recent_votes,
                COUNT(sb.id) as recent_blasts,
                COUNT(usl.id) as recent_listens
            FROM "Songs" s
            JOIN "SongGenres" sg ON s.id = sg."songId"
            JOIN "Genres" g ON sg."genreId" = g.id
            LEFT JOIN "Votes" v ON s.id = v."songId" AND v."createdAt" >= NOW() - INTERVAL '24 hours'
            LEFT JOIN "SongBlasts" sb ON s.id = sb."songId" AND sb."createdAt" >= NOW() - INTERVAL '24 hours'
            LEFT JOIN "UserSongListens" usl ON s.id = usl."songId" AND usl."createdAt" >= NOW() - INTERVAL '24 hours'
            WHERE LOWER(s."cityName") = LOWER(:city)
            AND LOWER(s."stateName") = LOWER(:state)
            AND LOWER(g.name) = LOWER(:genre)
            AND s.live = true
            AND s."deletedAt" IS NULL
        `;
        
        const result = await runQuery(query, {
            type: QueryTypes.SELECT,
            replacements: { city, state, genre }
        });
        
        return {
            recentVotes: result[0]?.recent_votes || 0,
            recentBlasts: result[0]?.recent_blasts || 0,
            recentListens: result[0]?.recent_listens || 0
        };
    }

    /**
     * Get trending songs in a home scene
     * @param {string} sceneKey - Scene key
     * @param {number} limit - Number of songs to return
     * @returns {Array} Trending songs
     */
    async getTrendingSongs(sceneKey, limit = 10) {
        try {
            const [city, state, genre] = this.parseSceneKey(sceneKey);
            
            const query = `
                WITH song_metrics AS (
                    SELECT 
                        s.id,
                        s.title,
                        s.thumbnail,
                        s.duration,
                        s."cityName",
                        s."stateName",
                        b.title as band_title,
                        b.id as band_id,
                        COUNT(v.id) FILTER (WHERE v.type = 'UPVOTE') as upvotes,
                        COUNT(v.id) FILTER (WHERE v.type = 'DOWNVOTE') as downvotes,
                        COUNT(sb.id) as blasts,
                        COUNT(usl.id) as listens
                    FROM "Songs" s
                    JOIN "SongGenres" sg ON s.id = sg."songId"
                    JOIN "Genres" g ON sg."genreId" = g.id
                    JOIN "Bands" b ON s."bandId" = b.id
                    LEFT JOIN "Votes" v ON s.id = v."songId"
                    LEFT JOIN "SongBlasts" sb ON s.id = sb."songId"
                    LEFT JOIN "UserSongListens" usl ON s.id = usl."songId"
                    WHERE LOWER(s."cityName") = LOWER(:city)
                    AND LOWER(s."stateName") = LOWER(:state)
                    AND LOWER(g.name) = LOWER(:genre)
                    AND s.live = true
                    AND s."deletedAt" IS NULL
                    AND b.status = 'ACTIVE'
                    GROUP BY s.id, b.id
                )
                SELECT 
                    *,
                    (upvotes * 2 + blasts * 1.5 + listens * 0.5 - downvotes * 2) as trend_score
                FROM song_metrics
                ORDER BY trend_score DESC
                LIMIT :limit
            `;
            
            const results = await runQuery(query, {
                type: QueryTypes.SELECT,
                replacements: { city, state, genre, limit }
            });
            
            return results;
        } catch (error) {
            console.error('Error getting trending songs:', error);
            throw error;
        }
    }
}

module.exports = new HomeSceneManager(); 