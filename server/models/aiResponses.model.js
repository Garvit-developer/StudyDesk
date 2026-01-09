const db = require("../config/db.js");

const aiResponseTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS ai_responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        explanation TEXT,
        steps JSON,
        subject VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  try {
    await db.query(query);
    console.log("AI response table created or already exists.");
  } catch (err) {
    console.error("Error creating AI response table:", err.message);
  }
};

const saveAIResponse = async (userId, data) => {
  const sql = `
    INSERT INTO ai_responses (user_id, question, answer, explanation, steps, subject)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    userId,
    data.question,
    data.answer,
    data.explanation,
    JSON.stringify(data.steps),
    data.subject,
  ];

  try {
    const result = await db.query(sql, values);
    return result;
  } catch (err) {
    throw new Error("Error saving AI response: " + err.message);
  }
};

const getUserAIResponses = async (userId, page = 1, limit = 10, search = "") => {
  const offset = (page - 1) * limit;
  let searchQuery = "";
  let searchParams = [];

if (search) {
  searchQuery = `
    AND (
      question LIKE ? 
      OR answer LIKE ? 
      OR subject LIKE ?
      OR DATE_FORMAT(created_at, '%d %b %Y') LIKE ?        -- 08 Sep 2025
      OR DATE_FORMAT(created_at, '%d %M %Y') LIKE ?        -- 08 September 2025
      OR DATE_FORMAT(created_at, '%Y-%m-%d') LIKE ?        -- 2025-09-08
      OR DATE_FORMAT(created_at, '%M %Y') LIKE ?           -- September 2025
      OR DATE_FORMAT(created_at, '%b %Y') LIKE ?           -- Sep 2025
      OR DATE_FORMAT(created_at, '%d %M %Y %h:%i %p') LIKE ? -- 08 September 2025 05:02 pm
    )
  `;

  const likeSearch = `%${search}%`;
  searchParams = [
    likeSearch,
    likeSearch,
    likeSearch,
    likeSearch,
    likeSearch,
    likeSearch,
    likeSearch,
    likeSearch,
    likeSearch,
  ];
}



  const countQuery = `
    SELECT COUNT(*) AS total 
    FROM ai_responses 
    WHERE user_id = ? ${searchQuery}
  `;

  const dataQuery = `
    SELECT * FROM ai_responses
    WHERE user_id = ? ${searchQuery}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  try {
    // Count total with search
    const [countResult] = await db.query(countQuery, [userId, ...searchParams]);
    const total = countResult[0].total;

    // Fetch paginated results with search
    const [dataResults] = await db.query(dataQuery, [
      userId,
      ...searchParams,
      limit,
      offset,
    ]);

    return {
      total,
      responses: dataResults,
    };
  } catch (err) {
    throw new Error("Error fetching AI responses: " + err.message);
  }
};



const deleteUserAIResponse = async (userId, responseId) => {
  const sql = "DELETE FROM ai_responses WHERE id = ? AND user_id = ?";
  try {
    const [result] = await db.query(sql, [responseId, userId]);
    return result;
  } catch (err) {
    throw new Error("Error deleting AI response: " + err.message);
  }
};

const deleteAllUserResponses = async (userId) => {
  const sql = "DELETE FROM ai_responses WHERE user_id = ?";
  try {
    const [result] = await db.query(sql, [userId]);
    return result;
  } catch (err) {
    throw new Error("Error deleting all responses: " + err.message);
  }
};

module.exports = {
  aiResponseTable,
  saveAIResponse,
  getUserAIResponses,
  deleteUserAIResponse,
  deleteAllUserResponses,
};
