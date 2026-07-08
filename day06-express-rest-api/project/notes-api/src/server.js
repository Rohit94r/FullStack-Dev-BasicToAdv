// =============================================================================
// NOTES API — server.js (Entry Point)
// This file's ONLY job: load environment variables, then start the server.
// =============================================================================

// TODO: Load environment variables with dotenv
// require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3000;

// TODO: Start the server by calling app.listen(PORT, callback)
// In the callback: console.log server URL + environment
// ________________________

// TODO: Handle SIGTERM for graceful shutdown
// process.on("SIGTERM", () => {
//   console.log("SIGTERM received. Closing server...");
//   server.close(() => process.exit(0));
// });
