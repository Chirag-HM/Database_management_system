const service = require("../services/student.service");

exports.getAll = (req, res) => {
  const { page, limit, search } = req.query;

  const result = service.getAllStudents(
    Number(page),
    Number(limit),
    search || ""
  );

  res.status(200).json(result);
};

exports.getById = (req, res, next) => {
  const student = service.getStudentById(req.params.id);

  if (!student) return next({ status: 404, message: "Student not found" });

  res.status(200).json(student);
};

exports.create = (req, res) => {
  const student = service.createStudent(req.body);
  res.status(201).json(student);
};

exports.update = (req, res, next) => {
  const student = service.updateStudent(req.params.id, req.body);

  if (!student) return next({ status: 404, message: "Student not found" });

  res.status(200).json(student);
};

exports.delete = (req, res, next) => {
  const student = service.deleteStudent(req.params.id);

  if (!student) return next({ status: 404, message: "Student not found" });

  res.status(200).json({ message: "Deleted successfully" });
};