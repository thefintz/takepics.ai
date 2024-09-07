import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { Prediction } from "replicate";
import { relations } from "drizzle-orm";

export const Users = sqliteTable("users", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	image: text("image").notNull(),
});

export const Images = sqliteTable("images", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: text("user_id")
		.notNull()
		.references(() => Users.id, { onDelete: "cascade", onUpdate: "cascade" }),
	url: text("url").notNull(),
	caption: text("caption").default("").notNull(),
});

export const Creations = sqliteTable("creations", {
	id: text("id").primaryKey(),
	imageId: integer("image_id")
		.notNull()
		.references(() => Images.id, { onDelete: "cascade", onUpdate: "cascade" }),
	data: text("data", { mode: "json" }).$type<Prediction>().notNull(),
});

export type User = typeof Users.$inferSelect;
export type Image = typeof Images.$inferSelect;
export type Creation = typeof Creations.$inferSelect;

export type UserInsert = typeof Users.$inferInsert;
export type ImageInsert = typeof Images.$inferInsert;
export type CreationInsert = typeof Creations.$inferInsert;

export type ImageWithCreation = Image & { creation: Creation };

const schema = { Users, Images, Creations };

const sqlite = new Database("./.data/db.sqlite3");
export const db = drizzle(sqlite, { logger: true, schema });
