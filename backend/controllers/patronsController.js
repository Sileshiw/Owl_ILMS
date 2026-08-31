const pool = require("../config/database");

// GET all patrons
const getPatrons = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM patrons
             ORDER BY patron_id DESC`
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            patrons: result.rows
        });

    } catch (error) {
        console.error("Error fetching patrons:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch patrons",
            error: error.message
        });
    }
};


// GET one patron by ID
const getPatronById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM patrons
             WHERE patron_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Patron not found"
            });
        }

        res.status(200).json({
            success: true,
            patron: result.rows[0]
        });

    } catch (error) {
        console.error("Error fetching patron:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch patron",
            error: error.message
        });
    }
};


// CREATE a new patron
const createPatron = async (req, res) => {
    try {
        const {
            membership_number,
            first_name,
            last_name,
            gender,
            date_of_birth,
            phone,
            email,
            address,
            patron_type,
            status,
            registration_date,
            expiry_date
        } = req.body;

        if (!membership_number || !first_name || !last_name) {
            return res.status(400).json({
                success: false,
                message: "membership_number, first_name and last_name are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO patrons
            (
                membership_number,
                first_name,
                last_name,
                gender,
                date_of_birth,
                phone,
                email,
                address,
                patron_type,
                status,
                registration_date,
                expiry_date
            )
            VALUES
            (
                $1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10, $11, $12
            )
            RETURNING *`,
            [
                membership_number,
                first_name,
                last_name,
                gender || null,
                date_of_birth || null,
                phone || null,
                email || null,
                address || null,
                patron_type || "Member",
                status || "Active",
                registration_date || new Date(),
                expiry_date || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Patron created successfully",
            patron: result.rows[0]
        });

    } catch (error) {
        console.error("Error creating patron:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create patron",
            error: error.message
        });
    }
};


// UPDATE a patron
const updatePatron = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            membership_number,
            first_name,
            last_name,
            gender,
            date_of_birth,
            phone,
            email,
            address,
            patron_type,
            status,
            registration_date,
            expiry_date
        } = req.body;

        if (!membership_number || !first_name || !last_name) {
            return res.status(400).json({
                success: false,
                message: "membership_number, first_name and last_name are required"
            });
        }

        const result = await pool.query(
            `UPDATE patrons
             SET
                membership_number = $1,
                first_name = $2,
                last_name = $3,
                gender = $4,
                date_of_birth = $5,
                phone = $6,
                email = $7,
                address = $8,
                patron_type = $9,
                status = $10,
                registration_date = $11,
                expiry_date = $12
             WHERE patron_id = $13
             RETURNING *`,
            [
                membership_number,
                first_name,
                last_name,
                gender || null,
                date_of_birth || null,
                phone || null,
                email || null,
                address || null,
                patron_type || "Member",
                status || "Active",
                registration_date || null,
                expiry_date || null,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Patron not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Patron updated successfully",
            patron: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating patron:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update patron",
            error: error.message
        });
    }
};


// DELETE a patron
const deletePatron = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM patrons
             WHERE patron_id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Patron not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Patron deleted successfully",
            patron: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting patron:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete patron",
            error: error.message
        });
    }
};


module.exports = {
    getPatrons,
    getPatronById,
    createPatron,
    updatePatron,
    deletePatron
};