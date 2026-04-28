FROM ubuntu:24.04

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl ca-certificates git python3 python3-pip python3-pytest bash \
        ffmpeg ripgrep libxcb-shm0 libx11-xcb1 libx11-6 libxcb1 libxext6 libxrandr2 libxcomposite1 libxcursor1 libxdamage1 libxfixes3 libxi6 libgtk-3-0t64 libpangocairo-1.0-0 libpango-1.0-0 libatk1.0-0t64 libcairo-gobject2 libcairo2 libgdk-pixbuf-2.0-0 libxrender1 libasound2t64 libfreetype6 libfontconfig1 libdbus-1-3 libnss3 libnspr4 libatk-bridge2.0-0t64 libdrm2 libxkbcommon0 libatspi2.0-0t64 libcups2t64 libxshmfence1 libgbm1 chromium-browser && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    npm i -g @getpochi/cli agent-browser && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/user && chmod 0755 /home/user

LABEL Author="any-task-builder"
LABEL Description="tRPC v11 task environment with Node.js v22 installed."

RUN mkdir -p /home/user/project && \
    cd /home/user/project && \
    npm init -y && \
    npm install @trpc/server@next @trpc/client@next @trpc/react-query@next @tanstack/react-query@latest zod typescript @types/node tsx && \
    npx tsc --init && \
    cat >server.ts <<'EOF'
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { z } from 'zod';

const t = initTRPC.create();

const appRouter = t.router({
  hello: t.procedure.input(z.string()).query(({ input }) => {
    return `Hello ${input}`;
  }),
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);
EOF
RUN cd /home/user/project && \
    cat >client.ts <<'EOF'
import { createTRPCClient, httpLink } from '@trpc/client';
import type { AppRouter } from './server';

const client = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: 'http://localhost:3000',
    }),
  ],
});

async function main() {
  const result1 = client.hello.query('world 1');
  const result2 = client.hello.query('world 2');
  const result3 = client.hello.query('world 3');
  const result4 = client.hello.query('world 4');
  const result5 = client.hello.query('world 5');
  
  const results = await Promise.all([result1, result2, result3, result4, result5]);
  console.log(results);
}

main();
EOF

# Container contents:
#   - Node.js v22
#   - tRPC v11 project with server.ts and client.ts in /home/user/project
#   - client.ts uses httpLink instead of httpBatchLink

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
