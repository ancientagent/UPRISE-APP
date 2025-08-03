// This is the complete, corrected file for fairPlayAlgorithm.js
const { SongLikes, SongBlasts, UserSongListens, SongSkips } = require('../database/models');

class FairPlayAlgorithm {
    constructor(db) {
        this.db = db;
        if (!this.db || !this.db.SongLikes) {
            console.error("FATAL: Database models were not passed to FairPlayAlgorithm constructor.");
            throw new Error("Database models were not passed to FairPlayAlgorithm constructor.");
        }
    }

    safeParseCount(result) {
        if (result && typeof result.count !== 'undefined' && result.count !== null) {
            return Number(result.count);
        }
        return 0;
    }

    async getSongMetrics(songId, tier) {
        try {
            const [likesResult, dislikesResult, blastsResult, fullListensResult, skipsResult] = await Promise.all([
                this.db.SongLikes.findAndCountAll({ where: { songId, tier, status: 'LIKE' } }),
                this.db.SongLikes.findAndCountAll({ where: { songId, tier, status: 'DISLIKE' } }),
                this.db.SongBlasts.findAndCountAll({ where: { songId } }),
                this.db.UserSongListens.findAndCountAll({ where: { songId } }),
                this.db.SongSkips.findAndCountAll({ where: { songId, tier } })
            ]);

            const likes = this.safeParseCount(likesResult);
            const dislikes = this.safeParseCount(dislikesResult);
            const blasts = this.safeParseCount(blastsResult);
            const fullListens = this.safeParseCount(fullListensResult);
            const skips = this.safeParseCount(skipsResult);

            return { likes, dislikes, blasts, fullListens, skips };
        } catch (error) {
            console.error(`Error in getSongMetrics for songId ${songId}:`, error);
            return { likes: 0, dislikes: 0, blasts: 0, fullListens: 0, skips: 0 };
        }
    }

    async updateSongPriority(song, tier) {
        try {
            const metrics = await this.getSongMetrics(song.id, tier);

            const timeSinceAired = (new Date() - new Date(song.airedOn || song.createdAt)) / (3600000); // in hours
            const timeDecayFactor = Math.max(0, 1 - (timeSinceAired / 168)); // Linear decay over 1 week

            const engagementScore = (metrics.likes * 1.5) + (metrics.blasts * 2) - (metrics.dislikes * 1) - (metrics.skips * 0.5);

            const finalPriority = (engagementScore + 1) * timeDecayFactor;

            const [priorityRecord, created] = await this.db.SongPriority.findOrCreate({
                where: { songId: song.id, tier: tier },
                defaults: { songId: song.id, tier: tier }
            });

            priorityRecord.finalPriority = finalPriority;
            priorityRecord.lastCalculated = new Date();
            await priorityRecord.save();

        } catch (error) {
            console.error(`Failed to update priority for song ${song.id}:`, error);
        }
    }
}

module.exports = FairPlayAlgorithm;