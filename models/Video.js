// models/Video.js

const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    cloudinaryUrl: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    class: { type: String, required: true }, // Changed quotes
    subject: { type: String, required: true }, // Changed quotes
    subcategory: { type: String, required: true },
    chapter: { type: String, required: true },
    isJEE: { type: Boolean, default: false },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('Video', videoSchema);