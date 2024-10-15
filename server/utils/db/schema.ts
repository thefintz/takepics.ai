import { sql } from "drizzle-orm";
import {
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import type { Model, Prediction, Training } from "replicate";
import type { Stripe } from "stripe";

export const Users = pgTable(
	"users",
	{
		id: text("id").primaryKey(),
		idStripe: text("id_stripe"),
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		image: text("image").notNull(),
		imageCredits: integer("image_credits").notNull().default(100),
		trainingCredits: integer("training_credits").notNull().default(1),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull()
			.$onUpdate(() => sql`now()`),
	},
	(table) => {
		return {
			emailIdx: index("users_email_idx").on(table.email),
			createdAtIdx: index("users_created_at_idx").on(table.createdAt.desc()),
			updatedAtIdx: index("users_updated_at_idx").on(table.updatedAt.desc()),
		};
	},
);

export const Images = pgTable(
	"images",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => Users.id, { onDelete: "cascade", onUpdate: "cascade" }),
		prompt: text("prompt").notNull(),
		url: text("url"),
		data: jsonb("data").$type<Prediction>().notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull()
			.$onUpdate(() => sql`now()`),
	},
	(table) => {
		return {
			userIdIdx: index("images_user_id_idx").on(table.userId),
			createdAtIdx: index("images_created_at_idx").on(
				table.createdAt.desc(),
			),
			updatedAtIdx: index("images_updated_at_idx").on(
				table.updatedAt.desc(),
			),
		};
	},
);

export const Checkouts = pgTable(
	"checkouts",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => Users.id, { onDelete: "cascade", onUpdate: "cascade" }),
		// The webhook event, if it has been processed
		event: jsonb("event").$type<Stripe.CheckoutSessionCompletedEvent>(),
		// The Stripe checkout session object
		session: jsonb("session").$type<Stripe.Checkout.Session>().notNull(),
		// The Stripe price object
		price: jsonb("price").$type<Stripe.Price>().notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull()
			.$onUpdate(() => sql`now()`),
	},
	(table) => {
		return {
			createdAtIdx: index("checkouts_created_at_idx").on(
				table.createdAt.desc(),
			),
			updatedAtIdx: index("checkouts_updated_at_idx").on(
				table.updatedAt.desc(),
			),
		};
	},
);

export const Models = pgTable(
	"models",
	{
		id: text("id").primaryKey().default(sql`gen_random_uuid()`),
		customName: text("custom_name").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => Users.id, { onDelete: "cascade", onUpdate: "cascade" }),
		zipUrl: text("zip_url").notNull(),
		modelResponseData: jsonb("model_response_data").$type<Model>().notNull(),
		trainingResponseData: jsonb("training_response_data").$type<Training>().notNull(),
		weights_url: text("weights_url"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull()
			.$onUpdate(() => sql`now()`),
		gender: text("gender").notNull(),
		eyeColor: text("eye_color").notNull(),
		trainingType: text("training_type").notNull(),
	},
	(table) => {
		return {
			userIdIdx: index("trainings_user_id_idx").on(table.userId),
			createdAtIdx: index("trainings_created_at_idx").on(
				table.createdAt.desc(),
			),
			updatedAtIdx: index("trainings_updated_at_idx").on(
				table.updatedAt.desc(),
			),
		};
	},
);

export type UserSelect = typeof Users.$inferSelect;
export type ImageSelect = typeof Images.$inferSelect;
export type CheckoutSelect = typeof Checkouts.$inferSelect;
export type ModelSelect = typeof Models.$inferSelect;

export type UserInsert = typeof Users.$inferInsert;
export type ImageInsert = typeof Images.$inferInsert;
export type CheckoutInsert = typeof Checkouts.$inferInsert;
export type ModelInsert = typeof Models.$inferInsert;