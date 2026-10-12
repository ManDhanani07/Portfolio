const User = require("../models/User");

/**
 * Admin Authorization Middleware
 * Ensures the requesting authenticated user has the 'admin' role.
 * Must be executed AFTER authMiddleware in the pipeline.
 */
const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Authentication required before checking admin privileges.",
      });
    }

    // Check role in JWT payload first; if absent or needs verification, query User document
    let role = req.user.role;
    if (!role) {
      const user = await User.findById(req.user.id).select("role");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
      role = user.role;
    }

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access is restricted to Administrators only.",
      });
    }

    req.user.role = role;
    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error verifying administrator access.",
    });
  }
};

module.exports = adminMiddleware;
