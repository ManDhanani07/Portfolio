const jwt = require("jsonwebtoken");

/**
 * Authentication Middleware (Practical 7)
 * Verifies JWT token from Authorization header (Bearer <token>)
 * Attaches decoded payload (user id, email) to req.user
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Check if Authorization header exists and follows Bearer scheme
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided or invalid format. Expected: Bearer <token>",
      });
    }

    // Extract the token part
    const token = authHeader.split(" ")[1];

    if (!token || token.trim() === "") {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token is missing.",
      });
    }

    // Verify token with JWT_SECRET
    const secret = process.env.JWT_SECRET || "default_jwt_secret";
    const decoded = jwt.verify(token, secret);

    // Attach decoded user data (e.g. { id, email }) to request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token. Authentication failed.",
    });
  }
};

module.exports = authMiddleware;
