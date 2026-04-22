// ─────────────────────────────────────────────────────────────
// Entry Point — server.js
// ─────────────────────────────────────────────────────────────
// 1. Load environment variables FIRST (before anything else
//    tries to read process.env).
// 2. Connect to MongoDB.
// 3. Only THEN start the Express server.
//
// This order guarantees that when the first HTTP request
// arrives, the database connection is already alive.
// ─────────────────────────────────────────────────────────────

require("dotenv").config(); // Load .env into process.env

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});