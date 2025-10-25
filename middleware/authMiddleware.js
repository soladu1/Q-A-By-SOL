const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();

function authMiddleware(req, res, next) {
  console.log("🔎 Authorization header received:", req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded successfully:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Invalid or expired token.' });
  }
}

module.exports = authMiddleware;
