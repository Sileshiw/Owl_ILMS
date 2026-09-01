const express = require("express");
const router = express.Router();

const {
  healthCheck,
  systemInfo,
} = require("../controllers/systemController");

// System health
router.get("/health", healthCheck);

// System information
router.get("/info", systemInfo);

module.exports = router;