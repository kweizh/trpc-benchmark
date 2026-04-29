import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

const appRouter = t.router({
  countdown: t.procedure.subscription(async function* () {
    // Yield numbers from 3 down to 1 with 100ms delay
    for (let i = 3; i >= 1; i--) {
      yield i;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }),
});

export type AppRouter = typeof appRouter;

const PORT = 3002;

// Simple HTTP server with SSE support
const http = require('http');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  if (url.pathname === '/trpc') {
    // Parse the procedure name from query params
    const procedure = url.searchParams.get('procedure');
    
    if (procedure === 'countdown') {
      // Set SSE headers
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      });

      try {
        // Get the subscription generator using tRPC caller
        const caller = appRouter.createCaller({});
        const generator = caller.countdown(); // No input needed for this subscription
        
        // Send each value as SSE event
        for await (const value of generator) {
          const event = {
            data: {
              result: {
                data: value,
              },
            },
          };
          res.write(`data: ${JSON.stringify(event)}\n\n`);
        }
        
        // Send completion signal
        res.write('data: [DONE]\n\n');
      } catch (error) {
        console.error('Subscription error:', error);
        const errorEvent = {
          error: {
            message: error instanceof Error ? error.message : 'Unknown error',
          },
        };
        res.write(`data: ${JSON.stringify(errorEvent)}\n\n`);
      } finally {
        res.end();
      }
    } else {
      res.writeHead(404);
      res.end('Procedure not found');
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`tRPC server running on http://localhost:${PORT}`);
});