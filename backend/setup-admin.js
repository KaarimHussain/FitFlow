const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const setupAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: 'admin@fitflow.com' });

        if (existingAdmin) {
            console.log('Admin user already exists');

            // Update the existing user to ensure they have admin role
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('Updated existing user to admin role');
        } else {
            // Create new admin user
            const adminUser = new User({
                username: 'admin',
                email: 'admin@fitflow.com',
                password: 'Admin12345@',
                role: 'admin',
                isVerified: true
            });

            await adminUser.save();
            console.log('Admin user created successfully');
        }

        console.log('Admin setup completed');
        process.exit(0);

    } catch (error) {
        console.error('Error setting up admin:', error);
        process.exit(1);
    }
};

setupAdmin();