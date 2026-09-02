import api from "./api";

// Get all books
export const getBooks = async () => {
  const response = await api.get("/books");
  return response.data;
};

// Get one book
export const getBookById = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

// Add a new book
export const createBook = async (bookData) => {
  const response = await api.post("/books", bookData);
  return response.data;
};

// Update a book
export const updateBook = async (id, bookData) => {
  const response = await api.put(`/books/${id}`, bookData);
  return response.data;
};

// Delete a book
export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};