/**
 * StudentTable Component
 * ──────────────────────
 * Displays all students in a responsive table (desktop) or
 * card layout (mobile).
 *
 * Props:
 *   students  — array of student objects
 *   onEdit    — callback(id) when "Edit" is clicked
 *   onDelete  — callback(id) when "Delete" is clicked
 *
 * REACT CONCEPTS:
 *   Props & Reusability — This component knows nothing about
 *      WHERE the data comes from. It receives students, onEdit,
 *      onDelete as props and renders them. The Dashboard page
 *      handles all the state management and passes data down.
 *
 *   Virtual DOM — When a student is deleted, React doesn't
 *      re-render the entire table from scratch. It diffs the
 *      old virtual DOM tree against the new one and only updates
 *      the specific <tr> that was removed.
 */
import { formatDate } from "../utils/helpers";
import Button from "./Button";

const StudentTable = ({ students, onEdit, onDelete }) => {
  return (
    <>
      {/* ─── Desktop Table ─── */}
      <div className="hidden md:block overflow-x-auto animate-fade-in">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Added On
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((student, index) => (
              <tr
                key={student._id}
                className="hover:bg-surface-hover/50 transition-colors"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
                      {student.imageUrl ? (
                        <img src={student.imageUrl} alt={student.name} className="w-full h-full object-cover" />
                      ) : (
                        student.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="font-medium text-text">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-text-muted">{student.age}</td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary-light text-xs font-medium">
                    {student.course}
                  </span>
                </td>
                <td className="px-6 py-4 text-text-muted text-sm">
                  {formatDate(student.createdAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(student._id)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(student._id)}
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Mobile Cards ─── */}
      <div className="md:hidden flex flex-col gap-3 animate-fade-in">
        {students.map((student) => (
          <div
            key={student._id}
            className="p-4 rounded-xl bg-surface-card border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold overflow-hidden">
                  {student.imageUrl ? (
                    <img src={student.imageUrl} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    student.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-text">{student.name}</h3>
                  <p className="text-text-muted text-xs">Age: {student.age}</p>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary-light text-xs font-medium">
                {student.course}
              </span>
            </div>
            <p className="text-text-muted text-xs mb-3">
              Added: {formatDate(student.createdAt)}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(student._id)}
                className="flex-1"
              >
                ✏️ Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(student._id)}
                className="flex-1"
              >
                🗑️ Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default StudentTable;
