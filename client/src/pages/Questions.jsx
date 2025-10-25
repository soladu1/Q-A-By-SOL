// src/pages/Questions.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

function Questions() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("/users/check", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Authenticated user:", res.data);
        setIsAuthenticated(true);
        fetchQuestions(token);
      } catch (err) {
        console.error("❌ Auth check failed:", err.response?.data?.message || err.message);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // ✅ Fetch questions from backend
  const fetchQuestions = async (token) => {
    try {
      const res = await axios.get("/questions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching questions:", err);
      setErrorMessage("Failed to load questions.");
    }
  };

  // ✅ Go back to Home
  const handleBackToHome = () => {
    navigate("/");
  };

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) return null;

  return (
    <div style={styles.pageContainer}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <span style={{ color: "#FF7A00", fontWeight: "bold" }}>EVAN</span>
          <span style={{ color: "black", fontWeight: "bold" }}>GADI</span>
        </div>

        <div style={styles.navLinks}>
          <button style={styles.backButton} onClick={handleBackToHome}>
            ← Back to Home
          </button>
        </div>
      </nav>

      {/* Questions List */}
      <div style={styles.contentContainer}>
        <h2 style={styles.title}>All Questions</h2>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {questions.length === 0 ? (
          <p>No questions available.</p>
        ) : (
          <ul style={styles.questionList}>
            {questions.map((q) => (
              <li key={q.questionid} style={styles.questionItem}>
                <h3 style={styles.questionTitle}>{q.title}</h3>
                <p style={styles.questionDescription}>{q.description}</p>
                {q.tag && <span style={styles.tag}>Tag: {q.tag}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fff",
    minHeight: "100vh",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 100px",
    borderBottom: "1px solid #e0e0e0",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },
  backButton: {
    backgroundColor: "#4f6df5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 20px",
    fontSize: "15px",
    cursor: "pointer",
  },
  contentContainer: {
    textAlign: "center",
    marginTop: "60px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "40px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
  },
  questionList: {
    listStyleType: "none",
    padding: 0,
    width: "80%",
    maxWidth: "800px",
  },
  questionItem: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "15px",
    textAlign: "left",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.05)",
  },
  questionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  questionDescription: {
    fontSize: "15px",
    color: "#333",
    marginBottom: "8px",
  },
  tag: {
    fontSize: "14px",
    fontStyle: "italic",
    color: "#777",
  },
};

export default Questions;
