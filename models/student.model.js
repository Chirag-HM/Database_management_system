function validateStudent(data) {
  // 🛑 Handle undefined first
  if (!data) {
    return "Request body is missing or invalid JSON";
  }

  const { name, age, course } = data;

  if (!name || typeof name !== "string") {
    return "Name is required and must be a string";
  }

  if (!age || typeof age !== "number") {
    return "Age must be a number";
  }

  if (!course || typeof course !== "string") {
    return "Course is required";
  }

  return null;
}

module.exports = { validateStudent };