const express = require("express");
const app = express();

const studentRoutes = require("./routes/student.routes");
const authRoutes = require("./routes/auth.routes");
const uploadRoutes = require("./routes/upload.routes");
const logger = require("./middlewares/logger.middleware");
const errorHandler = require("./middlewares/error.middleware");
const authMiddleware = require("./middlewares/auth.middleware");
const notFound = require("./middlewares/notFound.middleware");

// ─────────────────────────────────────────────────────────
// CORS Configuration (Express v5 compatible)
// ─────────────────────────────────────────────────────────
// WHY manual instead of the `cors` package?
//   Express v5 changed how OPTIONS (preflight) requests are
//   routed. The `cors` npm package relies on Express v4's
//   behavior and may not inject headers correctly on v5.
//   This manual middleware is simple, reliable, and clear.
//
// HOW CORS WORKS:
//   1. Browser sends a "preflight" OPTIONS request BEFORE
//      the real request (for POST, PUT, DELETE, or custom headers).
//   2. Server responds with which origins/methods/headers are allowed.
//   3. If the response has the right headers, the browser sends
//      the actual request. Otherwise it blocks it.
// ─────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:4173", // Vite preview server
];

app.use((req, res, next) => {
  const origin = req.get("origin") || req.get("Origin");

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }

  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Allow-Credentials", "true");

  // Handle preflight OPTIONS requests immediately
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

app.use(express.json());
app.use(logger);

// ─── Auth routes (PUBLIC — no token needed) ────────────────
app.use("/api/auth", authRoutes);

// ─── Upload routes (PROTECTED) ─────────────────────────────
app.use("/api/upload", uploadRoutes);

// ─── Student routes (PROTECTED — valid JWT required) ────────
// The authMiddleware runs BEFORE any student route handler.
// It verifies the JWT token and attaches req.user. If the
// token is missing or invalid, it returns 401 immediately.
app.use("/api/students", authMiddleware, studentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;