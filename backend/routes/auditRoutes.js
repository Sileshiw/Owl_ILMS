const express = require("express");
const router = express.Router();

const {
  getAuditLogs,
  getAuditLogById,
} = require("../controllers/auditController");

// Get audit logs
router.get("/", getAuditLogs);

// Get one audit log
router.get("/:id", getAuditLogById);

module.exports = router;