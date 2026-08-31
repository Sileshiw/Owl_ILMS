const pool = require("../config/database");

// GET all books
const getBooks = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM books
             ORDER BY book_id DESC`
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            books: result.rows
        });

    } catch (error) {
        console.error("Error fetching books:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch books",
            error: error.message
        });
    }
};


// GET one book by ID
const getBookById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM books
             WHERE book_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            book: result.rows[0]
        });

    } catch (error) {
        console.error("Error fetching book:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch book",
            error: error.message
        });
    }
};


// CREATE a new book
const createBook = async (req, res) => {
    try {
        const {
            isbn,
            title,
            subtitle,
            edition,
            publication_year,
            language,
            description,
            call_number
        } = req.body;

        if (!isbn || !title) {
            return res.status(400).json({
                success: false,
                message: "ISBN and title are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO books
            (
                isbn,
                title,
                subtitle,
                edition,
                publication_year,
                language,
                description,
                call_number
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                isbn,
                title,
                subtitle || null,
                edition || null,
                publication_year || null,
                language || null,
                description || null,
                call_number || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            book: result.rows[0]
        });

    } catch (error) {
        console.error("Error creating book:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create book",
            error: error.message
        });
    }
};


// UPDATE a book
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            isbn,
            title,
            subtitle,
            edition,
            publication_year,
            language,
            description,
            call_number
        } = req.body;

        const result = await pool.query(
            `UPDATE books
             SET
                isbn = $1,
                title = $2,
                subtitle = $3,
                edition = $4,
                publication_year = $5,
                language = $6,
                description = $7,
                call_number = $8,
                updated_at = CURRENT_TIMESTAMP
             WHERE book_id = $9
             RETURNING *`,
            [
                isbn,
                title,
                subtitle || null,
                edition || null,
                publication_year || null,
                language || null,
                description || null,
                call_number || null,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            book: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating book:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update book",
            error: error.message
        });
    }
};


// DELETE a book
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM books
             WHERE book_id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            book: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting book:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete book",
            error: error.message
        });
    }
};


module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};