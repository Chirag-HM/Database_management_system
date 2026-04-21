let students = [];

const getAllStudents = (page = 1, limit = 5, search = "") => {
  let filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return {
    total: filtered.length,
    page,
    data: paginated,
  };
};

const getStudentById = (id) => {
  return students.find(s => s.id === id);
};

const createStudent = (data) => {
  const newStudent = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date(),
  };

  students.push(newStudent);
  return newStudent;
};

const updateStudent = (id, data) => {
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return null;

  students[index] = { ...students[index], ...data };
  return students[index];
};

const deleteStudent = (id) => {
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return null;

  return students.splice(index, 1);
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};