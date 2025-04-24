const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/auth');
const placementFormRoutes = require('./routes/placementForm');
const placementDataRoutes = require('./routes/placementData');
const moreInfoRoutes = require('./routes/moreInfo');
const mentoringRoutes = require('./routes/mentoring');
const adminRoutes = require('./routes/admin');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/placement-form', placementFormRoutes);
app.use('/api/placement-data', placementDataRoutes);
app.use('/api/more-info', moreInfoRoutes);
app.use('/api/mentoring', mentoringRoutes);
app.use('/api/admin', adminRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Placement Portal API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
