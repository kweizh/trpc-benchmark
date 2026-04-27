In tRPC v11, the legacy `createCaller` function has been replaced by `createCallerFactory` to cleanly instantiate callers for server-side execution, such as within Next.js App Router Server Components.

You need to implement a server-side caller in `app/page.tsx` to prefetch data for a Server Component. Use `createCallerFactory` to instantiate a caller from the existing `appRouter`, execute the `hello` query with the input `"World"`, and render the result inside a `<main>` HTML tag.

**Constraints:**
- Do NOT use client-side hooks like `trpc.hello.useQuery()`.
- You must pass an empty context object `{}` when invoking the created caller.