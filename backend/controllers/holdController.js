const pool = require("../config/database");

const getHolds = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM holds
      ORDER BY hold_id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Get holds error:", error);

    res.status(500).json({
      message: "Failed to retrieve holds",
    });
  }
};

const getHoldById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM holds
       WHERE hold_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hold not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get hold error:", error);

    res.status(500).json({
      message: "Failed to retrieve hold",
    });
  }
};

const createHold = async (req, res) => {
  try {
    const {
      patron_id,
      book_id
    } = req.body;

    if (!patron_id || !book_id) {
      return res.status(400).json({
        message: "patron_id and book_id are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO holds
       (patron_id, book_id, status, created_at)
       VALUES ($1, $2, 'ACTIVE', NOW())
       RETURNING *`,
      [patron_id, book_id]
    );

    res.status(201).json({
      message: "Hold created successfully",
      hold: result.rows[0],
    });
  } catch (error) {
    console.error("Create hold error:", error);

    res.status(500).json({
      message: "Failed to create hold",
    });
  }
};

const updateHold = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE holds
       SET status = $1
       WHERE hold_id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hold not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update hold error:", error);

    res.status(500).json({
      message: "Failed to update hold",
    });
  }
};

const deleteHold = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM holds
       WHERE hold_id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hold not found",
      });
    }

    res.json({
      message: "Hold cancelled successfully",
      hold: result.rows[0],
    });
  } catch (error) {
    console.error("Delete hold error:", error);

    res.status(500).json({
      message: "Failed to cancel hold",
    });
  }
};

module.exports = {
  getHolds,
  getHoldById,
  createHold,
  updateHold,
  deleteHold,
};