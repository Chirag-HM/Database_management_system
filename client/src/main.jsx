/**
 * main.jsx — Application Entry Point
 * ───────────────────────────────────
 * React.createRoot mounts the App component into the #root
 * div defined in index.html. StrictMode enables extra
 * development warnings (double-invokes effects to find bugs).
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
