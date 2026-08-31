const express = require("express");

const {
    issueItem,
    getCirculations,
    getCirculationById,
    returnItem,
    renewItem
} = require("../controllers/circulationController");

const router = express.Router();

// GET all circulation records
router.get("/", getCirculations);

// GET one circulation record
router.get("/:id", getCirculationById);

// ISSUE an item
router.post("/", issueItem);

// RETURN an item
router.put("/:id/return", returnItem);

// RENEW an item
router.put("/:id/renew", renewItem);

module.exports = router;