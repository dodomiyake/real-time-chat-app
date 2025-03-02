const mongoose = require('mongoose');

const Userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://i.pravatar.cc/150?u=default" // Default avatar if none is provided
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', Userschema);