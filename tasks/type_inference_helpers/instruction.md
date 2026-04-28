# tRPC Type Inference Helpers

## Background
tRPC provides `inferRouterInputs` and `inferRouterOutputs` to extract the types of your API for use in the client or other parts of the application. This allows you to share types between the server and client without code generation.

## Requirements
- You have a Node.js project at `/home/user/project` with a tRPC server defined in `server.ts`.
- The server defines an `appRouter` with a `user` router containing a `getUser` query and a `createUser` mutation.
- You need to implement type inference in `client.ts`.

## Implementation Guide
1. Open `/home/user/project/client.ts`.
2. Import `inferRouterInputs` and `inferRouterOutputs` from `@trpc/server`.
3. Import the `AppRouter` type from `./server`.
4. Export a type `RouterInput` using `inferRouterInputs<AppRouter>`.
5. Export a type `RouterOutput` using `inferRouterOutputs<AppRouter>`.
6. Export a type `User` which is the output type of the `user.getUser` procedure.
7. Export a type `CreateUserInput` which is the input type of the `user.createUser` procedure.
8. Implement and export a function `printUser(user: User): string` that returns the string `"User: " + user.name`.
9. Implement and export a function `getDefaultCreateUserInput(): CreateUserInput` that returns the object `{ name: "Default" }`.

## Constraints
- Project path: `/home/user/project`
- Do not modify `server.ts`.
- Ensure `client.ts` compiles successfully without type errors.