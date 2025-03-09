const express = require('express')
const router = express.Router();

const userController = require('../controllers/user.controller.js');
const authUser = require('../middleware/user.auth.js')
const profileUpload = require('../middleware/profileUpload.js');

router.post('/create', userController.registerUser)

router.post('/login', userController.loginUser)

router.get('/profile', authUser.authMiddleware, userController.getProfile)

router.get('/logout', authUser.authMiddleware, userController.logoutUser)

router.get('/check-username/:value', userController.checkUsername)

router.put('/update-profile', 
    authUser.authMiddleware, 
    profileUpload.single('profilePhoto'), 
    userController.updateProfile
);

// Friend-related routes
router.get('/search', authUser.authMiddleware, userController.searchUsers);
router.post('/friend-request/:userId', authUser.authMiddleware, userController.sendFriendRequest);
router.put('/friend-request/:requestId/accept', authUser.authMiddleware, userController.acceptFriendRequest);
router.delete('/friend/:friendId', authUser.authMiddleware, userController.removeFriend);
router.get('/friend-requests', authUser.authMiddleware, userController.getFriendRequests);
router.get('/friends', authUser.authMiddleware, userController.getFriends);

module.exports = router;