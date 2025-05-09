import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";

export default function RegisterForm({ setIsAuthenticated, onClose }) {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const payload = isLogin ? { email, password } : { email, password, role };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin && data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("userRole", data.role);
          localStorage.setItem("userEmail", email);

          setIsAuthenticated(true);

          if (onClose) onClose();

          if (data.role === "tutor") {
            navigate("/profile/tutor");
          } else {
            navigate("/");
          }
        } else if (!isLogin) {
          setIsLogin(true);
          setError("Registration successful! Please log in.");
        }
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Connection error. Please check if the server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>{isLogin ? "Log in" : "Sign up"}</h2>

      {error && <div className="error-message">{error}</div>}

      <input
        className="register-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />

      <input
        className="register-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />

      {!isLogin && (
        <div className="role-selection">
          <p>I am a:</p>
          <select
            className="register-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isLoading}
          >
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
          </select>
          {role === "tutor" && (
            <p className="role-info">
              After registration, you'll be able to create your tutor profile.
            </p>
          )}
        </div>
      )}

      <button className="register-button" type="submit" disabled={isLoading}>
        {isLoading ? "Processing..." : isLogin ? "Log in" : "Sign up"}
      </button>

      <button
        type="button"
        className="register-button"
        style={{ backgroundColor: "#2c2d55", color: "#fff" }}
        onClick={() => {
          setIsLogin(!isLogin);
          setError("");
        }}
        disabled={isLoading}
      >
        {isLogin ? "Switch to Sign up" : "Switch to Log in"}
      </button>
    </form>
  );
}
