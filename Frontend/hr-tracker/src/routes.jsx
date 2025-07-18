import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Suspense } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import Candidates from "./pages/Candidates";

// Route wrapper to detect location changes
const RouteWrapper = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes location={location}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/candidates" element={<Candidates />} />
      </Routes>
    </Suspense>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />{" "}
      {/* Global toast container */}
      <RouteWrapper />
    </Router>
  );
};

export default AppRoutes;
