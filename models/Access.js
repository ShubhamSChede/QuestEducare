
// models/Access.js
const mongoose = require('mongoose');

const accessSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  class: { 
    type: String, 
    enum: ["11", "12"], 
    required: true     // Added this field
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
  grantedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  grantedAt: { 
    type: Date, 
    default: Date.now 
  },
  isRevoked: { 
    type: Boolean, 
    default: false 
  },
  revokedAt: { 
    type: Date 
  }
});

module.exports = mongoose.model('Access', accessSchema);