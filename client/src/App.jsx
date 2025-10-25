// src/App.jsx
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Questions from "./pages/Questions";
import { useEffect, useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // ✅ Simple token check for initial auth
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    console.log("🔍 Simple Auth check - Token exists:", !!token);
    return !!token;
  };

  useEffect(() => {
    // Initial auth check
    const tokenExists = checkAuth();
    setIsAuthenticated(tokenExists);
    console.log("✅ Initial auth set to:", tokenExists);

    // Listen for auth changes (login/logout)
    const onAuthChange = () => {
      console.log("🔄 Auth change event received");
      const newAuthState = checkAuth();
      console.log("🔄 Updating auth state to:", newAuthState);
      setIsAuthenticated(newAuthState);
    };

    window.addEventListener("authChange", onAuthChange);

    return () => {
      window.removeEventListener("authChange", onAuthChange);
    };
  }, []);

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Checking authentication...
      </p>
    );
  }

  return (
    <div>
      {/* Navbar */}
      <nav style={{ textAlign: "center", margin: "20px" }}>
        {isAuthenticated ? (
          <>
            <Link to="/home">Home</Link> {" | "}
            <Link to="/questions">Questions</Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> {" | "}
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      {/* Routes */}
      <Routes>
        {/* Protected routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/questions"
          element={isAuthenticated ? <Questions /> : <Navigate to="/login" replace />}
        />

        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Register />
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
