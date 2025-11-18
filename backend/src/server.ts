import dotenv from "dotenv";
dotenv.config();

import errorHandler from "errorhandler";
import app from "./app";
import type { ErrorRequestHandler } from "express";

/**
 * Error Handler. Provides full stack
 */
if (process.env.NODE_ENV === "development") {
  app.use(errorHandler() as unknown as ErrorRequestHandler);
}

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"),"0.0.0.0",() => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});

// Handle listen errors (useful for EADDRINUSE) and log helpful message
server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${app.get("port")} is already in use. Stop the conflicting process or change PORT.`);
    process.exit(1);
  }
  console.error("Server error:", err);
});

export default server;
