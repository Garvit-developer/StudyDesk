const pomodoroModel = require("../models/pomodoro.model");

const recordSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { duration, type } = req.body;

        if (!duration || !type) {
            return res.status(400).json({
                success: false,
                message: "Duration and type are required."
            });
        }

        await pomodoroModel.saveSession(userId, duration, type);
        res.status(200).json({
            success: true,
            message: "Session recorded successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    recordSession
};
