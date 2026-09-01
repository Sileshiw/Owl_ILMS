const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getCirculationReport,
  getOverdueReport,
  getBooksReport,
  getPatronsReport,
} = require("../controllers/reportController");

// Dashboard statistics
router.get("/dashboard", getDashboardStats);

// Circulation report
router.get("/circulation", getCirculationReport);

// Overdue books report
router.get("/overdue", getOverdueReport);

// Books report
router.get("/books", getBooksReport);

// Patrons report
router.get("/patrons", getPatronsReport);

module.exports = router;