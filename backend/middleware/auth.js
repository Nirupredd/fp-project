const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);

    // Find user by id
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found with ID: ' + decoded.id });
    }

    console.log('User found:', user.username, 'Role:', user.role);

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Not authorized, token failed: ' + error.message });
  }
};

// Middleware to check if user is admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
};

// Middleware to check if user is faculty
exports.faculty = (req, res, next) => {
  if (req.user && (req.user.role === 'faculty' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as faculty' });
  }
};

// Middleware to check if user is faculty or mentor
exports.facultyOrMentor = (req, res, next) => {
  if (req.user && (req.user.role === 'faculty' || req.user.role === 'admin' || req.user.role === 'mentor')) {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized for this action' });
  }
};

// Middleware to check if user is mentor
exports.mentor = (req, res, next) => {
  if (req.user && req.user.role === 'mentor') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as mentor' });
  }
};

// Middleware to check if user is student
exports.student = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  console.log('User role check:', req.user.role);

  if (req.user.role === 'student') {
    next();
  } else {
    return res.status(403).json({ message: `Not authorized as student. Current role: ${req.user.role}` });
  }
};
