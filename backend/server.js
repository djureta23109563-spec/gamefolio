//backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('DB Connection Error:', err));

// CORS
app.use(cors({ 
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint - ADD THIS
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Auto-create admin account - ADD THIS
const createAdminIfNotExists = async () => {
    try {
        const User = require('./models/User');
        const adminExists = await User.findOne({ email: 'admin@thefolio.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin User',
                email: 'admin@thefolio.com',
                password: 'Admin@1234',
                role: 'admin',
                status: 'active'
            });
            console.log('✅ Admin account created: admin@thefolio.com / Admin@1234');
        } else {
            console.log('✅ Admin account already exists');
        }
    } catch (error) {
        console.log('Admin check failed:', error.message);
    }
};
createAdminIfNotExists();

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});