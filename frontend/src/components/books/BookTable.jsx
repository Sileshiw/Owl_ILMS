function BookTable({ books, onDelete }) {
  if (!books || books.length === 0) {
    return (
      <div className="empty-state">
        <p>No books found.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="books-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>ISBN</th>
            <th>Publisher</th>
            <th>Publication Year</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {books.map((book) => (
            <tr key={book.book_id}>
              <td>{book.book_id}</td>
              <td>{book.title}</td>
              <td>{book.isbn || "—"}</td>
              <td>{book.publisher_name || "—"}</td>
              <td>{book.publication_year || "—"}</td>

              <td>
                <button
                  type="button"
                  onClick={() => onDelete(book.book_id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookTable;