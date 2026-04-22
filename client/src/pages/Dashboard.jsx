/**
 * Dashboard Page — Connected to Real API
 * ───────────────────────────────────────
 * Fetches students from the Express backend via the service
 * layer. Shows toast notifications for success/error feedback.
 *
 * WHAT CHANGED from the mock version:
 *   1. Added `error` state to display API failures
 *   2. Added `toast` state for delete success/error feedback
 *   3. Optimistic UI on delete — removes the row immediately,
 *      then rolls back if the API call fails
 *   4. Import Toast component
 *
 * Everything else (useEffect, pagination, search) is identical
 * because the service function signatures didn't change.
 */
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getStudents, deleteStudent } from "../services/studentService";
import { getSocket, disconnectSocket } from "../services/socketService";
import StudentTable from "../components/StudentTable";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import Toast from "../components/Toast";

const ITEMS_PER_PAGE = 5;

const Dashboard = () => {
  // ─── State ─────────────────────────────────────────────
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  // ─── Fetch function (memoized with useCallback) ────────
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getStudents(search, page, ITEMS_PER_PAGE);
      setStudents(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  // ─── useEffect: fetch data ─────────────────────────────
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ─── useEffect: Socket.IO Real-time updates ────────────
  useEffect(() => {
    const socket = getSocket();

    socket.on("studentCreated", (student) => {
      setToast({ message: `New student added: ${student.name}`, type: "success" });
      fetchStudents();
    });

    socket.on("studentUpdated", (student) => {
      setToast({ message: `Student updated: ${student.name}`, type: "success" });
      fetchStudents();
    });

    socket.on("studentDeleted", (id) => {
      setToast({ message: "A student was deleted", type: "success" });
      fetchStudents();
    });

    return () => {
      socket.off("studentCreated");
      socket.off("studentUpdated");
      socket.off("studentDeleted");
      // Optionally disconnect if dashboard is the only place it's used
      // disconnectSocket(); 
    };
  }, [fetchStudents]);

  // ─── Handlers ──────────────────────────────────────────
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleEdit = (id) => {
    navigate(`/students/edit/${id}`);
  };

  /**
   * handleDelete — Optimistic UI pattern
   * ─────────────────────────────────────
   * 1. Immediately remove the student from the UI (feels instant)
   * 2. Send the DELETE request to the backend
   * 3. If the request fails, ROLL BACK the UI and show an error toast
   * 4. If it succeeds, re-fetch to get accurate pagination numbers
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    // Save the current state for rollback
    const previousStudents = [...students];
    const previousTotal = total;

    // Optimistic: remove from UI immediately
    setStudents((prev) => prev.filter((s) => s._id !== id));
    setTotal((prev) => prev - 1);

    try {
      await deleteStudent(id);
      setToast({ message: "Student deleted successfully!", type: "success" });

      // Re-fetch to get accurate pagination
      const result = await getStudents(search, page, ITEMS_PER_PAGE);
      setStudents(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);

      // If current page is now empty, go to previous page
      if (result.data.length === 0 && page > 1) {
        setPage((p) => p - 1);
      }
    } catch (err) {
      // Rollback optimistic update
      setStudents(previousStudents);
      setTotal(previousTotal);
      setToast({
        message: err.message || "Failed to delete student",
        type: "error",
      });
    }
  };

  // ─── Render ────────────────────────────────────────────
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Student <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {total} student{total !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Link to="/students/new">
          <Button variant="primary" size="md">
            + Add Student
          </Button>
        </Link>
      </section>

      {/* Search */}
      <section className="mb-6">
        <SearchBar value={search} onChange={handleSearch} />
      </section>

      {/* Error State */}
      {error && !loading && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            onClick={fetchStudents}
            className="text-xs font-medium underline hover:no-underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      <section className="rounded-2xl bg-surface-card border border-border overflow-hidden">
        {loading ? (
          <Spinner message="Fetching students..." />
        ) : error ? (
          <EmptyState
            message="Could not load students"
            showAction={false}
          />
        ) : students.length === 0 ? (
          <EmptyState
            message={search ? "No students match your search" : "No students yet"}
            showAction={!search}
          />
        ) : (
          <StudentTable
            students={students}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </section>

      {/* Pagination */}
      {!loading && !error && students.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
};

export default Dashboard;
