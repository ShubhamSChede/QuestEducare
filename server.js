// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const videoRoutes = require('./routes/videoRoutes');

const app = express();

// Create single admin function
const createSingleAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Quest@123', 10);
      await User.create({
        email: 'admin@questacademy.com',
        password: hashedPassword,
        name: 'Quest Admin',
        role: 'admin'
      });
      console.log('Admin account created');
    }
  } catch (error) {
    console.error('Admin creation failed:', error);
  }
};

// Connect to DB and initialize admin
connectDB().then(() => {
  createSingleAdmin();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));