import { createTRPCClient, httpSubscriptionLink } from '@trpc/client';

type AppRouter = {
  countdown: {
    _def: {
      _output_out: number;
    };
  };
};

const client = createTRPCClient<AppRouter>({
  links: [
    httpSubscriptionLink({
      url: 'http://localhost:3002/trpc',
    }),
  ],
});

async function main() {
  console.log('Starting countdown subscription...');
  
  const subscription = client.countdown.subscribe(undefined, {
    onData: (data) => {
      console.log('Received:', data);
    },
    onError: (error) => {
      console.error('Error:', error);
    },
    onComplete: () => {
      console.log('Subscription completed');
    },
  });

  // Wait for subscription to complete (should take ~400ms for countdown)
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  subscription.unsubscribe();
}

main().catch(console.error);