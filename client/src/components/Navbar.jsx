import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Navbar Component
 * ────────────────
 * Sticky top navigation bar with glassmorphism effect.
 * - Shows brand name on the left
 * - Navigation links on the right (desktop) / hamburger menu (mobile)
 *
 * REACT CONCEPTS USED:
 *   useState  → controls whether the mobile menu is open/closed
 *   Closures  → the toggleMenu handler is a closure that captures
 *               the setIsOpen setter from the component scope.
 */
const Navbar = () => {
  // useState: a React hook that creates a piece of state (isOpen)
  // and a setter function (setIsOpen). When setIsOpen is called,
  // React re-renders ONLY this component — thanks to the Virtual DOM
  // diffing algorithm.
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Closure: this function "closes over" setIsOpen from the outer scope.
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { to: "/", label: "Home" },
    ...(user ? [{ to: "/dashboard", label: "Dashboard" }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ─── Brand ─── */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={closeMenu}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/25 group-hover:shadow-primary/50 transition-shadow">
              SM
            </div>
            <span className="text-lg font-bold text-text hidden sm:block">
              Student<span className="gradient-text">Manager</span>
            </span>
          </Link>

          {/* ─── Desktop Links ─── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? "bg-primary/20 text-primary-light"
                    : "text-text-muted hover:text-text hover:bg-surface-hover"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <>
                <Link
                  to="/students/new"
                  className="ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary-dark text-white transition-colors shadow-lg shadow-primary/25"
                >
                  + Add Student
                </Link>
                <div className="ml-4 flex items-center gap-3 border-l border-border pl-4">
                  <span className="text-sm font-medium text-text-muted">
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="ml-2 flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary-dark text-white transition-colors shadow-lg shadow-primary/25"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* ─── Mobile Hamburger ─── */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* ─── Mobile Menu ─── */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? "bg-primary/20 text-primary-light"
                      : "text-text-muted hover:text-text hover:bg-surface-hover"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link
                    to="/students/new"
                    onClick={closeMenu}
                    className="mt-2 px-4 py-3 rounded-lg text-sm font-medium bg-primary hover:bg-primary-dark text-white text-center transition-colors"
                  >
                    + Add Student
                  </Link>
                  <div className="mt-2 pt-2 border-t border-border px-4 py-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-text-muted">
                      {user.name}
                    </span>
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="text-sm font-medium text-danger"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-surface-hover transition-colors text-center"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="px-4 py-3 rounded-lg text-sm font-medium bg-primary hover:bg-primary-dark text-white text-center transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
