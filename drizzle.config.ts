import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

export default defineConfig({
	schema: "./server/utils/db.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.POSTGRES_URL || "",
	},
});
