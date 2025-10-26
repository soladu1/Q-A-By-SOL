// src/axiosConfig.js
import axios from "axios";

export default axios.create({
  baseURL: 'https://q-a-by-sol.onrender.com/users', // ✅ FIXED
});
