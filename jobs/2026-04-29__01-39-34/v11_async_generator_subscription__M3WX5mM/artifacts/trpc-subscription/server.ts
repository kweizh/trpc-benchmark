import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';

const t = initTRPC.create();

const appRouter = t.router({
  countdown: t.procedure.subscription(async function* () {
    for (let value = 3; value >= 1; value -= 1) {
      yield value;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }),
});

const server = createHTTPServer({
  router: appRouter,
  createContext: () => ({}),
  basePath: '/trpc/',
});

const port = 4000;
server.listen(port);

console.log(`tRPC server listening on http://localhost:${port}/trpc`);

export type AppRouter = typeof appRouter;
