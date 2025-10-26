// Database connection
const dbconection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

// ✅ REGISTER
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  // ✅ Validate input
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  try {
    // ✅ Check if username or email already exists
    const [existingUsers] = await dbConnection.query(
      "SELECT userid FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Username or email already exists" });
    }

    // ✅ Check password length
    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert new user into database
    const [result] = await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    // ✅ Generate JWT token for the new user
    const token = jwt.sign(
      { userId: result.insertId, username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log(`✅ New user registered: ${username} (ID: ${result.insertId})`);

    // ✅ Send success response
    return res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      userId: result.insertId,
      username,
      token,
    });

  } catch (error) {
    console.error("❌ Error during registration:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error during registration. Please try again later.",
    });
  }
}

// ✅ LOGIN
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Email and password are required" });
  }

  try {
    const [users] = await dbconection.query(
      "SELECT userid, username, password FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid email or password" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("⚠️ JWT_SECRET not configured in .env file!");
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "JWT secret missing" });
    }

    // ✅ FIXED: include both user info + token for frontend
    const token = jwt.sign(
      { username: user.username, userid: user.userid },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Token created for user:", user.username);

    return res.status(StatusCodes.OK).json({
      message: "Login successful!",
      token,
      user: {
        username: user.username,
        userid: user.userid,
      },
    });
  } catch (error) {
    console.error("💥 Error during login:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// ✅ CHECK USER
async function checkUser(req, res) {
  try {
    if (!req.user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User not authenticated" });
    }

    const { username, userid } = req.user;

    // Optionally issue a new token
    const token = jwt.sign(
      { username, userid },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(StatusCodes.OK).json({
      user: { username, userid },
      token,
      message: "User is authenticated",
    });
  } catch (error) {
    console.error("Error in checkUser:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error: error.message });
  }
}

module.exports = { register, login, checkUser };
