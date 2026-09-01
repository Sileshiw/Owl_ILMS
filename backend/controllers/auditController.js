const pool = require("../config/database");

const getAuditLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM audit_logs
      ORDER BY audit_id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Get audit logs error:", error);

    res.status(500).json({
      message: "Failed to retrieve audit logs",
    });
  }
};

const getAuditLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM audit_logs
       WHERE audit_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Audit log not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get audit log error:", error);

    res.status(500).json({
      message: "Failed to retrieve audit log",
    });
  }
};

module.exports = {
  getAuditLogs,
  getAuditLogById,
};