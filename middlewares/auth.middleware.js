const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ─────────────────────────────────────────────────────────────
// Auth Middleware — JWT Verification
// ─────────────────────────────────────────────────────────────
// This is the GATEKEEPER for all protected routes. It sits
// between the incoming request and the controller:
//
//   Client Request → auth.middleware → Controller
//
// STEP-BY-STEP:
//   1. Extract token from "Authorization: Bearer <token>"
//   2. Verify token signature using JWT_SECRET
//   3. Decode payload → { userId, email, iat, exp }
//   4. Confirm user still exists in the database
//   5. Attach user info to req.user
//   6. Call next() → request proceeds to the controller
//
//   If ANY step fails → 401 Unauthorized response
//
// WHY CHECK THE DATABASE (Step 4)?
//   A user might be deleted AFTER a token was issued. Without
//   this check, a deleted user's token would still work until
//   it expires. This adds a small DB query but greatly improves
//   security.
// ─────────────────────────────────────────────────────────────

const authMiddleware = async (req, res, next) => {
  try {
    // ── Step 1: Get the Authorization header ───────────────
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // ── Step 2: Extract the token ──────────────────────────
    // Expected format: "Bearer eyJhbGciOi..."
    // We split by space and take the second part.
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token format. Use: Bearer <token>",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // ── Step 3: Verify the token ───────────────────────────
    // jwt.verify() does two things:
    //   1. Checks if the signature matches (proves token wasn't tampered)
    //   2. Checks if the token has expired (compares `exp` with now)
    //
    // If either fails, it throws an error (caught below).
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ── Step 4: Confirm user still exists ──────────────────
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User belonging to this token no longer exists.",
      });
    }

    // ── Step 5: Attach user info to the request ────────────
    // Now any controller/middleware that runs AFTER this one
    // can access req.user to know who made the request.
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    // ── Step 6: Proceed to the next middleware/controller ───
    next();
  } catch (error) {
    // ── Handle specific JWT errors ─────────────────────────

    if (error.name === "TokenExpiredError") {
      // The token's `exp` field is in the past
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      // The token's signature doesn't match (tampered or invalid)
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    // Unexpected error — pass to global error handler
    next(error);
  }
};

module.exports = authMiddleware;
