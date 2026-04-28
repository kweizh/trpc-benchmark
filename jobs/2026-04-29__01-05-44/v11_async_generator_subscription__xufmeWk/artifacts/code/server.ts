import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';

const t = initTRPC.create();

const router = t.router({
  countdown: t.procedure.subscription(async function* () {
    for (let i = 3; i >= 1; i--) {
      yield i;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }),
});

export type AppRouter = typeof router;

const server = createHTTPServer({
  router,
});

server.listen(3002);
console.log('Server listening on http://localhost:3002');
