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