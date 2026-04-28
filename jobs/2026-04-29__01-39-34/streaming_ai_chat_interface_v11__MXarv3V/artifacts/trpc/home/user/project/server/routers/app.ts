import { publicProcedure, router } from "../trpc";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const appRouter = router({
  chatStream: publicProcedure.query(async function* () {
    const messages = ["Starting...", "Processing...", "Done!"];

    for (const message of messages) {
      yield message;
      await delay(100);
    }
  }),
});

export type AppRouter = typeof appRouter;
