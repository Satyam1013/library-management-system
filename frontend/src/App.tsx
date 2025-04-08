import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Home";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/Admin";
import Books from "./pages/Books";
import { jwtDecode } from "jwt-decode";
import { JSX } from "react";
import MainLayout from "./components/MainLayout";
import DigitalResources from "./pages/Digital-Resources";
import Profile from "./pages/Profile";

interface DecodedToken {
  role: string;
  sub: string;
  exp: number;
}

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
        {/* Routes without Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute
              allowedRoles={["admin"]}
              element={<AdminDashboard />}
            />
          }
        />
        {/* Routes with Navbar via Layout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/books"
          element={
            <MainLayout>
              <Books />
            </MainLayout>
          }
        />
        <Route
          path="/resources"
          element={
            <MainLayout>
              <DigitalResources />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}
