/**
 * SearchBar Component
 * ───────────────────
 * A controlled input for filtering the student list.
 *
 * Props:
 *   value    — the current search string (controlled by parent)
 *   onChange — callback when the user types
 *
 * REACT CONCEPTS:
 *   Props     — value and onChange are passed down from Dashboard.
 *               The Dashboard "owns" the search state; this component
 *               just renders it (a pattern called "lifting state up").
 *   Closures  — onChange is a closure that captures Dashboard's setState.
 */
const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative w-full max-w-md">
      {/* Search Icon */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <input
        type="text"
        placeholder="Search students by name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-light border border-border text-text placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        aria-label="Search students"
      />
    </div>
  );
};

export default SearchBar;
