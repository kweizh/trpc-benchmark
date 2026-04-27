tRPC v11 requires transformers to be defined directly within the links array rather than the root client configuration, which frequently causes serialization errors during migrations from v10. 

You need to fix the tRPC client initialization in `client/trpc.ts` by moving the `superjson` transformer configuration. Properly place the transformer inside the `httpBatchLink` configuration object to ensure Date objects and complex types are successfully parsed on the client.

**Constraints:**
- Do NOT modify the server-side router configuration.
- The client must use `httpBatchLink` as the primary link.