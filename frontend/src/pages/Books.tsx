import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "../context/LocationContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

export default function Books() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { location } = useLocation();
  const [openPickerFor, setOpenPickerFor] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "upi" | "netbanking"
  >("card");

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
      setUserId(payload?.sub || null);
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

      const updatedBook = response.data.updatedBook;

      setBooks((prevBooks: any) =>
        prevBooks.map((b: any) => (b._id === updatedBook._id ? updatedBook : b))
      );

      if (response.data.message.toLowerCase().includes("borrowed")) {
        setShowPaymentModal(true); // open dummy payment modal
      } else {
        alert(response.data.message); // for reservations
      }

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

            {book.status === "borrowed" &&
            book.borrowedBy?.toString() === userId ? (
              <button
                disabled
                className="mt-4 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
              >
                Borrowed
              </button>
            ) : book.status === "borrowed" &&
              book.borrowedBy?.toString() !== userId ? (
              <button
                onClick={() => handleBookSubmit(book)}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Reserve
              </button>
            ) : null}
          </div>
        ))}
      </div>
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-[400px] rounded-xl shadow-lg p-6 space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-center">Secure Payment</h2>
            <p className="text-center text-gray-600">
              Complete to borrow your book
            </p>

            {/* Tabs for Payment Method */}
            <div className="flex justify-around border-b pb-2">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 text-sm font-medium py-2 ${
                  paymentMethod === "card"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                💳 Card
              </button>
              <button
                onClick={() => setPaymentMethod("upi")}
                className={`flex-1 text-sm font-medium py-2 ${
                  paymentMethod === "upi"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                🧾 UPI
              </button>
              <button
                onClick={() => setPaymentMethod("netbanking")}
                className={`flex-1 text-sm font-medium py-2 ${
                  paymentMethod === "netbanking"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                🏦 Net Banking
              </button>
            </div>

            {/* Dynamic Payment Form */}
            {paymentMethod === "card" && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Name on Card"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-1/2 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-1/2 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g. name@bank)"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {paymentMethod === "netbanking" && (
              <div className="space-y-2">
                <select className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select your bank</option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Bank</option>
                </select>
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={() => {
                setShowPaymentModal(false);
                navigate("/profile");
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mt-4"
            >
              Pay and Borrow Book
            </button>

            {/* Cancel Option */}
            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
