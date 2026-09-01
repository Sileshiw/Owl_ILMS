const express = require("express");
const router = express.Router();

const {
  getHolds,
  getHoldById,
  createHold,
  updateHold,
  deleteHold,
} = require("../controllers/holdController");

// Get all holds
router.get("/", getHolds);

// Get one hold
router.get("/:id", getHoldById);

// Create a hold
router.post("/", createHold);

// Update a hold
router.put("/:id", updateHold);

// Delete/cancel a hold
router.delete("/:id", deleteHold);

module.exports = router;