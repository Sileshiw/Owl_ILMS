const pool = require("../config/database");

// Link a subject to a book
const addBookSubject = async (req, res) => {
    try {
        const { book_id, subject_id } = req.body;

        if (!book_id || !subject_id) {
            return res.status(400).json({
                success: false,
                message: "book_id and subject_id are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO book_subjects (book_id, subject_id)
             VALUES ($1, $2)
             RETURNING *`,
            [book_id, subject_id]
        );

        res.status(201).json({
            success: true,
            message: "Subject linked to book successfully",
            book_subject: result.rows[0]
        });

    } catch (error) {
        console.error("Error linking subject to book:", error);

        res.status(500).json({
            success: false,
            message: "Failed to link subject to book",
            error: error.message
        });
    }
};


// Get all subjects for a specific book
const getSubjectsByBook = async (req, res) => {
    try {
        const { book_id } = req.params;

        const result = await pool.query(
            `SELECT
                s.subject_id,
                s.name,
                s.description
             FROM subjects s
             INNER JOIN book_subjects bs
                ON s.subject_id = bs.subject_id
             WHERE bs.book_id = $1
             ORDER BY s.name`,
            [book_id]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            subjects: result.rows
        });

    } catch (error) {
        console.error("Error fetching book subjects:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch book subjects",
            error: error.message
        });
    }
};


module.exports = {
    addBookSubject,
    getSubjectsByBook
};