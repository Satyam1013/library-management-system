import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
// import Books from "./pages/Books";
// import DigitalResources from "./pages/DigitalResources";
// import Transactions from "./pages/Transactions";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/books" element={<Books />} />
        <Route path="/resources" element={<DigitalResources />} />
        <Route path="/transactions" element={<Transactions />} /> */}
      </Routes>
    </Router>
  );
}
