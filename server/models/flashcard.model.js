const db = require("../config/db.js");

const initFlashcardTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS flashcards (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      subject VARCHAR(255) DEFAULT 'General',
      is_mastered BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
    try {
        await db.query(query);
        console.log("Flashcards table created or already exists.");
    } catch (err) {
        console.error("Error creating flashcards table:", err.message);
    }
};

const createFlashcard = async (userId, question, answer, subject) => {
    const [result] = await db.query(
        "INSERT INTO flashcards (user_id, question, answer, subject) VALUES (?, ?, ?, ?)",
        [userId, question, answer, subject]
    );
    return result.insertId;
};

const getUserFlashcards = async (userId) => {
    const [rows] = await db.query(
        "SELECT * FROM flashcards WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
    );
    return rows;
};

const deleteFlashcard = async (userId, cardId) => {
    const [result] = await db.query(
        "DELETE FROM flashcards WHERE id = ? AND user_id = ?",
        [cardId, userId]
    );
    return result;
};

const toggleMastered = async (userId, cardId, isMastered) => {
    const [result] = await db.query(
        "UPDATE flashcards SET is_mastered = ? WHERE id = ? AND user_id = ?",
        [isMastered, cardId, userId]
    );
    return result;
};

module.exports = {
    initFlashcardTable,
    createFlashcard,
    getUserFlashcards,
    deleteFlashcard,
    toggleMastered,
};
