// models/Access.js
const mongoose = require('mongoose');

const accessSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    grantedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    grantedAt: { type: Date, default: Date.now },
    isRevoked: { type: Boolean, default: false },
    revokedAt: { type: Date }
  });

module.exports = mongoose.model('Access', accessSchema);