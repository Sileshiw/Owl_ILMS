const pool = require("../config/database");

// Add an author to a book
const addBookAuthor = async (req, res) => {
    try {
        const { book_id, author_id } = req.body;

        if (!book_id || !author_id) {
            return res.status(400).json({
                success: false,
                message: "book_id and author_id are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO book_authors (book_id, author_id)
             VALUES ($1, $2)
             RETURNING *`,
            [book_id, author_id]
        );

        res.status(201).json({
            success: true,
            message: "Author linked to book successfully",
            book_author: result.rows[0]
        });

    } catch (error) {
        console.error("Error linking author to book:", error);

        res.status(500).json({
            success: false,
            message: "Failed to link author to book",
            error: error.message
        });
    }
};


// Get authors for a specific book
const getAuthorsByBook = async (req, res) => {
    try {
        const { book_id } = req.params;

        const result = await pool.query(
            `SELECT
                a.author_id,
                a.first_name,
                a.last_name,
                a.bio
             FROM authors a
             INNER JOIN book_authors ba
                ON a.author_id = ba.author_id
             WHERE ba.book_id = $1
             ORDER BY a.last_name, a.first_name`,
            [book_id]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            authors: result.rows
        });

    } catch (error) {
        console.error("Error fetching book authors:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch book authors",
            error: error.message
        });
    }
};


module.exports = {
    addBookAuthor,
    getAuthorsByBook
};