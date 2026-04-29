import { z } from 'zod';
import { router, publicProcedure } from './init';

async function* streamGenerator() {
  const words = ['Hello', 'streaming', 'world'];
  for (const word of words) {
    yield word;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

export const appRouter = router({
  streamWords: publicProcedure
    .output(z.array(z.string()))
    .query(async function* () {
      yield* streamGenerator();
    }),
});

export type AppRouter = typeof appRouter;