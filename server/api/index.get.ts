import type { Index } from "~/types";

export default eventHandler(async (): Promise<Index> => {
  return { time: new Date() };
});
