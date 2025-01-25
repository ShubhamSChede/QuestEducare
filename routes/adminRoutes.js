// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const upload = require('../middleware/upload');
const isAdmin = require('../middleware/admin');
const auth = require('../middleware/auth');
// routes/adminRoutes.js
router.post('/videos/upload', auth, isAdmin, upload.single('video'), adminController.uploadVideo);
router.post('/access/grant', auth, isAdmin, adminController.grantAccess);
router.post('/access/revoke', auth, isAdmin, adminController.revokeAccess);
router.patch('/students/:studentId/lock', auth, isAdmin, adminController.lockStudent);

module.exports = router;

