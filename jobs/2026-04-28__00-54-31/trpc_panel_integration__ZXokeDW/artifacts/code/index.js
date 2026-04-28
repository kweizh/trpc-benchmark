const express = require('express');
const { initTRPC } = require('@trpc/server');
const { createExpressMiddleware } = require('@trpc/server/adapters/express');
const { renderTrpcPanel } = require('trpc-panel');
const { z } = require('zod');

// Initialize tRPC v11
const t = initTRPC.create();

// Define the router
const appRouter = t.router({
  greeting: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return {
        text: `Hello, ${input.name}!`,
      };
    }),
});

const app = express();

// Mount tRPC API
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

// Mount trpc-panel
app.get('/panel', (req, res) => {
  res.send(
    renderTrpcPanel(appRouter, {
      url: 'http://localhost:3000/trpc',
    })
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`tRPC API at http://localhost:${PORT}/trpc`);
  console.log(`trpc-panel at http://localhost:${PORT}/panel`);
});
