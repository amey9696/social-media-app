const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://res.cloudinary.com/thunderbolt/image/upload/v1649253839/blank-profile-picture-g8bf33b5fb_1280_fybple.png"
    },
    followers: [{
        type: ObjectId,
        ref: "user"
    }],
    following: [{
        type: ObjectId,
        ref: "user"
    }],
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);