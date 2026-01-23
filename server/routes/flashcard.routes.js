const express = require("express");
const router = express.Router();
const {
    addFlashcard,
    getMyFlashcards,
    removeFlashcard,
    updateMastery,
} = require("../controllers/flashcard.controller");
const isAuthenticated = require("../middlewares/validateLogin.js");

router.post("/flashcards", isAuthenticated, addFlashcard);
router.get("/flashcards", isAuthenticated, getMyFlashcards);
router.delete("/flashcards/:id", isAuthenticated, removeFlashcard);
router.patch("/flashcards/:id/mastery", isAuthenticated, updateMastery);

module.exports = router;
