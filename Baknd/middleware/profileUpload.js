const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Improve console logging for debugging
console.log('Initializing profile upload middleware');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(uploadDir)) {
    console.log(`Creating profiles upload directory: ${uploadDir}`);
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(`Saving profile image to: ${uploadDir}`);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = 'profile-' + uniqueSuffix + path.extname(file.originalname);
        console.log(`Generated filename: ${fileName} for original: ${file.originalname}`);
        cb(null, fileName);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    console.log(`Processing profile image: ${file.originalname}, mimetype: ${file.mimetype}`);
    
    if (file.mimetype.startsWith('image/')) {
        console.log('File accepted: valid image type');
        cb(null, true);
    } else {
        console.error('File rejected: not an image');
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload; 