const mongoose = require('mongoose');

/**
 * Connect to MongoDB using MONGO_URI or MONGODB_URI from environment variables.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  console.log('ENV PATH:', __dirname);
  console.log('Mongo URI:', uri);

  if (!uri) {
    throw new Error('MongoDB URI is missing. Set MONGO_URI or MONGODB_URI in your .env file.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
