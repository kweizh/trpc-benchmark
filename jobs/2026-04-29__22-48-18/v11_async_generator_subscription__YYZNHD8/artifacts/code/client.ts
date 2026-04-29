import { EventSource } from 'eventsource';
Object.assign(globalThis, { EventSource });

import { createTRPCClient, httpSubscriptionLink, splitLink, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server.js';
import * as fs from 'fs';

const client = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: httpSubscriptionLink({
        url: 'http://localhost:2022',
      }),
      false: httpBatchLink({
        url: 'http://localhost:2022',
      }),
    }),
  ],
});

async function main() {
  const log: number[] = [];
  
  const sub = client.countdown.subscribe(undefined, {
    onData(value) {
      log.push(value);
      console.log('Received:', value);
    },
    onComplete() {
      console.log('Done');
      fs.writeFileSync('/home/user/project/output.log', JSON.stringify(log));
      process.exit(0);
    },
    onError(err) {
      console.error(err);
      process.exit(1);
    }
  });
}

main();
