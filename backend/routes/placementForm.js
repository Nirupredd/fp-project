const express = require('express');
const router = express.Router();
const PlacementData = require('../models/PlacementData');
const { protect } = require('../middleware/auth');

// @route   POST /api/placement-form
// @desc    Submit placement form data
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      rollno,
      branch,
      mobilenumber1,
      mobilenumber2,
      personalEmail,
      collegeEmail,
      cgpa,
      companyPlaced,
      package,
      yearJoined,
      yearPlaced,
      campus,
      status,
      companyType
    } = req.body;

    // Check if record with this roll number already exists
    const existingRecord = await PlacementData.findOne({ rollno });
    if (existingRecord) {
      return res.status(400).json({ message: 'Record with this roll number already exists' });
    }

    // Create new placement record
    const placementData = new PlacementData({
      firstname,
      lastname,
      rollno,
      branch,
      mobilenumber1,
      mobilenumber2,
      personalEmail,
      collegeEmail,
      cgpa,
      companyPlaced,
      package,
      yearJoined,
      yearPlaced,
      campus,
      status,
      companyType,
      createdBy: req.user._id
    });

    const savedData = await placementData.save();
    res.status(201).json(savedData);
  } catch (error) {
    console.error('Placement form submission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/placement-form/:id
// @desc    Update placement form data
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const placementData = await PlacementData.findById(req.params.id);

    if (!placementData) {
      return res.status(404).json({ message: 'Placement data not found' });
    }

    // Check if user is authorized to update this record
    if (placementData.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this record' });
    }

    // Update record
    const updatedData = await PlacementData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedData);
  } catch (error) {
    console.error('Placement form update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
