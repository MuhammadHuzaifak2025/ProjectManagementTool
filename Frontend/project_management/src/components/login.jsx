import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../Auth/context/AuthContext";
import axiosInstance from "../Auth/axios_instance/axios";
import { toast } from "react-toastify";

const Login = () => {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset
  } = useForm();
  const { setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();


  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(
        import.meta.env.VITE_BACKEND + "/api/v1/user/login",
        data,
        { withCredentials: true }
      );

      if (response) {
        // alert("Login successful");
        toast.success("Login successful");
        setUser(response.data.data.data.user);
        localStorage.setItem("access-token", response.data.data.data.token);
        localStorage.setItem("refresh-token", response.data.data.data.refresh_token);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.data.data.token}`;
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        setError("apiError", { message: "Invalid credentials" });
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Login failed. Please try again.");
      setError("apiError", { message: "Login failed. Please try again." });
    } finally {
      reset({}, { keepValues: true }); // ✅ Reset form state but keep input values
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email" className="pb-1">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Please enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="pb-1">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*\d).{6,}$/,
                    message:
                      "Password must contain at least one uppercase letter and one number",
                  },
                })}

              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            {errors.apiError && (
              <p className="text-red-500 text-sm">{errors.apiError.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
          <p className="text-center mt-4">
            Don't have an account? <a href="/Signup" className="text-blue-500">Register</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
