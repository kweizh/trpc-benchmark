# Configure wsLink for a Specific Procedure

## Background
You have a tRPC v11 client set up in `/home/user/app`. It currently uses `httpBatchLink` for all requests. The backend has recently added a WebSocket server for real-time features, specifically for a new subscription procedure named `notifications.onNewMessage`.

## Requirements
- Update the tRPC client configuration in `/home/user/app/src/client.ts` to use `wsLink` exclusively for the `notifications.onNewMessage` procedure.
- All other procedures (queries and mutations) must continue to use the existing `httpBatchLink`.
- Use tRPC's `splitLink` to achieve this routing.
- The WebSocket URL is `ws://localhost:3001`.

## Implementation Guide
1. Open `/home/user/app/src/client.ts`.
2. Import `splitLink`, `wsLink`, and `createWSClient` from `@trpc/client`.
3. Create a WebSocket client using `createWSClient({ url: 'ws://localhost:3001' })`.
4. Modify the `links` array in the `createTRPCClient` configuration.
5. Use `splitLink` to route requests where the operation path is `'notifications.onNewMessage'` to the `wsLink` (using the created wsClient).
6. Route all other requests to the existing `httpBatchLink({ url: 'http://localhost:3000/trpc' })`.

## Constraints
- Project path: /home/user/app
- Do not modify the backend code or the test files.
- The client must export the configured tRPC client as `trpcClient`.