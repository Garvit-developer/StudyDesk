const db = require("../config/db.js");

const pomodoroTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS pomodoro_sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            duration_minutes INT NOT NULL,
            session_type ENUM('work', 'short_break', 'long_break') NOT NULL,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `;
    try {
        await db.query(query);
        console.log("Pomodoro sessions table created or already exists.");
    } catch (err) {
        console.error("Error creating pomodoro table:", err.message);
    }
};

const saveSession = async (userId, duration, type) => {
    const sql = "INSERT INTO pomodoro_sessions (user_id, duration_minutes, session_type) VALUES (?, ?, ?)";
    try {
        const [result] = await db.query(sql, [userId, duration, type]);
        return result;
    } catch (err) {
        throw new Error("Error saving pomodoro session: " + err.message);
    }
};

const getUserFocusStats = async (userId) => {
    const sql = `
        SELECT 
            SUM(duration_minutes) as total_minutes,
            COUNT(*) as total_sessions
        FROM pomodoro_sessions 
        WHERE user_id = ? AND session_type = 'work'
    `;
    try {
        const [results] = await db.query(sql, [userId]);
        return results[0];
    } catch (err) {
        throw new Error("Error fetching focus stats: " + err.message);
    }
};

module.exports = {
    pomodoroTable,
    saveSession,
    getUserFocusStats
};
