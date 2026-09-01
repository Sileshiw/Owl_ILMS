const pool = require("../config/database");

const healthCheck = async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "OK",
      server: "running",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check error:", error);

    res.status(503).json({
      status: "ERROR",
      server: "running",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
};

const systemInfo = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        current_database() AS database_name,
        current_user AS database_user,
        version() AS database_version
    `);

    res.json({
      application: "Integrated Library Management System",
      version: "1.0.0",
      database: result.rows[0],
      node_version: process.version,
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    console.error("System info error:", error);

    res.status(500).json({
      message: "Failed to retrieve system information",
    });
  }
};

module.exports = {
  healthCheck,
  systemInfo,
};