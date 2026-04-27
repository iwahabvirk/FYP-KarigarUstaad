const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const workerRoutes = require('./routes/workerRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const walletRoutes = require('./routes/walletRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Initialize Express app
const app = express();


// Start the server only after MongoDB is connected
async function startServer() {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  const HOST = '0.0.0.0';
  
  app.listen(PORT, HOST, () => {
    console.log(`\n✅ Server started on ${HOST}:${PORT}`);
    console.log(`📍 Available at http://localhost:${PORT} (local machine)`);
    console.log(`📱 For mobile/emulator, use your local IP: http://<YOUR_IP>:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🗄️  Database: ${process.env.MONGO_URI || process.env.MONGODB_URI || 'MongoDB Connected'}\n`);
  });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  
  console.log(`\n📨 [${new Date().toISOString()}] ${req.method.padEnd(6)} ${req.path}`);
  console.log(`   Client IP: ${clientIp}`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`   Body: ${JSON.stringify(req.body).substring(0, 100)}...`);
  }
  
  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 200 && res.statusCode < 300 ? '✅' : res.statusCode >= 300 && res.statusCode < 400 ? '🔀' : '❌';
    console.log(`   ${statusColor} Status: ${res.statusCode} | Duration: ${duration}ms`);
  });
  
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/ai', aiRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error',
  });
});

startServer();
