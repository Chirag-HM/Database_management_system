const authService = require("../services/auth.service");

// ─────────────────────────────────────────────────────────────
// Auth Controller
// ─────────────────────────────────────────────────────────────
// Follows the same THIN controller pattern as student.controller:
//   1. Parse the incoming request
//   2. Call the service
//   3. Send the response
//   4. Pass errors to the global error handler via next()
//
// Contains ZERO business logic or database code.
// ─────────────────────────────────────────────────────────────

// ─── SIGNUP ─────────────────────────────────────────────────
// POST /api/auth/signup
// Body: { name, email, password }
// Returns: { token, user }
// ─────────────────────────────────────────────────────────────
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const result = await authService.registerUser(name, email, password);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── LOGIN ──────────────────────────────────────────────────
// POST /api/auth/login
// Body: { email, password }
// Returns: { token, user }
// ─────────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ME ─────────────────────────────────────────────────
// GET /api/auth/me
// Headers: Authorization: Bearer <token>
// Returns: { user }
//
// This endpoint is protected by auth.middleware.js, which
// verifies the JWT and attaches `req.user` before this
// controller runs.
// ─────────────────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
