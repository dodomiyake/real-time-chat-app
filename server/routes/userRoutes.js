const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save uploaded files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Append a timestamp to the file name
    }
});

const upload = multer({ storage });

// Route for updating user avatar
router.post('/update-avatar', upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

        const avatarUrl = `uploads/${req.file.filename}`; // construct the avatar URL
        await User.findByIdAndUpdate(req.body.id, { avatar: avatarUrl }); // Update the user's avatar

        res.status(200).json({ msg: 'Avatar updated successfully', avatar: avatarUrl });
    } catch (error) {
        res.status(500).json({ msg: "Error uploading avatar", error });// Return a 500 error if something goes wrong
    }
});

module.exports = router;
