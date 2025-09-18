const express = require('express');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Nutrition = require('../models/Nutrition');
const Progress = require('../models/Progress');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Apply authentication and admin check to all routes
router.use(protect);
router.use(adminOnly);

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/stats', async (req, res) => {
    try {
        console.log('Admin stats endpoint called');
        
        // Get total counts
        const totalUsers = await User.countDocuments();
        const totalWorkouts = await Workout.countDocuments();
        const totalNutritionEntries = await Nutrition.countDocuments();
        const totalProgressEntries = await Progress.countDocuments();

        // Get active users (users who have logged in within the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // For now, we'll use createdAt as a proxy for last login since we don't track login dates
        const activeUsers = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        // Get new users this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const newUsersThisMonth = await User.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        const stats = {
            totalUsers,
            totalWorkouts,
            totalNutritionEntries,
            totalProgressEntries,
            activeUsers,
            newUsersThisMonth
        };

        console.log('Admin stats:', stats);

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching admin statistics'
        });
    }
});

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        // Get additional stats for each user
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const workoutCount = await Workout.countDocuments({ user: user._id });
                const nutritionCount = await Nutrition.countDocuments({ user: user._id });
                const progressCount = await Progress.countDocuments({ user: user._id });

                return {
                    ...user.toObject(),
                    workoutCount,
                    nutritionCount,
                    progressCount
                };
            })
        );

        res.status(200).json({
            success: true,
            data: usersWithStats
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching users'
        });
    }
});

// @route   GET /api/admin/workouts
// @desc    Get all workouts across all users
// @access  Private (Admin only)
router.get('/workouts', async (req, res) => {
    try {
        const workouts = await Workout.find({})
            .populate('user', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: workouts
        });

    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching workouts'
        });
    }
});

// @route   GET /api/admin/nutrition
// @desc    Get all nutrition entries across all users
// @access  Private (Admin only)
router.get('/nutrition', async (req, res) => {
    try {
        const nutritionEntries = await Nutrition.find({})
            .populate('user', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: nutritionEntries
        });

    } catch (error) {
        console.error('Error fetching nutrition entries:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching nutrition entries'
        });
    }
});

// @route   GET /api/admin/progress
// @desc    Get all progress entries across all users
// @access  Private (Admin only)
router.get('/progress', async (req, res) => {
    try {
        const progressEntries = await Progress.find({})
            .populate('user', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: progressEntries
        });

    } catch (error) {
        console.error('Error fetching progress entries:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching progress entries'
        });
    }
});

// @route   DELETE /api/admin/users/:userId
// @desc    Delete a user (admin only)
// @access  Private (Admin only)
router.delete('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Don't allow admin to delete themselves
        if (userId === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        // Delete user and all associated data
        await User.findByIdAndDelete(userId);
        await Workout.deleteMany({ user: userId });
        await Nutrition.deleteMany({ user: userId });
        await Progress.deleteMany({ user: userId });

        res.status(200).json({
            success: true,
            message: 'User and all associated data deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting user'
        });
    }
});

// @route   PUT /api/admin/users/:userId/role
// @desc    Update user role (admin only)
// @access  Private (Admin only)
router.put('/users/:userId/role', async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be "user" or "admin"'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user,
            message: 'User role updated successfully'
        });

    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating user role'
        });
    }
});

// @route   GET /api/admin/users/:userId/details
// @desc    Get detailed user information with all associated data
// @access  Private (Admin only)
router.get('/users/:userId/details', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const workouts = await Workout.find({ user: userId }).sort({ createdAt: -1 });
        const nutrition = await Nutrition.find({ user: userId }).sort({ createdAt: -1 });
        const progress = await Progress.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                user: {
                    ...user.toObject(),
                    workoutCount: workouts.length,
                    nutritionCount: nutrition.length,
                    progressCount: progress.length
                },
                workouts,
                nutrition,
                progress
            }
        });

    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching user details'
        });
    }
});

module.exports = router;