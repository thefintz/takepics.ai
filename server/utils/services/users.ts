import { count, eq } from "drizzle-orm";
import type { H3Event } from "h3";
import type { DB } from "../db/client";
import { type UserInsert, Users, type UserSelect } from "../db/schema";

export class UsersService {
	private readonly db: DB;

	constructor(db: DB) {
		this.db = db;
	}

	async create(user: UserInsert): Promise<UserSelect> {
		console.info(`Creating user ${user.id}`);
		const [userDb] = await this.db.insert(Users).values(user).returning();
		console.info(`Created user ${userDb.id}`);
		console.debug(userDb);
		return userDb;
	}

	async fetch(id: string): Promise<UserSelect | undefined> {
		console.info(`Fetching user ${id}`);
		const userDb = await this.db.query.Users.findFirst({
			where: eq(Users.id, id),
		});
		console.info(`Fetched user ${userDb?.id}`);
		console.debug(userDb);
		return userDb;
	}

	async exists(id: string): Promise<boolean> {
		console.info(`Checking if user ${id} exists`);
		const [totalDb] = await this.db
			.select({ count: count() })
			.from(Users)
			.where(eq(Users.id, id));
		const result = totalDb.count > 0;
		console.info(`User ${id} exists: ${result}`);
		return result;
	}

	async update(user: UserInsert): Promise<UserSelect> {
		console.info(`Updating user ${user.id}`);
		const [userDb] = await this.db
			.update(Users)
			.set(user)
			.where(eq(Users.id, user.id))
			.returning();
		console.info(`Updated user ${userDb.id}`);
		console.debug(userDb);
		return userDb;
	}
}

export const createUsersService = (tx: DB, event?: H3Event): UsersService => {
	return new UsersService(tx);
};
