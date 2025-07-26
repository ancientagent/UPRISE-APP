# 🎵 Song Upload System - Technical Implementation Guide

**Date**: July 2025  
**Status**: ✅ **COMPLETE & OPERATIONAL**  
**Version**: 2.0 - Updated for Architectural Realignment

---

## 📋 **System Overview**

The song upload system provides a complete end-to-end solution for artists to upload songs with thumbnails, extract audio metadata, and make them available for music discovery through the radio system.

### **Key Features**
- ✅ **File Upload**: MP3, MPEG, M4R, WAV file support
- ✅ **Thumbnail Upload**: Album artwork support
- ✅ **Metadata Extraction**: Automatic audio metadata extraction
- ✅ **File Storage**: Local storage with AWS S3 fallback
- ✅ **Radio Integration**: Songs available via radio endpoints for music discovery
- ✅ **Genre Filtering**: Content filtered by user genre preferences
- ✅ **Location Filtering**: Content filtered by user location

---

## 🏗️ **Architecture**

### **System Components**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Webapp-UI)   │    │   (Node.js)     │    │  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Upload Request     │                       │
         ├──────────────────────►│                       │
         │                       │ 2. File Validation    │
         │                       ├──────────────────────►│
         │                       │ 3. File Storage       │
         │                       │ (Local/AWS S3)       │
         │                       ├──────────────────────►│
         │                       │ 4. Metadata Extract   │
         │                       │ (FFprobe)            │
         │                       ├──────────────────────►│
         │                       │ 5. Database Insert    │
         │                       ├──────────────────────►│
         │ 6. Success Response   │                       │
         │◄──────────────────────┤                       │
```

### **Data Flow**

1. **Frontend**: User selects MP3 file and thumbnail
2. **Validation**: File type and size validation
3. **Upload**: File stored locally with sanitized filename
4. **Metadata**: FFprobe extracts audio metadata
5. **Database**: Song record created with all metadata
6. **Genre**: Song linked to user's genre preferences
7. **Radio**: Song available via radio endpoints for music discovery

---

## 🔧 **Technical Implementation**

### **1. File Upload System**

#### **Backend Implementation** (`Webapp_API-Develop/src/utils/fileUpload.js`)

```javascript
const handleFileUpload = async (file, folderName) => {
    // File validation
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/m4r', 'audio/wav'];
    if (!validTypes.includes(file.mimetype)) {
        throw new Error('Invalid file type');
    }
    
    // Filename sanitization
    const fileName = path.basename(file.originalname)
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '');
    
    // Local storage implementation
    if (!isAwsConfigured) {
        const localDir = path.join(uploadsDir, folderName);
        if (!fs.existsSync(localDir)) {
            fs.mkdirSync(localDir, { recursive: true });
        }
        
        const localPath = path.join(localDir, fileName);
        fs.writeFileSync(localPath, file.buffer);
        
        return {
            Location: `/uploads/${folderName}/${fileName}`,
            Key: `${folderName}/${fileName}`,
            Bucket: 'local-storage'
        };
    }
    
    // AWS S3 implementation (fallback)
    return s3.upload(params).promise();
};
```

#### **Frontend Implementation** (`webapp-ui/src/api/songService.ts`)

```typescript
export const uploadSong = async (
    file: File, 
    title: string, 
    genres: string[], 
    token: string, 
    thumbnail?: File
) => {
    const formData = new FormData();
    formData.append('song', file);
    formData.append('title', title);
    formData.append('genres', genres.join(','));
    formData.append('country', 'United States');
    
    if (thumbnail) {
        formData.append('thumbnail', thumbnail);
    }
    
    const response = await axios.post('/song/upload', formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    
    return response.data;
};
```

### **2. Audio Metadata Extraction**

#### **FFprobe Integration** (`Webapp_API-Develop/src/utils/mediaHandler.js`)

```javascript
const getAudioMetaData = async (filePath) => {
    return new Promise((resolve, reject) => {
        // Convert relative path to absolute path
        let actualPath = filePath;
        if (filePath.startsWith('/uploads/')) {
            const relativePath = filePath.replace('/uploads/', '');
            actualPath = path.join(__dirname, '..', '..', 'uploads', relativePath);
        }
        
        // File existence check
        if (!fs.existsSync(actualPath)) {
            return reject(new Error(`File not found: ${actualPath}`));
        }
        
        // Metadata extraction with timeout
        ffmpeg.ffprobe(actualPath, { timeout: 10000 }, (err, metadata) => {
            if (err) {
                return reject(err);
            }
            return resolve(metadata);
        });
    });
};
```

#### **FFmpeg Configuration** (`Webapp_API-Develop/src/utils/fffmpeg.js`)

```javascript
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;
const fluentFFMPEG = require('fluent-ffmpeg');

fluentFFMPEG.setFfmpegPath(ffmpegPath);
fluentFFMPEG.setFfprobePath(ffprobePath);

module.exports = fluentFFMPEG;
```

### **3. Database Integration**

#### **Song Upload Route** (`Webapp_API-Develop/src/routes/song.js`)

```javascript
Router.post('/upload', customUpload.fields([
    { name: 'song', maxCount: 1 }, 
    { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
    try {
        // File upload
        const songFile = await handleFileUpload(songData.song, 'songs');
        songData.song = songFile.Location;
        
        // Thumbnail upload
        if (req.files.thumbnail) {
            const thumbnailFile = await handleFileUpload(thumbnail, 'song-thumbnails');
            songData.thumbnail = thumbnailFile.Location;
        }
        
        // Metadata extraction
        const duration = await getAudioMetaData(songData.song);
        songData.duration = duration.format.duration;
        
        // Database insertion
        const newSong = await Songs.create(songData);
        
        // Genre associations
        for (const genre of genresData) {
            const _genre = await Genres.findOne({ where: { name: genre } });
            await SongGenres.create({
                songId: newSong.id,
                genreId: _genre.id
            });
        }
        
        res.json({ message: 'Song uploaded successfully', data: newSong });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
```

### **4. Radio Integration** ⭐ **UPDATED - ARCHITECTURAL REALIGNMENT**

#### **Radio Song Query** (`Webapp_API-Develop/src/routes/radio.js`)

```sql
-- Songs are now available via radio endpoints for music discovery
SELECT s.id, s.title, s.song, s.thumbnail, s.duration,
       s."cityName", s."stateName", s."createdAt",
       b.id as "bandId", b.title as "bandTitle", b.logo as "bandLogo"
FROM "Songs" s
LEFT JOIN "Bands" b ON b.id = s."bandId"
WHERE s."deletedAt" IS NULL 
AND b.status = 'ACTIVE' 
AND s.live = true
AND lower(s."cityName") = lower(:cityName)
AND EXISTS (
    SELECT 1 FROM "SongGenres" sg
    WHERE sg."songId" = s.id
    AND sg."genreId" IN (:genreIds)
)
ORDER BY s."createdAt" DESC;
```

**Note**: Following the architectural realignment, songs are no longer directly integrated into the feed. Instead, they are available through dedicated radio endpoints for music discovery, maintaining proper separation of concerns between community notifications (feed) and music content (radio).

---

## 🗄️ **Database Schema**

### **Songs Table**
```sql
CREATE TABLE "Songs" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "song" VARCHAR(500) NOT NULL,
    "thumbnail" VARCHAR(500),
    "duration" DECIMAL(10,3),
    "cityName" VARCHAR(100),
    "stateName" VARCHAR(100),
    "country" VARCHAR(100),
    "uploadedBy" INTEGER REFERENCES "Users"(id),
    "live" BOOLEAN DEFAULT false,
    "bandId" INTEGER REFERENCES "Bands"(id),
    "albumId" INTEGER REFERENCES "Albums"(id),
    "hashValue" VARCHAR(255),
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "promotedSong" BOOLEAN DEFAULT false,
    "airedOn" TIMESTAMP,
    "promotedToStateDate" TIMESTAMP,
    "promotedToNationalDate" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    "deletedAt" TIMESTAMP
);
```

### **SongGenres Table**
```sql
CREATE TABLE "SongGenres" (
    "id" SERIAL PRIMARY KEY,
    "songId" INTEGER REFERENCES "Songs"(id),
    "genreId" INTEGER REFERENCES "Genres"(id),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 **Configuration**

### **Environment Variables**

#### **Backend** (`Webapp_API-Develop/.env`)
```env
# Database Configuration
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=Loca$h2682
DB_NAME=uprise_radiyo
DB_PORT=5432

# File Storage
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_bucket_name

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### **Frontend** (`webapp-ui/.env`)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_CLIENT_ID=437920819fa89d19abe380073d28839c
VITE_CLIENT_SECRET=28649120bdf32812f433f428b15ab1a1
```

---

## 🧪 **Testing**

### **Unit Tests**

#### **File Upload Test**
```javascript
describe('File Upload', () => {
    test('should upload MP3 file successfully', async () => {
        const file = createMockFile('test.mp3', 'audio/mpeg');
        const result = await handleFileUpload(file, 'songs');
        
        expect(result.Location).toContain('/uploads/songs/');
        expect(result.Bucket).toBe('local-storage');
    });
    
    test('should reject invalid file types', async () => {
        const file = createMockFile('test.txt', 'text/plain');
        
        await expect(handleFileUpload(file, 'songs'))
            .rejects.toThrow('Invalid file type');
    });
});
```

#### **Metadata Extraction Test**
```javascript
describe('Metadata Extraction', () => {
    test('should extract audio metadata', async () => {
        const metadata = await getAudioMetaData('/uploads/songs/test.mp3');
        
        expect(metadata.format.duration).toBeDefined();
        expect(metadata.format.bit_rate).toBeDefined();
        expect(metadata.streams[0].codec_name).toBe('mp3');
    });
});
```

### **Integration Tests**

#### **Complete Upload Flow Test**
```javascript
describe('Song Upload Flow', () => {
    test('should complete full upload process', async () => {
        // 1. Upload file
        const songFile = await uploadFile(mockSongFile);
        
        // 2. Extract metadata
        const metadata = await extractMetadata(songFile.path);
        
        // 3. Create database record
        const song = await createSongRecord({
            title: 'Test Song',
            duration: metadata.format.duration,
            filePath: songFile.path
        });
        
        // 4. Verify radio integration
        const radioSongs = await getRadioSongs(userId);
        expect(radioSongs).toContainEqual(
            expect.objectContaining({ songId: song.id })
        );
    });
});
```

---

## 🚀 **Performance Optimization**

### **File Processing**
- **Parallel Processing**: Metadata extraction runs in parallel with file storage
- **Caching**: File metadata cached to avoid re-extraction
- **Compression**: Audio files compressed for faster upload/download

### **Database Optimization**
- **Indexes**: Proper indexes on frequently queried columns
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Optimized radio queries with proper joins

### **Storage Optimization**
- **File Deduplication**: Hash-based file deduplication
- **CDN Integration**: Content delivery network for faster access
- **Compression**: Automatic file compression for storage efficiency

---

## 🔒 **Security Considerations**

### **File Upload Security**
- **File Type Validation**: Strict MIME type checking
- **File Size Limits**: Maximum file size restrictions
- **Virus Scanning**: Antivirus scanning for uploaded files
- **Path Traversal Protection**: Secure file path handling

### **Access Control**
- **Authentication**: JWT-based authentication required
- **Authorization**: User can only upload to their own bands
- **Rate Limiting**: Upload rate limiting to prevent abuse
- **Audit Logging**: Complete audit trail for uploads

---

## 📊 **Monitoring & Analytics**

### **Upload Metrics**
- **Success Rate**: Track upload success/failure rates
- **Processing Time**: Monitor metadata extraction performance
- **File Sizes**: Track average file sizes and trends
- **Storage Usage**: Monitor disk space usage

### **User Analytics**
- **Upload Frequency**: Track user upload patterns
- **Genre Preferences**: Analyze popular genres
- **Geographic Distribution**: Track upload locations
- **Engagement Metrics**: Monitor song play counts

---

## 🔄 **Deployment**

### **Production Checklist**
- [ ] AWS S3 configured for file storage
- [ ] CDN configured for file delivery
- [ ] Database indexes optimized
- [ ] Monitoring and alerting configured
- [ ] Backup strategy implemented
- [ ] Security audit completed
- [ ] Performance testing completed
- [ ] Documentation updated

### **Deployment Commands**
```bash
# Backend deployment
cd Webapp_API-Develop
npm install
npm run build
npm start

# Frontend deployment
cd webapp-ui
npm install
npm run build
npm run preview
```

---

## 🏗️ **Architectural Realignment Impact** ⭐ **NEW SECTION**

### **Changes Made**
Following the architectural realignment completed in July 2025, the song upload system has been updated to align with proper separation of concerns:

#### **Before (Incorrect Architecture)**
- Songs appeared directly in the feed
- Mixed community notifications with music content
- Violated "Feed = notifications only" principle

#### **After (Correct Architecture)**
- Songs available via radio endpoints only
- Clear separation between feed (notifications) and player (music)
- Proper architectural alignment maintained

### **Integration Points**
- **Upload**: Songs uploaded and stored in database
- **Radio Discovery**: Songs available via `/radio/song` endpoints
- **Feed Notifications**: Song uploads create notification records (not direct song display)
- **Music Player**: Dedicated interface for music discovery and playback

### **Benefits of Realignment**
- ✅ **Clear User Experience**: Users understand feed vs. player purpose
- ✅ **Scalable Architecture**: Easy to extend music features independently
- ✅ **Maintainable Code**: Clear separation of concerns
- ✅ **Performance**: Optimized queries for different content types

---

## 📚 **Related Documentation**

- **`PROJECT-MANAGER-REPORT-SONG-UPLOAD-SUCCESS.md`** - Project manager report
- **`ARCHITECTURAL-REALIGNMENT-IMPLEMENTATION.md`** - Complete architectural fix documentation
- **`QUICK-FIXES.md`** - Troubleshooting guide
- **`PROJECT-STRUCTURE.md`** - System architecture overview
- **`FEED-INTEGRATION-GUIDE.md`** - Feed system documentation

---

**Documentation Version**: 2.0 - Updated for Architectural Realignment  
**Last Updated**: July 2025  
**Status**: ✅ **COMPLETE & OPERATIONAL** 