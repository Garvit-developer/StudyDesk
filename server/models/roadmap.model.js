const db = require("../config/db.js");

const roadmapTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS roadmaps (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            topic VARCHAR(255) NOT NULL,
            grade VARCHAR(50) NOT NULL,
            content JSON NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `;
    try {
        await db.query(query);
        console.log("Roadmaps table created or already exists.");
    } catch (err) {
        console.error("Error creating roadmaps table:", err.message);
    }
};

const saveRoadmap = async (userId, topic, grade, content) => {
    const sql = `
        INSERT INTO roadmaps (user_id, topic, grade, content)
        VALUES (?, ?, ?, ?)
    `;
    const values = [userId, topic, grade, JSON.stringify(content)];
    try {
        const [result] = await db.query(sql, values);
        return result;
    } catch (err) {
        throw new Error("Error saving roadmap: " + err.message);
    }
};

const getUserRoadmaps = async (userId) => {
    const sql = "SELECT * FROM roadmaps WHERE user_id = ? ORDER BY created_at DESC";
    try {
        const [results] = await db.query(sql, [userId]);
        return results.map(r => ({
            ...r,
            content: typeof r.content === 'string' ? JSON.parse(r.content) : r.content
        }));
    } catch (err) {
        throw new Error("Error fetching user roadmaps: " + err.message);
    }
};

const getRoadmapById = async (userId, roadmapId) => {
    const sql = "SELECT * FROM roadmaps WHERE id = ? AND user_id = ?";
    try {
        const [results] = await db.query(sql, [roadmapId, userId]);
        if (results.length === 0) return null;
        const r = results[0];
        return {
            ...r,
            content: typeof r.content === 'string' ? JSON.parse(r.content) : r.content
        };
    } catch (err) {
        throw new Error("Error fetching roadmap: " + err.message);
    }
};

const deleteRoadmap = async (userId, roadmapId) => {
    const sql = "DELETE FROM roadmaps WHERE id = ? AND user_id = ?";
    try {
        const [result] = await db.query(sql, [roadmapId, userId]);
        return result;
    } catch (err) {
        throw new Error("Error deleting roadmap: " + err.message);
    }
};

module.exports = {
    roadmapTable,
    saveRoadmap,
    getUserRoadmaps,
    getRoadmapById,
    deleteRoadmap
};
