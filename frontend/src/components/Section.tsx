import axios from "axios";
import { useState } from "react";
import DatePicker from "react-datepicker";
import PaymentModal from "./PaymentModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Section({
  title,
  color,
  books,
  image,
  type,
  disabledLost = [],
  setBooks,
}: {
  title: string;
  color: string;
  books: any[];
  type: "borrowed" | "reserved" | "ebook";
  disabledLost?: string[];
  image?: string;
  setBooks?: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const token = localStorage.getItem("token");

  const [openModal, setOpenModal] = useState(false);
  const [renewBookId, setRenewBookId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [prevEndTime, setPrevEndTime] = useState<Date | null>(null);
  const [showRenewPaymentModal, setShowRenewPaymentModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [lostBookId, setLostBookId] = useState<string | null>(null);
  const [disabledLostBooks, setDisabledLostBooks] =
    useState<string[]>(disabledLost);

  const handleLost = (bookId: string) => {
    setLostBookId(bookId);
    setShowPaymentModal(true);
  };

  const handleRenewClick = (book: any) => {
    setRenewBookId(book._id);
    setPrevEndTime(new Date(book.endTime));
    setStartDate(null);
    setEndDate(null);
    setOpenModal(true);
  };

  const handleRenewSubmit = () => {
    if (!startDate || !endDate || !renewBookId) return;

    const maxDiff = 28 * 24 * 60 * 60 * 1000;

    if (startDate <= prevEndTime!) {
      toast.error("Start date must be after current end date.");
      return;
    }

    if (endDate.getTime() - startDate.getTime() > maxDiff) {
      toast.error("End date cannot be more than 28 days after start date.");
      return;
    }

    setShowRenewPaymentModal(true);
    setOpenModal(false);
  };

  const handleRenewPaymentConfirm = async () => {
    if (!startDate || !endDate || !renewBookId) return;

    try {
      await axios.patch(
        `http://localhost:3001/books/${renewBookId}/renew`,
        {
          startTime: startDate,
          endTime: endDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Book renewed successfully!");
      setShowRenewPaymentModal(false);
      setRenewBookId(null);
      window.location.reload();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    }
  };

  const handleLostPaymentConfirm = async () => {
    if (!lostBookId) return;
    try {
      await axios.patch(
        `http://localhost:3001/books/${lostBookId}/lost`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedBooks = books.map((book) =>
        book._id === lostBookId ? { ...book, status: "lost" } : book
      );
      setDisabledLostBooks((prev) => [...prev, lostBookId]);

      if (type === "borrowed") {
        setBooks?.(updatedBooks);
      }

      setShowPaymentModal(false);
      setLostBookId(null);
    } catch (err) {
      console.error("Failed to mark book as lost:", err);
      toast.error("Failed to mark book as lost.");
    }
  };

  return (
    <div className="mb-10">
      <h3 className={`text-xl font-semibold mb-3 ${color}`}>{title}</h3>
      {books.length === 0 ? (
        <p className="text-gray-500">No books {type}.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >
              <img
                src={image}
                alt="Book"
                className="w-full h-32 object-cover rounded mb-2 cursor-pointer"
                onClick={() => {
                  if (type === "ebook") {
                    setShowPdfModal(true);
                  }
                }}
              />

              <p className="font-bold text-lg mb-1">{book.title}</p>
              <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
              <p className="text-sm mb-1">Category: {book.category}</p>
              {type === "ebook" ? (
                <p className="text-sm mb-1">Cost: {book.cost}</p>
              ) : (
                <p className="text-sm mb-1">Location: {book.location}</p>
              )}

              {type === "borrowed" && (
                <>
                  <p className="text-sm">
                    From: {new Date(book.startTime).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    To: {new Date(book.endTime).toLocaleDateString()}
                  </p>

                  <div className="mt-4 flex justify-between gap-2">
                    <button
                      onClick={() => handleLost(book._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                      disabled={
                        disabledLostBooks.includes(book._id) ||
                        book.status === "lost"
                      }
                    >
                      Lost
                    </button>

                    <button
                      onClick={() => handleRenewClick(book)}
                      className={`${
                        book.reservations?.length > 0 ||
                        book.status === "lost" ||
                        book.status === "reserved" ||
                        book.isRenewed
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white px-3 py-1 rounded`}
                      disabled={
                        book.reservations?.length > 0 ||
                        book.status === "lost" ||
                        book.status === "reserved" ||
                        book.isRenewed
                      }
                    >
                      Renew
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Renew Modal */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Select New Dates</h3>

            <label className="block text-sm mb-2">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={
                prevEndTime ? new Date(prevEndTime.getTime() + 1) : new Date()
              }
              className="border px-3 py-1 rounded w-full mb-4"
            />

            <label className="block text-sm mb-2">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              maxDate={
                startDate
                  ? new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000)
                  : undefined
              }
              className="border px-3 py-1 rounded w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRenewSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modals (Only for "borrowed") */}
      {type === "borrowed" && (
        <>
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setLostBookId(null);
            }}
            onSuccess={handleLostPaymentConfirm}
            actionType="lost"
          />

          <PaymentModal
            isOpen={showRenewPaymentModal}
            onClose={() => {
              setShowRenewPaymentModal(false);
              setRenewBookId(null);
            }}
            onSuccess={handleRenewPaymentConfirm}
            actionType="renew"
          />
        </>
      )}

      {showPdfModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-md max-w-4xl w-full h-[80%] flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">E-Book Preview</h3>
              <button
                onClick={() => setShowPdfModal(false)}
                className="text-red-600 font-semibold"
              >
                Close
              </button>
            </div>
            <iframe
              src="/sample.pdf"
              className="flex-1 w-full border rounded"
              title="PDF Preview"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
