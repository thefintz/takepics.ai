import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { Prediction } from "replicate";
import type { Stripe } from "stripe";

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

export const Checkouts = sqliteTable("checkouts", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => Users.id, { onDelete: "cascade", onUpdate: "cascade" }),
	// The webhook event, if it has been processed
	event: text("event", {
		mode: "json",
	}).$type<Stripe.CheckoutSessionCompletedEvent>(),
	// The Stripe checkout session object
	session: text("session", { mode: "json" })
		.$type<Stripe.Checkout.Session>()
		.notNull(),
	price: text("price", { mode: "json" }).$type<Stripe.Price>().notNull(),
});

export type User = typeof Users.$inferSelect;
export type Image = typeof Images.$inferSelect;
export type Creation = typeof Creations.$inferSelect;
export type Checkout = typeof Checkouts.$inferSelect;

export type UserInsert = typeof Users.$inferInsert;
export type ImageInsert = typeof Images.$inferInsert;
export type CreationInsert = typeof Creations.$inferInsert;
export type CheckoutInsert = typeof Checkouts.$inferInsert;

export type ImageWithCreation = Image & { creation: Creation };

const schema = { Users, Images, Creations, Checkouts };

const sqlite = new Database("./.data/db.sqlite3");
export const db = drizzle(sqlite, { logger: true, schema });
