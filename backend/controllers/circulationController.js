const pool = require("../config/database");

// ISSUE an item to a patron
const issueItem = async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            item_id,
            patron_id,
            issue_date,
            due_date
        } = req.body;

        if (!item_id || !patron_id || !due_date) {
            return res.status(400).json({
                success: false,
                message: "item_id, patron_id and due_date are required"
            });
        }

        await client.query("BEGIN");

        // Check item
        const itemResult = await client.query(
            `SELECT *
             FROM items
             WHERE item_id = $1
             FOR UPDATE`,
            [item_id]
        );

        if (itemResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        const item = itemResult.rows[0];

        if (item.status !== "Available") {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: `Item is not available. Current status: ${item.status}`
            });
        }

        // Check patron
        const patronResult = await client.query(
            `SELECT *
             FROM patrons
             WHERE patron_id = $1`,
            [patron_id]
        );

        if (patronResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Patron not found"
            });
        }

        const patron = patronResult.rows[0];

        if (patron.status !== "Active") {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "Patron is not active"
            });
        }

        // Create circulation record
        const circulationResult = await client.query(
            `INSERT INTO circulation
            (
                item_id,
                patron_id,
                issue_date,
                due_date,
                return_date,
                status,
                renewal_count
            )
            VALUES
            (
                $1,
                $2,
                COALESCE($3, CURRENT_DATE),
                $4,
                NULL,
                'Issued',
                0
            )
            RETURNING *`,
            [
                item_id,
                patron_id,
                issue_date || null,
                due_date
            ]
        );

        // Change item status
        await client.query(
            `UPDATE items
             SET status = 'On Loan'
             WHERE item_id = $1`,
            [item_id]
        );

        await client.query("COMMIT");

        res.status(201).json({
            success: true,
            message: "Item issued successfully",
            circulation: circulationResult.rows[0]
        });

    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Error issuing item:", error);

        res.status(500).json({
            success: false,
            message: "Failed to issue item",
            error: error.message
        });

    } finally {
        client.release();
    }
};


// GET all circulation records
const getCirculations = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                c.*,
                i.barcode,
                b.title,
                p.membership_number,
                p.first_name,
                p.last_name
             FROM circulation c
             INNER JOIN items i
                ON c.item_id = i.item_id
             INNER JOIN books b
                ON i.book_id = b.book_id
             INNER JOIN patrons p
                ON c.patron_id = p.patron_id
             ORDER BY c.circulation_id DESC`
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            circulations: result.rows
        });

    } catch (error) {
        console.error("Error fetching circulations:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch circulation records",
            error: error.message
        });
    }
};


// GET one circulation record
const getCirculationById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                c.*,
                i.barcode,
                b.title,
                p.membership_number,
                p.first_name,
                p.last_name
             FROM circulation c
             INNER JOIN items i
                ON c.item_id = i.item_id
             INNER JOIN books b
                ON i.book_id = b.book_id
             INNER JOIN patrons p
                ON c.patron_id = p.patron_id
             WHERE c.circulation_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Circulation record not found"
            });
        }

        res.status(200).json({
            success: true,
            circulation: result.rows[0]
        });

    } catch (error) {
        console.error("Error fetching circulation:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch circulation record",
            error: error.message
        });
    }
};


// RETURN an item
const returnItem = async (req, res) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        await client.query("BEGIN");

        // Find active circulation
        const circulationResult = await client.query(
            `SELECT *
             FROM circulation
             WHERE circulation_id = $1
             FOR UPDATE`,
            [id]
        );

        if (circulationResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Circulation record not found"
            });
        }

        const circulation = circulationResult.rows[0];

        if (circulation.status === "Returned") {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "This item has already been returned"
            });
        }

        // Update circulation
        const updatedCirculation = await client.query(
            `UPDATE circulation
             SET
                return_date = CURRENT_DATE,
                status = 'Returned'
             WHERE circulation_id = $1
             RETURNING *`,
            [id]
        );

        // Make item available again
        await client.query(
            `UPDATE items
             SET status = 'Available'
             WHERE item_id = $1`,
            [circulation.item_id]
        );

        await client.query("COMMIT");

        res.status(200).json({
            success: true,
            message: "Item returned successfully",
            circulation: updatedCirculation.rows[0]
        });

    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Error returning item:", error);

        res.status(500).json({
            success: false,
            message: "Failed to return item",
            error: error.message
        });

    } finally {
        client.release();
    }
};


// RENEW an item
const renewItem = async (req, res) => {
    const { id } = req.params;
    const { due_date } = req.body;

    try {
        if (!due_date) {
            return res.status(400).json({
                success: false,
                message: "due_date is required"
            });
        }

        const result = await pool.query(
            `UPDATE circulation
             SET
                due_date = $1,
                renewal_count = renewal_count + 1
             WHERE circulation_id = $2
               AND status = 'Issued'
             RETURNING *`,
            [due_date, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Active circulation record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Item renewed successfully",
            circulation: result.rows[0]
        });

    } catch (error) {
        console.error("Error renewing item:", error);

        res.status(500).json({
            success: false,
            message: "Failed to renew item",
            error: error.message
        });
    }
};


module.exports = {
    issueItem,
    getCirculations,
    getCirculationById,
    returnItem,
    renewItem
};