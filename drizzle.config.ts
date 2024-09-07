import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./server/utils/db.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: "file:./.data/db.sqlite3",
	},
});
