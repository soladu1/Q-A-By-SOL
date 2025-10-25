// src/app.js

// ✅ Import dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ✅ Initialize express app
const app = express();

// ✅ Use Render-assigned port (default to 5500 locally)
const PORT = process.env.PORT || 5500;

// ✅ Database connection
const dbConnection = require('./db/dbConfig');

// ✅ Import routes and middleware
const userRoute = require('./routes/userRoute');
const questionRoute = require('./routes/questionRoute');
const authMiddleware = require('./middleware/authMiddleware');

// ✅ Configure and enable CORS
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// ✅ Parse incoming JSON requests
app.use(express.json());

// ✅ Register routes
app.use('/users', userRoute);
app.use('/questions', authMiddleware, questionRoute);

// ✅ Root endpoint (for Render health check)
app.get('/', (req, res) => {
  res.send('✅ Server is running successfully!');
});

// ✅ Start server only after confirming DB connection
async function start() {
  try {
    // Test database connection
    const [rows] = await dbConnection.query("SELECT 1 AS test");
    console.log("✅ Database connected successfully:", rows);

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Exit if DB connection fails
  }
}

start();

// ✅ Export app for testing or serverless use
module.exports = app;
