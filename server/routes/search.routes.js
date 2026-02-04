const express = require("express");
const router = express.Router();
const { searchAll } = require("../controllers/search.controller");
const isAuthenticated = require("../middlewares/validateLogin.js");

router.get("/search", isAuthenticated, searchAll);

module.exports = router;
