import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
      // minlength: 6,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      // minlength: 6,
      maxlength: 255,
      index: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      // minlength: 6,
      maxlength: 1024,
    },

    refresh_token: {
      type: String,
      required: false,
      default: "",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    pin: {
      type: String,
      default: "",
    },
    task: {
      type: Array,
      of: Schema.Types.ObjectId,
      ref: "Task",
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getAccessToken = function () {
  return jwt.sign(
    { id: this._id.toHexString(), email: this.email, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h", // 1 hour
    }
  );
};

userSchema.methods.getRefreshToken = function () {
  return jwt.sign({ id: this._id.toHexString() }, process.env.JWT_SECRET, {
    expiresIn: "2d", // 2 days
  });
};

export const User = mongoose.model("User", userSchema);
