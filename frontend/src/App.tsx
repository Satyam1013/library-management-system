import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/Admin";
import { jwtDecode } from "jwt-decode";
import { JSX } from "react";
import Books from "./pages/Books";

interface DecodedToken {
  role: string;
  sub: string;
  exp: number;
}

// Helper to get role from token
const getUserRole = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }
    return decoded.role;
  } catch (err) {
    return null;
  }
};

// Role-based private route
const PrivateRoute = ({
  element,
  allowedRoles,
}: {
  element: JSX.Element;
  allowedRoles: string[];
}) => {
  const role = getUserRole();
  if (!role) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" />;
  return element;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/books" element={<Books />} />
        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <PrivateRoute
              allowedRoles={["admin"]}
              element={<AdminDashboard />}
            />
          }
        />

        {/* You can add more like this for user-only routes in future */}
        {/* <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={["user"]} element={<UserProfile />} />
          }
        /> */}
      </Routes>
    </Router>
  );
}
