// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// --- Forget Password, OTP, and Reset Password ---
const crypto = require('crypto');
const { sendOTPEmail } = require('../utils/email');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user by email and include password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
const { protect } = require('../middleware/auth');

router.get('/me', protect, async (req, res) => {
    try {
        // Assuming you have authentication middleware that adds user to req
        // This would typically be protected by a middleware that verifies JWT
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching user data'
        });
    }
});

// @route   POST /api/auth/verify
// @desc    Verify user email (simplified)
// @access  Private
router.post('/verify', protect, async (req, res) => {
    try {
        // In a real app, you'd verify a token sent to email
        // This is a simplified version that just sets isVerified to true

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { isVerified: true },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during verification'
        });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Send OTP to user's email for password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {

    console.log("Forgot password request received");

    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpires = new Date(otpExpires);
        await user.save();
        await sendOTPEmail(email, otp);
        res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (error) {
        console.log("Error Sending OTP:", error);

        res.status(500).json({ success: false, message: 'Error sending OTP' });
    }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP for password reset
// @access  Public
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }
        const user = await User.findOne({ email });
        if (!user || !user.resetPasswordOTP) {
            return res.status(400).json({ success: false, message: 'Invalid request' });
        }
        if (user.resetPasswordOTP !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
        if (user.resetPasswordOTPExpires < new Date()) {
            return res.status(400).json({ success: false, message: 'OTP expired' });
        }
        res.status(200).json({ success: true, message: 'OTP verified' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error verifying OTP' });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using OTP
// @access  Public
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.resetPasswordOTP) {
            return res.status(400).json({ success: false, message: 'Invalid request' });
        }
        if (user.resetPasswordOTP !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
        if (user.resetPasswordOTPExpires < new Date()) {
            return res.status(400).json({ success: false, message: 'OTP expired' });
        }
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;
        await user.save();
        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error resetting password' });
    }
});

module.exports = router;