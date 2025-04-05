import { useEffect, useState } from "react";
import axios from "axios";

export default function Books() {
  const [books, setBooks] = useState([]);

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

  return (
    <div className="p-6">
      <ul className="space-y-2">
        {books.map((book: any) => (
          <li key={book._id} className="border p-4 rounded shadow">
            <p className="font-bold">{book.title}</p>
            <p>{book.author}</p>
            <p>{book.genre}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
