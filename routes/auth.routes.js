const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// ─────────────────────────────────────────────────────────────
// Auth Routes
// ─────────────────────────────────────────────────────────────
// PUBLIC routes (no token required):
//   POST /api/auth/signup  → Register a new user
//   POST /api/auth/login   → Login and get a JWT token
//
// PROTECTED routes (valid JWT required):
//   GET  /api/auth/me      → Get the currently logged-in user
// ─────────────────────────────────────────────────────────────

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.get("/me", authMiddleware, controller.getMe);

module.exports = router;
