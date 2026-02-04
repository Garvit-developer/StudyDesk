const db = require("../config/db.js");

const initBadgesTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS badges (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      badge_type VARCHAR(255) NOT NULL,
      earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_badge (user_id, badge_type),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
    try {
        await db.query(query);
        console.log("Badges table created or already exists.");
    } catch (err) {
        console.error("Error creating badges table:", err.message);
    }
};

const getBadgesByUserId = async (userId) => {
    const [rows] = await db.query("SELECT * FROM badges WHERE user_id = ?", [userId]);
    return rows;
};

const awardBadge = async (userId, badgeType) => {
    try {
        const [result] = await db.query(
            "INSERT IGNORE INTO badges (user_id, badge_type) VALUES (?, ?)",
            [userId, badgeType]
        );
        return result.insertId;
    } catch (err) {
        console.error("Award Badge Error:", err);
        return null;
    }
};

module.exports = {
    initBadgesTable,
    getBadgesByUserId,
    awardBadge
};
