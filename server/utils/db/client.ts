import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { Checkouts, Creations, Images, Users } from "./schema";

const config = useRuntimeConfig();
if (!config.public.POSTGRES_URL) {
	throw new Error("POSTGRES_URL is not set");
}

const client = postgres(config.public.POSTGRES_URL);
export const db = drizzle(client, {
	// logger: true,
	schema: { Users, Images, Creations, Checkouts },
});

// Typescript-foo to get the transaction type
type TxCallable = Parameters<typeof db.transaction>[0];
export type DB = Parameters<TxCallable>[0] | typeof db;
