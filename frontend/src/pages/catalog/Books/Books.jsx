import { useEffect, useState } from "react";
import BookTable from "../../../components/books/BookTable";
import {
  getBooks,
  deleteBook,
} from "../../../services/bookService";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBooks();

      // Support either direct array or { books: [...] }
      const bookList = Array.isArray(data)
        ? data
        : data.books || [];

      setBooks(bookList);
    } catch (err) {
      console.error("Failed to load books:", err);

      setError(
        err.response?.data?.message ||
        "Failed to load books."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBook(id);

      setBooks((currentBooks) =>
        currentBooks.filter((book) => book.book_id !== id)
      );
    } catch (err) {
      console.error("Failed to delete book:", err);

      alert(
        err.response?.data?.message ||
        "Failed to delete book."
      );
    }
  };

  return (
    <div className="books-page">

      <div className="page-header">
        <div>
          <h1>Books</h1>
          <p>Manage library books and cataloguing records.</p>
        </div>

        <button type="button" className="add-button">
          + Add New Book
        </button>
      </div>

      {loading && (
        <p>Loading books...</p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!loading && !error && (
        <BookTable
          books={books}
          onDelete={handleDelete}
        />
      )}

    </div>
  );
}

export default Books;