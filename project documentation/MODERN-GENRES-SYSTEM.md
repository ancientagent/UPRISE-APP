# Modern Music Genre System - Uprise Mobile App

## Overview

The Uprise mobile app now features a comprehensive modern music genre system that covers the full spectrum of contemporary music. This system replaces the basic 23-genre list with a hierarchical structure of **12 super genres** and **over 100 sub-genres**.

## System Architecture

### Super Genres (12 Main Categories)

1. **Punk** - 9 sub-genres
2. **Metal** - 11 sub-genres  
3. **Electronic** - 12 sub-genres
4. **Hip Hop** - 9 sub-genres
5. **Rock** - 10 sub-genres
6. **Jazz** - 7 sub-genres
7. **Pop** - 6 sub-genres
8. **Country** - 5 sub-genres
9. **Folk** - 4 sub-genres
10. **R&B** - 4 sub-genres
11. **Reggae** - 4 sub-genres
12. **Classical** - 4 sub-genres

**Total: 12 Super Genres + 85 Sub-Genres = 97 Total Genres**

## API Endpoints

### 1. `/onboarding/super-genres`
Returns the complete hierarchical structure with super genres and their sub-genres.

**Response Format:**
```json
{
  "super_genres": [
    {
      "id": "punk",
      "name": "Punk",
      "aliases": ["punk rock", "punk music"],
      "category": "rock",
      "sub_genres": [
        {
          "id": "hardcore-punk",
          "name": "Hardcore Punk",
          "aliases": ["hardcore", "hc punk", "hardcore punk"]
        }
        // ... more sub-genres
      ]
    }
    // ... more super genres
  ]
}
```

### 2. `/onboarding/all-genres`
Returns all genres in a flat list format compatible with existing systems.

**Response Format:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Punk",
      "super_genre": "punk",
      "category": "rock",
      "type": "super"
    },
    {
      "id": 2,
      "name": "Hardcore Punk",
      "super_genre": "punk",
      "category": "rock",
      "type": "sub"
    }
    // ... all genres
  ]
}
```

### 3. `/onboarding/sub-genres/{superGenreId}`
Returns sub-genres for a specific super genre.

**Example:** `/onboarding/sub-genres/punk`

## Detailed Genre Breakdown

### 🎸 Punk (9 sub-genres)
- **Hardcore Punk** - Aggressive, fast-paced punk
- **Pop Punk** - Melodic, accessible punk rock
- **Post Punk** - Experimental, art-influenced punk
- **Crust Punk** - Anarchist, extreme punk
- **Folk Punk** - Acoustic, storytelling punk
- **Ska Punk** - Reggae-influenced punk
- **Street Punk** - Working-class, Oi! punk
- **Emo** - Emotional hardcore
- **Screamo** - Screaming emo

### 🤘 Metal (11 sub-genres)
- **Death Metal** - Brutal, technical metal
- **Black Metal** - Atmospheric, extreme metal
- **Thrash Metal** - Fast, aggressive metal
- **Power Metal** - Epic, symphonic metal
- **Progressive Metal** - Complex, technical metal
- **Doom Metal** - Slow, heavy metal
- **Nu Metal** - Rap-influenced metal
- **Metalcore** - Hardcore-influenced metal
- **Deathcore** - Extreme death metal
- **Folk Metal** - Traditional folk-influenced metal
- **Industrial Metal** - Electronic-influenced metal

### 🎛️ Electronic (12 sub-genres)
- **House** - Dance music foundation
- **Techno** - Detroit electronic music
- **Trance** - Euphoric electronic music
- **Drum & Bass** - Fast breakbeat music
- **Dubstep** - Bass-heavy electronic
- **Ambient** - Atmospheric, chillout
- **Industrial** - Aggressive electronic
- **Synthwave** - Retro-futuristic electronic
- **Breakbeat** - Breakbeat-based electronic
- **Hardcore** - Fast, aggressive electronic
- **Trap** - Hip-hop influenced electronic
- **Future Bass** - Melodic electronic

### 🎤 Hip Hop (9 sub-genres)
- **Conscious Hip Hop** - Political, message-driven rap
- **Trap Rap** - Atlanta-style trap music
- **Drill** - Chicago/UK drill music
- **Boom Bap** - 90s golden age hip hop
- **Alternative Hip Hop** - Experimental, underground
- **Gangsta Rap** - West coast gangsta rap
- **East Coast Rap** - New York style rap
- **Southern Rap** - Dirty south, crunk
- **Conscious Rap** - Positive, spiritual rap

### 🎸 Rock (10 sub-genres)
- **Classic Rock** - 70s rock and roll
- **Alternative Rock** - Indie, alternative
- **Progressive Rock** - Complex, art rock
- **Psychedelic Rock** - Mind-expanding rock
- **Garage Rock** - Lo-fi, raw rock
- **Blues Rock** - Blues-influenced rock
- **Folk Rock** - Acoustic, storytelling rock
- **Country Rock** - Southern rock
- **Hard Rock** - Arena rock
- **Soft Rock** - Adult contemporary

### 🎷 Jazz (7 sub-genres)
- **Bebop** - Fast, complex jazz
- **Cool Jazz** - Relaxed, west coast jazz
- **Free Jazz** - Experimental, avant-garde
- **Fusion** - Rock-influenced jazz
- **Smooth Jazz** - Contemporary, lounge jazz
- **Acid Jazz** - Funk-influenced jazz
- **Latin Jazz** - Afro-Cuban, Brazilian jazz

### 🎵 Pop (6 sub-genres)
- **Indie Pop** - Independent, alternative pop
- **Synth Pop** - Electronic pop, new wave
- **Dream Pop** - Atmospheric, shoegaze pop
- **Electropop** - Electronic dance pop
- **Art Pop** - Experimental, avant-garde pop
- **Teen Pop** - Youth-oriented pop

### 🤠 Country (5 sub-genres)
- **Outlaw Country** - Rebel, anti-establishment
- **Bluegrass** - Traditional mountain music
- **Alt Country** - Alternative, Americana
- **Country Rock** - Rock-influenced country
- **Honky Tonk** - Traditional country

### 🌿 Folk (4 sub-genres)
- **Contemporary Folk** - Modern singer-songwriter
- **Traditional Folk** - Heritage, roots music
- **Celtic Folk** - Irish, Scottish folk
- **Americana** - American roots music

### 🎶 R&B (4 sub-genres)
- **Neo Soul** - Contemporary soul
- **Contemporary R&B** - Modern urban contemporary
- **Soul** - Classic soul music
- **Funk** - Groove-based funk

### 🇯🇲 Reggae (4 sub-genres)
- **Roots Reggae** - Conscious, Rasta reggae
- **Dancehall** - Jamaican dancehall
- **Dub** - Instrumental reggae
- **Ska** - Jamaican ska music

### 🎼 Classical (4 sub-genres)
- **Baroque** - Early classical period
- **Romantic** - 19th century classical
- **Modern Classical** - 20th century classical
- **Minimalism** - Repetitive, minimalist classical

## Implementation Notes

### Frontend Integration
The new genre system can be integrated in multiple ways:

1. **Hierarchical Selection**: Users first choose a super genre, then a sub-genre
2. **Flat List**: All genres in a single searchable list
3. **Smart Search**: Search across all genres with alias matching

### Backward Compatibility
- The `/auth/genres` endpoint still returns the original 23 genres
- The new `/onboarding/all-genres` provides the expanded list
- Existing code continues to work unchanged

### Search and Discovery
Each genre includes:
- **Primary name** (e.g., "Hardcore Punk")
- **Aliases** (e.g., ["hardcore", "hc punk", "hardcore punk"])
- **Category** (e.g., "rock")
- **Type** (super or sub)

This enables powerful search functionality and genre discovery.

## Benefits

1. **Comprehensive Coverage**: Covers the full spectrum of modern music
2. **User-Friendly**: Logical grouping makes genre selection intuitive
3. **Extensible**: Easy to add new genres or sub-genres
4. **Searchable**: Multiple aliases enable flexible search
5. **Backward Compatible**: Existing systems continue to work

## Future Enhancements

- **Genre Fusion**: Support for hybrid genres
- **Regional Variations**: Location-specific genre variations
- **Temporal Tags**: Era-specific genre classifications
- **Mood Mapping**: Emotional characteristics of genres
- **Collaborative Filtering**: User-driven genre discovery

---

*This modern genre system provides Uprise users with the most comprehensive and accurate music classification available, enabling precise community building and content discovery.* 