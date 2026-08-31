const express = require("express");

const {
    getSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectsController");

const router = express.Router();

// GET all subjects
router.get("/", getSubjects);

// GET one subject
router.get("/:id", getSubjectById);

// CREATE a subject
router.post("/", createSubject);

// UPDATE a subject
router.put("/:id", updateSubject);

// DELETE a subject
router.delete("/:id", deleteSubject);

module.exports = router;