// controllers/studentController.js
const Access = require('../models/Access');
const Video = require('../models/Video');
const AccessRequest = require('../models/AccessRequest');
const User = require('../models/User');
  
  exports.requestAccess = async (req, res) => {
  try {
    const { subject, categories } = req.body;
    
    // Check if student already has access
    const existingAccess = await Access.findOne({
      student: req.user._id,
      subject,
      isRevoked: false
    });

    if (existingAccess) {
      return res.status(400).json({ 
        error: 'You already have access to this subject' 
      });
    }

    // Check for pending request
    const pendingRequest = await AccessRequest.findOne({
      student: req.user._id,
      subject,
      status: 'pending'
    });

    if (pendingRequest) {
      return res.status(400).json({ 
        error: 'You already have a pending request for this subject' 
      });
    }

    const accessRequest = await AccessRequest.create({
      student: req.user._id,
      subject,
      categories: Array.isArray(categories) ? categories : [categories]
    });

    res.status(201).json(accessRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAccessibleVideos = async (req, res) => {
  try {
    // Get all access grants for the student
    const accesses = await Access.find({
      student: req.user._id,
      isRevoked: false
    });

    // Get videos based on granted access
    const videos = await Video.find({
      $and: [
        {
          subject: {
            $in: accesses.map(access => access.subject)
          }
        },
        {
          category: {
            $elemMatch: {
              $in: accesses.flatMap(access => access.categories)
            }
          }
        }
      ]
    });

    res.json(videos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get student profile and access information
exports.getProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select('-password');
    
    // Get all active accesses
    const accesses = await Access.find({
      student: req.user._id,
      isRevoked: false
    });

    // Format access information
    const accessInfo = accesses.map(access => ({
      subject: access.subject,
      categories: access.categories,
      grantedAt: access.grantedAt
    }));

    res.json({
      profile: student,
      accesses: accessInfo
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get access request status
exports.getAccessRequests = async (req, res) => {
  try {
    const requests = await AccessRequest.find({
      student: req.user._id
    }).sort({ requestedAt: -1 }); // Most recent first

    res.json(requests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};