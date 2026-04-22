/**
 * Spinner Component
 * ─────────────────
 * Shows a CSS-only loading spinner with an optional message.
 * Used whenever async data is being fetched to give users
 * visual feedback that something is happening.
 */
const Spinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-12 h-12 rounded-full border-4 border-surface-hover border-t-primary animate-spin mb-4" />
      <p className="text-text-muted text-sm">{message}</p>
    </div>
  );
};

export default Spinner;
