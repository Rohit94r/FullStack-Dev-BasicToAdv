import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import { AppError } from "./utils/errors";

const app = express();

// TODO: Use helmet(), cors(), morgan("dev"), express.json(), cookieParser()
// app.use(______)
// app.use(cors({ origin: true, credentials: true }))  // credentials for cookies
// app.use(______)
// app.use(express.json())
// app.use(cookieParser())

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// TODO: Mount routes
// app.use("/auth", authRoutes)
// app.use("/users", usersRoutes)

// Admin alias route
// app.use("/admin/users", requireAuth, requireRole("admin"), ...) OR mount a sub-router

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.message);

  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message, code: err.code });
  }

  if (err.name === "ZodError") {
    return res.status(422).json({ error: "Validation failed" });
  }

  const isDev = process.env.NODE_ENV !== "production";
  res.status(500).json({
    error: isDev ? err.message : "Internal Server Error",
    ...(isDev && { stack: err.stack }),
  });
});

export default app;
