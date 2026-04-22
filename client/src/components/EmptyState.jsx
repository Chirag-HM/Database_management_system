/**
 * EmptyState Component
 * ────────────────────
 * Displayed when a list has zero items. Provides a friendly
 * message and an optional CTA so the user isn't staring at
 * a blank screen.
 */
import { Link } from "react-router-dom";
import Button from "./Button";

const EmptyState = ({ message = "No students found", showAction = true }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-surface-hover flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.471.886 6 2.34M12 6.042a8.967 8.967 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.34M12 6.042V20.34"
          />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-text mb-2">{message}</h3>
      <p className="text-text-muted text-sm mb-6 text-center max-w-xs">
        {showAction
          ? "Get started by adding your first student to the system."
          : "Try adjusting your search query."}
      </p>

      {showAction && (
        <Link to="/students/new">
          <Button variant="primary" size="lg">
            + Add First Student
          </Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
