const bossAgent = require('../config/aiAgent.js');
const roadmapModel = require('../models/roadmap.model.js');

const generateRoadmap = async (req, res) => {
    try {
        const { topic, grade } = req.body;
        const userId = req.user.id;

        if (!topic || !grade) {
            return res.status(400).json({
                success: false,
                message: "Topic and grade are required."
            });
        }

        const result = await bossAgent.handleRoadmap(topic, grade, userId);

        if (result.success) {
            // Automatically save the generated roadmap
            await roadmapModel.saveRoadmap(userId, topic, grade, result.roadmap);

            res.status(200).json({
                success: true,
                roadmap: result.roadmap
            });
        } else {
            res.status(500).json({
                success: false,
                message: result.error || "Failed to generate roadmap."
            });
        }
    } catch (error) {
        console.error("Roadmap Controller Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const getMyRoadmaps = async (req, res) => {
    try {
        const userId = req.user.id;
        const roadmaps = await roadmapModel.getUserRoadmaps(userId);
        res.status(200).json({
            success: true,
            roadmaps
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteRoadmap = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await roadmapModel.deleteRoadmap(userId, id);
        res.status(200).json({
            success: true,
            message: "Roadmap deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    generateRoadmap,
    getMyRoadmaps,
    deleteRoadmap
};
