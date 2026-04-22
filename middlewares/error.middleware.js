// ─────────────────────────────────────────────────────────────
// Global Error Handler Middleware
// ─────────────────────────────────────────────────────────────
// Express identifies this as an error-handling middleware
// because it has FOUR parameters (err, req, res, next).
//
// Any time next(error) is called from a controller or another
// middleware, Express skips all normal middleware and jumps
// straight here.
//
// We inspect the error to give the client a helpful, consistent
// JSON response instead of a raw stack trace.
// ─────────────────────────────────────────────────────────────

module.exports = (err, req, res, next) => {
  // Default values
  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";

  // ── Mongoose CastError ──────────────────────────────────
  // Happens when an invalid ObjectId is passed to findById()
  // Example: GET /api/students/not-a-real-id
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ── Mongoose ValidationError ────────────────────────────
  // Happens when schema-level validation fails (e.g. required
  // field missing, value out of min/max range).
  if (err.name === "ValidationError") {
    statusCode = 400;
    // Collect all individual field errors into one string
    const errors = Object.values(err.errors).map((val) => val.message);
    message = errors.join(". ");
  }

  // ── MongoDB Duplicate Key Error ─────────────────────────
  // Error code 11000 fires when a unique index is violated.
  // Currently the Student schema has no unique fields, but
  // this is here for future-proofing (e.g. adding email).
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(", ");
    message = `Duplicate value for field(s): ${field}`;
  }

  // Log the full error in development for debugging
  console.error(`❌ [${statusCode}] ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
  });
};