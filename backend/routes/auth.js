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

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
    try {
        const { username, bio, fitnessGoals, dateOfBirth } = req.body

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            })
        }

        // Find and update user
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                username,
                bio,
                fitnessGoals,
                dateOfBirth,
            },
            {
                new: true,
                runValidators: true,
            },
        )

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                bio: user.bio,
                fitnessGoals: user.fitnessGoals,
                dateOfBirth: user.dateOfBirth,
                createdAt: user.createdAt,
            },
        })
    } catch (error) {
        // Handle Mongoose validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message)
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: messages,
            })
        }

        res.status(500).json({
            success: false,
            message: "Server error updating profile",
        })
    }
})

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put("/change-password", protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required",
            })
        }

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            })
        }

        // Find user with password
        const user = await User.findById(req.user.id).select("+password")

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        // Check current password
        const isMatch = await user.comparePassword(currentPassword)

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            })
        }

        // Update password
        user.password = newPassword
        await user.save()

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error changing password",
        })
    }
})

// @route   DELETE /api/auth/account
// @desc    Delete user account
// @access  Private
router.delete("/account", protect, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            })
        }

        // Delete user account
        await User.findByIdAndDelete(req.user.id)

        res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error deleting account",
        })
    }
})

// // @route   POST /api/auth/make-admin
// // @desc    Make current user admin (temporary route for setup)
// // @access  Private
// router.post("/make-admin", protect, async (req, res) => {
//     try {
//         if (!req.user) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized access",
//             })
//         }

//         // Update user role to admin
//         const user = await User.findByIdAndUpdate(
//             req.user.id,
//             { role: 'admin' },
//             { new: true }
//         )

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             })
//         }

//         res.status(200).json({
//             success: true,
//             message: "User role updated to admin successfully",
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email,
//                 role: user.role,
//                 isVerified: user.isVerified,
//                 createdAt: user.createdAt,
//             }
//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server error updating role",
//         })
//     }
// })

// // @route   POST /api/auth/setup-admin
// // @desc    Create admin user (one-time setup)
// // @access  Public
// router.post("/setup-admin", async (req, res) => {
//     try {
//         // Check if admin user already exists
//         const existingAdmin = await User.findOne({ email: 'admin@fitflow.com' });
        
//         if (existingAdmin) {
//             // Update the existing user to ensure they have admin role
//             existingAdmin.role = 'admin';
//             existingAdmin.isVerified = true;
//             await existingAdmin.save();
            
//             return res.status(200).json({
//                 success: true,
//                 message: "Admin user already exists and role updated",
//                 user: {
//                     id: existingAdmin._id,
//                     username: existingAdmin.username,
//                     email: existingAdmin.email,
//                     role: existingAdmin.role,
//                     isVerified: existingAdmin.isVerified
//                 }
//             });
//         }

//         // Create new admin user
//         const adminUser = new User({
//             username: 'admin',
//             email: 'admin@fitflow.com',
//             password: 'Admin12345@',
//             role: 'admin',
//             isVerified: true
//         });

//         await adminUser.save();

//         res.status(201).json({
//             success: true,
//             message: "Admin user created successfully",
//             user: {
//                 id: adminUser._id,
//                 username: adminUser.username,
//                 email: adminUser.email,
//                 role: adminUser.role,
//                 isVerified: adminUser.isVerified
//             }
//         });

//     } catch (error) {
//         console.error('Error setting up admin:', error);
//         res.status(500).json({
//             success: false,
//             message: "Server error creating admin user",
//         });
//     }
// })

module.exports = router;