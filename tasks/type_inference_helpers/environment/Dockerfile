FROM ubuntu:24.04

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl ca-certificates git python3 python3-pip python3-pytest bash && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/user/project && chmod 0755 /home/user/project

LABEL Author="any-task-builder"
LABEL Description="Node.js environment with tRPC v11 for type inference task."

WORKDIR /home/user/project

RUN cat > package.json <<'EOF'
{
  "name": "trpc-inference-task",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@trpc/server": "next",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.11.16"
  }
}
EOF

RUN cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
EOF

RUN cat > server.ts <<'EOF'
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

const userRouter = t.router({
  getUser: t.procedure.query(() => {
    return { id: 1, name: 'Alice' };
  }),
  createUser: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      return { id: 2, name: input.name };
    }),
});

export const appRouter = t.router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
EOF

RUN cat > client.ts <<'EOF'
// Implement type inference here
// Import inferRouterInputs and inferRouterOutputs from @trpc/server
// Import AppRouter from ./server

// Export RouterInput and RouterOutput types

// Export User and CreateUserInput types

// Implement and export printUser(user: User): string

// Implement and export getDefaultCreateUserInput(): CreateUserInput

EOF

RUN npm install

# Container contents:
#   - Node.js v24 installed
#   - /home/user/project with tRPC v11 setup
#   - server.ts with basic router
#   - client.ts template

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
