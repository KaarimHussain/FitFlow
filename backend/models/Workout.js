const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Workout name is required'],
        trim: true
    },
    category: {
        type: String,
        enum: {
            values: ['strength', 'cardio', 'flexibility', 'other'],
            message: 'Category must be strength, cardio, flexibility, or other'
        },
        default: 'other'
    },
    exercises: [{
        name: {
            type: String,
            required: [true, 'Exercise name is required']
        },
        sets: {
            type: Number,
            min: [1, 'Sets must be at least 1']
        },
        reps: {
            type: Number,
            min: [1, 'Reps must be at least 1']
        },
        weight: {
            type: Number,
            min: [0, 'Weight cannot be negative']
        },
        notes: {
            type: String
        }
    }],
    tags: [{
        type: String,
        trim: true
    }],
    date: {
        type: Date,
        default: Date.now
    },
    duration: {
        type: Number, // in minutes
        min: [0, 'Duration cannot be negative']
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);