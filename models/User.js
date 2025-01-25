// // models/User.js
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   name: { type: String, required: true },
//   role: { type: String, enum: ['admin', 'student'], required: true },
//   class: { type: String, enum: ['11', '12'], required: function() { return this.role === 'student' } },
//   isLocked: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('User', userSchema);

// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'student'], 
    required: true,
    validate: {
      validator: async function(role) {
        if (role === 'admin') {
          const adminCount = await mongoose.models.User.countDocuments({ role: 'admin' });
          return adminCount === 0;
        }
        return true;
      },
      message: 'Only one admin account is allowed'
    }
  },
  class: { type: String, enum: ['11', '12'], required: function() { return this.role === 'student' } },
  isLocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);