// src/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5500/api", // ✅ matches your backend route
});

export default instance;
