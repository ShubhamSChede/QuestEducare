// models/AccessRequest.js
const mongoose = require('mongoose');

const accessRequestSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  subject: { 
    type: String, 
    enum: ["Physics", "Chemistry", "Math", "Biology"], 
    required: true 
  },
  categories: [{
    type: String,
    enum: ["Boards", "JEE", "NEET"],
    required: true
  }],
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  requestedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('AccessRequest', accessRequestSchema);
