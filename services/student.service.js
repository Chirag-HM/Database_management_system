const { Student } = require("../models/student.model");

// ─────────────────────────────────────────────────────────────
// Service Layer
// ─────────────────────────────────────────────────────────────
// All database interactions live here. Controllers call these
// functions and never import Mongoose directly. This makes the
// code easier to test (you can mock a service) and ensures
// a single place to change if the database engine ever changes.
// ─────────────────────────────────────────────────────────────

/**
 * getAllStudents
 * ──────────────
 * Supports:
 *   • Pagination  — via `page` and `limit` query params
 *   • Search      — partial, case-insensitive match on `name`
 *
 * HOW PAGINATION WORKS:
 *   skip = (page - 1) * limit
 *   MongoDB skips that many documents, then returns `limit` docs.
 *
 * HOW SEARCH WORKS:
 *   We build a filter object. If `search` is truthy, we add a
 *   regex condition: { name: { $regex: search, $options: "i" } }
 *   $options: "i" makes it case-insensitive.
 */
const getAllStudents = async (page = 1, limit = 5, search = "") => {
  // Build a dynamic filter object
  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  // Count total matching documents (for pagination metadata)
  const total = await Student.countDocuments(filter);

  // Fetch the paginated slice, sorted newest-first
  const data = await Student.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data,
  };
};

/**
 * getStudentById
 * ──────────────
 * Finds a single student by their MongoDB _id.
 * Returns null if not found (controller decides the HTTP status).
 */
const getStudentById = async (id) => {
  return await Student.findById(id);
};

/**
 * createStudent
 * ─────────────
 * Creates a new student document. Mongoose schema validation
 * will kick in automatically — if the data violates any schema
 * rule the promise rejects with a ValidationError.
 */
const createStudent = async (data) => {
  return await Student.create(data);
};

/**
 * updateStudent
 * ─────────────
 * Finds a student by _id and applies the partial update.
 *
 * OPTIONS explained:
 *   new: true          → Return the UPDATED document, not the old one
 *   runValidators: true → Re-run schema validations on the new values
 */
const updateStudent = async (id, data) => {
  return await Student.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

/**
 * deleteStudent
 * ─────────────
 * Removes the document and returns the deleted document
 * (or null if not found).
 */
const deleteStudent = async (id) => {
  return await Student.findByIdAndDelete(id);
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};