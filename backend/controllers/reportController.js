const pool = require("../config/database");

const getDashboardStats = async (req, res) => {
  try {
    const books = await pool.query(`
      SELECT COUNT(*) AS total_books
      FROM books
    `);

    const patrons = await pool.query(`
      SELECT COUNT(*) AS total_patrons
      FROM patrons
    `);

    const items = await pool.query(`
      SELECT COUNT(*) AS total_items
      FROM items
    `);

    const loans = await pool.query(`
      SELECT COUNT(*) AS active_loans
      FROM circulation
      WHERE status = 'Issued'
    `);

    const overdue = await pool.query(`
      SELECT COUNT(*) AS overdue_books
      FROM circulation
      WHERE status = 'Issued'
      AND due_date < CURRENT_DATE
    `);

    res.json({
      total_books: Number(books.rows[0].total_books),
      total_patrons: Number(patrons.rows[0].total_patrons),
      total_items: Number(items.rows[0].total_items),
      active_loans: Number(loans.rows[0].active_loans),
      overdue_books: Number(overdue.rows[0].overdue_books),
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error);

    res.status(500).json({
      message: "Failed to retrieve dashboard statistics",
    });
  }
};

const getCirculationReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM circulation
      ORDER BY circulation_id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Circulation report error:", error);

    res.status(500).json({
      message: "Failed to retrieve circulation report",
    });
  }
};

const getOverdueReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM circulation
      WHERE status = 'Issued'
      AND due_date < CURRENT_DATE
      ORDER BY due_date ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Overdue report error:", error);

    res.status(500).json({
      message: "Failed to retrieve overdue report",
    });
  }
};

const getBooksReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total_books
      FROM books
    `);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Books report error:", error);

    res.status(500).json({
      message: "Failed to retrieve books report",
    });
  }
};

const getPatronsReport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total_patrons
      FROM patrons
    `);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Patrons report error:", error);

    res.status(500).json({
      message: "Failed to retrieve patrons report",
    });
  }
};

module.exports = {
  getDashboardStats,
  getCirculationReport,
  getOverdueReport,
  getBooksReport,
  getPatronsReport,
};