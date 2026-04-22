const mongoose = require("mongoose");

// ─────────────────────────────────────────────────────────────
// Mongoose Schema
// ─────────────────────────────────────────────────────────────
// This is the SINGLE SOURCE OF TRUTH for what a "Student"
// document looks like inside MongoDB.
//
// Mongoose validates data at the schema level before it ever
// reaches the database, acting as a safety net even if
// the request-level validation middleware is bypassed.
// ─────────────────────────────────────────────────────────────
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,        // Removes leading/trailing whitespace
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [1, "Age must be at least 1"],
      max: [150, "Age cannot exceed 150"],
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
      minlength: [2, "Course must be at least 2 characters"],
      maxlength: [100, "Course cannot exceed 100 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now, // Auto-set on document creation
    },
  },
  {
    // versionKey: false removes the __v field that Mongoose adds
    // by default. It is safe to disable if you are not using
    // Mongoose's built-in optimistic concurrency control.
    versionKey: false,
  }
);

const Student = mongoose.model("Student", studentSchema);

// ─────────────────────────────────────────────────────────────
// Request-level validation (kept from original code)
// ─────────────────────────────────────────────────────────────
// This runs in the validation middleware BEFORE the request
// reaches the controller / service layer. It prevents obviously
// bad data from even touching Mongoose and keeps error messages
// user-friendly.
// ─────────────────────────────────────────────────────────────
function validateStudent(data) {
  if (!data) {
    return "Request body is missing or invalid JSON";
  }

  const { name, age, course } = data;

  if (!name || typeof name !== "string") {
    return "Name is required and must be a string";
  }

  if (age === undefined || age === null || typeof age !== "number") {
    return "Age is required and must be a number";
  }

  if (!course || typeof course !== "string") {
    return "Course is required and must be a string";
  }

  return null; // No errors
}

module.exports = { Student, validateStudent };