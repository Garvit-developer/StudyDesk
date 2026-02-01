const express = require("express");
const router = express.Router();
const { recordSession } = require("../controllers/pomodoro.controller");
const isAuthenticated = require("../middlewares/validateLogin.js");

router.get("/stats", isAuthenticated, getUserStats);
router.post("/pomodoro/session", isAuthenticated, recordSession);

module.exports = router;
