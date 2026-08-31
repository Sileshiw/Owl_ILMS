const express = require("express");

const {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} = require("../controllers/booksController");

const router = express.Router();

// GET all books
router.get("/", getBooks);

// GET one book
router.get("/:id", getBookById);

// CREATE a book
router.post("/", createBook);

// UPDATE a book
router.put("/:id", updateBook);

// DELETE a book
router.delete("/:id", deleteBook);

module.exports = router;