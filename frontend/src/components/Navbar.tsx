import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "../context/LocationContext";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  name?: string;
  email?: string;
  // add other fields if needed
}

export function Navbar() {
  const navigate = useNavigate();
  const { location, setLocation } = useLocation();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserName(decoded.name || decoded.email || "User");
      } catch (err) {
        console.error("Invalid token");
        setUserName(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserName(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Library Management</h1>

        <select
          className="mr-4 px-2 py-1 rounded"
          value={location ?? ""}
          onChange={(e) => setLocation(e.target.value || null)}
        >
          <option value="">All Locations</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bangalore">Bangalore</option>
        </select>

        <div className="flex gap-2 items-center">
          <a
            href="/"
            className="text-white px-4 py-2 hover:bg-gray-700 rounded"
          >
            Home
          </a>

          <a
            href="/books"
            className="text-white px-4 py-2 hover:bg-gray-700 rounded"
          >
            Books
          </a>
          <a
            href="/resources"
            className="text-white px-4 py-2 hover:bg-gray-700 rounded"
          >
            Digital Resources
          </a>
          <a
            href="/profile"
            className="text-white px-4 py-2 hover:bg-gray-700 rounded"
          >
            Profile
          </a>

          {userName ? (
            <>
              <span className="text-white font-medium">Hi, {userName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
