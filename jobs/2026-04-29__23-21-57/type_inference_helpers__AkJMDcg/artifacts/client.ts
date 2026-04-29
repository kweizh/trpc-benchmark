import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { AppRouter } from './server';

// Export RouterInput and RouterOutput types
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

// Export User and CreateUserInput types
export type User = RouterOutput['user']['getUser'];
export type CreateUserInput = RouterInput['user']['createUser'];

// Implement and export printUser(user: User): string
export function printUser(user: User): string {
  return 'User: ' + user.name;
}

// Implement and export getDefaultCreateUserInput(): CreateUserInput
export function getDefaultCreateUserInput(): CreateUserInput {
  return { name: 'Default' };
}