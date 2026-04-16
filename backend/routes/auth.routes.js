// backend/routes/auth.routes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');
const { upload, handleUploadError } = require('../middleware/upload');
const router = express.Router();

// Helper function - generates a JWT token that expires in 7 days
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// - - POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email is already registered' });
        
        const user = await User.create({ name, email, password });
        res.status(201).json({
            token: generateToken(user.id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// - - POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });
        
        if (user.status === 'inactive') {
            return res.status(403).json({ message: 'Your account is deactivated. Please contact the admin.' });
        }
        
        const match = await user.matchPassword(password);
        if (!match) return res.status(400).json({ message: 'Invalid email or password' });
        
        res.json({
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic,
                bio: user.bio
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// - - GET /api/auth/me
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// - - PUT /api/auth/profile - Update profile with picture
router.put('/profile', protect, upload.single('profilePic'), handleUploadError, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Update fields
        if (req.body.name) user.name = req.body.name;
        if (req.body.bio) user.bio = req.body.bio;
        
        // Handle profile picture upload
        if (req.file) {
            // Delete old profile picture if exists
            if (user.profilePic && user.profilePic !== '') {
                const oldPath = path.join(__dirname, '../uploads', user.profilePic);
                try {
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                        console.log('Deleted old profile picture:', user.profilePic);
                    }
                } catch (err) {
                    console.log('Error deleting old file:', err.message);
                }
            }
            user.profilePic = req.file.filename;
        }
        
        await user.save();
        
        // Return user without password
        const updatedUser = await User.findById(user._id).select('-password');
        res.json(updatedUser);
        
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ message: err.message });
    }
});

// - - PUT /api/auth/change-password
router.put('/change-password', protect, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user._id);
        const match = await user.matchPassword(currentPassword);
        
        if (!match) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;