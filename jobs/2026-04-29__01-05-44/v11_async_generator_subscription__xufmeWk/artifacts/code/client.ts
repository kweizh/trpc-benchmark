import { createTRPCClient, httpSubscriptionLink, httpBatchLink, splitLink } from '@trpc/client';
import type { AppRouter } from './server.js';
import { EventSource } from 'eventsource';

// @ts-ignore
global.EventSource = EventSource;

const client = createTRPCClient<AppRouter>({
  links: [
    httpSubscriptionLink({
      url: 'http://localhost:3002',
    }),
  ],
});

async function main() {
  console.log('Starting countdown subscription...');
  client.countdown.subscribe(undefined, {
    onData(value) {
      console.log('Received:', value);
    },
    onError(err) {
      console.error('Error:', err);
      process.exit(1);
    },
    onComplete() {
      console.log('Subscription completed');
      process.exit(0);
    },
  });
}

main().catch(console.error);
