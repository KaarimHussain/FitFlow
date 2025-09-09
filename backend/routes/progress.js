const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Progress = require('../models/Progress');

// @route   GET /api/progress
// @desc    Get all progress entries for a user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const progressEntries = await Progress.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: progressEntries.length,
            data: progressEntries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while fetching progress entries'
        });
    }
});

// @route   GET /api/progress/:id
// @desc    Get a single progress entry
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const progressEntry = await Progress.findById(req.params.id);
        
        if (!progressEntry) {
            return res.status(404).json({
                success: false,
                message: 'Progress entry not found'
            });
        }
        
        // Check if user owns the progress entry
        if (progressEntry.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to view this progress entry'
            });
        }
        
        res.status(200).json({
            success: true,
            data: progressEntry
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Progress entry not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while fetching progress entry'
        });
    }
});

// @route   POST /api/progress
// @desc    Create a new progress entry
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { weight, measurements, performance, date, notes } = req.body;
        
        const progressEntry = await Progress.create({
            user: req.user.id,
            weight,
            measurements,
            performance,
            date,
            notes
        });
        
        res.status(201).json({
            success: true,
            data: progressEntry
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
            message: 'Server error while creating progress entry'
        });
    }
});

// @route   PUT /api/progress/:id
// @desc    Update a progress entry
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let progressEntry = await Progress.findById(req.params.id);
        
        if (!progressEntry) {
            return res.status(404).json({
                success: false,
                message: 'Progress entry not found'
            });
        }
        
        // Check if user owns the progress entry
        if (progressEntry.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this progress entry'
            });
        }
        
        progressEntry = await Progress.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true,
            data: progressEntry
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Progress entry not found'
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
            message: 'Server error while updating progress entry'
        });
    }
});

// @route   DELETE /api/progress/:id
// @desc    Delete a progress entry
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const progressEntry = await Progress.findById(req.params.id);
        
        if (!progressEntry) {
            return res.status(404).json({
                success: false,
                message: 'Progress entry not found'
            });
        }
        
        // Check if user owns the progress entry
        if (progressEntry.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this progress entry'
            });
        }
        
        await progressEntry.deleteOne();
        
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Progress entry not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while deleting progress entry'
        });
    }
});

module.exports = router;