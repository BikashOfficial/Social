const mongoose = require('mongoose');


//ttl - time to live what is ttl in mongodb ans is used to set the time to live for a document in a collection or in simple words it is used to set the expiration time for a document in a collection.and here it is used for the token to expire after 24 hours.
const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    } // 86400 seconds = 24 hours
});

module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);

