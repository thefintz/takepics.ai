import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { Images, Users, Models } from "./schema";

dotenv.config();

// @ts-ignore
const client = postgres(process.env.POSTGRES_URL);

export const db = drizzle(client, {
	// logger: true,
	schema: { Users, Images, Models },
});

// Typescript-foo to get the transaction type
type TxCallable = Parameters<typeof db.transaction>[0];
export type DB = Parameters<TxCallable>[0] | typeof db;
