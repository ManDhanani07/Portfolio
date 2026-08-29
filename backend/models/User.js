const mongoose = require("mongoose");

/**
 * User Schema for JWT Authentication (Practical 7)
 * Stores user credentials with email uniqueness and hashed passwords
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
