import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma CLI does not automatically read Next's .env.local in this setup,
// so load local env files before resolving the datasource URL.
for (const envFile of [".env", ".env.local", path.join("prisma", ".env"), path.join("prisma", ".env.local")]) {
  try {
    process.loadEnvFile(envFile);
  } catch {
    // Ignore missing env files and continue with the next candidate.
  }
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
