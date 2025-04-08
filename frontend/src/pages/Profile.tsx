import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBorrowedBooks(res.data.borrowedBooks || []);
        setReservedBooks(res.data.reservedBooks || []);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Loading profile...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">📚 My Book Profile</h2>

      {/* Borrowed Books */}
      <Section
        title="Borrowed Books"
        color="text-green-700"
        books={borrowedBooks}
        type="borrowed"
      />

      {/* Reserved Books */}
      <Section
        title="Reserved Books"
        color="text-yellow-700"
        books={reservedBooks}
        type="reserved"
      />
    </div>
  );
}

function Section({
  title,
  color,
  books,
  type,
}: {
  title: string;
  color: string;
  books: any[];
  type: "borrowed" | "reserved";
}) {
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
              <p className="font-bold text-lg mb-1">{book.title}</p>
              <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
              <p className="text-sm mb-1">Category: {book.category}</p>
              <p className="text-sm mb-1">Location: {book.location}</p>
              {type === "borrowed" && (
                <>
                  <p className="text-sm">
                    From: {new Date(book.startTime).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    To: {new Date(book.endTime).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
