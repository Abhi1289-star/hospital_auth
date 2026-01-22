import React, { useContext, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddNewDoctor from "./components/AddNewDoctor";
import AddNewAdmin from "./components/AddNewAdmin";
import Messages from "./components/Messages";
import Doctors from "./components/Doctors";
import Sidebar from "./components/Sidebar";

import { AdminContext } from "./AdminContext";
import "./App.css";

// 🔐 Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AdminContext);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppLayout = () => {
  const location = useLocation();

  // Hide sidebar on login page
  const hideSidebar = location.pathname === "/login";

  return (
    <>
      {!hideSidebar && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/doctor/addnew"
          element={
            <ProtectedRoute>
              <AddNewDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/addnew"
          element={
            <ProtectedRoute>
              <AddNewAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors"
          element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

const App = () => {
  const { setIsAuthenticated, setAdmin } =
    useContext(AdminContext);

  // 🔒 Prevent React 18 double fetch
  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchAdmin = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/user/admin/me",
          { withCredentials: true }
        );

        setIsAuthenticated(true);
        setAdmin(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin(null);
      }
    };

    fetchAdmin();
  }, []);

  return (
    <Router>
      <AppLayout />
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
