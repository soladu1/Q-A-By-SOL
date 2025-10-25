// controllers/questionController.js
const dbconnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid"); // ✅ For generating unique question IDs

async function postQuestion(req, res) {
  try {
    const { title, description, tag } = req.body;
    const userId = req.user.userid; // ✅ Comes from authMiddleware

    // ✅ Validate required fields
    if (!title || !description) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Title and description are required." });
    }

    // ✅ Generate unique question ID
    const questionId = uuidv4();

    // ✅ Insert question into the database
    const query = `
      INSERT INTO questions (userid, title, description, tag)
      VALUES (?, ?, ?, ?)
    `;
    await dbconnection.query(query, [
      userId,
      title,
      description,
      tag || null,
    ]);

    // ✅ Respond with success and the new question ID
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Question posted successfully!", questionId });
  } catch (error) {
    console.error("❌ Error posting question:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
}

module.exports = { postQuestion };
