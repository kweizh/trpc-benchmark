### 1. Library Overview
*   **Description**: tRPC (TypeScript Remote Procedure Call) v11 is a major update to the end-to-end typesafe API framework. It allows developers to build APIs without schemas or code generation, leveraging TypeScript's type inference to share types between the server and client.
*   **Ecosystem Role**: Primarily used in the TypeScript ecosystem (React, Next.js, Solid, Vue) to provide a seamless "glue" between the backend and frontend. In v11, it emphasizes deeper integration with TanStack React Query v5 and native support for modern web features like Server-Sent Events (SSE) and Streaming.
*   **Project Setup**: 
    1.  Install dependencies: `npm install @trpc/server@next @trpc/client@next @trpc/react-query@next @tanstack/react-query@latest`.
    2.  Initialize tRPC: 
        ```ts
        import { initTRPC } from '@trpc/server';
        export const t = initTRPC.create();
        export const router = t.router;
        export const publicProcedure = t.procedure;
        export const createCallerFactory = t.createCallerFactory;
        ```
    3.  Define a Router:
        ```ts
        export const appRouter = router({
          hello: publicProcedure.input(z.string()).query(({ input }) => `Hello ${input}`),
        });
        export type AppRouter = typeof appRouter;
        ```
    4.  Expose API (Next.js App Router): Create `app/api/trpc/[trpc]/route.ts` using `fetchRequestHandler`.
### 2. Core Primitives & APIs
*   **`initTRPC.create()`**: The entry point for initializing tRPC. In v11, it includes new options like `sse` for configuring Server-Sent Events.
    *   [Documentation](https://trpc.io/docs/server/routers)
*   **`createCallerFactory`**: Replaces the old `createCaller`. It is used to create a "caller" for executing procedures on the server (e.g., in RSCs or tests).
    ```ts
    const createCaller = createCallerFactory(appRouter);
    const caller = createCaller({ /* context */ });
    const result = await caller.hello('world');
    ```
    *   [Documentation](https://trpc.io/docs/server/server-side-calls)
*   **`httpSubscriptionLink`**: A new link that uses SSE for subscriptions, removing the strict requirement for WebSockets.
    ```ts
    httpSubscriptionLink({
      url: '/api/trpc',
      transformer: superjson,
    })
    ```
    *   [Documentation](https://trpc.io/docs/client/links/httpSubscriptionLink)
*   **`httpBatchStreamLink`**: Enables streaming responses (e.g., for AI chat or slow data) over standard HTTP.
    *   [Documentation](https://trpc.io/docs/client/links/httpBatchStreamLink)
*   **`AsyncGenerator` Subscriptions**: Subscriptions now use native async generators.
    ```ts
    sub: publicProcedure.subscription(async function* () {
      yield { status: 'starting' };
      // ...
    })
    ```
### 3. Real-World Use Cases & Templates
*   **Full-Stack Next.js App Router**: Combining RSCs for initial data fetching via `createCallerFactory` and React Query for client-side interactivity.
*   **Real-time Dashboards**: Using `httpSubscriptionLink` (SSE) to push updates from the server without managing a WebSocket server.
*   **AI Streaming**: Utilizing `httpBatchStreamLink` to stream LLM responses directly into a tRPC procedure.
*   **Example Projects**:
    *   [tRPC v11 Next.js Starter](https://github.com/trpc/trpc/tree/next/examples/next-app-dir)
    *   [tRPC v11 Form-Data Example](https://github.com/trpc/trpc/tree/next/examples/next-formdata)
### 4. Developer Friction Points
*   **Transformer Migration**: In v11, the `transformer` must be moved from the client initialization object directly into the `links` array (e.g., inside `httpBatchLink`). Forgetting this leads to serialization errors. [Issue Reference](https://trpc.io/docs/migrate-from-v10-to-v11#transformers-moved).
*   **Strict Content-Type**: v11 enforces `Content-Type: application/json` (or similar) for POST requests. Manual fetch calls to tRPC endpoints that worked in v10 might fail with `415 Unsupported Media Type` in v11.
*   **Lazy Input Materialization**: `createContext` no longer has immediate access to the procedure input. Developers must use `info.calls[index].getRawInput()` if they need to access raw request data before the procedure executes. [Issue Reference](https://trpc.io/docs/migrate-from-v10-to-v11#trpcrequestinfo-has-been-updated-rarely-breaking).
### 5. Evaluation Ideas
*   **Simple**: Implement a typesafe "Hello World" API and call it from a Next.js Client Component.
*   **Simple**: Set up a v11 project with `superjson` transformer correctly placed in the links array.
*   **Medium**: Create a server-side caller using `createCallerFactory` to fetch data in a Next.js Server Component.
*   **Medium**: Implement a real-time notification system using the new SSE-based `httpSubscriptionLink`.
*   **Complex**: Build a streaming AI chat interface using `AsyncGenerator` and `httpBatchStreamLink`.
*   **Complex**: Migrate a v10 project to v11, correctly handling the `transformer` move and the new `TRPCRequestInfo` constraints.
*   **Complex**: Implement a file upload procedure using the new v11 native `FormData` support.
### 6. Sources
1.  [tRPC v11 Migration Guide](https://trpc.io/docs/migrate-from-v10-to-v11): Official guide for upgrading from v10.
2.  [tRPC llms.txt](https://trpc.io/llms.txt): Machine-readable documentation summary.
3.  [tRPC Blog - Announcing v11](https://trpc.io/blog/announcing-trpc-v11): High-level overview of v11 goals and features.
4.  [tRPC GitHub Repository](https://github.com/trpc/trpc): Source of truth for releases and issues.
5.  [Next.js App Router Setup Guide](https://trpc.io/docs/client/nextjs/app-router/setup): Setup instructions for modern Next.js apps.