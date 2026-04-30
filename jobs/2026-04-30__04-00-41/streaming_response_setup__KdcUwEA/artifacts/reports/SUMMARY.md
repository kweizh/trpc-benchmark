# tRPC v11 Streaming Demo - Summary

## What was built

A Next.js 14 (App Router) project at `/home/user/project` that uses tRPC v11
streaming responses (`async function*` + `httpBatchStreamLink`) to incrementally
stream the words `"Hello"`, `"streaming"`, `"world"` to a client-side React
component. The component appends each word to local state as it arrives so that
the final rendered text reads `Hello streaming world`.

## Project layout

```
/home/user/project
├── package.json                 # Next, tRPC v11, react-query, zod
├── tsconfig.json
├── next.config.js
├── next-env.d.ts
└── src/
    ├── server/
    │   ├── trpc.ts              # initTRPC base
    │   └── router.ts            # streamWords async generator procedure
    ├── utils/
    │   ├── trpc.ts              # createTRPCReact (typed hooks)
    │   └── trpcClient.ts        # vanilla typed client w/ httpBatchStreamLink
    └── app/
        ├── layout.tsx
        ├── providers.tsx        # QueryClient + tRPC provider, httpBatchStreamLink
        ├── page.tsx             # Client component consuming streamWords
        └── api/trpc/[trpc]/route.ts  # Fetch adapter handler (GET/POST)
```

## Key streaming pieces

**Server (`src/server/router.ts`)**
```ts
export const appRouter = router({
  streamWords: publicProcedure.query(async function* () {
    const words = ["Hello", "streaming", "world"];
    for (const word of words) {
      await sleep(100);
      yield word;
    }
  }),
});
```

**Client transport (`src/utils/trpcClient.ts` and `src/app/providers.tsx`)**
```ts
links: [
  httpBatchStreamLink({
    url: `${getBaseUrl()}/api/trpc`,
  }),
],
```

**Page (`src/app/page.tsx`)** — iterates the async iterable returned from the
streaming query and appends each yielded word to state, rendering them joined
by a space.

## Verification

- `npm run dev` boots Next.js on port 3000.
- A direct request to `/api/trpc/streamWords?batch=1&input=...` with header
  `trpc-accept: application/jsonl` returns the JSONL stream containing
  `Hello`, `streaming`, `world` in order.
- The client page consumes those values with `for await ... of` and ends up
  displaying `Hello streaming world`.

## Run

```bash
cd /home/user/project
npm run dev   # http://localhost:3000
```
