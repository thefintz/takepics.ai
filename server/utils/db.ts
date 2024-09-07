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
	id: integer("id").primaryKey({ autoIncrement: true }),
	imageId: integer("image_id")
		.notNull()
		.references(() => Images.id, { onDelete: "cascade", onUpdate: "cascade" }),
	data: text("data", { mode: "json" }).$type<Prediction>().notNull(),
});

export const ImageCreation = relations(Images, ({ one }) => ({
	creation: one(Creations, {
		fields: [Images.id],
		references: [Creations.imageId],
	}),
}));

export type User = typeof Users.$inferSelect;
export type UserInsert = typeof Users.$inferInsert;
export type Image = typeof Images.$inferSelect;
export type ImageInsert = typeof Images.$inferInsert;
export type Creation = typeof Creations.$inferSelect;
export type CreationInsert = typeof Creations.$inferInsert;

const schema = { Users, Images, Creations, ImageCreation };

const sqlite = new Database("./.data/db.sqlite3");
export const db = drizzle(sqlite, { logger: true, schema });
