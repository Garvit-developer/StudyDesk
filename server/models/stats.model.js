const db = require("../config/db.js");

const getGlobalStats = async (userId) => {
    const [aiCount] = await db.query(
        "SELECT COUNT(*) as total FROM ai_responses WHERE user_id = ?",
        [userId]
    );

    const [flashcardStats] = await db.query(
        "SELECT COUNT(*) as total, SUM(CASE WHEN is_mastered = 1 THEN 1 ELSE 0 END) as mastered FROM flashcards WHERE user_id = ?",
        [userId]
    );

    return {
        questionsAsked: aiCount[0].total,
        totalFlashcards: flashcardStats[0].total,
        masteredFlashcards: flashcardStats[0].mastered || 0,
    };
};

const getSubjectDistribution = async (userId) => {
    const [aiSubjects] = await db.query(
        "SELECT subject, COUNT(*) as count FROM ai_responses WHERE user_id = ? GROUP BY subject",
        [userId]
    );

    const [flashcardSubjects] = await db.query(
        "SELECT subject, COUNT(*) as count FROM flashcards WHERE user_id = ? GROUP BY subject",
        [userId]
    );

    // Merge results
    const distribution = {};
    aiSubjects.forEach(s => {
        const sub = s.subject || 'General';
        distribution[sub] = (distribution[sub] || 0) + s.count;
    });
    flashcardSubjects.forEach(s => {
        const sub = s.subject || 'General';
        distribution[sub] = (distribution[sub] || 0) + s.count;
    });

    return Object.keys(distribution).map(key => ({
        subject: key,
        count: distribution[key]
    }));
};

const getActivityOverTime = async (userId) => {
    // Get last 7 days of activity
    const [activity] = await db.query(`
        SELECT DATE(created_at) as date, COUNT(*) as count 
        FROM (
            SELECT created_at FROM ai_responses WHERE user_id = ?
            UNION ALL
            SELECT created_at FROM flashcards WHERE user_id = ?
        ) as combined
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
    `, [userId, userId]);

    return activity;
};

module.exports = {
    getGlobalStats,
    getSubjectDistribution,
    getActivityOverTime
};
