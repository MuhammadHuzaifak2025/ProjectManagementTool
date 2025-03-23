import { Router } from "express";
import { body } from "express-validator";

import { authorize } from "../middlewares/authorize.js";
import {
  getUser,
  login,
  logout,
  register,
  test,
} from "../controllers/user.controller.js";

const UserRouter = Router();

UserRouter.post(
  "/register",

  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("name")
      .isString()
      .withMessage("Name must be a string")
      .isLength({ min: 3, max: 50 })
      .withMessage("Name must be between 3 and 50 characters"),
    body("password")
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter"),
  ],
  register
);

UserRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter"),
  ],
  login
);

UserRouter.post("/logout", authorize, logout);
UserRouter.get("/", authorize, getUser);
UserRouter.get("/test", authorize, test);

export default UserRouter;
