//backend/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
    try {
        // Connect directly to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected successfully');
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@thefolio.com' });
        
        if (existingAdmin) {
            console.log('Admin account already exists!');
            console.log('Email: admin@thefolio.com');
            console.log('Password: Admin@1234');
            process.exit(0);
        }
        
        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@thefolio.com',
            password: 'Admin@1234',
            role: 'admin',
            status: 'active'
        });
        
        console.log('Admin account created successfully!');
        console.log('Email: admin@thefolio.com');
        console.log('Password: Admin@1234');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();