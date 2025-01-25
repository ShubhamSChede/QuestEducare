// controllers/adminController.js
const User = require('../models/User');
const Video = require('../models/Video');
const Access = require('../models/Access');
const cloudinary = require('../config/cloudinary');

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
      isJEE: req.body.isJEE === 'true',
      uploadedBy: req.user._id
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.grantAccess = async (req, res) => {
  try {
    const { studentId, videoId } = req.body;
    const access = await Access.create({
      student: studentId,
      video: videoId,
      grantedBy: req.user._id
    });
    res.status(201).json(access);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.revokeAccess = async (req, res) => {
  try {
    const access = await Access.findOneAndUpdate(
      { student: req.body.studentId, video: req.body.videoId },
      { isRevoked: true, revokedAt: Date.now() },
      { new: true }
    );
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