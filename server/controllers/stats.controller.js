const statsModel = require("../models/stats.model");

const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const [global, subjects, activity] = await Promise.all([
            statsModel.getGlobalStats(userId),
            statsModel.getSubjectDistribution(userId),
            statsModel.getActivityOverTime(userId)
        ]);

        res.status(200).json({
            success: true,
            stats: {
                global,
                subjects,
                activity
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
