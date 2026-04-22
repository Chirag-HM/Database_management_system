// ─────────────────────────────────────────────────────────
// Auth Service — Client API Layer
// ─────────────────────────────────────────────────────────
// Handles all API calls related to authentication and
// manages the JWT token in localStorage.
// ─────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// ─── Token Management ─────────────────────────────────────
export const saveToken = (token) => {
  localStorage.setItem("jwt_token", token);
};

export const getToken = () => {
  return localStorage.getItem("jwt_token");
};

export const removeToken = () => {
  localStorage.removeItem("jwt_token");
};

// Check if token is expired by decoding the payload
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // payload.exp is in seconds, Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true; // If parsing fails, consider it expired
  }
};

// ─── API Fetch Wrapper ────────────────────────────────────
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers, // Merge custom headers
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
};

// ─── Auth API Calls ───────────────────────────────────────

export const loginUser = async (email, password) => {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  saveToken(data.token);
  return data.user;
};

export const signupUser = async (name, email, password) => {
  const data = await apiFetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  saveToken(data.token);
  return data.user;
};

export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const data = await apiFetch("/api/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.user;
};
