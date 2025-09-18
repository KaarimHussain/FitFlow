const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const nutritionRoutes = require('./routes/nutrition');
const progressRoutes = require('./routes/progress');
const adminRoutes = require('./routes/admin');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);

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