import { router, publicProcedure } from '../trpc';

export const appRouter = router({
  chatStream: publicProcedure.query(async function* () {
    const messages = ["Starting...", "Processing...", "Done!"];
    for (const msg of messages) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      yield msg;
    }
  }),
});

export type AppRouter = typeof appRouter;
