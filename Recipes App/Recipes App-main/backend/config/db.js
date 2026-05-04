// ============================================================
// config/db.js — MongoDB connection via Mongoose
// ============================================================
const mongoose = require('mongoose');

/**
 * Establishes connection to MongoDB using the MONGO_URI env variable.
 * Exits the process on failure so the container restarts (Docker policy).
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
