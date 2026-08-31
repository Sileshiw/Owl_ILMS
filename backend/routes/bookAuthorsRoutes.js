const express = require("express");

const {
    addBookAuthor,
    getAuthorsByBook
} = require("../controllers/bookAuthorsController");

const router = express.Router();

// Link an author to a book
router.post("/", addBookAuthor);

// Get all authors for a specific book
router.get("/book/:book_id", getAuthorsByBook);

module.exports = router;