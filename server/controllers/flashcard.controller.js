const {
    createFlashcard,
    getUserFlashcards,
    deleteFlashcard,
    toggleMastered,
} = require("../models/flashcard.model.js");

const addFlashcard = async (req, res) => {
    const userId = req.user.id;
    const { question, answer, subject } = req.body;

    if (!question || !answer) {
        return res.status(400).json({ message: "Question and Answer are required" });
    }

    try {
        const cardId = await createFlashcard(userId, question, answer, subject || "General");
        res.status(201).json({
            success: true,
            message: "Flashcard added successfully",
            cardId,
        });
    } catch (err) {
        console.error("[Add Flashcard Error]", err.message);
        res.status(500).json({ message: "Database error" });
    }
};

const getMyFlashcards = async (req, res) => {
    const userId = req.user.id;

    try {
        const flashcards = await getUserFlashcards(userId);
        res.status(200).json({
            success: true,
            flashcards,
        });
    } catch (err) {
        console.error("[Get Flashcards Error]", err.message);
        res.status(500).json({ message: "Database error" });
    }
};

const removeFlashcard = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const result = await deleteFlashcard(userId, id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Flashcard not found" });
        }
        res.status(200).json({ success: true, message: "Flashcard deleted" });
    } catch (err) {
        console.error("[Delete Flashcard Error]", err.message);
        res.status(500).json({ message: "Database error" });
    }
};

const updateMastery = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { isMastered } = req.body;

    try {
        const result = await toggleMastered(userId, id, isMastered);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Flashcard not found" });
        }
        res.status(200).json({ success: true, message: "Mastery status updated" });
    } catch (err) {
        console.error("[Update Mastery Error]", err.message);
        res.status(500).json({ message: "Database error" });
    }
};

module.exports = {
    addFlashcard,
    getMyFlashcards,
    removeFlashcard,
    updateMastery,
};
