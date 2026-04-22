const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// ─────────────────────────────────────────────────────────────
// User Schema
// ─────────────────────────────────────────────────────────────
// This schema stores authenticated users who can access the
// student management system. Passwords are NEVER stored as
// plain text — they are hashed using bcrypt before saving.
//
// WHAT IS HASHING?
//   Hashing is a ONE-WAY mathematical function that converts
//   your password into a fixed-length string of characters.
//   Unlike encryption (which is reversible), hashing CANNOT
//   be reversed.
//
//   Example:
//     "MyPassword123" → "$2b$10$N9qo8uLOickgx2ZMRZoMye..."
//
// WHY WE NEVER STORE PLAIN PASSWORDS:
//   If a database is breached:
//     • Plain text → attacker has everyone's passwords instantly
//     • Hashed → attacker gets useless hash strings
//
//   bcrypt adds a random "salt" to each hash, meaning two users
//   with the SAME password get DIFFERENT hashes. This defeats
//   rainbow table attacks (precomputed hash lookups).
// ─────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,               // Creates a MongoDB unique index
      trim: true,
      lowercase: true,            // Normalize: "John@Email.COM" → "john@email.com"
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
      // ↑ SECURITY: `select: false` means the password field is
      //   EXCLUDED from query results by default. You must
      //   explicitly use .select("+password") to include it.
      //   This prevents accidental password hash leaks in APIs.
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

// ─────────────────────────────────────────────────────────────
// Pre-save Hook — Hash Password Before Saving
// ─────────────────────────────────────────────────────────────
// This runs AUTOMATICALLY every time a user document is saved.
//
// HOW IT WORKS:
//   1. Check if the password field was modified (avoids
//      re-hashing on name/email updates)
//   2. Generate a "salt" — random data mixed into the hash
//      (salt rounds = 10 → good balance of security vs speed)
//   3. Hash the password with the salt
//   4. Replace the plain password with the hash
//   5. Call next() to proceed with saving
//
// WHY 10 SALT ROUNDS?
//   Each round doubles the computation time. 10 rounds takes
//   ~100ms — fast enough for login, but slow enough to make
//   brute-force attacks impractical (~10 guesses/second vs
//   billions with MD5).
// ─────────────────────────────────────────────────────────────
userSchema.pre("save", async function () {
  // Only hash if password was modified (or is new)
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─────────────────────────────────────────────────────────────
// Instance Method — Compare Password
// ─────────────────────────────────────────────────────────────
// Used during login to verify the user's password.
//
// HOW bcrypt.compare() WORKS:
//   1. Extracts the salt from the stored hash
//   2. Hashes the candidate password with the SAME salt
//   3. Compares the two hashes
//   4. Returns true if they match, false otherwise
//
// This is why we don't need to store the salt separately —
// bcrypt embeds it in the hash string itself.
// ─────────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
