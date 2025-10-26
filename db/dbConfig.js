// db/dbConfig.js
const mysql = require('mysql2/promise');
require('dotenv').config({ silent: true }); // disables dotenv logs

// ✅ Log environment variables (without password)
console.log('🔹 Connecting to MySQL:');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);
console.log('Port:', process.env.DB_PORT);

// ✅ Create a MySQL connection pool
const dbConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds
});

// ✅ Retry logic for initial connection
async function testConnection(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await dbConnection.getConnection();
      console.log('✅ Database connected successfully!');
      console.log(`👤 Connected as user: ${process.env.DB_USER}`);
      console.log(`🗄️  Database name: ${process.env.DB_NAME}`);
      console.log(`🌐 Host: ${process.env.DB_HOST}`);
      console.log(`🔌 Port: ${process.env.DB_PORT}`);
      connection.release();
      return;
    } catch (err) {
      console.warn(`⚠️ DB connection failed (attempt ${i + 1}/${retries}): ${err.message}`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  console.error('❌ Unable to connect to the database after multiple attempts.');
  process.exit(1); // Stop the app if DB connection fails
}

// Immediately test the connection on startup
testConnection();

// ✅ Export the pool for controllers
module.exports = dbConnection;
