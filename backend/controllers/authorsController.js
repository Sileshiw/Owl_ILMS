const pool = require("../config/database");

// GET all authors
const getAuthors = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM authors
             ORDER BY author_id DESC`
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            authors: result.rows
        });

    } catch (error) {
        console.error("Error fetching authors:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch authors",
            error: error.message
        });
    }
};


// GET one author by ID
const getAuthorById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM authors
             WHERE author_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Author not found"
            });
        }

        res.status(200).json({
            success: true,
            author: result.rows[0]
        });

    } catch (error) {
        console.error("Error fetching author:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch author",
            error: error.message
        });
    }
};


// CREATE a new author
const createAuthor = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            bio
        } = req.body;

        if (!first_name || !last_name) {
            return res.status(400).json({
                success: false,
                message: "First name and last name are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO authors
            (
                first_name,
                last_name,
                bio
            )
            VALUES ($1, $2, $3)
            RETURNING *`,
            [
                first_name,
                last_name,
                bio || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Author created successfully",
            author: result.rows[0]
        });

    } catch (error) {
        console.error("Error creating author:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create author",
            error: error.message
        });
    }
};


// UPDATE an author
const updateAuthor = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            first_name,
            last_name,
            bio
        } = req.body;

        const result = await pool.query(
            `UPDATE authors
             SET
                first_name = $1,
                last_name = $2,
                bio = $3
             WHERE author_id = $4
             RETURNING *`,
            [
                first_name,
                last_name,
                bio || null,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Author not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Author updated successfully",
            author: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating author:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update author",
            error: error.message
        });
    }
};


// DELETE an author
const deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM authors
             WHERE author_id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Author not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Author deleted successfully",
            author: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting author:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete author",
            error: error.message
        });
    }
};


module.exports = {
    getAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor
};