const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    text: {
        type: String,
        required: true,
        maxLength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const postSchema = new mongoose.Schema({ 
    title: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,  // This will store the path to the image
        required: true
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    location: {
        type: String,
        default: ''
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    // likes: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }],
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

const postsModel = mongoose.model('post', postSchema);
module.exports = postsModel;