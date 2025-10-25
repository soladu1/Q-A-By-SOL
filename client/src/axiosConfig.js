// src/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://q-a-by-sol.onrender.com", // ✅ matches your backend route
});

export default instance;

// https://q-a-by-sol.onrender.com