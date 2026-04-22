const service = require("../services/student.service");
const mongoose = require("mongoose");

// ─────────────────────────────────────────────────────────────
// Controller Layer
// ─────────────────────────────────────────────────────────────
// Controllers are intentionally THIN:
//   1. Parse the incoming request (params, query, body)
//   2. Call the service
//   3. Send the response
//   4. Pass errors to the global error handler via next()
//
// They contain ZERO business logic or database code.
// ─────────────────────────────────────────────────────────────

/**
 * Helper — checks whether a string is a valid MongoDB ObjectId.
 * Used before calling findById / findByIdAndUpdate / findByIdAndDelete
 * to return a clear 400 instead of letting Mongoose throw a CastError.
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ─── GET ALL ────────────────────────────────────────────────
exports.getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const search = req.query.search || "";

    const result = await service.getAllStudents(page, limit, search);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── GET BY ID ──────────────────────────────────────────────
exports.getById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    const student = await service.getStudentById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

// ─── CREATE ─────────────────────────────────────────────────
exports.create = async (req, res, next) => {
  try {
    const student = await service.createStudent(req.body);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE ─────────────────────────────────────────────────
exports.update = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    const student = await service.updateStudent(req.params.id, req.body);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

// ─── DELETE ─────────────────────────────────────────────────
exports.delete = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    const student = await service.deleteStudent(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};