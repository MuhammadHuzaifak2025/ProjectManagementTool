import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true, // Ensures cookies are sent
});

export default axiosInstance;
