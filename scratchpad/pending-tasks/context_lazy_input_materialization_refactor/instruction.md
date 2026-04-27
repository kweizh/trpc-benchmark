tRPC v11 optimizes performance by deferring input parsing, meaning `createContext` no longer has synchronous, immediate access to procedure inputs. Developers must explicitly extract it using the `TRPCRequestInfo` object.

You need to refactor a custom authorization function inside `server/context.ts` that relies on reading request payloads before procedure execution. Use the `info.calls[index].getRawInput()` method to asynchronously retrieve and inspect the raw request input to authorize the action.

**Constraints:**
- Do NOT attempt to access the removed `info.input` property.
- You must correctly await the resolution of `getRawInput()` before executing your authorization logic.