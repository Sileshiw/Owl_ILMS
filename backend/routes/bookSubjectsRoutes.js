const express = require("express");

const {
    addBookSubject,
    getSubjectsByBook
} = require("../controllers/bookSubjectsController");

const router = express.Router();

// Link a subject to a book
router.post("/", addBookSubject);

// Get subjects for a specific book
router.get("/book/:book_id", getSubjectsByBook);

module.exports = router;