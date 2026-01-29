const express = require("express");
const router = express.Router();
const { generateQuiz } = require("../controllers/quiz.controller");
const isAuthenticated = require("../middlewares/validateLogin.js");

router.post("/generate-quiz", isAuthenticated, generateQuiz);

module.exports = router;
