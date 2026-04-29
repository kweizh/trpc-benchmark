import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from './server';

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export type User = RouterOutput['user']['getUser'];
export type CreateUserInput = RouterInput['user']['createUser'];

export function printUser(user: User): string {
  return "User: " + user.name;
}

export function getDefaultCreateUserInput(): CreateUserInput {
  return { name: "Default" };
}
