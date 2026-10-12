const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { validateRegister, validateLogin } = require("../middleware/validationMiddleware");
const { sendPasswordResetEmail } = require("../utils/emailService");

const router = express.Router();

// =========================================================================
// POST /api/auth/register — User Registration
// =========================================================================
router.post("/register", validateRegister, async (req, res) => {
  try {
    const { email, password, role } = req.body;

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

    // Create and save new user (default role is 'user')
    const userRole = role === "admin" ? "admin" : "user";
    const newUser = new User({
      email,
      password: hashedPassword,
      role: userRole,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        email: savedUser.email,
        role: savedUser.role,
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

    // Generate JWT Token including role in payload
    const secret = process.env.JWT_SECRET || "default_jwt_secret";
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role || "user",
      },
      secret,
      { expiresIn: "8h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role || "user",
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
      role: user.role || "user",
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

// =========================================================================
// POST /api/auth/forgot-password — Request Password Reset Email via Nodemailer
// =========================================================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    // For privacy/security, if user doesn't exist, we still return success message
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, password reset instructions have been sent.",
      });
    }

    // Generate cryptographically secure random token (64 hex characters)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpiration;
    await user.save();

    // Construct reset link for client
    const clientOrigin = req.headers.origin || "http://localhost:5173";
    const resetUrl = `${clientOrigin}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

    // Dispatch email through Nodemailer
    await sendPasswordResetEmail({
      to: user.email,
      resetUrl,
      resetToken,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset instructions have been sent to your email.",
      token: process.env.NODE_ENV === "production" ? undefined : resetToken, // returned in development for immediate test convenience
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process password reset request. Please try again later.",
      error: error.message,
    });
  }
});

// =========================================================================
// POST /api/auth/reset-password — Confirm & Set New Password with Token
// =========================================================================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, reset token, and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find user with matching email, token, and unexpired timestamp
    const user = await User.findOne({
      email: cleanEmail,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired. Please request a new one.",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been successfully updated! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error resetting password.",
      error: error.message,
    });
  }
});

// =========================================================================
// POST /api/auth/setup-admin — Seed / Promote Admin User (Development & Demo)
// =========================================================================
router.post("/setup-admin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const targetEmail = (email || "admin@portfolio.com").toLowerCase().trim();
    const targetPassword = password || "Admin@12345";

    let user = await User.findOne({ email: targetEmail });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(targetPassword, salt);

    if (user) {
      user.role = "admin";
      user.password = hashedPassword;
      await user.save();
    } else {
      user = new User({
        email: targetEmail,
        password: hashedPassword,
        role: "admin",
      });
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: `Admin user (${targetEmail}) successfully configured with 'admin' role!`,
      credentials: {
        email: targetEmail,
        password: targetPassword,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Setup Admin Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to setup admin user",
      error: error.message,
    });
  }
});

module.exports = router;
