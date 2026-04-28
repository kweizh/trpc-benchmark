import { createTRPCClient, httpSubscriptionLink } from '@trpc/client';
import { EventSource } from 'eventsource';
import type { AppRouter } from './server';

const client = createTRPCClient<AppRouter>({
  links: [
    httpSubscriptionLink({
      url: 'http://localhost:4000/trpc',
      EventSource,
    }),
  ],
});

const values: number[] = [];

const run = async () => {
  await new Promise<void>((resolve, reject) => {
    client.countdown.subscribe(undefined, {
      onStarted: () => {
        console.log('subscription started');
      },
      onData: (value) => {
        values.push(value);
        console.log('received', value);
      },
      onError: (error) => {
        reject(error);
      },
      onComplete: () => {
        resolve();
      },
    });
  });

  console.log('collected values:', values);
};

run().catch((error) => {
  console.error('subscription failed', error);
  process.exitCode = 1;
});
