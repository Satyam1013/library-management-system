import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "../context/LocationContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);
  const { location } = useLocation();
  const [openPickerFor, setOpenPickerFor] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  let adjustedStart: Date | null = null;

  if (startDate) {
    adjustedStart = new Date(startDate);

    const now = new Date();
    if (
      startDate.toDateString() === now.toDateString() &&
      adjustedStart.getTime() <= now.getTime()
    ) {
      adjustedStart.setHours(now.getHours(), now.getMinutes() + 1, 0, 0);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Decode token (or fetch user info from backend)
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT
      setUserId(payload?.userId || null); // depends on your token structure
    }

    const fetchBooks = async () => {
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

  const handleBookSubmit = async (book: any) => {
    if (
      !startDate ||
      isNaN(startDate.getTime()) ||
      !endDate ||
      isNaN(endDate.getTime())
    ) {
      alert("Please select valid start and end dates.");
      return;
    }

    const diffInDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays > 28) {
      alert("Booking period cannot exceed 4 weeks (28 days).");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3001/books/${book._id}/borrow`,
        { startTime: adjustedStart, endTime: endDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the book status locally
      setBooks((prevBooks: any) =>
        prevBooks.map((b: any) =>
          b._id === book._id
            ? {
                ...b,
                status: response.data.updatedStatus || "reserved", // fallback if not returned
                borrowedBy: userId,
              }
            : b
        )
      );

      alert(response.data.message);
      setOpenPickerFor(null);
      setStartDate(null);
      setEndDate(null);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
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
              <>
                <button
                  onClick={() =>
                    setOpenPickerFor((prev) =>
                      prev === book._id ? null : book._id
                    )
                  }
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {openPickerFor === book._id ? "Cancel" : "Book Now"}
                </button>

                {openPickerFor === book._id && (
                  <div className="mt-4 space-y-2">
                    {/* Selected Time Display */}
                    <div className="text-sm text-gray-700 mb-2">
                      {startDate && (
                        <p>
                          <strong>Start:</strong>{" "}
                          {startDate.toLocaleDateString()}
                        </p>
                      )}
                      {endDate && (
                        <p>
                          <strong>End:</strong> {endDate.toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Start Date Picker */}
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      placeholderText="Start Date"
                      dateFormat="yyyy-MM-dd"
                      className="border px-2 py-1 rounded w-full"
                      minDate={new Date()} // 🛡️ disables past dates
                    />

                    {/* End Date Picker */}
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      placeholderText="End Date"
                      dateFormat="yyyy-MM-dd"
                      className="border px-2 py-1 rounded w-full"
                      minDate={startDate || new Date()} // 🛡️ disables dates before startDate
                    />

                    {/* Confirm Button */}
                    <button
                      onClick={() => handleBookSubmit(book)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
                    >
                      Confirm Booking
                    </button>
                  </div>
                )}
              </>
            )}

            {(book.status === "borrowed" || book.status === "reserved") &&
            book.borrowedBy !== userId ? (
              <button
                onClick={() => handleBookSubmit(book)}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Reserve
              </button>
            ) : book.borrowedBy === userId ? (
              <button
                disabled
                className="mt-4 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
              >
                Already Reserved
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
