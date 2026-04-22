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

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const socketConfig = require("./config/socket");

const PORT = process.env.PORT || 5000;

// Create HTTP server instead of listening on Express directly
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
socketConfig.init(server);

// Connect to MongoDB, then start listening
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});