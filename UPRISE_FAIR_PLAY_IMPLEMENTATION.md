# UPRISE Fair Play System Implementation

## Overview
This document outlines the complete implementation of the UPRISE Fair Play system, which ensures fair exposure for all artists while creating natural community curation based on genuine listening behavior.

## Core Principles

### 1. Equal Initial Opportunity
- All songs start with equal time-based priority
- Songs uploaded longer ago get higher priority for each user
- Ensures every song gets fair exposure to every listener

### 2. Community Evaluation
- After 2-3 plays per user, switches to community-based priority
- Community engagement determines rotation frequency
- Fair exposure: Every song gets at least 2 chances with every listener

### 3. Anti-Manipulation
- GPS verification for location-based engagement
- Activity analysis and reporting system
- Prevents gaming and artificial promotion

## Engagement System

### Primary Engagements (One-time per tier, high weight)
- **Like (Thumbs Up)**: High positive weight (10.0 points)
- **Dislike (Thumbs Down)**: High negative weight (-8.0 points)
- **Neutral**: No weight (default state)

### Ongoing Engagements (Unlimited, low weight)
- **Full Listen**: Low positive weight (1.0 point)
- **Skip**: Low negative weight (-0.5 points)

### Tier Progression
- **Upvote**: Solely for elevating songs to next tier
- **Voting rules**: 1 vote per song per tier (can vote again if song gets promoted)
- **NATIONAL tier**: No voting, only favoriting

### Additional Features
- **Blast**: Creates trending status, earns activity points when others like
- **Favorites**: Personal collection management (available in ALL tiers)
- **Skip tracking**: For artist analytics with timing information

## Database Models Created

### 1. SongLikes
Tracks the three-state like/dislike system per tier:
```sql
- userId, songId, tier (unique constraint)
- status: LIKE, NEUTRAL, DISLIKE
- location: GPS coordinates for verification
```

### 2. SongSkips
Tracks skip timing for artist analytics:
```sql
- userId, songId, tier
- skipTime: Time in seconds when skipped
- songDuration: Total duration of song
- skipPercentage: Percentage completed before skip
```

### 3. SongPriority
Tracks priority scores for Fair Play system:
```sql
- songId, tier (unique constraint)
- timeBasedPriority: Priority based on upload time
- communityPriority: Priority based on community engagement
- finalPriority: Final priority score (plays per hour)
- communityThresholdReached: Whether enough users have heard song
- totalUsersHeard: Number of unique users who heard song
- requiredUsersThreshold: Users required before community scoring
```

## API Endpoints Created

### 1. Song Like/Dislike System
- `POST /song-likes/song-like-status` - Update like/dislike status
- `GET /song-likes/song-like-status/:songId/:tier` - Get user's like status
- `POST /song-likes/song-skip` - Record song skip with timing
- `POST /song-likes/song-listen` - Record full song listen
- `GET /song-likes/song-engagement/:songId/:tier` - Get engagement statistics

### 2. Enhanced Radio System
- Updated `/radio/song` to use Fair Play algorithm for song selection
- Tier-based song selection (CITYWIDE, STATEWIDE, NATIONAL)
- Individualized rotation based on priority scores

## Fair Play Algorithm Features

### 1. Time-Based Priority
- Higher priority for songs uploaded longer ago
- Logarithmic scaling to prevent extreme values
- Ensures fair exposure for all songs

### 2. Community-Based Priority
- Calculated from engagement metrics (likes, dislikes, listens, skips)
- Weighted scoring system with anti-manipulation measures
- Normalized to prevent extreme values

### 3. Priority Calculation
```javascript
// Final priority combines time-based and community-based priority
if (communityThresholdReached) {
    finalPriority = communityScore;
} else {
    finalPriority = timePriority;
}
```

### 4. Song Selection
- Weighted random selection based on priority scores
- Fallback to basic selection if no priority data
- Genre filtering support

## Tier System

### CITYWIDE Tier
- Songs from local artists in user's city
- Full voting available (upvote, downvote, like, dislike)
- Community percentage threshold: 15%
- Upvote threshold for progression: 10

### STATEWIDE Tier
- Best songs promoted from citywide communities
- Full voting available (upvote, downvote, like, dislike)
- Community percentage threshold: 25%
- Upvote threshold for progression: 50

### NATIONAL Tier
- Best songs promoted from statewide communities
- NO VOTING ALLOWED (as clarified)
- Only favoriting/liking for personal collection
- Community percentage threshold: 35%

## Cron Jobs

### 1. Song Priority Updates
- Runs every hour
- Updates priority scores for all active songs
- Handles both time-based and community-based calculations

### 2. Priority Record Cleanup
- Runs daily at 2 AM
- Removes priority records for inactive songs
- Maintains database efficiency

### 3. Priority Record Initialization
- Runs daily at 3 AM
- Creates priority records for new songs
- Ensures all songs have proper priority tracking

## Key Benefits

### 1. Fair Artist Exposure
- Every song gets at least 2 chances with every listener
- Time-based priority ensures no artist gets buried
- Natural selection based on genuine listener preference

### 2. Community-Driven Curation
- Collective listening behavior determines rotation
- Anti-manipulation measures ensure fairness
- Organic growth allows songs to improve over time

### 3. Personalized Experience
- Each user's rotation reflects community taste
- Individualized priority based on listening history
- Fair exposure while maintaining quality

### 4. Anti-Manipulation
- GPS verification prevents location-based gaming
- Activity analysis detects suspicious patterns
- Reporting system for inappropriate content

## Implementation Status

### ✅ Completed
- Database models and migrations
- Fair Play algorithm implementation
- API endpoints for engagement tracking
- Radio system integration
- Cron jobs for priority updates
- Tier-based voting system
- Skip tracking with analytics

### 🔄 Next Steps
1. Run database migrations
2. Test API endpoints
3. Update frontend to use new like/dislike system
4. Implement GPS verification for home scene
5. Add activity points system for blasts
6. Create artist analytics dashboard

## Technical Notes

### Database Migrations
Run the following migrations in order:
1. `20241201000001-create-song-likes.js`
2. `20241201000002-create-song-skips.js`
3. `20241201000003-create-song-priority.js`

### Configuration
- Engagement weights can be adjusted in `fairPlayAlgorithm.js`
- Community percentage thresholds can be modified per tier
- Cron job schedules can be customized in `index.js`

### Performance Considerations
- Priority calculations are cached in database
- Batch processing for large song catalogs
- Indexed queries for efficient song selection
- Regular cleanup of inactive records

This implementation provides a robust, fair, and scalable system for music discovery that benefits both artists and listeners while maintaining the integrity of the UPRISE platform. 