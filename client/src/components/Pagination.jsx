/**
 * Pagination Component
 * ────────────────────
 * Renders page numbers and prev/next buttons.
 *
 * Props:
 *   page       — current page number
 *   totalPages — total number of pages
 *   onPageChange — callback(newPage)
 */
import Button from "./Button";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Build an array of page numbers to display
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        ← Prev
      </Button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            p === page
              ? "bg-primary text-white shadow-lg shadow-primary/30"
              : "bg-surface-hover text-text-muted hover:text-text hover:bg-border"
          }`}
        >
          {p}
        </button>
      ))}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next →
      </Button>
    </div>
  );
};

export default Pagination;
