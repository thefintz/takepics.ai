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

	async addModelToUser(userId: string, modelData: typeof Models.$inferInsert): Promise<void> {
		console.info(`Adding model to user ${userId}`);
		await this.db.insert(Models).values({
			...modelData,
			userId: userId,
		});
		console.info(`Added model to user ${userId}`);
	}

	async createUserWithOnboardingModel(user: UserInsert): Promise<UserSelect> {
		console.info(`Creating user ${user.id} with onboarding model`);

		const userDb = await this.db.transaction(async (tx) => {
			const [createdUser] = await tx.insert(Users).values(user).returning();

			await this.addModelToUser(createdUser.id, {
				customName: "example_model_gabriel_novak",
				eyeColor: "green",
				gender: "male",
				trainingType: "person",
				weights_url: "https://replicate.delivery/yhqm/NAf0H2U0kO1PMqyBnrzctA37p40SfEAUD9xBec3DeGLqWopNB/trained_model.tar",
				zipUrl: "www.fintz.com.br",
				modelResponseData: {
					url: "",
					owner: "",
					name: "",
					visibility: "public",
					run_count: 0
				},
				trainingResponseData: {
					id: "onboarding_model_1",
					model: "https://replicate.delivery/yhqm/NAf0H2U0kO1PMqyBnrzctA37p40SfEAUD9xBec3DeGLqWopNB/trained_model.tar",
					created_at: new Date().toISOString(),
					status: "succeeded",
					version: "1.0",
					input: {},
					source: "api",
					urls: {
						get: "www.fintz.com.br",
						cancel: "www.fintz.com.br",
					},
				},
				userId: createdUser.id
			});

			return createdUser;
		});

		console.info(`Created user ${userDb.id} with onboarding model`);
		console.debug(userDb);
		return userDb;
	}
}

export const createUsersService = (tx: DB, event?: H3Event): UsersService => {
	return new UsersService(tx);
};
