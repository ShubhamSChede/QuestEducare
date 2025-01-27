// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');

router.get('/videos', auth, studentController.getAccessibleVideos);
router.get('/profile', auth, studentController.getProfile);
router.get('/access-requests', auth, studentController.getAccessRequests);
router.post('/access/request', auth, studentController.requestAccess);

module.exports = router;