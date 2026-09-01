const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/database");
const booksRoutes = require("./routes/booksRoutes");
const authorsRoutes = require("./routes/authorsRoutes");
const bookAuthorsRoutes = require("./routes/bookAuthorsRoutes");
const subjectsRoutes = require("./routes/subjectsRoutes");
const bookSubjectsRoutes = require("./routes/bookSubjectsRoutes");
const itemsRoutes = require("./routes/itemsRoutes");
const patronsRoutes = require("./routes/patronsRoutes");
const circulationRoutes = require("./routes/circulationRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/books", booksRoutes);
app.use("/api/authors", authorsRoutes);
app.use("/api/book-authors", bookAuthorsRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/book-subjects", bookSubjectsRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/patrons", patronsRoutes);
app.use("/api/circulation", circulationRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "ILMS Backend API is running"
    });
});

const PORT = process.env.PORT || 5000;
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "Neon PostgreSQL connected successfully",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
    console.log(`ILMS Backend running on port ${PORT}`);
});

