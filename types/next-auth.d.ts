import type { DefaultSession } from "next-auth";
import type { User } from "@/server/utils/db";

// This file is needed for us extend the types of the next-auth module.
//
// For example, the commented out `user` property is an example of how we can
// extend the type of the session. This is good as we get the type safety of
// typescript and IDE support for free!!
//
// Adapted from:
// https://auth.sidebase.io/guide/authjs/session-data#typescript

declare module "next-auth" {
	interface Session extends DefaultSession {
		user?: User;
	}
}
