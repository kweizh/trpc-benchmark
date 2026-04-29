import { createTRPCReact } from '@trpc/react-query';
import { httpBatchStreamLink } from '@trpc/client';
import { type AppRouter } from '@/lib/trpc/router';

export const trpc = createTRPCReact<AppRouter>();

export function createTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchStreamLink({
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/trpc`,
      }),
    ],
  });
}