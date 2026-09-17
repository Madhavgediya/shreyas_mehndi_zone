const mongoose = require('mongoose');
const dns = require('dns');

// Fallback to public DNS servers if local/ISP DNS fails to resolve MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Continue if dns override is unavailable
}

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shreyas_mehndi_zone';
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`🌿 MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    console.log('👉 Please ensure MongoDB is running locally (e.g. mongodb://127.0.0.1:27017/shreyas_mehndi_zone)');
    console.log('👉 Or provide a valid MONGODB_URI in your .env file.\n');
    return null;
  }
};

module.exports = connectDB;
