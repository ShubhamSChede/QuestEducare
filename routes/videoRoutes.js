// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const auth = require('../middleware/auth');

router.get('/', auth, videoController.getVideosByFilters);

module.exports = router;