// ─────────────────────────────────────────────────────────
// Dummy / Mock Data
// ─────────────────────────────────────────────────────────
// This file acts as a stand-in for the real MongoDB data.
// When the backend is connected later, this file becomes
// irrelevant — the service layer will fetch from the API.
// ─────────────────────────────────────────────────────────

const students = [
  {
    _id: "665f1a2b3c4d5e6f7a8b9c01",
    name: "Chirag HM",
    age: 21,
    course: "Database Management Systems",
    createdAt: "2026-04-20T10:30:00.000Z",
  },
  {
    _id: "665f1a2b3c4d5e6f7a8b9c02",
    name: "Ananya Sharma",
    age: 22,
    course: "Data Structures & Algorithms",
    createdAt: "2026-04-19T14:15:00.000Z",
  },
  {
    _id: "665f1a2b3c4d5e6f7a8b9c03",
    name: "Rahul Patel",
    age: 20,
    course: "Operating Systems",
    createdAt: "2026-04-18T09:45:00.000Z",
  },
  {
    _id: "665f1a2b3c4d5e6f7a8b9c04",
    name: "Priya Nair",
    age: 23,
    course: "Computer Networks",
    createdAt: "2026-04-17T16:00:00.000Z",
  },
  {
    _id: "665f1a2b3c4d5e6f7a8b9c05",
    name: "Karthik Reddy",
    age: 21,
    course: "Software Engineering",
    createdAt: "2026-04-16T11:20:00.000Z",
  },
  {
    _id: "665f1a2b3c4d5e6f7a8b9c06",
    name: "Sneha Kulkarni",
    age: 22,
    course: "Artificial Intelligence",
    createdAt: "2026-04-15T08:50:00.000Z",
  },
  {
    _id: "665f1a2b3c4d5e6f7a8b9c07",
    name: "Arjun Mehta",
    age: 20,
    course: "Web Development",
    createdAt: "2026-04-14T13:30:00.000Z",
  },
  {
    _id: "665f1a2b3c4d5e6f7a8b9c08",
    name: "Divya Iyer",
    age: 24,
    course: "Cloud Computing",
    createdAt: "2026-04-13T07:10:00.000Z",
  },
];

export default students;
