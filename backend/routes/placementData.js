const express = require('express');
const router = express.Router();
const PlacementData = require('../models/PlacementData');
const { protect, faculty, facultyOrMentor } = require('../middleware/auth');

// @route   GET /api/placement-data
// @desc    Get all placement data
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const placementData = await PlacementData.find({})
      .sort({ createdAt: -1 });

    res.json(placementData);
  } catch (error) {
    console.error('Get placement data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/placement-data/:id
// @desc    Get placement data by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const placementData = await PlacementData.findById(req.params.id);

    if (placementData) {
      res.json(placementData);
    } else {
      res.status(404).json({ message: 'Placement data not found' });
    }
  } catch (error) {
    console.error('Get placement data by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/placement-data/user/:userId
// @desc    Get placement data by user ID
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
  try {
    // Check if user is requesting their own data or is faculty/admin
    if (req.user._id.toString() !== req.params.userId && req.user.role === 'student') {
      return res.status(403).json({ message: 'Not authorized to access this data' });
    }

    const placementData = await PlacementData.find({ createdBy: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(placementData);
  } catch (error) {
    console.error('Get placement data by user ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/placement-data/:id
// @desc    Delete placement data
// @access  Private (Faculty/Admin/Mentor only)
router.delete('/:id', protect, facultyOrMentor, async (req, res) => {
  try {
    const placementData = await PlacementData.findById(req.params.id);

    if (!placementData) {
      return res.status(404).json({ message: 'Placement data not found' });
    }

    await placementData.remove();
    res.json({ message: 'Placement data removed' });
  } catch (error) {
    console.error('Delete placement data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
