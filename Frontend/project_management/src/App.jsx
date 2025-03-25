import { useEffect, useState } from "react";
import axios from "axios";
import login from "./components/login";
import register from "./components/register";
import Dashboard from "./components/dashboard";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AuthProvider } from './Auth/context/AuthContext';
import Account from "./Auth/routes/account"
import Protected from "./Auth/routes/protected"
import NotFound from "./components/pagenotfound";
import axiosInstance from "./Auth/axios_instance/axios";


function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const authenticate = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND + "/api/v1/user/", {
        withCredentials: true,
      });

      if (response.data.StatusCode === 200) {
        setUser(response.data.message);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    authenticate();
  }, []); // Removed `[!isAuthenticated]` to avoid infinite loops

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response, // Pass successful responses
      (error) => {
        if (error.response && error.response.status === 401 || error.response.status === 500) {
          setIsAuthenticated(false);
          setUser(null);
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return (
    <AuthProvider value={{ isAuthenticated, setIsAuthenticated, loading, setLoading, authenticate, user, setUser }}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Public Routes */}
        <Route path="/login" element={<Account Component={login} />} />
        <Route path="/signup" element={<Account Component={register} />} />

        {/* Protected Routes */}


        <Route path="/dashboard" element={<Protected Component={Dashboard} />} >

        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
export default App;