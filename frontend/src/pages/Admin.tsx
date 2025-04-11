import { useState, useEffect } from "react";
import axios from "axios";
import { Book } from "../types/books";
import { DigitalResource } from "./Digital-Resources";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"books" | "resources">("books");

  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState<Book>({
    copyId: "",
    bookId: "",
    title: "",
    author: "",
    isbn: "",
    category: "",
    location: "",
    status: "available",
  });

  const [resources, setResources] = useState<DigitalResource[]>([]);
  const [newResource, setNewResource] = useState<DigitalResource>({
    resourceId: "",
    title: "",
    author: "",
    category: "",
    fileUrl: "",
    cost: 0,
  });

  // Fetch Data
  const fetchBooks = async () => {
    const res = await axios.get("http://localhost:3001/admin/books");
    setBooks(res.data);
  };

  const fetchResources = async () => {
    const res = await axios.get("http://localhost:3001/admin/resources");
    setResources(res.data);
  };

  // Create Entries
  const addBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.bookId)
      return alert("Please fill in all required book fields.");
    await axios.post("http://localhost:3001/admin/create-book", newBook);
    fetchBooks();
    setNewBook({
      ...newBook,
      title: "",
      author: "",
      isbn: "",
      category: "",
      location: "",
      bookId: "",
    });
  };

  const addResource = async () => {
    if (!newResource.title || !newResource.author || !newResource.resourceId)
      return alert("Please fill in all required eBook fields.");
    await axios.post(
      "http://localhost:3001/admin/digital-resources",
      newResource
    );
    fetchResources();
    setNewResource({
      ...newResource,
      title: "",
      author: "",
      category: "",
      fileUrl: "",
      resourceId: "",
      cost: 0,
    });
  };

  // Delete
  const deleteBook = async (id: string) => {
    await axios.delete(`http://localhost:3001/admin/books/${id}`);
    fetchBooks();
  };

  const deleteResource = async (id: string) => {
    await axios.delete(`http://localhost:3001/admin/resources/${id}`);
    fetchResources();
  };

  const handleLogout = () => {
    // Add your token clearing / auth logic here
    localStorage.clear(); // or remove token only
    window.location.href = "/login"; // redirect to login
  };

  useEffect(() => {
    fetchBooks();
    fetchResources();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          Logout
        </button>
      </header>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded font-semibold ${
            activeTab === "books" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("books")}
        >
          Manage Books
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold ${
            activeTab === "resources"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("resources")}
        >
          Manage eBooks
        </button>
      </div>

      {/* Book Section */}
      {activeTab === "books" && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={addBook}
          >
            Add Book
          </button>

          <h3 className="text-xl font-semibold mt-8 mb-4">All Books</h3>
          <ul className="space-y-2">
            {books.map((book) => (
              <li
                key={book._id}
                className="flex justify-between items-center border p-2 rounded bg-white shadow-sm"
              >
                <span>
                  <strong>{book.title}</strong> by {book.author}
                </span>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => deleteBook(book._id!)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Resource Section */}
      {activeTab === "resources" && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Add New eBook</h2>
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
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={addResource}
          >
            Add eBook
          </button>

          <h3 className="text-xl font-semibold mt-8 mb-4">All eBooks</h3>
          <ul className="space-y-2">
            {resources.map((res) => (
              <li
                key={res._id}
                className="flex justify-between items-center border p-2 rounded bg-white shadow-sm"
              >
                <span>
                  <strong>{res.title}</strong> ({res.category})
                </span>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => deleteResource(res._id!)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
