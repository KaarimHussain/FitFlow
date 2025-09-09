const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weight: {
        type: Number,
        min: [0, 'Weight cannot be negative']
    },
    measurements: {
        chest: {
            type: Number,
            min: [0, 'Chest measurement cannot be negative']
        },
        waist: {
            type: Number,
            min: [0, 'Waist measurement cannot be negative']
        },
        hips: {
            type: Number,
            min: [0, 'Hips measurement cannot be negative']
        },
        arms: {
            type: Number,
            min: [0, 'Arms measurement cannot be negative']
        },
        thighs: {
            type: Number,
            min: [0, 'Thighs measurement cannot be negative']
        }
    },
    performance: {
        benchPress: {
            type: Number, // in kg or lbs
            min: [0, 'Bench press cannot be negative']
        },
        squat: {
            type: Number, // in kg or lbs
            min: [0, 'Squat cannot be negative']
        },
        deadlift: {
            type: Number, // in kg or lbs
            min: [0, 'Deadlift cannot be negative']
        },
        run5k: {
            type: Number, // in minutes
            min: [0, '5K run time cannot be negative']
        }
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

module.exports = mongoose.model('Progress', progressSchema);