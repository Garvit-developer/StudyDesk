const statsModel = require("../models/stats.model");
const badgeModel = require("../models/badges.model");

const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const [global, subjects, activity, streak] = await Promise.all([
            statsModel.getGlobalStats(userId),
            statsModel.getSubjectDistribution(userId),
            statsModel.getActivityOverTime(userId),
            statsModel.getDailyStreak(userId)
        ]);

        // Badge awarding logic
        const badgePromises = [];
        if (streak >= 7) badgePromises.push(badgeModel.awardBadge(userId, 'STREAK_WARRIOR'));
        if (global.totalFlashcards >= 50) badgePromises.push(badgeModel.awardBadge(userId, 'FLASHCARD_MASTER'));
        if (global.focusMinutes >= 500) badgePromises.push(badgeModel.awardBadge(userId, 'FOCUS_GIANT'));

        if (badgePromises.length > 0) {
            await Promise.all(badgePromises);
        }

        // Fetch earned badges
        const badges = await badgeModel.getBadgesByUserId(userId);

        res.status(200).json({
            success: true,
            stats: {
                global: { ...global, streak },
                subjects,
                activity,
                badges
            }
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching statistics"
        });
    }
};

module.exports = {
    getUserStats
};
