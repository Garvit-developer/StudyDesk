const express = require("express");
const router = express.Router();
const {
  askAI,
  getSavedResponses,
  deleteResponse,
  deleteAllResponses,
  summarizeText
} = require("../controllers/ai.controller");
const { askAIValidation } = require("../validations/askAiValidation.js");
const limitAskAI = require("../middlewares/limitAskAi.js");
const validateInput = require("../middlewares/validateInput.js");
const isAuthenticated = require("../middlewares/validateLogin.js");

const {
  generateRoadmap,
  getMyRoadmaps,
  deleteRoadmap: deleteRoadmapRoute
} = require("../controllers/roadmap.controller");

router.post("/ask-ai", limitAskAI, askAIValidation, validateInput, askAI);
router.get("/ai-responses", isAuthenticated, getSavedResponses);
//delete single response
router.delete("/ai-responses/:id", isAuthenticated, deleteResponse);
//delete all responses of particular user
router.delete("/responses/all", isAuthenticated, deleteAllResponses);

// Roadmap routes
router.post("/generate-roadmap", isAuthenticated, generateRoadmap);
router.get("/my-roadmaps", isAuthenticated, getMyRoadmaps);
router.delete("/roadmaps/:id", isAuthenticated, deleteRoadmapRoute);

// Summarizer route
router.post("/summarize", isAuthenticated, summarizeText);

module.exports = router;
