const uuid = require('uuid');
const ffmpeg = require('./fffmpeg');
const path = require('path');


const getAudioMetaData = async (filePath) =>{
    return new Promise((resolve, reject) => {
        // If the file path starts with /uploads/, convert it to the actual local path
        let actualPath = filePath;
        if (filePath.startsWith('/uploads/')) {
            // Convert /uploads/songs/filename.mp3 to actual local path
            const relativePath = filePath.replace('/uploads/', '');
            actualPath = path.join(__dirname, '..', '..', 'uploads', relativePath);
        }
        
        console.log('Getting audio metadata for:', actualPath);
        
        // Check if file exists
        const fs = require('fs');
        if (!fs.existsSync(actualPath)) {
            console.error('File does not exist:', actualPath);
            return reject(new Error(`File not found: ${actualPath}`));
        }
        
        // Get file stats to verify it's readable
        try {
            const stats = fs.statSync(actualPath);
            console.log('File stats:', { size: stats.size, isFile: stats.isFile() });
        } catch (statErr) {
            console.error('Error getting file stats:', statErr);
            return reject(statErr);
        }
        
        // Try using ffprobe with input options
        ffmpeg.ffprobe(actualPath, { timeout: 10000 }, (err, metadata) => {
            if(err) {
                console.error('FFprobe error:', err);
                return reject(err);
            }
            console.log('Successfully got metadata:', metadata);
            return resolve(metadata);            
        });
    });
};



const generateThumbnail = async (filePath) => {
    return new Promise((resolve, reject) => {
        const fileUUID = uuid.v4();
        const metadata = {
            filename: fileUUID + '.png',
            pathToFile: `/tmp/${fileUUID+'.png'}`,
        };
        ffmpeg(filePath)
            .on('end', function() {
                resolve(metadata);
            })
            .on('error', function(err) {
                reject(err);
            })
        // take 1 screenshots at predefined timemarks and size
            .takeScreenshots({
                timestamps: [0],
                filename: metadata.filename,
                folder: '/tmp',
                size: '320x240',
            });
    });
};
    
module.exports={ getAudioMetaData,generateThumbnail };
