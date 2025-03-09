const Message = require('../models/message.model');
const User = require('../models/user.model');

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;
        const senderId = req.user._id;

        const message = new Message({
            sender: senderId,
            receiver: receiverId,
            text
        });

        await message.save();

        res.json({
            success: true,
            message: await Message.findById(message._id)
                .populate('sender', 'username profilePhoto')
                .populate('receiver', 'username profilePhoto')
        });
    } catch (err) {
        console.error('Send message error:', err);
        res.status(500).json({
            success: false,
            message: 'Error sending message'
        });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { friendId } = req.params;
        const userId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: friendId },
                { sender: friendId, receiver: userId }
            ]
        })
        .sort('createdAt')
        .populate('sender', 'username profilePhoto')
        .populate('receiver', 'username profilePhoto');

        // Mark messages as read
        await Message.updateMany(
            { sender: friendId, receiver: userId, read: false },
            { read: true }
        );

        res.json({
            success: true,
            messages
        });
    } catch (err) {
        console.error('Get messages error:', err);
        res.status(500).json({
            success: false,
            message: 'Error getting messages'
        });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        if (message.receiver.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        message.read = true;
        await message.save();

        res.json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (err) {
        console.error('Mark as read error:', err);
        res.status(500).json({
            success: false,
            message: 'Error marking message as read'
        });
    }
}; 