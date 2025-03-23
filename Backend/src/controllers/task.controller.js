import { User } from "../models/user.models.js";
import asynchandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ErrorHandling.js";
import GenerateToken from "../utils/GenerateToken.js";
import ApiResponse from "../utils/ResponseHandling.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";