# tRPC v11 with React Query v5

## Background
You have a basic React application created with Vite in `/home/user/app`. You need to integrate tRPC v11 using `@trpc/react-query` and TanStack Query v5.

## Requirements
- Install the required dependencies: `@trpc/server@next`, `@trpc/client@next`, `@trpc/react-query@next`, and `@tanstack/react-query@latest`.
- Create a simple tRPC router in `src/server/trpc.ts` with a `hello` query that takes a string input and returns `Hello ${input}`.
- Set up the tRPC React client in `src/utils/trpc.ts`.
- Configure the `QueryClientProvider` and `trpc.Provider` in `src/App.tsx`.
- Add a component in `src/App.tsx` that uses `trpc.hello.useQuery('World')` and displays the result.

## Implementation Guide
1. Navigate to `/home/user/app`.
2. Install the required dependencies.
3. Create `src/server/trpc.ts`:
   - Initialize tRPC with `initTRPC.create()`.
   - Create an `appRouter` with a `hello` public procedure.
   - Export `AppRouter` type.
4. Create `src/utils/trpc.ts`:
   - Create the tRPC React hooks using `createTRPCReact<AppRouter>()`.
5. Update `src/App.tsx`:
   - Create a `QueryClient` and `trpcClient` (using `httpBatchLink` pointing to `http://localhost:3000/trpc`).
   - Wrap the app with `trpc.Provider` and `QueryClientProvider`.
   - Render the result of the `hello` query (e.g., render a `<div>` with id `trpc-result` containing the text).

## Constraints
- Project path: /home/user/app
- Use `zod` for input validation (already installed).
- Do not run a real server; just set up the client providers and the router definition so it compiles and passes TypeScript checks.