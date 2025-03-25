import { Router } from "express";
import { body, query } from "express-validator";

import { authorize } from "../middlewares/authorize.js";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  getTasks_querry,
  updateTask,
} from "../controllers/task.controller.js";

const TaskRouter = Router();

const validateTask = [
  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 3, max: 50 })
    .withMessage("Title must be between 3 and 50 characters"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 3, max: 100 })
    .withMessage("Description must be between 3 and 100 characters"),
  body("status")
    .optional()
    .isString()
    .withMessage("Status must be a string")
    .isIn(["To Do", "In Progress", "Done"])
    .withMessage("Status must be To Do, In Progress or Done"),
  body("due_date")
    .optional()
    .isDate()
    .custom((value) => {
      const dueDate = new Date(value);
      console.log(dueDate, new Date());
      if (dueDate < new Date()) {
        throw new Error("Due date must be in the future");
      }
      return true;
    })
    .withMessage("Due date must be a valid date in the future"),
];

const validateSearchQuery = [
  query("title")
    .optional()
    .isString()
    .withMessage("title must be a string")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),
  query("status")
    .optional()
    .isIn(["To Do", "In Progress", "Done"])
    .withMessage("Status must be 'To Do', 'In Progress', or 'Done'"),
  query("due_date")
    .optional()
    .isDate()
    .withMessage("Due date must be a valid date"),
];

TaskRouter.post("/", authorize, validateTask, createTask);
TaskRouter.get("/", authorize, getTasks);
TaskRouter.get("/search", authorize, validateSearchQuery, getTasks_querry);
TaskRouter.get("/:id", authorize, getTaskById);
TaskRouter.put("/:id", authorize, validateTask, updateTask);
TaskRouter.delete("/:id", authorize, deleteTask);

export default TaskRouter;
