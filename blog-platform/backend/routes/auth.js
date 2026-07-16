const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const user = new User({ username, email, password });
        await user.save();
        
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '7d' }
        );
        
        res.status(201).json({ token, user: { id: user._id, username, email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '7d' }
        );
        
        res.json({ token, user: { id: user._id, username: user.username, email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;