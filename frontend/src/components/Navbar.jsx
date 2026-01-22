import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated, setUser } =
    useContext(Context);

  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/user/patient/logout",
        { withCredentials: true }
      );

      toast.success(res.data.message || "Logged out");

      setIsAuthenticated(false);
      setUser(null);
      setShow(false);

      navigateTo("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Logout failed"
      );
    }
  };

  const goToLogin = () => {
    setShow(false);
    navigateTo("/login");
  };

  return (
    <nav className="container">
      <div className="logo">
        <img src="/logo.png" alt="ZeeCare logo" className="logo-img" />
      </div>

      <div className={show ? "navLinks showmenu" : "navLinks"}>
        <div className="links">
          <Link to="/" onClick={() => setShow(false)}>
            Home
          </Link>
          <Link to="/appointment" onClick={() => setShow(false)}>
            Appointment
          </Link>
          <Link to="/about" onClick={() => setShow(false)}>
            About Us
          </Link>
        </div>

        {isAuthenticated ? (
          <button className="logoutBtn btn" onClick={handleLogout}>
            LOGOUT
          </button>
        ) : (
          <button className="loginBtn btn" onClick={goToLogin}>
            LOGIN
          </button>
        )}
      </div>

      <div className="hamburger" onClick={() => setShow(!show)}>
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
