const pool = require("../config/database");

// GET all items
const getItems = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                i.*,
                b.title
             FROM items i
             INNER JOIN books b
                ON i.book_id = b.book_id
             ORDER BY i.item_id DESC`
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            items: result.rows
        });

    } catch (error) {
        console.error("Error fetching items:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch items",
            error: error.message
        });
    }
};


// GET one item by ID
const getItemById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                i.*,
                b.title
             FROM items i
             INNER JOIN books b
                ON i.book_id = b.book_id
             WHERE i.item_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        res.status(200).json({
            success: true,
            item: result.rows[0]
        });

    } catch (error) {
        console.error("Error fetching item:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch item",
            error: error.message
        });
    }
};


// CREATE a new item
const createItem = async (req, res) => {
    try {
        const {
            book_id,
            barcode,
            call_number,
            location,
            status,
            acquisition_date,
            price
        } = req.body;

        if (!book_id || !barcode) {
            return res.status(400).json({
                success: false,
                message: "book_id and barcode are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO items
            (
                book_id,
                barcode,
                call_number,
                location,
                status,
                acquisition_date,
                price
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                book_id,
                barcode,
                call_number || null,
                location || null,
                status || "Available",
                acquisition_date || null,
                price || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Item created successfully",
            item: result.rows[0]
        });

    } catch (error) {
        console.error("Error creating item:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create item",
            error: error.message
        });
    }
};


// UPDATE an item
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            book_id,
            barcode,
            call_number,
            location,
            status,
            acquisition_date,
            price
        } = req.body;

        if (!book_id || !barcode) {
            return res.status(400).json({
                success: false,
                message: "book_id and barcode are required"
            });
        }

        const result = await pool.query(
            `UPDATE items
             SET
                book_id = $1,
                barcode = $2,
                call_number = $3,
                location = $4,
                status = $5,
                acquisition_date = $6,
                price = $7
             WHERE item_id = $8
             RETURNING *`,
            [
                book_id,
                barcode,
                call_number || null,
                location || null,
                status || "Available",
                acquisition_date || null,
                price || null,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Item updated successfully",
            item: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating item:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update item",
            error: error.message
        });
    }
};


// DELETE an item
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM items
             WHERE item_id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Item deleted successfully",
            item: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting item:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete item",
            error: error.message
        });
    }
};


module.exports = {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
};