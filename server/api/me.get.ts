import { getServerSession } from "#auth";
import type { User } from "~/types";

export default eventHandler(async (event): Promise<User> => {
  const session = await getServerSession(event);

  if (!session?.user) {
    throw createError({ status: 401, message: "unauthenticated" });
  }

  // Shitty stuff to make TypeScript happy
  const user: User = {};
  if (session.user.name) user.name = session.user.name;
  if (session.user.email) user.email = session.user.email;
  if (session.user.image) user.image = session.user.image;

  return user;
});
