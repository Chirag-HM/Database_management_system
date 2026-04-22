// ─────────────────────────────────────────────────────────
// Student Service — Real API Integration
// ─────────────────────────────────────────────────────────
//
// This is the ONLY file that changed to connect frontend
// to the backend. No component or page was modified.
//
// Every function uses the native fetch() API with:
//   • async/await for clean async code
//   • Proper error handling (network + backend errors)
//   • A retry mechanism for transient failures
//
// HOW import.meta.env WORKS:
//   Vite replaces import.meta.env.VITE_* with the actual
//   values from the .env file at BUILD time. This is NOT
//   a runtime lookup — the string is baked into the bundle.
// ─────────────────────────────────────────────────────────

import { getToken, removeToken } from "./authService";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// ─── Helper: make a fetch request with error handling ────
/**
 * apiFetch — wraps fetch() with:
 *   1. Automatic JSON parsing
 *   2. Backend error extraction (reads the { message } body)
 *   3. Simple retry for network failures (max 2 retries)
 *
 * @param {string}  endpoint  — e.g. "/api/students"
 * @param {object}  options   — fetch options (method, body, etc.)
 * @param {number}  retries   — how many times to retry on failure
 * @returns {Promise<any>}    — parsed JSON response
 */
const apiFetch = async (endpoint, options = {}, retries = 2) => {
  const url = `${API_BASE}${endpoint}`;

  // Default headers for JSON requests
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    ...options,
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, config);

      // Parse the response body (even for errors — the backend
      // sends { message: "..." } in the JSON body)
      const data = await response.json();

      // Handle 401 Unauthorized globally (e.g. expired token)
      if (response.status === 401) {
        removeToken();
        window.location.href = "/login"; // Force redirect to login
      }

      // If the HTTP status is not 2xx, throw the backend's message
      if (!response.ok) {
        const error = new Error(data.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      // If it's a known backend error (has status), don't retry
      if (error.status) throw error;

      // Network error — retry if attempts remain
      if (attempt < retries) {
        console.warn(`⚠️ Retry ${attempt + 1}/${retries} for ${endpoint}`);
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        continue;
      }

      // All retries exhausted
      throw new Error("Network error — please check your connection and try again.");
    }
  }
};

// ─────────────────────────────────────────────────────────
// CRUD Functions
// ─────────────────────────────────────────────────────────
// The function signatures are IDENTICAL to the old mock
// service. This is why the Dashboard and FormPage didn't
// need any code changes.
// ─────────────────────────────────────────────────────────

/**
 * Fetch all students with optional search and pagination.
 * Maps to: GET /api/students?search=...&page=...&limit=...
 */
export const getStudents = async (search = "", page = 1, limit = 5) => {
  const params = new URLSearchParams({
    search,
    page: String(page),
    limit: String(limit),
  });

  return await apiFetch(`/api/students?${params}`);
};

/**
 * Fetch a single student by ID.
 * Maps to: GET /api/students/:id
 */
export const getStudentById = async (id) => {
  return await apiFetch(`/api/students/${id}`);
};

/**
 * Create a new student.
 * Maps to: POST /api/students
 */
export const createStudent = async (data) => {
  return await apiFetch("/api/students", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Update an existing student.
 * Maps to: PUT /api/students/:id
 */
export const updateStudent = async (id, data) => {
  return await apiFetch(`/api/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * Delete a student.
 * Maps to: DELETE /api/students/:id
 */
export const deleteStudent = async (id) => {
  return await apiFetch(`/api/students/${id}`, {
    method: "DELETE",
  });
};

/**
 * Upload profile image.
 * Maps to: POST /api/upload
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  // We can't use apiFetch directly because fetch needs to let browser set Content-Type for FormData
  const url = `${API_BASE}/api/upload`;
  const token = getToken();

  // Retry logic built-in
  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();

      if (response.status === 401) {
        removeToken();
        window.location.href = "/login";
      }

      if (!response.ok) {
        throw new Error(data.message || "Image upload failed");
      }

      return data;
    } catch (error) {
      if (attempt < 2) {
        console.warn(`⚠️ Retry upload ${attempt + 1}/2`);
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }
      throw error;
    }
  }
};
