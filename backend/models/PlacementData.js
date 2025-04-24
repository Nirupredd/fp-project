const mongoose = require('mongoose');

const PlacementDataSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  rollno: {
    type: String,
    required: true,
    unique: true
  },
  branch: {
    type: String,
    required: true
  },
  mobilenumber1: {
    type: String,
    required: true
  },
  mobilenumber2: {
    type: String
  },
  personalEmail: {
    type: String,
    required: true
  },
  collegeEmail: {
    type: String,
    required: true
  },
  cgpa: {
    type: Number,
    required: true
  },
  companyPlaced: {
    type: String,
    required: true
  },
  package: {
    type: Number,
    required: true
  },
  yearJoined: {
    type: Date,
    required: true
  },
  yearPlaced: {
    type: Date,
    required: true
  },
  campus: {
    type: String,
    enum: ['On Campus', 'Off Campus'],
    required: true
  },
  status: {
    type: String,
    enum: ['Placed', 'Not Placed', 'Internship'],
    required: true
  },
  companyType: {
    type: String,
    enum: ['Product Based', 'Service Based', 'Startup', 'Other'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('PlacementData', PlacementDataSchema);
