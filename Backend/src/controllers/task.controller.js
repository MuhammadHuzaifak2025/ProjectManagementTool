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

// Get All Tasks
export const getTasks = asynchandler(async (req, res, next) => {
  const tasks = await Task.find({_id: req.user.task});
  if (!tasks) return next(new ApiError(404, "No tasks found"));
  return res.status(200).json(new ApiResponse(200, tasks));
});

// Get Single Task
export const getTaskById = asynchandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(new ApiError(404, "Task not found"));

  return res.status(200).json(new ApiResponse(200, task));
});

// Update Task
export const updateTask = asynchandler(async (req, res, next) => {
  const { title, description, status, due_date } = req.body;
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { title, description, status, due_date },
    { new: true, runValidators: true }
  );

  if (!task) return next(new ApiError(404, "Task not found"));

  return res.status(200).json(new ApiResponse(200, task));
});

// Delete Task
export const deleteTask = asynchandler(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return next(new ApiError(404, "Task not found"));

  // Remove task from user's task list
  const user = await User.findOne({ task: req.params.id });
  if (user) {
    user.task = user.task.filter(
      (taskId) => taskId.toString() !== req.params.id
    );
    await user.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Task deleted successfully"));
});
