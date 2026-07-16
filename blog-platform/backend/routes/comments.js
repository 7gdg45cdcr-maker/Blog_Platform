const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add comment
router.post('/', auth, async (req, res) => {
    try {
        const { content, postId } = req.body;
        
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        const comment = new Comment({
            content,
            author: req.user.id,
            post: postId
        });
        await comment.save();
        
        const populatedComment = await Comment.findById(comment._id)
            .populate('author', 'username');
        
        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }
        
        await comment.deleteOne();
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;