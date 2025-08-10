import { defineConfig } from "drizzle-kit";


// Enterprise-grade environment validation
if (!process.env.DATABASE_URL) {
  // eslint-disable-next-line no-console
  console.error("[ERROR] DATABASE_URL is not set. Please provision your database and set the DATABASE_URL environment variable.");
  process.exit(1);
}

export default defineConfig({
  out: "../migrations",
  schema: "../shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
