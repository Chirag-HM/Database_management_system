/**
 * FormPage — Add / Edit Student (API Connected)
 * ──────────────────────────────────────────────
 * Now fetches/saves data via the real backend API.
 *
 * WHAT CHANGED:
 *   1. Added toast notifications for save success/error
 *   2. Error messages now show the backend's validation message
 *      (e.g. "Name must be at least 2 characters") instead of
 *      a generic "Failed to save student".
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getStudentById,
  createStudent,
  updateStudent,
} from "../services/studentService";
import StudentForm from "../components/StudentForm";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";

const FormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // ─── Fetch existing student for edit mode ──────────────
  useEffect(() => {
    if (!isEditMode) return;

    let cancelled = false;

    const fetchStudent = async () => {
      try {
        const data = await getStudentById(id);
        if (!cancelled) {
          if (data) {
            setStudent(data);
          } else {
            setError("Student not found");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load student data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStudent();
    return () => {
      cancelled = true;
    };
  }, [id, isEditMode]);

  // ─── Submit handler ────────────────────────────────────
  const handleSubmit = async (formData) => {
    setSaving(true);
    setToast(null);
    try {
      if (isEditMode) {
        await updateStudent(id, formData);
      } else {
        await createStudent(formData);
      }
      // Navigate to dashboard on success
      navigate("/dashboard");
    } catch (err) {
      // Show the backend's validation error (e.g. "Age must be at
      // least 1") instead of a generic message
      setToast({
        message: err.message || "Failed to save student",
        type: "error",
      });
      setSaving(false);
    }
  };

  // ─── Render ────────────────────────────────────────────
  if (loading) return <Spinner message="Loading student data..." />;

  if (error) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-text mb-2">{error}</h2>
        <p className="text-text-muted mb-6">
          The student you&apos;re looking for might have been deleted.
        </p>
        <Link
          to="/dashboard"
          className="text-primary-light hover:text-primary transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1 text-text-muted hover:text-text text-sm mb-6 transition-colors"
      >
        ← Back to Dashboard
      </Link>

      {/* Page header */}
      <section className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {isEditMode ? (
            <>
              Edit <span className="gradient-text">Student</span>
            </>
          ) : (
            <>
              Add New <span className="gradient-text">Student</span>
            </>
          )}
        </h1>
        <p className="text-text-muted text-sm mt-1">
          {isEditMode
            ? "Update the student's information below."
            : "Fill in the details to register a new student."}
        </p>
      </section>

      {/* Form Card */}
      <section className="p-6 sm:p-8 rounded-2xl bg-surface-card border border-border animate-slide-up">
        <StudentForm
          initialData={student}
          onSubmit={handleSubmit}
          isLoading={saving}
        />
      </section>

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

export default FormPage;
