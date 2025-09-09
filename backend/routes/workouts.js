const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Workout = require('../models/Workout');

// @route   GET /api/workouts
// @desc    Get all workouts for a user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: workouts.length,
            data: workouts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while fetching workouts'
        });
    }
});

// @route   GET /api/workouts/:id
// @desc    Get a single workout
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        
        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }
        
        // Check if user owns the workout
        if (workout.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to view this workout'
            });
        }
        
        res.status(200).json({
            success: true,
            data: workout
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while fetching workout'
        });
    }
});

// @route   POST /api/workouts
// @desc    Create a new workout
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { name, category, exercises, tags, duration, notes } = req.body;
        
        const workout = await Workout.create({
            user: req.user.id,
            name,
            category,
            exercises,
            tags,
            duration,
            notes
        });
        
        res.status(201).json({
            success: true,
            data: workout
        });
    } catch (error) {
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
            message: 'Server error while creating workout'
        });
    }
});

// @route   PUT /api/workouts/:id
// @desc    Update a workout
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let workout = await Workout.findById(req.params.id);
        
        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }
        
        // Check if user owns the workout
        if (workout.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this workout'
            });
        }
        
        workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true,
            data: workout
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }
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
            message: 'Server error while updating workout'
        });
    }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete a workout
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        
        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }
        
        // Check if user owns the workout
        if (workout.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this workout'
            });
        }
        
        await workout.deleteOne();
        
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while deleting workout'
        });
    }
});

module.exports = router;