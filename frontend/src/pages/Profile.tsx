import { useEffect, useState } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Section } from "../components/Section";

export default function Profile() {
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);
  const [reservedBooks, setReservedBooks] = useState<any[]>([]);
  const [borrowedEBooks, setBorrowedEBooks] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [disabledLost, setDisabledLost] = useState<string[]>([]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBorrowedBooks(res.data.borrowedBooks || []);
        setReservedBooks(res.data.reservedBooks || []);
        setBorrowedEBooks(res.data.borrowedEBooks || []);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Mark book as lost if redirected from payment
  useEffect(() => {
    const bookId = searchParams.get("lostBookId");
    if (bookId) {
      axios
        .patch(
          `http://localhost:3001/books/${bookId}/lost`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          alert("Book marked as lost!");
          setDisabledLost((prev) => [...prev, bookId]);
          navigate("/profile");
        })
        .catch((err) => {
          console.error("Failed to mark book as lost:", err);
        });
    }
  }, [token, navigate, searchParams]);

  if (loading) return <p className="p-6 text-gray-500">Loading profile...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">📚 My Book Profile</h2>

      <Section
        title="Borrowed Books"
        color="text-green-700"
        books={borrowedBooks}
        type="borrowed"
        image="book.jpg"
        disabledLost={disabledLost}
        setBooks={setBorrowedBooks}
      />

      <Section
        title="Reserved Books"
        color="text-yellow-700"
        image="book.jpg"
        books={reservedBooks}
        type="reserved"
      />

      <Section
        title="Borrowed E-Books"
        color="text-blue-700"
        image="ebook.jpg"
        books={borrowedEBooks}
        type="ebook"
      />
    </div>
  );
}
