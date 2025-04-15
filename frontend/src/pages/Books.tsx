import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "../context/LocationContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PaymentModal from "../components/PaymentModal";
import { toast } from "react-toastify";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBookForPayment, setSelectedBookForPayment] =
    useState<any>(null);
  const { location } = useLocation();
  const [openPickerFor, setOpenPickerFor] = useState<string | null>(null);
  const [startDates, setStartDates] = useState<Record<string, Date | null>>({});
  const [endDates, setEndDates] = useState<Record<string, Date | null>>({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
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

  const submitBooking = async (book: any) => {
    const startDate = startDates[book._id];
    const endDate = endDates[book._id];

    const now = new Date();
    let adjustedStart = new Date(startDate!);
    if (
      startDate!.toDateString() === now.toDateString() &&
      adjustedStart.getTime() <= now.getTime()
    ) {
      adjustedStart.setHours(now.getHours(), now.getMinutes() + 1, 0, 0);
    }

    try {
      const token = localStorage.getItem("token");
      const isBorrowing = book.status === "available";

      const endpoint = isBorrowing
        ? `http://localhost:3001/books/${book._id}/borrow`
        : `http://localhost:3001/books/${book._id}/reserve`;

      const payload = isBorrowing
        ? {
            startTime: adjustedStart.toISOString(),
            endTime: endDate!.toISOString(),
          }
        : {
            reserveStartTime: adjustedStart.toISOString(),
            reserveEndTime: endDate!.toISOString(),
          };

      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedBook = response.data.updatedBook;

      setBooks((prevBooks: any) =>
        prevBooks.map((b: any) => (b._id === updatedBook._id ? updatedBook : b))
      );

      // Show success toast
      toast.success(response.data.message);

      setOpenPickerFor(null);
      setStartDates((prev) => ({ ...prev, [book._id]: null }));
      setEndDates((prev) => ({ ...prev, [book._id]: null }));
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const validateAndProceedToPayment = (book: any) => {
    const startDate = startDates[book._id];
    const endDate = endDates[book._id];

    if (
      !(startDate instanceof Date) ||
      isNaN(startDate.getTime()) ||
      !(endDate instanceof Date) ||
      isNaN(endDate.getTime())
    ) {
      toast.error("Please select valid start and end dates.");
      return;
    }

    if (endDate <= startDate) {
      toast.error("End date must be after start date.");
      return;
    }

    const diffInDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays > 28) {
      toast.error("Booking period cannot exceed 4 weeks (28 days).");
      return;
    }

    // Open payment modal after validation
    setSelectedBookForPayment(book);
    setShowPaymentModal(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Blurred Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md"
        style={{ backgroundImage: "url('/bg-book.jpg')" }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 p-6">
        <h2 className="text-2xl mb-4 font-semibold text-white drop-shadow">
          {location ? `Books in ${location}` : "All Books"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredBooks.map((book: any) => {
            const startDate = startDates[book._id];
            const endDate = endDates[book._id];
            const showPicker = openPickerFor === book._id;

            return (
              <div
                key={book._id}
                className="border p-4 rounded shadow flex flex-col justify-between bg-white"
              >
                <div className="m-auto">
                  <img src="book.jpg" alt="Book Cover" className="mb-2" />
                  <p className="font-bold text-lg">{book.title}</p>
                  <p className="text-sm">{book.author}</p>
                  <p className="text-sm">{book.genre}</p>
                  <p className="text-sm text-gray-500">Status: {book.status}</p>
                  {book.status === "borrowed" &&
                    book.startTime &&
                    book.endTime && (
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>From:</strong>{" "}
                          {new Date(book.startTime).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>To:</strong>{" "}
                          {new Date(book.endTime).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                </div>

                {(book.status === "available" || book.status === "borrowed") &&
                  book.borrowedBy?.toString() !== userId && (
                    <>
                      <button
                        onClick={() =>
                          setOpenPickerFor((prev) =>
                            prev === book._id ? null : book._id
                          )
                        }
                        className={`mt-4 ${
                          book.status === "available"
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        } text-white px-4 py-2 rounded`}
                      >
                        {openPickerFor === book._id
                          ? "Cancel"
                          : book.status === "available"
                          ? "Book Now"
                          : "Reserve"}
                      </button>

                      {showPicker && (
                        <div className="mt-4 space-y-2">
                          <div className="text-sm text-gray-700 mb-2">
                            {startDate && (
                              <p>
                                <strong>Start:</strong>{" "}
                                {startDate.toLocaleDateString()}
                              </p>
                            )}
                            {endDate && (
                              <p>
                                <strong>End:</strong>{" "}
                                {endDate.toLocaleDateString()}
                              </p>
                            )}
                          </div>

                          <DatePicker
                            selected={startDate}
                            onChange={(date) =>
                              setStartDates((prev) => ({
                                ...prev,
                                [book._id]: date,
                              }))
                            }
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Start Date"
                            dateFormat="yyyy-MM-dd"
                            className="border px-2 py-1 rounded w-full"
                            minDate={
                              book.status === "borrowed" && book.endTime
                                ? new Date(
                                    new Date(book.endTime).getTime() +
                                      24 * 60 * 60 * 1000
                                  )
                                : new Date()
                            }
                          />

                          <DatePicker
                            selected={endDate}
                            onChange={(date) =>
                              setEndDates((prev) => ({
                                ...prev,
                                [book._id]: date,
                              }))
                            }
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="End Date"
                            dateFormat="yyyy-MM-dd"
                            className="border px-2 py-1 rounded w-full"
                            minDate={startDate || new Date()}
                          />

                          <button
                            onClick={() => validateAndProceedToPayment(book)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
                          >
                            Confirm{" "}
                            {book.status === "available"
                              ? "Booking"
                              : "Reservation"}
                          </button>
                        </div>
                      )}
                    </>
                  )}

                {book.status === "borrowed" &&
                  book.borrowedBy?.toString() === userId && (
                    <button
                      disabled
                      className="mt-4 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                    >
                      Borrowed
                    </button>
                  )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedBookForPayment && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedBookForPayment(null);
          }}
          onSuccess={() => {
            setShowPaymentModal(false);
            submitBooking(selectedBookForPayment);
            setSelectedBookForPayment(null);
          }}
          actionType={
            selectedBookForPayment?.status === "available" ? "borrow" : "renew"
          }
        />
      )}
    </div>
  );
}
