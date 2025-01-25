// controllers/studentController.js
exports.getAccessibleVideos = async (req, res) => {
    try {
      const accesses = await Access.find({
        student: req.user._id,
        isRevoked: false
      }).populate('video');
      
      const videos = accesses.map(access => access.video);
      res.json(videos);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };