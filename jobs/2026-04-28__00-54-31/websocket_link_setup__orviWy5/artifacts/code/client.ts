import { createTRPCClient, httpBatchLink, splitLink, wsLink, createWSClient } from '@trpc/client';
import type { AppRouter } from './server';

const wsClient = createWSClient({
  url: 'ws://localhost:3001',
});

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition(op) {
        return op.path === 'notifications.onNewMessage';
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: 'http://localhost:3000/trpc',
      }),
    }),
  ],
});
