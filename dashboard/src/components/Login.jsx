import axios from "axios";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AdminContext } from "../AdminContext";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated, setAdmin } =
    useContext(AdminContext);

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
          role: "Admin",
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(res.data.message || "Login successful");

      setIsAuthenticated(true);
      setAdmin(res.data.user || null);

      navigateTo("/");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Admin login failed"
      );
    }
  };

  // 🔐 Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="container form-component">
      <img src="/logo.png" alt="ZeeCare logo" className="logo" />

      <h1 className="form-title">WELCOME TO ZEECARE</h1>
      <p>Only Admins Are Allowed To Access These Resources!</p>

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

        <div style={{ justifyContent: "center", alignItems: "center" }}>
          <button type="submit">Login</button>
        </div>
      </form>
    </section>
  );
};

export default Login;
