const express = require("express");

const {
    getPatrons,
    getPatronById,
    createPatron,
    updatePatron,
    deletePatron
} = require("../controllers/patronsController");

const router = express.Router();

// GET all patrons
router.get("/", getPatrons);

// GET one patron
router.get("/:id", getPatronById);

// CREATE a patron
router.post("/", createPatron);

// UPDATE a patron
router.put("/:id", updatePatron);

// DELETE a patron
router.delete("/:id", deletePatron);

module.exports = router;