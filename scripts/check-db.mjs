import path from "node:path";
import { Client } from "pg";

for (const envFile of [".env", ".env.local", path.join("prisma", ".env"), path.join("prisma", ".env.local")]) {
  try {
    process.loadEnvFile(envFile);
  } catch {
    // Ignore missing env files and continue.
  }
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const url = new URL(connectionString);
const sslmode = url.searchParams.get("sslmode");
const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);

const client = new Client({
  connectionString,
  connectionTimeoutMillis: 10000,
  ...(sslmode === "disable" || (isLocalhost && !sslmode)
    ? {}
    : { ssl: { rejectUnauthorized: false } }),
});

try {
  await client.connect();
  const result = await client.query("select current_database() as db, current_user as user");
  const row = result.rows[0];
  console.log(`Connected to database "${row.db}" as "${row.user}".`);
} catch (error) {
  console.error("Database connection failed.");
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
