const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Nutrition = require('../models/Nutrition');

// @route   GET /api/nutrition
// @desc    Get all nutrition entries for a user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const nutritionEntries = await Nutrition.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: nutritionEntries.length,
            data: nutritionEntries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while fetching nutrition entries'
        });
    }
});

// @route   GET /api/nutrition/:id
// @desc    Get a single nutrition entry
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const nutritionEntry = await Nutrition.findById(req.params.id);
        
        if (!nutritionEntry) {
            return res.status(404).json({
                success: false,
                message: 'Nutrition entry not found'
            });
        }
        
        // Check if user owns the nutrition entry
        if (nutritionEntry.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to view this nutrition entry'
            });
        }
        
        res.status(200).json({
            success: true,
            data: nutritionEntry
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Nutrition entry not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while fetching nutrition entry'
        });
    }
});

// @route   POST /api/nutrition
// @desc    Create a new nutrition entry
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { mealType, foodItems, totalCalories, date, notes } = req.body;
        
        // Calculate total calories if not provided
        let calculatedCalories = totalCalories;
        if (!totalCalories && foodItems && foodItems.length > 0) {
            calculatedCalories = foodItems.reduce((total, item) => {
                return total + (item.calories || 0);
            }, 0);
        }
        
        const nutritionEntry = await Nutrition.create({
            user: req.user.id,
            mealType,
            foodItems,
            totalCalories: calculatedCalories,
            date,
            notes
        });
        
        res.status(201).json({
            success: true,
            data: nutritionEntry
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
            message: 'Server error while creating nutrition entry'
        });
    }
});

// @route   PUT /api/nutrition/:id
// @desc    Update a nutrition entry
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let nutritionEntry = await Nutrition.findById(req.params.id);
        
        if (!nutritionEntry) {
            return res.status(404).json({
                success: false,
                message: 'Nutrition entry not found'
            });
        }
        
        // Check if user owns the nutrition entry
        if (nutritionEntry.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this nutrition entry'
            });
        }
        
        // Calculate total calories if not provided
        let { totalCalories, foodItems } = req.body;
        if (!totalCalories && foodItems && foodItems.length > 0) {
            totalCalories = foodItems.reduce((total, item) => {
                return total + (item.calories || 0);
            }, 0);
            req.body.totalCalories = totalCalories;
        }
        
        nutritionEntry = await Nutrition.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true,
            data: nutritionEntry
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Nutrition entry not found'
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
            message: 'Server error while updating nutrition entry'
        });
    }
});

// @route   DELETE /api/nutrition/:id
// @desc    Delete a nutrition entry
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const nutritionEntry = await Nutrition.findById(req.params.id);
        
        if (!nutritionEntry) {
            return res.status(404).json({
                success: false,
                message: 'Nutrition entry not found'
            });
        }
        
        // Check if user owns the nutrition entry
        if (nutritionEntry.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this nutrition entry'
            });
        }
        
        await nutritionEntry.deleteOne();
        
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Nutrition entry not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while deleting nutrition entry'
        });
    }
});

module.exports = router;