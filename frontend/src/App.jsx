import React, { useContext, useEffect, useRef } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Appointment from "./Pages/Appointment";
import AboutUs from "./Pages/AboutUs";
import Register from "./Pages/Register";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Context } from "./main";
import Login from "./Pages/Login";

const App = () => {
  const { setIsAuthenticated, setUser } = useContext(Context);

  // 🔒 Prevent React 18 StrictMode double API call
  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/user/patient/me",
          { withCredentials: true }
        );

        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        // ✅ 401 is normal if not logged in
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer />
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
