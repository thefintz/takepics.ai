import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { Checkouts, Creations, Images, Users } from "./schema";

const client = postgres("postgresql://postgres@localhost:5432/postgres");
export const db = drizzle(client, {
	// logger: true,
	schema: { Users, Images, Creations, Checkouts },
});

// Typescript-foo to get the transaction type
type TxCallable = Parameters<typeof db.transaction>[0];
export type DB = Parameters<TxCallable>[0] | typeof db;
