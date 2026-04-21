const { validateStudent } = require("../models/student.model");

module.exports = (req, res, next) => {
  const error = validateStudent(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  next();
};