import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../Auth/axios_instance/axios";
import { toast } from "react-toastify";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    reset
  } = useForm();

  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(
        import.meta.env.VITE_BACKEND + "/api/v1/user/register",
        data,
        { withCredentials: true }
      );

      if (response) {
        navigate("/login"); // Redirect after successful registration
      } else {
        setError("apiError", { message: "Registration failed. Try again." });
      }
    } catch (err) {
      toast.error(err.response.data.message);
      setError("apiError", { message: "Registration failed. Please try again." });
    }
    finally {
      reset({}, { keepValues: true }); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div>
              <Label htmlFor="name" className="pb-1">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
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

            {/* Password Field */}
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

            {/* Confirm Password Field */}
            <div>
              <Label htmlFor="confirmPassword" className="pb-1">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* API Error Handling */}
            {errors.apiError && (
              <p className="text-red-500 text-sm">{errors.apiError.message}</p>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </form>
          <p className="text-center mt-4">
            Don't have an account? <a href="/login" className="text-blue-500">Login</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
