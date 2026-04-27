For slow-resolving endpoints such as LLM chat responses, tRPC v11 supports HTTP streaming natively using `httpBatchStreamLink`.

You need to configure the tRPC client in `src/trpc/client.ts` to utilize `httpBatchStreamLink` to consume an AI text generation endpoint. Replace the standard batch link with the stream link so the UI can progressively render chunks of text as they are yielded by the server procedure.

**Constraints:**
- The client initialization must successfully export the correctly configured `trpc` client instance.
- Do NOT use `httpBatchLink` in the final configuration.