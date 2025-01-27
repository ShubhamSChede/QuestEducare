// controllers/adminController.js
const User = require('../models/User');
const Video = require('../models/Video');
const Access = require('../models/Access');
const cloudinary = require('../config/cloudinary');
const AccessRequest = require('../models/AccessRequest');

exports.uploadVideo = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video',
      folder: 'education-videos'
    });

    const video = await Video.create({
      title: req.body.title,
      description: req.body.description,
      cloudinaryUrl: result.secure_url,
      cloudinaryId: result.public_id,
      class: req.body.class,
      subject: req.body.subject,
      subcategory: req.body.subcategory,
      chapter: req.body.chapter,
      category: Array.isArray(req.body.category) ? req.body.category : [req.body.category], // Handle both array and single value
      uploadedBy: req.user._id
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.grantAccess = async (req, res) => {
  try {
    const { studentId, subject, categories } = req.body;

    // Check if access already exists
    const existingAccess = await Access.findOne({
      student: studentId,
      subject: subject,
      isRevoked: false
    });

    if (existingAccess) {
      // Update existing access with new categories
      const newCategories = Array.isArray(categories) ? categories : [categories];
      existingAccess.categories = [...new Set([...existingAccess.categories, ...newCategories])];
      await existingAccess.save();
      
      // Update related request if exists
      await AccessRequest.findOneAndUpdate(
        { student: studentId, subject, status: 'pending' },
        { 
          status: 'approved',
          processedBy: req.user._id,
          processedAt: Date.now()
        }
      );

      return res.json(existingAccess);
    }


    // Create new access if it doesn't exist
    const access = await Access.create({
      student: studentId,
      subject,
      categories: Array.isArray(categories) ? categories : [categories],
      grantedBy: req.user._id
    });

     // Update any existing request to approved
     await AccessRequest.findOneAndUpdate(
      { student: studentId, subject, status: 'pending' },
      { 
        status: 'approved',
        processedBy: req.user._id,
        processedAt: Date.now()
      }
    );
    

    res.status(201).json(access);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.revokeAccess = async (req, res) => {
  try {
    const { studentId, subject, categories } = req.body;
    
    const access = await Access.findOne({
      student: studentId,
      subject: subject,
      isRevoked: false
    });

    if (!access) {
      return res.status(404).json({ error: 'Access not found' });
    }

    // Handle both array and single category input
    const categoriesToRevoke = Array.isArray(categories) ? categories : [categories];

    if (categoriesToRevoke.length === access.categories.length) {
      // Revoke entire subject access
      access.isRevoked = true;
      access.revokedAt = Date.now();
    } else {
      // Remove specific categories
      access.categories = access.categories.filter(cat => !categoriesToRevoke.includes(cat));
    }

    await access.save();
    res.json(access);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.lockStudent = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.studentId,
      { isLocked: true },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// controllers/adminController.js

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all video access requests
exports.getAllAccessRequests = async (req, res) => {
  try {
    const requests = await AccessRequest.find()
      .populate('student', 'name email class')
      .sort({ requestedAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get videos by category/subject
exports.getVideosByFilter = async (req, res) => {
  try {
    const { subject, category, class: studentClass } = req.query;
    const query = {};

    if (subject) query.subject = subject;
    if (category) query.category = category;
    if (studentClass) query.class = studentClass;

    const videos = await Video.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get student access history
exports.getStudentAccessHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get student details
    const student = await User.findById(studentId).select('-password');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get all access records (active and revoked)
    const accessHistory = await Access.find({ student: studentId })
      .populate('grantedBy', 'name email')
      .sort({ grantedAt: -1 });

    // Get all access requests
    const accessRequests = await AccessRequest.find({ student: studentId })
      .populate('processedBy', 'name email')
      .sort({ requestedAt: -1 });

    res.json({
      student,
      accessHistory,
      accessRequests
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


