import { appRouter, createCallerFactory } from './router';

async function main() {
  const createCaller = createCallerFactory(appRouter);
  
  // Create a caller with an empty context (since we don't use it in the router)
  const caller = createCaller({});

  try {
    const result = await caller.greet({ name: "World" });
    console.log(result);
  } catch (error) {
    console.error("Error calling greet:", error);
    process.exit(1);
  }
}

main();
