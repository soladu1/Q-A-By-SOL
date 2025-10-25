// routes/questionRoute.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // ✅ keep folder name correct
const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/dbConfig");

// ✅ Controller function for posting a question
async function postQuestion(req, res) {
  try {
    const { title, description, tag } = req.body;
    const userId = req.user.userid; // from authMiddleware

    if (!title || !description) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Title and description are required" });
    }

    const query = `
      INSERT INTO questions (questionid, userid, title, description, tag)
      VALUES (NULL, ?, ?, ?, ?)
    `;
    await dbconnection.execute(query, [userId, title, description, tag || null]);

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Question posted successfully!" });
  } catch (error) {
    console.error("❌ Error posting question:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
}

// ✅ POST /api/questions
router.post("/", authMiddleware, postQuestion);

// ✅ GET /api/questions - fetch all questions
router.get("/", async (req, res) => {
  try {
    const [rows] = await dbconnection.execute(
      "SELECT * FROM questions ORDER BY questionid DESC"
    );
    return res.status(StatusCodes.OK).json(rows);
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
});

module.exports = router;
