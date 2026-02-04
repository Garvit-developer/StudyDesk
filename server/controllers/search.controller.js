const db = require("../config/db.js");

const searchAll = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `%${req.query.q}%`;

        const [roadmaps] = await db.query(
            "SELECT id, title, subject FROM roadmaps WHERE user_id = ? AND (title LIKE ? OR subject LIKE ?) LIMIT 5",
            [userId, query, query]
        );

        const [flashcards] = await db.query(
            "SELECT id, question, subject FROM flashcards WHERE user_id = ? AND (question LIKE ? OR answer LIKE ? OR subject LIKE ?) LIMIT 5",
            [userId, query, query, query]
        );

        const [history] = await db.query(
            "SELECT id, question, subject FROM ai_responses WHERE user_id = ? AND (question LIKE ? OR response LIKE ? OR subject LIKE ?) LIMIT 5",
            [userId, query, query, query]
        );

        res.status(200).json({
            success: true,
            results: {
                roadmaps,
                flashcards,
                history
            }
        });
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({
            success: false,
            message: "Error performing search"
        });
    }
};

module.exports = {
    searchAll
};
