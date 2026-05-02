// ============================================
// TripIQ Backend - Main Server
// ============================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tripiq', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/driver-auth', require('./routes/driverAuth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/vehicles', require('./routes/vehicles'));
//app.use('/api/reviews', require('./routes/reviews'));
//app.use('/api/destinations', require('./routes/destinations'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TripIQ API is running' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong!',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 TripIQ Backend running on port ${PORT}`);
});
