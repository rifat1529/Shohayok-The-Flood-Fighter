import "../styles/login.css";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../api/axios";
import socket from "../socket/socket";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });

      const { accessToken, user } = res.data;

      // 🔥 DEBUG (IMPORTANT)
      console.log("LOGIN RESPONSE:", res.data);
      console.log("ROLE:", user?.role);

      if (!accessToken || !user) {
        setError("Invalid server response");
        return;
      }

      // ✅ SAVE
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      if (user?.id) { socket.emit("join", user.id); console.log("🟢 Socket joined:", user.id); }
      const role = user.role;

      // 🔥 SAFE NAVIGATION
      switch (role) {
        case "admin":
          navigate("/admin");
          break;

        case "volunteer_head":
          navigate("/volunteer-head-dashboard");
          break;

        case "volunteer":
          navigate("/volunteer-dashboard");
          break;

        case "user":
          navigate("/");
          break;

        default:
          console.warn("Unknown role:", role);
          navigate("/");
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);

      const msg =
        err.response?.data?.message || "Login failed. Try again.";
      setError(msg);
    }
  };

  return (
    <div className="login-root">
      <Navbar />

      <div className="login-layout">
        <div className="login-left">
          <h2 className="left-heading">
            Coordinate.<br />Respond.<br /><span>Save Lives.</span>
          </h2>
        </div>

        <div className="login-right">
          <form className="login-form" onSubmit={handleLogin}>
            <h2 className="form-heading">Sign In</h2>
            Enter your email :
            <input
              type="email"
              className="field-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            /> Enter your password :

            <input
              className="field-input"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            /> <br></br>

            <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <input
                type="checkbox"
                checked={showPass}
                onChange={() => setShowPass(!showPass)}
              />
              Show Password
            </label>

            {error && (
              <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
                {error}
              </p>
            )}

            <button type="submit" className="login-btn">
              LOGIN
            </button>

            <p style={{ marginTop: "15px", textAlign: "center" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#6366f1", fontWeight: "bold" }}>
                Register here
              </Link>
            </p>

            <p style={{ textAlign: "center", marginTop: "10px" }}>
              <Link to="/forgot-password" style={{ color: "#6366f1" }}>
                Forgot Password?
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}