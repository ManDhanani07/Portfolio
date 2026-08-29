/**
 * Validation Middleware Pipeline (Practical 7)
 * Implements server-side input validation for Auth & Task routes.
 * Returns HTTP 400 on validation failure.
 */

// Email regex pattern for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates task payload for POST /api/tasks and PUT /api/tasks/:id
 */
const validateTask = (req, res, next) => {
  const { title } = req.body;

  // Title is required and must not be empty/whitespace
  if (title === undefined || title === null || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Validation Error: Task title is required and cannot be empty",
    });
  }

  // Trim the title in request body
  req.body.title = title.trim();

  if (req.body.description && typeof req.body.description === "string") {
    req.body.description = req.body.description.trim();
  }

  next();
};

/**
 * Validates registration payload for POST /api/auth/register
 */
const validateRegister = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string" || email.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Validation Error: Email is required",
    });
  }

  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Validation Error: Invalid email format",
    });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Validation Error: Password is required and must be at least 6 characters",
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

/**
 * Validates login payload for POST /api/auth/login
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string" || email.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Validation Error: Email is required",
    });
  }

  if (!password || typeof password !== "string" || password.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Validation Error: Password is required",
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

module.exports = {
  validateTask,
  validateRegister,
  validateLogin,
};
