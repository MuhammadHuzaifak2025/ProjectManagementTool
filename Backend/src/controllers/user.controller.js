import { User } from "../models/user.models.js";
import asynchandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ErrorHandling.js";
import GenerateToken from "../utils/GenerateToken.js";
import ApiResponse from "../utils/ResponseHandling.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
// test cases:
// 1. email, password, name are not provided
//  email: "", password: "", name: ""
// 2. password is less than 6 characters
// email: "abc@abc" password: "12345" name: "abc"
// 3. user already exists with the same email
// email: "abc@abc" password: "123456" name: "abc"
// 4. user is created successfully
// email: "abc@abc" password: "123456" name: "abc"

const register = asynchandler(async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //   console.log(err_new);
      const err_new = new ApiError(
        400,
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
      throw err_new;
    }
    const user = await User.findOne({ email: email });

    if (user) {
      throw new ApiError(400, "User already exists with this email");
    }
    const newUser = await User.create({
      email,
      password,
      name,
    });

    return res.status(201).json(
      new ApiResponse(201, {
        message: "User created successfully",
        data: newUser,
      })
    );
  } catch (error) {
    next(error);
  }
});

const login = asynchandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err_new = new ApiError(
        400,
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
      throw err_new;
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new ApiError(400, "User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(400, "Invalid credentials");
    }

    const [token, refresh_token] = GenerateToken(user);
    user.refresh_token = refresh_token;
    await user.save();

    res.cookie("access-token", token, { httpOnly: true });
    res.cookie("refresh-token", refresh_token, { httpOnly: true });
    user.password = undefined;
    user.refresh_token = undefined;
    return res.status(200).json(
      new ApiResponse(200, {
        message: "User logged in successfully",
        data: user,
      })
    );
  } catch (error) {
    next(error);
  }
});

const logout = asynchandler(async (req, res, next) => {
  try {
    res.clearCookie("access-token");
    res.clearCookie("refresh-token");
    return res.status(200).json(
      new ApiResponse(200, {
        message: "User logged out successfully",
      })
    );
  } catch (error) {
    next(error);
  }
});

const getUser = asynchandler(async (req, res, next) => {
  try {
    const user = req.user;
    return res.status(200).json(
      new ApiResponse(200, {
        message: "User details",
        data: user,
      })
    );
  } catch (error) {
    next(error);
  }
});

const test = asynchandler(async (req, res, next) => {
  try {
    res.clearCookie("access-token");
    return res.status(200).json(
      new ApiResponse(200, {
        message: "Test",
      })
    );
  } catch (error) {
    next(error);
  }
});

export { register, login, logout, getUser, test };
