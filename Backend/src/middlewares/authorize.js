import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ErrorHandling.js";

export const authorize = async (req, res, next) => {
  try {
    let token = req.cookies["access-token"];
    let refresh_token = req.cookies["refresh-token"];
    // console.log(token, refresh_token);
    // console.log(token, refresh_token);
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (
      !refresh_token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      refresh_token = req.headers.authorization.split(" ")[1];
    }
    if (!token && !refresh_token) {
      throw new Error("Token not found");
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new Error("User not found");
      }
      req.user = user;
      next();
    }
    if (refresh_token) {
      
      const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new Error("User not found");
      }
      const newToken = user.getRefreshToken();
      res.cookie("access-token", newToken, { httpOnly: true });
      req.user = user;
      next();
    }
  } catch (error) {
    next(new ApiError(401, "Unauthorized"));
  }
};
