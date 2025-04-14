import { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation as useReactRouterLocation,
} from "react-router-dom";
import { useLocation } from "../context/LocationContext";
import { jwtDecode } from "jwt-decode";
import { Menu, X, User, BookOpen, Library, FileText } from "lucide-react";

interface DecodedToken {
  name?: string;
  email?: string;
}

export function Navbar() {
  const navigate = useNavigate();
  const { location, setLocation } = useLocation();
  const [userName, setUserName] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = useReactRouterLocation().pathname;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserName(decoded.name || "User");
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

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Check if current path is '/profile' or '/books' to conditionally show the location select
  const showLocationSelect =
    currentPath === "/profile" || currentPath === "/books";

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1
          className="text-xl font-bold flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Library size={24} className="mr-2" /> {/* Library Icon */}
          Library Management
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {showLocationSelect && (
            <select
              className="px-4 py-2 rounded-lg text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={location ?? ""}
              onChange={(e) => setLocation(e.target.value || null)}
            >
              <option value="">All Locations</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          )}
          <a href="/books" className="hover:bg-gray-700 px-3 py-2 rounded flex">
            <BookOpen size={24} className="mr-2" />
            Books
          </a>
          <a
            href="/resources"
            className="hover:bg-gray-700 px-3 py-2 rounded flex"
          >
            <FileText size={24} className="mr-2" />
            Digital Resources
          </a>
          {userName && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded"
              >
                <User size={18} /> Profile
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow z-50">
                  <a
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </a>
                  <span className="block px-4 py-2 text-sm text-gray-600">
                    Hi, {userName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          {!userName && (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none text-white"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-gray-700 text-white">
          {showLocationSelect && (
            <select
              className="w-full px-4 py-2 rounded-lg text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={location ?? ""}
              onChange={(e) => setLocation(e.target.value || null)}
            >
              <option value="">All Locations</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          )}

          <a
            href="/books"
            className="block hover:bg-gray-600 px-3 py-2 rounded"
          >
            Books
          </a>
          <a
            href="/resources"
            className="block hover:bg-gray-600 px-3 py-2 rounded"
          >
            Digital Resources
          </a>

          <div className="border-t border-gray-600 pt-2">
            {userName && (
              <>
                <a href="/profile" className="block px-3 py-2">
                  <span className="flex items-center gap-2">
                    <User size={18} />
                    My Profile
                  </span>
                </a>
                <p className="px-3 py-1 text-sm text-gray-300">
                  Hi, {userName}
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-600 rounded"
                >
                  Logout
                </button>
              </>
            )}

            {!userName && (
              <button
                onClick={() => navigate("/login")}
                className="w-full text-left px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
