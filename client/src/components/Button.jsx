/**
 * Button Component
 * ────────────────
 * REUSABLE button with multiple variants.
 *
 * Props:
 *   children  — button text / content
 *   variant   — "primary" | "danger" | "secondary" | "ghost"
 *   size      — "sm" | "md" | "lg"
 *   onClick   — click handler
 *   type      — "button" | "submit"
 *   disabled  — disables the button
 *   className — additional classes
 *
 * WHY a separate Button component?
 *   Consistency. Every button in the app looks the same for a
 *   given variant. If we change the primary color tomorrow,
 *   we update ONE component, not fifty <button> tags.
 */
const variants = {
  primary:
    "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25 hover:shadow-primary/40",
  danger:
    "bg-danger hover:bg-danger-dark text-white shadow-lg shadow-danger/25 hover:shadow-danger/40",
  secondary:
    "bg-surface-hover hover:bg-border text-text border border-border",
  ghost:
    "bg-transparent hover:bg-surface-hover text-text-muted hover:text-text",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
