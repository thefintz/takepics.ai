import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

if (!process.env.POSTGRES_URL) {
	throw new Error("POSTGRES_URL environment variable is not set");
}

export default defineConfig({
	schema: "./server/utils/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.POSTGRES_URL,
	},
});
