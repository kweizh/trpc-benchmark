# tRPC v11 Async Generator Subscription

## Background
In tRPC v11, subscriptions can now use native async generators, and the client can consume them using Server-Sent Events (SSE) via the new `httpSubscriptionLink`. This removes the strict requirement for WebSockets.

## Requirements
- Implement a tRPC v11 standalone server.
- Create a `countdown` subscription procedure using an `async function* ()`.
- The procedure should yield numbers from 3 down to 1, with a 100ms delay between each yield.
- Create a client script that uses `httpSubscriptionLink` to connect to the server and collect the yielded values.

## Constraints
- Project path: `/home/user/project`
- Log file: `/home/user/project/output.log`