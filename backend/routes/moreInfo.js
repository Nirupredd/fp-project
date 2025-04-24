const express = require('express');
const router = express.Router();
const PlacementData = require('../models/PlacementData');
const { protect } = require('../middleware/auth');

// @route   GET /api/more-info/stats
// @desc    Get placement statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    // Get total number of placed students
    const totalPlaced = await PlacementData.countDocuments({ status: 'Placed' });

    // Only proceed with other aggregations if there's data
    let avgPackage = null;
    let highestPackage = null;
    let companyWisePlacement = [];
    let branchWisePlacement = [];

    if (totalPlaced > 0) {
      // Get average package
      const avgPackageResult = await PlacementData.aggregate([
        { $match: { status: 'Placed' } },
        { $group: { _id: null, avgPackage: { $avg: '$package' } } }
      ]);
      avgPackage = avgPackageResult.length > 0 ? avgPackageResult[0].avgPackage : null;

      // Get highest package
      const highestPackageResult = await PlacementData.aggregate([
        { $match: { status: 'Placed' } },
        { $group: { _id: null, highestPackage: { $max: '$package' } } }
      ]);
      highestPackage = highestPackageResult.length > 0 ? highestPackageResult[0].highestPackage : null;

      // Get company-wise placement count
      companyWisePlacement = await PlacementData.aggregate([
        { $match: { status: 'Placed' } },
        { $group: { _id: '$companyPlaced', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      // Get branch-wise placement count
      branchWisePlacement = await PlacementData.aggregate([
        { $match: { status: 'Placed' } },
        { $group: { _id: '$branch', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
    }

    res.json({
      totalPlaced,
      avgPackage,
      highestPackage,
      companyWisePlacement,
      branchWisePlacement
    });
  } catch (error) {
    console.error('Get placement stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/more-info/companies
// @desc    Get list of companies that have recruited
// @access  Public
router.get('/companies', async (req, res) => {
  try {
    // Check if there's any placement data first
    const placementCount = await PlacementData.countDocuments({ status: 'Placed' });

    if (placementCount === 0) {
      // Return empty array if no placements
      return res.json([]);
    }

    const companies = await PlacementData.aggregate([
      { $match: { status: 'Placed' } },
      { $group: { _id: '$companyPlaced', count: { $sum: 1 }, avgPackage: { $avg: '$package' } } },
      { $sort: { count: -1 } }
    ]);

    res.json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/more-info/year-wise
// @desc    Get year-wise placement data
// @access  Public
router.get('/year-wise', async (req, res) => {
  try {
    // Check if there's any placement data first
    const placementCount = await PlacementData.countDocuments({ status: 'Placed' });

    if (placementCount === 0) {
      // Return empty array if no placements
      return res.json([]);
    }

    const yearWisePlacement = await PlacementData.aggregate([
      { $match: { status: 'Placed' } },
      {
        $project: {
          year: { $year: '$yearPlaced' },
          package: 1
        }
      },
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 },
          avgPackage: { $avg: '$package' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(yearWisePlacement);
  } catch (error) {
    console.error('Get year-wise placement data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
