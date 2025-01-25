// models/Subject.js

const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, enum: ['Physics', 'Chemistry', 'Math', 'Biology'], required: true },
    subcategories: [{
      name: { type: String, required: true },
      chapters: [{ type: String }]
    }]
  });

module.exports = mongoose.model('Subject', subjectSchema);