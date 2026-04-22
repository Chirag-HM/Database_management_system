/**
 * Toast Component
 * ───────────────
 * A floating notification that appears at the bottom-right
 * and auto-dismisses after a few seconds.
 *
 * Props:
 *   message — text to display
 *   type    — "success" | "error" | "info"
 *   onClose — callback to remove the toast
 *
 * This component uses useEffect to set a timer that calls
 * onClose after 4 seconds, creating the auto-dismiss behavior.
 */
import { useEffect } from "react";

const typeStyles = {
  success: "bg-green-600/90 border-green-500/50 text-white",
  error: "bg-red-600/90 border-red-500/50 text-white",
  info: "bg-blue-600/90 border-blue-500/50 text-white",
};

const typeIcons = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
};

const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-2xl backdrop-blur-md animate-slide-up ${typeStyles[type]}`}
      role="alert"
    >
      <span className="text-lg">{typeIcons[type]}</span>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-white/70 hover:text-white transition-colors cursor-pointer"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
