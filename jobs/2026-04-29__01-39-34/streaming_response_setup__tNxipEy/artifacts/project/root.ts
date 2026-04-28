import { publicProcedure, router } from "@/server/trpc";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const appRouter = router({
  streamWords: publicProcedure.query(async function* () {
    const words = ["Hello", "streaming", "world"] as const;

    for (const word of words) {
      await delay(100);
      yield word;
    }
  }),
});

export type AppRouter = typeof appRouter;
