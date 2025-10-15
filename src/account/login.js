import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send username as email
      const response = await fetch("http://127.0.0.1:8000/accounts/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Save JWT tokens in localStorage
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        navigate("/dashboard");
      } else {
        const errData = await response.json();
        setError(
          errData.detail || "❌ Invalid email or password. Please try again."
        );
      }
    } catch (err) {
      setError("⚠️ Server error. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
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

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
