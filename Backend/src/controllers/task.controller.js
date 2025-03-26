import { User } from "../models/user.models.js";
import { Task } from "../models/task.model.js";
import asynchandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ErrorHandling.js";
import GenerateToken from "../utils/GenerateToken.js";
import ApiResponse from "../utils/ResponseHandling.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

// Create Task -
// Test Cases:
// 1. title, description, status, due_date are not provided
//     title: "", description: "", status: "", due_date: ""
// 2. title is less than 3 characters
//     title: "ab", description: "abc", status: "To Do", due_date: "2022-12-12"
// 3. title is more than 50 characters or description is more than 100 characters (Invalid Input Type)
// title: "a".repeat(51), description: "abc", status: "To Do", due_date: "2022-12-12"

export const createTask = asynchandler(async (req, res, next) => {
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

  const { title, description, status, due_date } = req.body;
  const task_with_same_title = await Task.findOne({ title });

  if (task_with_same_title)
    throw new ApiError(400, "Task with same title already exists");

  const user = req.user;
  const task = await Task.create({ title, description, status, due_date });

  user.task.push(task._id);
  await user.save();

  return res.status(201).json(new ApiResponse(201, task));
});

export const getTasks = asynchandler(async (req, res, next) => {
  const tasks = await Task.find({ _id: req.user.task });
  if (!tasks) return next(new ApiError(404, "No tasks found"));
  return res.status(200).json(new ApiResponse(200, tasks));
});

export const getTaskById = asynchandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  const user = req.user;
  const taskExists = user.task.find(
    (task) => task._id.toString() === req.params.id
  );
  if (taskExists) {
    return res.status(200).json(new ApiResponse(200, task));
  }

  throw new ApiError(404, "Task not found");
});

// test case 1: title, description, status, due_date are not provided
// title: "", description: "", status: "", due_date: ""
// test case 2: Invalid title format
// title: "ab", description: "abc", status: "To Do", due_date: "2022-12-12"

export const updateTask = asynchandler(async (req, res, next) => {
  const { title, description, status, due_date } = req.body;
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
  const user = req.user;

  const taskExists = user.task.find(
    (task) => task._id.toString() === req.params.id
  );

  if (!taskExists) {
    throw new ApiError(404, "Task not found");
  }
  let updatedFields = {};

  if (title) {
    const checkTitleExists = await Task.findOne({ title });
    // if (checkTitleExists) {
    //   throw new ApiError(400, "Task with the same title already exists");
    // }
    updatedFields.title = title;
  }

  if (description) updatedFields.description = description;
  if (status) updatedFields.status = status;
  if (due_date) updatedFields.due_date = due_date;

  if (Object.keys(updatedFields).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    updatedFields,
    { new: true, runValidators: true }
  );

  res.status(200).json(new ApiResponse(200, updatedTask));
});

// test case: Task not found - Fail
// test case: Task found but now owned by user- Fail
// test case: Task found and owned by user - Success

export const deleteTask = asynchandler(async (req, res, next) => {
  const user = req.user;

  const taskExists = user.task.some(
    (task) => task._id.toString() === req.params.id
  );
  if (!taskExists) {
    throw new ApiError(404, "Task not found");
  }

  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return next(new ApiError(404, "Task not found"));

  user.task = user.task.filter((task) => task._id.toString() !== req.params.id);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Task deleted successfully"));
});

export const getTasks_querry = asynchandler(async (req, res, next) => {
  const { title, status, due_date } = req.query;

  let filter = {};

  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }
  if (status) {
    filter.status = { $regex: status, $options: "i" };
  }
  if (due_date) {
    const parsedDate = new Date(due_date);
    if (parsedDate.toString() === "Invalid Date") {
      throw new ApiError(400, "Invalid date format");
    }
    filter.due_date = {
      $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
      $lte: new Date(parsedDate.setHours(23, 59, 59, 999)),
    };
  }

  const tasks = await Task.find(filter);
  if (!tasks.length) return next(new ApiError(404, "No tasks found"));

  return res.status(200).json(new ApiResponse(200, tasks));
});
