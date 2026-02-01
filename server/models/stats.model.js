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

    const [pomodoroStats] = await db.query(
        "SELECT SUM(duration_minutes) as total FROM pomodoro_sessions WHERE user_id = ? AND session_type = 'work'",
        [userId]
    );

    return {
        questionsAsked: aiCount[0].total,
        totalFlashcards: flashcardStats[0].total,
        masteredFlashcards: flashcardStats[0].mastered || 0,
        focusMinutes: pomodoroStats[0].total || 0,
    };
};

const getDailyStreak = async (userId) => {
    // A simple streak logic: count consecutive days backwards from today with at least one record
    const [activityDays] = await db.query(`
        SELECT DATE(created_at) as activity_date
        FROM (
            SELECT created_at FROM ai_responses WHERE user_id = ?
            UNION ALL
            SELECT created_at FROM flashcards WHERE user_id = ?
            UNION ALL
            SELECT completed_at as created_at FROM pomodoro_sessions WHERE user_id = ?
        ) as combined
        GROUP BY DATE(created_at)
        ORDER BY activity_date DESC
    `, [userId, userId, userId]);

    if (activityDays.length === 0) return 0;

    let streak = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < activityDays.length; i++) {
        let activityDate = new Date(activityDays[i].activity_date);
        activityDate.setHours(0, 0, 0, 0);

        let diff = (today - activityDate) / (1000 * 60 * 60 * 24);

        if (diff === streak) {
            streak++;
        } else if (diff > streak) {
            break;
        }
    }

    return streak;
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
        SELECT DATE(date) as date, COUNT(*) as count 
        FROM (
            SELECT created_at as date FROM ai_responses WHERE user_id = ?
            UNION ALL
            SELECT created_at as date FROM flashcards WHERE user_id = ?
            UNION ALL
            SELECT completed_at as date FROM pomodoro_sessions WHERE user_id = ?
        ) as combined
        WHERE date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(date)
        ORDER BY date ASC
    `, [userId, userId, userId]);

    return activity;
};

module.exports = {
    getGlobalStats,
    getSubjectDistribution,
    getActivityOverTime,
    getDailyStreak
};
