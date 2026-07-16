const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create post
router.post('/', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = new Post({
            title,
            content,
            author: req.user.id
        });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update post
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to edit this post' });
        }
        
        post.title = title || post.title;
        post.content = content || post.content;
        post.updatedAt = Date.now();
        await post.save();
        
        res.json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }
        
        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;