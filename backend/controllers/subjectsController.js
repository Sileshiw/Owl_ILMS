const pool = require("../config/database");

// GET all subjects
const getSubjects = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM subjects
             ORDER BY subject_id DESC`
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            subjects: result.rows
        });

    } catch (error) {
        console.error("Error fetching subjects:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch subjects",
            error: error.message
        });
    }
};


// GET one subject by ID
const getSubjectById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM subjects
             WHERE subject_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.status(200).json({
            success: true,
            subject: result.rows[0]
        });

    } catch (error) {
        console.error("Error fetching subject:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch subject",
            error: error.message
        });
    }
};


// CREATE a new subject
const createSubject = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Subject name is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO subjects
            (
                name,
                description
            )
            VALUES ($1, $2)
            RETURNING *`,
            [
                name,
                description || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Subject created successfully",
            subject: result.rows[0]
        });

    } catch (error) {
        console.error("Error creating subject:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create subject",
            error: error.message
        });
    }
};


// UPDATE a subject
const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Subject name is required"
            });
        }

        const result = await pool.query(
            `UPDATE subjects
             SET
                name = $1,
                description = $2
             WHERE subject_id = $3
             RETURNING *`,
            [
                name,
                description || null,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Subject updated successfully",
            subject: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating subject:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update subject",
            error: error.message
        });
    }
};


// DELETE a subject
const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM subjects
             WHERE subject_id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Subject deleted successfully",
            subject: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting subject:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete subject",
            error: error.message
        });
    }
};


module.exports = {
    getSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject
};