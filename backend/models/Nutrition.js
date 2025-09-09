const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mealType: {
        type: String,
        enum: {
            values: ['breakfast', 'lunch', 'dinner', 'snack', 'other'],
            message: 'Meal type must be breakfast, lunch, dinner, snack, or other'
        },
        required: [true, 'Meal type is required']
    },
    foodItems: [{
        name: {
            type: String,
            required: [true, 'Food name is required']
        },
        calories: {
            type: Number,
            min: [0, 'Calories cannot be negative']
        },
        protein: {
            type: Number, // in grams
            min: [0, 'Protein cannot be negative']
        },
        carbs: {
            type: Number, // in grams
            min: [0, 'Carbs cannot be negative']
        },
        fat: {
            type: Number, // in grams
            min: [0, 'Fat cannot be negative']
        },
        quantity: {
            type: Number,
            min: [0, 'Quantity cannot be negative']
        },
        unit: {
            type: String
        }
    }],
    totalCalories: {
        type: Number,
        min: [0, 'Total calories cannot be negative']
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Nutrition', nutritionSchema);