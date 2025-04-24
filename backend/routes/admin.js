const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Query = require('../models/Query');
const { protect, faculty } = require('../middleware/auth');

// @route   POST /api/admin/remove-all-mentors
// @desc    Remove all mentor assignments from students
// @access  Private (Faculty/Admin only)
router.post('/remove-all-mentors', protect, faculty, async (req, res) => {
  try {
    console.log('Removing all mentor assignments initiated by:', req.user.username);
    
    // Find all students with assigned mentors
    const studentsWithMentors = await User.find({ 
      role: 'student',
      assignedMentor: { $ne: null }
    });
    
    const count = studentsWithMentors.length;
    console.log(`Found ${count} students with assigned mentors`);
    
    // Update all students to remove their assigned mentors
    const updateResult = await User.updateMany(
      { role: 'student' },
      { $set: { assignedMentor: null } }
    );
    
    console.log('Update result:', updateResult);
    
    // Return success response with count of affected students
    res.json({ 
      message: 'All mentor assignments have been removed successfully', 
      affectedStudents: count 
    });
  } catch (error) {
    console.error('Error removing mentor assignments:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
