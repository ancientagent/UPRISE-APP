const aws = require('aws-sdk');
const path = require('path');
const fs = require('fs');
// const uuid = require('uuid');
const multer = require('multer');
const multerCustomStorage = require('./multerCustomStorage');

// const storage = MulterCustomStorage({
//     destination: function (req, file, cb) 
//     { 
//         cb(null, '/tmp/uploads/');
//     },
//     filename: function (req, file, cb) 
//     { 
//         const extension = file.originalname.split('.').pop();
//         const fileName = `${uuid.v4()}.${extension}`;
//         cb(null,fileName);
//     }
// });
const customUpload = multer({ storage: multerCustomStorage({}) });

const config = require('../config/index');
const {SECRET_KEY,ACCESS_KEY,REGION, BUCKET_NAME,} = config.aws;

// Check if AWS credentials are configured
const isAwsConfigured = SECRET_KEY && ACCESS_KEY && REGION && BUCKET_NAME;

if (isAwsConfigured) {
aws.config.update({ 
    accessKeyId: ACCESS_KEY, 
    secretAccessKey: SECRET_KEY, 
    region: REGION
});
}

const s3 = new aws.S3();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const handleFileUpload = async (file,folderName) => {
    if(!file){
        throw new Error('file was not found');
    }
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ||
     file.mimetype === 'image/jpg' || file.mimetype === 'audio/mpeg' ||
      file.mimetype === 'video/mp4' || file.mimetype === 'audio/mp3' || 
      file.mimetype === 'image/gif' || file.mimetype === 'audio/m4r' || file.mimetype === 'audio/wav'){
        
        const filePath = file.originalname;
        // Sanitize filename to remove spaces and special characters
        const fileName = path.basename(filePath).replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        const imgData = `${folderName}/` + fileName;
        
        // If AWS is not configured, store locally
        if (!isAwsConfigured) {
            console.log('AWS not configured, storing file locally');
            const localDir = path.join(uploadsDir, folderName);
            if (!fs.existsSync(localDir)) {
                fs.mkdirSync(localDir, { recursive: true });
            }
            
            const localPath = path.join(localDir, fileName);
            fs.writeFileSync(localPath, file.buffer);
            
            // Return a mock S3 response with local file path
            return {
                Location: `/uploads/${imgData}`,
                Key: imgData,
                Bucket: 'local-storage'
            };
        }
        
        // Use AWS S3 if configured
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: BUCKET_NAME,
                Body: file.buffer,
                Key: imgData,
                ACL: 'public-read'
                         };
            s3.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                if (data) {
                    resolve(data);
                }
            });
        });
    } 
    else {
        throw new Error('file type must have .jpeg, .png, .jpg only');
    }  
};

const bufferHandler = async (buffer,folderName,fileName) => {
    //const filePath = file.originalname;
    // Sanitize filename to remove spaces and special characters
    const sanitizedFileName = path.basename(fileName).replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
    const imgData = `${folderName}/`+ sanitizedFileName;
    
    // If AWS is not configured, store locally
    if (!isAwsConfigured) {
        console.log('AWS not configured, storing buffer locally');
        const localDir = path.join(uploadsDir, folderName);
        if (!fs.existsSync(localDir)) {
            fs.mkdirSync(localDir, { recursive: true });
        }
        
        const localPath = path.join(localDir, path.basename(fileName));
        fs.writeFileSync(localPath, buffer);
        
        // Return a mock S3 response with local file path
        return {
            Location: `/uploads/${imgData}`,
            Key: imgData,
            Bucket: 'local-storage'
        };
    }
    
    // Use AWS S3 if configured
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: BUCKET_NAME,
            Body: buffer,
            Key: imgData,
            ACL: 'public-read'
                        };
        s3.upload(params, (err, data) => {  
            if (err) {
                reject(err);
            }
            if (data) {
                resolve(data);
            }
        });
    });
};

const get_url_extension = ( url )  => {
    return url.split(/[#?]/)[0].split('.').pop().trim();
};

module.exports = { handleFileUpload, customUpload, get_url_extension, bufferHandler };