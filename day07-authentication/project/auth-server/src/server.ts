import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { authService } from "./services/auth.service";

const PORT = process.env.PORT || 4000;

async function start() {
  await authService.seedAdmin();

  app.listen(PORT, () => {
    console.log(`Auth server running on http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
  });
}

start();
