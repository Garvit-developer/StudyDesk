const express = require("express");
const router = express.Router();
const { getUserStats } = require("../controllers/stats.controller");
const isAuthenticated = require("../middlewares/validateLogin.js");

router.get("/stats", isAuthenticated, getUserStats);

module.exports = router;
