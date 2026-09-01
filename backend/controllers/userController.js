const bcrypt = require("bcryptjs");
const pool = require("../config/database");

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, username, role, created_at
       FROM users
       ORDER BY user_id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: "Failed to retrieve users",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT user_id, username, role, created_at
       FROM users
       WHERE user_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      message: "Failed to retrieve user",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const existing = await pool.query(
      `SELECT user_id FROM users WHERE username = $1`,
      [username]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
       (username, password_hash, role)
       VALUES ($1, $2, $3)
       RETURNING user_id, username, role, created_at`,
      [username, passwordHash, role || "LIBRARIAN"]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create user error:", error);

    res.status(500).json({
      message: "Failed to create user",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `UPDATE users
         SET username = $1,
             password_hash = $2,
             role = $3
         WHERE user_id = $4
         RETURNING user_id, username, role, created_at`,
        [username, passwordHash, role, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.json(result.rows[0]);
    }

    const result = await pool.query(
      `UPDATE users
       SET username = $1,
           role = $2
       WHERE user_id = $3
       RETURNING user_id, username, role, created_at`,
      [username, role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update user error:", error);

    res.status(500).json({
      message: "Failed to update user",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM users
       WHERE user_id = $1
       RETURNING user_id, username`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      message: "Failed to delete user",
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};