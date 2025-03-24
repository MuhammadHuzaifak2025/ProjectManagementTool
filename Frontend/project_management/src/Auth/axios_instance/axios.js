import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND,
  withCredentials: true, // Ensures cookies are sent
});

export default axiosInstance;
