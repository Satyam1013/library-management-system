import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "../context/LocationContext";

export default function Books() {
  const [books, setBooks] = useState([]);
  const { location } = useLocation();

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    };
    fetchBooks();
  }, []);

  const filteredBooks = location
    ? books.filter((book: any) => book.location === location)
    : books;

  const handlePay = (book: any) => {
    // Replace with your payment/booking logic
    alert(`Booking "${book.title}"`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4 font-semibold">
        {location ? `Books in ${location}` : "All Books"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredBooks.map((book: any) => (
          <div
            key={book._id}
            className="border p-4 rounded shadow flex flex-col justify-between"
          >
            <div>
              <p className="font-bold text-lg">{book.title}</p>
              <p className="text-sm">{book.author}</p>
              <p className="text-sm">{book.genre}</p>
              <p className="text-sm text-gray-500">Status: {book.status}</p>
            </div>
            {book.status === "available" && (
              <button
                onClick={() => handlePay(book)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Book Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
