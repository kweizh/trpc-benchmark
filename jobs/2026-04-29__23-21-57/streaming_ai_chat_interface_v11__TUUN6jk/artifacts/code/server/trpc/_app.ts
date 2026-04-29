import { router, publicProcedure } from "./init";

export const appRouter = router({
  chatStream: publicProcedure
    .query(async function* () {
      yield "Starting...";
      await new Promise((resolve) => setTimeout(resolve, 100));
      yield "Processing...";
      await new Promise((resolve) => setTimeout(resolve, 100));
      yield "Done!";
    }),
});

export type AppRouter = typeof appRouter;