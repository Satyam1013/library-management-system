import { useState, useEffect } from "react";
import axios from "axios";
import { Book } from "../types/books";

interface DigitalResource {
  _id?: string;
  resourceId: string;
  title: string;
  author: string;
  category: string;
  fileUrl: string;
  cost: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"books" | "resources">("books");

  // Books state
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState<Book>({
    copyId: "",
    bookId: "",
    title: "",
    author: "",
    isbn: "",
    category: "",
    location: "",
    status: "available", // 🆕
  });

  // eBooks state
  const [resources, setResources] = useState<DigitalResource[]>([]);
  const [newResource, setNewResource] = useState<DigitalResource>({
    resourceId: "",
    title: "",
    author: "",
    category: "",
    fileUrl: "",
    cost: 0,
  });

  // API calls
  const fetchBooks = async () => {
    const res = await axios.get("http://localhost:3001/admin/books");
    setBooks(res.data);
  };

  const fetchResources = async () => {
    const res = await axios.get("http://localhost:3001/admin/resources");
    setResources(res.data);
  };

  const addBook = async () => {
    await axios.post("http://localhost:3001/admin/create-book", newBook);
    fetchBooks();
  };

  const deleteBook = async (id: string) => {
    await axios.delete(`http://localhost:3001/admin/books/${id}`);
    fetchBooks();
  };

  const addResource = async () => {
    await axios.post(
      "http://localhost:3001/admin/digital-resources",
      newResource
    );
    fetchResources();
  };

  const deleteResource = async (id: string) => {
    await axios.delete(`http://localhost:3001/admin/resources/${id}`);
    fetchResources();
  };

  useEffect(() => {
    fetchBooks();
    fetchResources();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "books" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("books")}
        >
          Manage Books
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "resources"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("resources")}
        >
          Manage eBooks
        </button>
      </div>

      {/* Books Tab */}
      {activeTab === "books" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Add Book</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <input
              className="border p-2"
              placeholder="Title"
              value={newBook.title}
              onChange={(e) =>
                setNewBook({ ...newBook, title: e.target.value })
              }
            />
            <input
              className="border p-2"
              placeholder="Author"
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
            />
            <input
              className="border p-2"
              placeholder="ISBN"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
            />
            <input
              className="border p-2"
              placeholder="Category"
              value={newBook.category}
              onChange={(e) =>
                setNewBook({ ...newBook, category: e.target.value })
              }
            />
            <select
              className="border p-2"
              value={newBook.location}
              onChange={(e) =>
                setNewBook({ ...newBook, location: e.target.value })
              }
            >
              <option value="">Select Location</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Kolkata">Kolkata</option>
            </select>
            <select
              className="border p-2"
              value={newBook.status}
              onChange={(e) =>
                setNewBook({
                  ...newBook,
                  status: e.target.value as Book["status"],
                })
              }
            >
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="borrowed">Borrowed</option>
              <option value="lost">Lost</option>
            </select>

            <input
              className="border p-2"
              placeholder="Book ID"
              value={newBook.bookId}
              onChange={(e) =>
                setNewBook({ ...newBook, bookId: e.target.value })
              }
            />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={addBook}
          >
            Add Book
          </button>

          <h2 className="text-xl font-semibold mt-8 mb-4">All Books</h2>
          <ul className="space-y-2">
            {books.map((book) => (
              <li
                key={book._id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>
                  <strong>{book.title}</strong> by {book.author}
                </span>
                <button
                  className="text-red-500"
                  onClick={() => deleteBook(book._id!)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* eBooks Tab */}
      {activeTab === "resources" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Add eBook</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <input
              className="border p-2"
              placeholder="Title"
              value={newResource.title}
              onChange={(e) =>
                setNewResource({ ...newResource, title: e.target.value })
              }
            />
            <input
              className="border p-2"
              placeholder="Author"
              value={newResource.author}
              onChange={(e) =>
                setNewResource({ ...newResource, author: e.target.value })
              }
            />
            <input
              className="border p-2"
              placeholder="Category"
              value={newResource.category}
              onChange={(e) =>
                setNewResource({ ...newResource, category: e.target.value })
              }
            />
            <input
              className="border p-2"
              placeholder="File URL"
              value={newResource.fileUrl}
              onChange={(e) =>
                setNewResource({ ...newResource, fileUrl: e.target.value })
              }
            />
            <input
              className="border p-2"
              placeholder="Resource ID"
              value={newResource.resourceId}
              onChange={(e) =>
                setNewResource({ ...newResource, resourceId: e.target.value })
              }
            />
            <input
              className="border p-2"
              type="number"
              placeholder="Cost"
              value={newResource.cost}
              onChange={(e) =>
                setNewResource({
                  ...newResource,
                  cost: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={addResource}
          >
            Add eBook
          </button>

          <h2 className="text-xl font-semibold mt-8 mb-4">All eBooks</h2>
          <ul className="space-y-2">
            {resources.map((res) => (
              <li
                key={res._id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>
                  <strong>{res.title}</strong> ({res.category})
                </span>
                <button
                  className="text-red-500"
                  onClick={() => deleteResource(res._id!)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
