// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig"; // centralized axios instance

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUpRedirect = () => navigate("/register");

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page refresh
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post("/login", { email, password });

      console.log("✅ Login response:", res.data);

      if (res.data?.token) {
        // Save token and optional username
        localStorage.setItem("token", res.data.token);
        if (res.data.userName) localStorage.setItem("userName", res.data.userName);

        console.log("✅ Token saved to localStorage");

        // Dispatch auth change to update App-level state
        window.dispatchEvent(new Event("authChange"));

        // Redirect to Home after ensuring state updated
        // navigate("/home", { replace: true,user:res.data.user  });
      } else {
        setErrorMessage(res.data?.message || "Invalid login response.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setErrorMessage(
        err.response?.data?.message ||
          "Login failed. Please check your credentials or server connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.mainTitle}>Login to your account</h1>

        <form style={styles.formSection} onSubmit={handleSubmit} noValidate>
          {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}

          <h2 style={styles.sectionTitle}>Your Email</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={styles.fullWidthInput}
            required
          />

          <h2 style={styles.sectionTitle}>Your Password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={styles.fullWidthInput}
            required
          />

          <button type="submit" style={styles.joinButton} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p style={styles.loginPrompt}>
            Don't have an account?{" "}
            <span style={styles.loginLink} onClick={handleSignUpRedirect}>
              Create a new account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

// Styles (unchanged)
const styles = {
  wrapper: { height: "90vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fa" },
  container: { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: "Arial, sans-serif", backgroundColor: "#ffffff", border: "2px solid #0073b1", borderRadius: "5px", padding: "40px 50px", width: "400px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" },
  mainTitle: { fontSize: "28px", fontWeight: "bold", marginBottom: "20px", color: "#0073b1", textAlign: "center" },
  formSection: { width: "100%" },
  sectionTitle: { fontSize: "15px", fontWeight: "bold", margin: "15px 0 8px 0", color: "#333" },
  fullWidthInput: { width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", marginBottom: "15px" },
  joinButton: { width: "100%", padding: "12px", backgroundColor: "#0073b1", color: "white", border: "none", borderRadius: "24px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" },
  loginPrompt: { fontSize: "14px", color: "#666", marginTop: "20px", textAlign: "center" },
  loginLink: { color: "#0073b1", cursor: "pointer", textDecoration: "underline" },
  errorMessage: { color: "red", fontSize: "14px", marginBottom: "10px", textAlign: "center" },
};

export default Login;
