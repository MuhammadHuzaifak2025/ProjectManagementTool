import axios from "axios";
const token = localStorage.getItem("access-token");
// const refreshToken = localStorage.getItem("refresh-token");

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND || "http://localhost:5001",
  withCredentials: true, // Ensures cookies are sent
  headers: { Authorization: `Bearer ${token}` },
});

export default axiosInstance;
