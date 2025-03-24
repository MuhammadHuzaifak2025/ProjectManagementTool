import { check } from "express-validator";
import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: 255,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
      Options: ["To Do", "In Progress", "Done"],
    },
    due_date: {
      type: Date,
      required: false,
      check: (val) => val > Date.now(),
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
