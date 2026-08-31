const express = require("express");

const {
    getAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor
} = require("../controllers/authorsController");

const router = express.Router();

// GET all authors
router.get("/", getAuthors);

// GET one author
router.get("/:id", getAuthorById);

// CREATE an author
router.post("/", createAuthor);

// UPDATE an author
router.put("/:id", updateAuthor);

// DELETE an author
router.delete("/:id", deleteAuthor);

module.exports = router;