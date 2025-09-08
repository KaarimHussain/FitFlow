const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Schemas
const WorkoutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    tags: [String],
    exercises: [{
        name: String,
        sets: Number,
        reps: String,
        weight: Number,
        rest: Number,
        notes: String
    }],
    duration: Number,
    caloriesBurned: Number,
    date: { type: Date, default: Date.now },
    userId: String
});

const NutritionSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    meals: {
        breakfast: [{
            food: String,
            calories: Number
        }],
        lunch: [{
            food: String,
            calories: Number
        }],
        snacks: [{
            food: String,
            calories: Number
        }],
        dinner: [{
            food: String,
            calories: Number
        }]
    },
    totalCalories: Number,
    macros: {
        protein: Number,
        carbs: Number,
        fat: Number
    },
    userId: String
});

const ProgressSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    measurements: {
        weight: Number,
        bodyFat: Number,
        chest: Number,
        waist: Number,
        arms: Number,
        thighs: Number
    },
    performance: [{
        exercise: String,
        weight: Number,
        reps: Number,
        sets: Number
    }],
    userId: String
});

// Models
const Workout = mongoose.model('Workout', WorkoutSchema);
const Nutrition = mongoose.model('Nutrition', NutritionSchema);
const Progress = mongoose.model('Progress', ProgressSchema);

// Routes
app.use('/api/auth', authRoutes);

// Workout Routes
app.post('/api/workouts', async (req, res) => {
    try {
        const workout = new Workout(req.body);
        await workout.save();
        res.status(201).json({ message: 'Workout created successfully', workout });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/workouts', async (req, res) => {
    try {
        const workouts = await Workout.find().sort({ date: -1 });
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/workouts/:id', async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }
        res.json(workout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Nutrition Routes
app.post('/api/nutrition', async (req, res) => {
    try {
        const nutrition = new Nutrition(req.body);
        await nutrition.save();
        res.status(201).json({ message: 'Nutrition logged successfully', nutrition });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/nutrition', async (req, res) => {
    try {
        const { date } = req.query;
        const query = date ? { date: new Date(date) } : {};
        const nutrition = await Nutrition.find(query).sort({ date: -1 });
        res.json(nutrition);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/nutrition/food', async (req, res) => {
    try {
        const { meal, food, calories, date } = req.body;

        let nutritionEntry = await Nutrition.findOne({
            date: new Date(date || new Date().toDateString())
        });

        if (!nutritionEntry) {
            nutritionEntry = new Nutrition({
                date: new Date(date || new Date().toDateString()),
                meals: { breakfast: [], lunch: [], snacks: [], dinner: [] },
                totalCalories: 0,
                macros: { protein: 0, carbs: 0, fat: 0 }
            });
        }

        nutritionEntry.meals[meal].push({ food, calories });
        nutritionEntry.totalCalories += calories;

        await nutritionEntry.save();
        res.json({ message: 'Food added successfully', nutritionEntry });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Progress Routes
app.post('/api/progress', async (req, res) => {
    try {
        const progress = new Progress(req.body);
        await progress.save();
        res.status(201).json({ message: 'Progress logged successfully', progress });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/progress', async (req, res) => {
    try {
        const progress = await Progress.find().sort({ date: -1 });
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/progress/measurements', async (req, res) => {
    try {
        const measurements = req.body;
        const progress = new Progress({
            measurements,
            date: new Date()
        });
        await progress.save();
        res.json({ message: 'Measurements logged successfully', progress });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/progress/performance', async (req, res) => {
    try {
        const performance = req.body;
        const progress = new Progress({
            performance: [performance],
            date: new Date()
        });
        await progress.save();
        res.json({ message: 'Performance logged successfully', progress });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Dashboard Stats Route
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayWorkouts = await Workout.countDocuments({
            date: { $gte: today }
        });

        const todayNutrition = await Nutrition.findOne({
            date: { $gte: today }
        });

        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);

        const weeklyWorkouts = await Workout.countDocuments({
            date: { $gte: weekStart }
        });

        const stats = {
            todayWorkouts,
            caloriesConsumed: todayNutrition ? todayNutrition.totalCalories : 0,
            weeklyWorkouts,
            // Add more stats as needed
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// MongoDB connection
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

// Basic route
app.get('/', (req, res) => {
    res.send('Fitness Tracker API');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});