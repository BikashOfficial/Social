const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const authUser = require('../middleware/user.auth');

router.post('/send', authUser.authMiddleware, messageController.sendMessage);
router.get('/:friendId', authUser.authMiddleware, messageController.getMessages);
router.put('/:messageId/read', authUser.authMiddleware, messageController.markAsRead);

module.exports = router; 