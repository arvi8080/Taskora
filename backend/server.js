const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expert-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB connected successfully');

  // Create default admin user if none exists
  const User = require('./models/User');
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      name: 'Admin User',
      email: 'admin@expertservice.com',
      phone: '9999999999',
      password: hashedPassword,
      isVerified: true,
      isActive: true,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Default admin user created: admin@expertservice.com / admin123');
  }
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/health', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/experts', require('./routes/experts'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/tracking', require('./routes/tracking'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/video', require('./routes/video'));
app.use('/api/voice', require('./routes/voice'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/community', require('./routes/community'));
app.use('/api/warranty', require('./routes/warranty'));

// Root route for health check (MUST be before 404 handler)
app.get('/', (req, res) => {
  res.json({ 
    message: 'Taskora API Running 🚀',
    version: '1.0.0',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Root route for health check (alternative)
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Join user to their room
  socket.on('join-room', (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined their room`);
  });

  // Expert location tracking
  socket.on('expert-location', (data) => {
    socket.broadcast.emit('expert-location-update', data);
  });

  // Emergency alerts
  socket.on('emergency-alert', (data) => {
    socket.broadcast.emit('emergency-notification', data);
  });

  // Video call events
  socket.on('video-call-request', (data) => {
    socket.to(data.expertId).emit('incoming-video-call', data);
  });

  socket.on('video-call-accept', (data) => {
    socket.to(data.userId).emit('video-call-accepted', data);
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Dynamic pricing cron job (runs every 5 minutes)
cron.schedule('*/5 * * * *', () => {
  const PricingService = require('./services/pricingService');
  PricingService.updateDynamicPricing();
});

// Gamification rewards cron job (runs daily at midnight)
cron.schedule('0 0 * * *', () => {
  const { processDailyRewards } = require('./services/gamificationService');
  processDailyRewards();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, io };
