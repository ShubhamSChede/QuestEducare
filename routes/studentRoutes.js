// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');

router.get('/videos', auth, studentController.getAccessibleVideos);
router.post('/access/request', auth, studentController.requestAccess);

module.exports = router;