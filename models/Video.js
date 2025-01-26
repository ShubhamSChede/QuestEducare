// models/Video.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  cloudinaryUrl: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  class: { type: String, enum: ["11", "12"], required: true },
  subject: { type: String, enum: ["Physics", "Chemistry", "Math", "Biology"], required: true },
  subcategory: { type: String, required: true },
  chapter: { type: String, required: true },
  category: [{
    type: String,
    enum: ["Boards", "JEE", "NEET"],
    required: true
  }],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);