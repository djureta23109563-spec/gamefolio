//backend/routes/post.routes.js
const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const { upload, handleUploadError } = require('../middleware/upload');
const router = express.Router();

// GET /api/posts — Public: all published posts (newest first)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({ status: 'published' })
            .populate('author', 'name profilePic')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET /api/posts/:id — Public: single post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name profilePic');
        
        if (!post || post.status === 'removed') {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.json(post);
    } catch (err) {
        console.error('Error fetching post:', err);
        res.status(500).json({ message: err.message });
    }
});

// POST /api/posts — Member or Admin: create new post
router.post('/', protect, memberOrAdmin, upload.single('image'), handleUploadError, async (req, res) => {
    try {
        const { title, body } = req.body;
        
        // Validate required fields
        if (!title || !body) {
            return res.status(400).json({ message: 'Title and body are required' });
        }
        
        const image = req.file ? req.file.filename : '';
        
        const post = await Post.create({ 
            title, 
            body, 
            image, 
            author: req.user._id 
        });
        
        await post.populate('author', 'name profilePic');
        res.status(201).json(post);
    } catch (err) {
        console.error('Post creation error:', err);
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/posts/:id — Edit: only post owner OR admin
router.put('/:id', protect, memberOrAdmin, upload.single('image'), handleUploadError, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        const isOwner = post.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        if (req.body.title) post.title = req.body.title;
        if (req.body.body) post.body = req.body.body;
        if (req.file) post.image = req.file.filename;
        
        await post.save();
        
        await post.populate('author', 'name profilePic');
        res.json(post);
    } catch (err) {
        console.error('Post update error:', err);
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/posts/:id — Delete: only post owner OR admin
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        const isOwner = post.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Post deletion error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;