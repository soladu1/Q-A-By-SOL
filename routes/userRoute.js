const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // fixed spelling
const { register, login, checkUser } = require("../controller/controller");

// ✅ Register route
router.post("/register", register);

// ✅ Login route
router.post("/login", login);

// ✅ Check user route (protected)
router.get("/check", authMiddleware, checkUser);

module.exports = router;
