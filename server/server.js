const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect Database & Start Server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🌿 SHREYA'S MEHNDI ZONE - SERVER ONLINE`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`❤️  Health:   http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
};

startServer();
