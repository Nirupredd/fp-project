const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Query = require('../models/Query');
const { protect, student, mentor } = require('../middleware/auth');

// @route   GET /api/mentoring/mentors
// @desc    Get all mentors
// @access  Private (Students only)
router.get('/mentors', protect, async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(mentors);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/mentoring/mentor/:id
// @desc    Get mentor by ID
// @access  Private
router.get('/mentor/:id', protect, async (req, res) => {
  try {
    const mentor = await User.findOne({ _id: req.params.id, role: 'mentor' })
      .select('-password');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json(mentor);
  } catch (error) {
    console.error('Error fetching mentor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/mentoring/assign
// @desc    Assign mentor to student
// @access  Private (Students only)
router.post('/assign', protect, student, async (req, res) => {
  try {
    const { mentorId } = req.body;

    if (!mentorId) {
      return res.status(400).json({ message: 'Mentor ID is required' });
    }

    console.log('Assigning mentor with ID:', mentorId, 'to student:', req.user._id);

    // Check if mentor exists
    const mentor = await User.findOne({ _id: mentorId, role: 'mentor' });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check if student already has a mentor
    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.assignedMentor) {
      return res.status(400).json({ message: 'You already have an assigned mentor' });
    }

    // Assign mentor to student using findByIdAndUpdate to avoid validation issues
    const updatedStudent = await User.findByIdAndUpdate(
      req.user._id,
      { assignedMentor: mentorId },
      { new: true }
    );

    res.json({ message: 'Mentor assigned successfully', mentor });
  } catch (error) {
    console.error('Error assigning mentor:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/mentoring/my-mentor
// @desc    Get student's assigned mentor
// @access  Private (Students only)
router.get('/my-mentor', protect, student, async (req, res) => {
  try {
    console.log('Fetching assigned mentor for student:', req.user._id);

    // First check if the student exists
    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if mentor is assigned
    if (!student.assignedMentor) {
      console.log('No mentor assigned for student:', student.username);
      return res.status(404).json({ message: 'No mentor assigned' });
    }

    // Get mentor details
    const mentor = await User.findById(student.assignedMentor).select('-password');
    if (!mentor) {
      // If the assigned mentor ID doesn't exist in the database
      return res.status(404).json({ message: 'Assigned mentor not found. The mentor may have been removed from the system.' });
    }

    console.log('Assigned mentor found:', mentor.username);
    res.json(mentor);
  } catch (error) {
    console.error('Error fetching assigned mentor:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/mentoring/my-students
// @desc    Get mentor's assigned students
// @access  Private (Mentors only)
router.get('/my-students', protect, mentor, async (req, res) => {
  try {
    const students = await User.find({
      assignedMentor: req.user._id,
      role: 'student'
    }).select('-password');

    res.json(students);
  } catch (error) {
    console.error('Error fetching assigned students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/mentoring/query
// @desc    Create a new query
// @access  Private (Students only)
router.post('/query', protect, student, async (req, res) => {
  try {
    const { title, question } = req.body;

    // Check if student has an assigned mentor
    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!student.assignedMentor) {
      return res.status(400).json({ message: 'You need to assign a mentor first' });
    }

    // Create new query
    const query = await Query.create({
      student: req.user._id,
      mentor: student.assignedMentor,
      title,
      question
    });

    res.status(201).json(query);
  } catch (error) {
    console.error('Error creating query:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/mentoring/queries
// @desc    Get all queries for a student
// @access  Private (Students only)
router.get('/queries', protect, student, async (req, res) => {
  try {
    const queries = await Query.find({ student: req.user._id })
      .populate('mentor', 'username email')
      .sort({ createdAt: -1 });

    res.json(queries);
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/mentoring/mentor-queries
// @desc    Get all queries for a mentor
// @access  Private (Mentors only)
router.get('/mentor-queries', protect, mentor, async (req, res) => {
  try {
    const queries = await Query.find({ mentor: req.user._id })
      .populate('student', 'username email')
      .sort({ createdAt: -1 });

    res.json(queries);
  } catch (error) {
    console.error('Error fetching mentor queries:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/mentoring/query/:id
// @desc    Update a query (add response)
// @access  Private (Mentors only)
router.put('/query/:id', protect, mentor, async (req, res) => {
  try {
    const { response } = req.body;

    console.log('Received response submission:', { queryId: req.params.id, mentorId: req.user._id, response });

    if (!response) {
      return res.status(400).json({ message: 'Response text is required' });
    }

    // Find query
    const query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    // Check if mentor is assigned to this query
    if (query.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this query' });
    }

    // Update query using findByIdAndUpdate to avoid validation issues
    const updatedQuery = await Query.findByIdAndUpdate(
      req.params.id,
      {
        response: response,
        status: 'answered',
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('student', 'username email');

    console.log('Query updated successfully');
    res.json(updatedQuery);
  } catch (error) {
    console.error('Error updating query:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/mentoring/query/:id
// @desc    Get a query by ID
// @access  Private
router.get('/query/:id', protect, async (req, res) => {
  try {
    const query = await Query.findById(req.params.id)
      .populate('student', 'username email')
      .populate('mentor', 'username email');

    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    // Check if user is authorized to view this query
    if (
      req.user.role !== 'admin' &&
      query.student._id.toString() !== req.user._id.toString() &&
      query.mentor._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this query' });
    }

    res.json(query);
  } catch (error) {
    console.error('Error fetching query:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
