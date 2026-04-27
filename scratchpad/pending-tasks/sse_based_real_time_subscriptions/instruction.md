tRPC v11 introduces `httpSubscriptionLink` and uses native async generators to handle real-time subscriptions via Server-Sent Events (SSE), eliminating the need for a dedicated WebSocket server.

You need to implement a `notifications` subscription in `server/router.ts` using an `async function*` that yields a `{ status: 'ping' }` object every second. Subsequently, update the client configuration to handle this subscription by adding `httpSubscriptionLink` to the links array.

**Constraints:**
- Do NOT use `wsLink` or implement a WebSocket server.
- The subscription procedure MUST use a native `AsyncGenerator` (`async function*`).