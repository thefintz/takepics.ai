import { eq } from "drizzle-orm";
import { type User, type UserUpsert, Users, db } from "./db";

export const upsertUser = async (u: UserUpsert): Promise<User> => {
	console.info("Upserting user", u.id);

	// Should always return a single user
	const [user] = await db
		.insert(Users)
		.values(u)
		.onConflictDoUpdate({ target: Users.id, set: u })
		.returning();

	console.info("Upserted user", user.id);
	return user;
};

export const fetchUser = async (id: string): Promise<User> => {
	console.info("Fetching user", id);

	const user = await db.query.Users.findFirst({ where: eq(Users.id, id) });

	if (!user) {
		throw new Error(`User ${id} not found`);
	}

	console.info("Fetched user", user.id);
	return user;
};
