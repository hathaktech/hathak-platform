// routes/main.routes.js
const express = require("express");
const router = express.Router();
const { home } = require("../controllers/main.controller");

// Define routes
router.get("/", home);

module.exports = router;
