// controllers/videoController.js
exports.getVideosByFilters = async (req, res) => {
    try {
      const { class: studentClass, subject, subcategory, chapter, isJEE } = req.query;
      const query = {};
  
      if (studentClass) query.class = studentClass;
      if (subject) query.subject = subject;
      if (subcategory) query.subcategory = subcategory;
      if (chapter) query.chapter = chapter;
      if (isJEE) query.isJEE = isJEE === 'true';
  
      const videos = await Video.find(query);
      res.json(videos);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };