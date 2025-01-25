// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
      console.log("Auth Header:", req.header('Authorization')); // Debug log
      const token = req.header('Authorization').replace('Bearer ', '');
      console.log("Token:", token); // Debug log
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded:", decoded); // Debug log
      
      const user = await User.findById(decoded.id);
      if (!user || user.isLocked) {
        throw new Error();
      }
  
      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      console.log("Auth Error:", error); // Debug log
      res.status(401).json({ error: 'Please authenticate' });
    }
  };

module.exports = auth;