import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, useNavigate, Navigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } =
    useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/login",
        {
          email,
          password,
          confirmPassword: password, // 🔥 REQUIRED
          role: "Patient",
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(res.data.message || "Login successful");

      setIsAuthenticated(true);
      setUser(res.data.user || null);

      navigateTo("/");

      setEmail("");
      setPassword("");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed";

      toast.error(message);
    }
  };

  // 🔐 Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container form-component login-form">
      <h2>Sign In</h2>
      <p>Please Login To Continue</p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div style={{ gap: "10px", justifyContent: "flex-end" }}>
          <p style={{ marginBottom: 0 }}>Not Registered?</p>
          <Link
            to="/register"
            style={{ textDecoration: "none", color: "#271776ca" }}
          >
            Register Now
          </Link>
        </div>

        <div style={{ justifyContent: "center" }}>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
