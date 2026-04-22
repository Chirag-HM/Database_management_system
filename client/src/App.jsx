/**
 * App.jsx — Root Component
 * ────────────────────────
 * Sets up client-side routing using react-router-dom.
 *
 * ROUTING EXPLAINED:
 *   React Router intercepts link clicks and renders the matching
 *   page component WITHOUT a full page reload. The browser URL
 *   changes, but everything stays as a Single Page App (SPA).
 *
 *   Routes defined:
 *     /                    → Landing page
 *     /dashboard           → Student dashboard
 *     /students/new        → Add new student form
 *     /students/edit/:id   → Edit existing student form
 */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import FormPage from "./pages/FormPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/students/new" 
                element={
                  <ProtectedRoute>
                    <FormPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/students/edit/:id" 
                element={
                  <ProtectedRoute>
                    <FormPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
