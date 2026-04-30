import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { z } from "zod";

const t = initTRPC.create();

const appRouter = t.router({
  hello: t.procedure
    .input(z.string().optional())
    .query(({ input }) => {
      return { greeting: `Hello ${input ?? "World"}!` };
    }),
});

export type AppRouter = typeof appRouter;

const corsMiddleware = cors({
  origin: "http://localhost:3000",
  credentials: true,
});

const server = createHTTPServer({
  router: appRouter,
  middleware: corsMiddleware,
});

server.listen(4000, () => {
  console.log("tRPC server listening on http://localhost:4000");
});
