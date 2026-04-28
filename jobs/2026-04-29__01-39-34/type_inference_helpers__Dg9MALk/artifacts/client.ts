import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./server";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export type User = RouterOutput["user"]["getUser"];
export type CreateUserInput = RouterInput["user"]["createUser"];

export const printUser = (user: User): string => `User: ${user.name}`;

export const getDefaultCreateUserInput = (): CreateUserInput => ({
  name: "Default",
});
