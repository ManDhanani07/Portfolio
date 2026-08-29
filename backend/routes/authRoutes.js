const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { validateRegister, validateLogin } = require("../middleware/validationMiddleware");

const router = express.Router();

// =========================================================================
// POST /api/auth/register — User Registration
// =========================================================================
router.post("/register", validateRegister, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password with bcryptjs (salt rounds = 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Never return password in response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        email: savedUser.email,
        createdAt: savedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
});

// =========================================================================
// POST /api/auth/login — User Login & JWT Generation
// =========================================================================
router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT Token
    const secret = process.env.JWT_SECRET || "default_jwt_secret";
    const token = jwt.sign(
      { id: user._id, email: user.email },
      secret,
      { expiresIn: "1h" }
    );

    // Return token to frontend (password excluded)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
});

// =========================================================================
// GET /api/auth/me — Get Current Authenticated User
// Protected via authMiddleware
// =========================================================================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // req.user.id is attached by authMiddleware after JWT verification
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      id: user._id,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("GET /me Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching user details",
      error: error.message,
    });
  }
});

module.exports = router;
