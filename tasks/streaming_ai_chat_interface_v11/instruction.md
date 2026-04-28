# tRPC v11 AI Chat Streaming

## Background
tRPC v11 introduces native `AsyncGenerator` support and `httpBatchStreamLink`, which are perfect for building streaming AI chat interfaces without WebSockets.

## Requirements
1. You are provided with a basic Next.js App Router project in `/home/user/project`.
2. Install tRPC v11 (`@trpc/server@next`, `@trpc/client@next`, `@trpc/react-query@next`, `@tanstack/react-query@latest`).
3. Create a tRPC router with a `chatStream` public procedure that uses an `async function*` (async generator) to stream three messages: `"Starting..."`, `"Processing..."`, and `"Done!"`, with a 100ms delay between each yield.
4. Configure the tRPC client link to use `httpBatchStreamLink`.
5. Update the Next.js Client Component on the home page (`app/page.tsx`) to call the `chatStream` procedure on mount and render the streamed messages in a `<ul>` list with `<li>` elements.

## Constraints
- Project path: `/home/user/project`
- Start command: `npm run dev`
- Port: 3000