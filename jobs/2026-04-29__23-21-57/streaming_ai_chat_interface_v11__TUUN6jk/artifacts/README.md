# tRPC v11 AI Chat Streaming Example

## Overview
This project demonstrates tRPC v11's native `AsyncGenerator` support and `httpBatchStreamLink` for building streaming AI chat interfaces without WebSockets.

## Implementation Details

### 1. Dependencies Installed
- `@trpc/server@next` - tRPC v11 server
- `@trpc/client@next` - tRPC v11 client
- `@trpc/react-query@next` - tRPC React Query integration
- `@tanstack/react-query@latest` - React Query for data fetching

### 2. Server Setup (`/server/trpc/`)
- **init.ts**: Initializes tRPC with `initTRPC.create()`
- **_app.ts**: Creates the app router with `chatStream` procedure

#### chatStream Procedure
```typescript
chatStream: publicProcedure
  .query(async function* () {
    yield "Starting...";
    await new Promise((resolve) => setTimeout(resolve, 100));
    yield "Processing...";
    await new Promise((resolve) => setTimeout(resolve, 100));
    yield "Done!";
  })
```

Uses an async generator (`async function*`) to stream three messages with 100ms delays between each yield.

### 3. API Route (`/app/api/trpc/[trpc]/route.ts`)
Next.js API route handler that uses tRPC's fetch adapter:
```typescript
fetchRequestHandler({
  endpoint: "/api/trpc",
  req,
  router: appRouter,
  createContext: () => ({}),
})
```

### 4. Client Setup (`/client/trpc.tsx`)
- Creates tRPC React client with `httpBatchStreamLink`
- Configures to stream responses from `http://localhost:3000/api/trpc`
- Wraps app with `TRPCProvider` component

### 5. Provider Integration (`/app/layout.tsx`)
Wraps the entire app with `TRPCProvider` to enable tRPC throughout the application.

### 6. Client Component (`/app/page.tsx`)
Uses `trpc.chatStream.useQuery()` to:
- Call the `chatStream` procedure on mount
- Subscribe to the async generator
- Render messages in a `<ul>` list with `<li>` elements

## How to Run

```bash
cd /home/user/project
npm run dev
```

Then visit `http://localhost:3000` to see the streaming messages appear one by one.

## Key Features
- ✅ tRPC v11 native async generator support
- ✅ `httpBatchStreamLink` for streaming over HTTP
- ✅ Real-time message updates without WebSockets
- ✅ Clean type safety throughout the stack
- ✅ Simple, clean API for streaming data

## File Structure
```
/home/user/project/
├── server/
│   └── trpc/
│       ├── init.ts         # tRPC initialization
│       └── _app.ts         # Router with chatStream procedure
├── client/
│   └── trpc.tsx            # tRPC client and provider
├── app/
│   ├── api/
│   │   └── trpc/
│   │       └── [trpc]/
│   │           └── route.ts  # API route handler
│   ├── layout.tsx          # Root layout with TRPCProvider
│   └── page.tsx            # Client component consuming stream
└── package.json
```

## Expected Output
When you visit the home page, you'll see three messages appear sequentially:
1. "Starting..."
2. "Processing..."
3. "Done!"

Each message appears 100ms after the previous one, demonstrating the streaming capability.