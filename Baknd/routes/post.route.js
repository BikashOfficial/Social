const express = require("express")
const router = express.Router();
const postController = require("../controllers/post.controller.js");
const authUser = require('../middleware/user.auth.js')
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files are allowed!'));
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('image');

// Wrap the upload middleware to handle errors
const uploadMiddleware = (req, res, next) => {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            return res.status(400).json({
                success: false,
                message: err.message
            });
        } else if (err) {
            // An unknown error occurred
            return res.status(500).json({
                success: false,
                message: 'Error uploading file'
            });
        }
        // Everything went fine
        next();
    });
};

router.post("/addPost", authUser.authMiddleware, uploadMiddleware, postController.createPost);

// router.get("/posts", postController.getAllPosts);
router.delete("/deletePost/:id", authUser.authMiddleware, postController.deletePost);
router.get("/getPost/:id", authUser.authMiddleware, postController.getPost);
router.get("/getPosts", authUser.authMiddleware, postController.getPosts);
router.put("/updatePost/:id", authUser.authMiddleware, postController.updatePost);

// Comment routes
router.post('/:postId/comment', authUser.authMiddleware, postController.addComment);
router.delete('/:postId/comment/:commentId', authUser.authMiddleware, postController.deleteComment);
router.get('/:postId/comments', authUser.authMiddleware, postController.getComments);

// Like route
router.post('/:postId/like', authUser.authMiddleware, postController.toggleLike);

module.exports = router;
