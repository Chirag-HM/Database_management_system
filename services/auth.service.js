const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ─────────────────────────────────────────────────────────────
// Auth Service Layer
// ─────────────────────────────────────────────────────────────
// All authentication business logic lives here. Controllers
// call these functions and never import Mongoose or JWT
// directly. This keeps the architecture consistent with the
// existing student.service.js pattern.
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// Generate JWT Token
// ─────────────────────────────────────────────────────────────
// HOW JWT (JSON Web Token) WORKS:
//   A JWT has three parts separated by dots:
//     header.payload.signature
//
//   1. HEADER  — algorithm (HS256) and token type (JWT)
//   2. PAYLOAD — your data (userId, email, expiry time)
//   3. SIGNATURE — HMAC(header + payload, JWT_SECRET)
//
//   The server creates the token on login. The client stores
//   it and sends it with every request. The server verifies
//   the signature on each request — if it matches, the user
//   is authenticated. If the token was tampered with, the
//   signature won't match and the request is rejected.
//
// WHY NOT STORE SESSIONS?
//   JWTs are "stateless" — the server doesn't need to store
//   anything. The token itself contains all the info needed
//   to authenticate the user. This makes the server simpler
//   and more scalable.
// ─────────────────────────────────────────────────────────────
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },                                // Payload
    process.env.JWT_SECRET,                           // Secret key
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // Expiry
  );
};

// ─────────────────────────────────────────────────────────────
// Register a New User
// ─────────────────────────────────────────────────────────────
// Steps:
//   1. Check if email already exists (avoid duplicate key error)
//   2. Create the user (password is hashed by the pre-save hook)
//   3. Generate a JWT token
//   4. Return token + user info (password is excluded)
// ─────────────────────────────────────────────────────────────
const registerUser = async (name, email, password) => {
  // Check for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("A user with this email already exists");
    error.status = 409; // Conflict
    throw error;
  }

  // Create user — password is auto-hashed by pre-save hook
  const user = await User.create({ name, email, password });

  // Generate JWT
  const token = generateToken(user._id, user.email);

  // Return user data without password
  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

// ─────────────────────────────────────────────────────────────
// Login an Existing User
// ─────────────────────────────────────────────────────────────
// Steps:
//   1. Find user by email (include password with +password)
//   2. If not found → throw error (don't reveal which field
//      is wrong — this prevents email enumeration attacks)
//   3. Compare passwords using bcrypt
//   4. If wrong → throw same generic error
//   5. Generate JWT and return
// ─────────────────────────────────────────────────────────────
const loginUser = async (email, password) => {
  // Find user AND include the password field
  // (which is excluded by default due to `select: false`)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  // Compare the provided password with the stored hash
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  // Generate JWT
  const token = generateToken(user._id, user.email);

  // Return user data without password
  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

// ─────────────────────────────────────────────────────────────
// Get User By ID (for the /me endpoint)
// ─────────────────────────────────────────────────────────────
const getUserById = async (id) => {
  return await User.findById(id);
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  generateToken,
};
