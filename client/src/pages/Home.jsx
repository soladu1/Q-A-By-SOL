// src/pages/Home.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../axiosConfig"; // centralized axios

function Home() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // prevent multiple navigations or overlapping checks
  const checkingRef = useRef(false);
  const navigatingRef = useRef(false);

  // ✅ Check authentication when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      if (checkingRef.current) return; // avoid duplicate checks
      checkingRef.current = true;

      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No token found, redirecting to login...");
        setIsAuthenticated(false);
        setLoading(false);
        if (!navigatingRef.current) {
          navigatingRef.current = true;
          navigate("/login", { replace: true });
        }
        checkingRef.current = false;
        return;
      }

      try {
        const res = await axios.get("/users/check", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Auth check success:", res.data);

        if (res.data && res.data.user) {
          setIsAuthenticated(true);
          const name = res.data.user.username || localStorage.getItem("userName") || "";
          setUserName(name);
          localStorage.setItem("userName", name);
        } else {
          throw new Error("Invalid user data");
        }
      } catch (err) {
        console.error(
          "❌ Auth check failed:",
          err.response?.data?.message || err.message
        );
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        setIsAuthenticated(false);
        if (!navigatingRef.current) {
          navigatingRef.current = true;
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
        checkingRef.current = false;
      }
    };

    checkAuth();

    // Re-run when "authChange" event is fired from login/logout
    const onAuthChange = () => {
      console.log("🔄 Auth change detected");
      if (!checkingRef.current) checkAuth();
    };

    window.addEventListener("authChange", onAuthChange);
    return () => window.removeEventListener("authChange", onAuthChange);
  }, [navigate]);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login", { replace: true });
  };

  // ✅ Post Question function
  const handlePostQuestion = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login before posting a question!");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const res = await axios.post(
        "/questions",
        { title, description, tag },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage(res.data.message || "✅ Question posted successfully!");
      setErrorMessage("");
      setTitle("");
      setDescription("");
      setTag("");
    } catch (err) {
      console.error("❌ Failed to post question:", err);
      setErrorMessage(err.response?.data?.message || "Failed to post question");
      setSuccessMessage("");
    }
  };

  // ✅ Navigate to Question Page
  const handleGoToQuestions = () => navigate("/questions");

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!isAuthenticated) return null;

  return (
    <div style={styles.pageContainer}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <Link
            to="https://solsportfolio.netlify.app"
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <span style={{ color: "#FF7A00", fontWeight: "bold" }}>SOLO</span>
            <span style={{ color: "black", fontWeight: "bold" }}>MON</span>
          </Link>
        </div>

        <div style={styles.navLinks}>
          {userName && (
            <span style={styles.welcomeMessage}>Welcome {userName}!</span>
          )}
          <button style={styles.logoutButton} onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div style={styles.contentContainer}>
        <div style={styles.instructions}>
          <h2 style={styles.title}>Steps to write a good question</h2>
          <ul style={styles.list}>
            <li>Summarize your problem in a one-line title.</li>
            <li>Describe your problem in more detail.</li>
            <li>Explain what you tried and what you expected to happen.</li>
            <li>Review your question before posting it to the site.</li>
          </ul>
        </div>

        <div style={styles.formContainer}>
          <h3 style={styles.formTitle}>Ask a public question</h3>

          <button
            style={{
              ...styles.subLink,
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
            }}
            onClick={handleGoToQuestions}
          >
            Go to Question page
          </button>

          {successMessage && (
            <p style={{ color: "green", marginBottom: "10px" }}>
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</p>
          )}

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder="Question Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          />
          <input
            type="text"
            placeholder="Tag (optional)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            style={styles.input}
          />

          <button style={styles.postButton} onClick={handlePostQuestion}>
            Post Your Question
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ Styles preserved
const styles = {
  pageContainer: { fontFamily: "Arial, sans-serif", backgroundColor: "#fff", minHeight: "100vh" },
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 100px", borderBottom: "1px solid #e0e0e0" },
  logo: { fontSize: "24px", fontWeight: "bold", display: "flex", alignItems: "center" },
  navLinks: { display: "flex", alignItems: "center", gap: "25px" },
  logoutButton: { backgroundColor: "white", color: "black", border: "1px solid black", padding: "8px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "15px", transition: "all 0.3s ease" },
  welcomeMessage: { fontSize: "16px", fontWeight: "bold", color: "#4f6df5" },
  contentContainer: { textAlign: "center", marginTop: "60px", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" },
  instructions: { maxWidth: "600px" },
  title: { fontSize: "20px", fontWeight: "bold", marginBottom: "15px" },
  list: { textAlign: "left", lineHeight: "1.8", fontSize: "15px", color: "#333" },
  formContainer: { backgroundColor: "#fff", width: "600px", padding: "30px", borderRadius: "12px", boxShadow: "0px 3px 10px rgba(0,0,0,0.1)" },
  formTitle: { fontSize: "18px", fontWeight: "bold" },
  subLink: { display: "block", color: "#555", marginBottom: "20px", textDecoration: "underline", fontSize: "14px" },
  input: { width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px", marginBottom: "15px" },
  textarea: { width: "100%", height: "120px", padding: "12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px", marginBottom: "20px" },
  postButton: { backgroundColor: "#4f6df5", color: "white", border: "none", borderRadius: "6px", padding: "12px 20px", fontSize: "15px", cursor: "pointer" },
};

export default Home;
