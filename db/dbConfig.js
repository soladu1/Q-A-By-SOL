// db/dbConfig.js
const mysql = require('mysql2/promise');
require('dotenv').config({ silent: true }); // disables dotenv logs

// ✅ Log environment variables for debugging
console.log('🔹 Connecting to local MySQL:');
console.log('Host:', process.env.DB_HOST || 'localhost');
console.log('User:', process.env.DB_USER || 'root');
console.log('Database:', process.env.DB_NAME || 'evangadi-db');
console.log('Port:', process.env.DB_PORT || 3306);

// ✅ Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  // database: process.env.DB_NAME || 'evangadi-db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Immediately test the connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    console.log(`👤 Connected as user: ${process.env.DB_USER || 'root'}`);
    console.log(`🗄️  Database name: ${process.env.DB_NAME || 'evangadi-db'}`);
    console.log(`🌐 Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`🔌 Port: ${process.env.DB_PORT || 3306}`);
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1); // Stop app if DB connection fails
  }
})();

module.exports = pool;
