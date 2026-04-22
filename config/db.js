const mongoose = require("mongoose");

/**
 * connectDB - Establishes connection to MongoDB Atlas.
 *
 * WHY async/await?
 *   mongoose.connect() returns a promise. Using async/await lets us
 *   wait for the connection to succeed (or fail) BEFORE the Express
 *   server starts accepting requests. This guarantees every incoming
 *   request already has a live database connection.
 *
 * WHY process.exit(1)?
 *   If the database is unreachable the server cannot serve any useful
 *   purpose. Exiting with code 1 signals a failure to the OS / process
 *   manager (like PM2 or Docker) so it can attempt a restart.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};

module.exports = connectDB;
