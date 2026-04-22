/**
 * Format an ISO date string into a readable format.
 * Example: "20 Apr 2026, 4:00 PM"
 */
export const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Validate student form data.
 * Returns an object with field-level error messages, or null if valid.
 */
export const validateStudentForm = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!data.age || isNaN(data.age) || data.age < 1 || data.age > 150) {
    errors.age = "Age must be a number between 1 and 150";
  }

  if (!data.course || data.course.trim().length < 2) {
    errors.course = "Course must be at least 2 characters";
  }

  return Object.keys(errors).length > 0 ? errors : null;
};
