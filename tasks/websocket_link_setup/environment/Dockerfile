FROM ubuntu:24.04

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl ca-certificates git python3 python3-pip python3-pytest bash && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/user && chmod 0755 /home/user

LABEL Author="any-task-builder"
LABEL Description="tRPC v11 project with an initial client setup in /home/user/app."

RUN mkdir -p /home/user/app/src /home/user/app/test && \
    cd /home/user/app && \
    cat > package.json <<'EOF'
{
  "name": "trpc-wslink-task",
  "version": "1.0.0",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "jest"
  },
  "dependencies": {
    "@trpc/server": "^11.0.0-rc.366",
    "@trpc/client": "^11.0.0-rc.366",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.11.16",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.2",
    "@types/jest": "^29.5.12"
  }
}
EOF

RUN cd /home/user/app && \
    cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "lib": ["es2022", "dom"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
EOF

RUN cd /home/user/app && \
    cat > jest.config.js <<'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
EOF

RUN cd /home/user/app && \
    cat > src/server.ts <<'EOF'
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  getUser: t.procedure.input(z.string()).query(({ input }) => {
    return { id: input, name: 'John Doe' };
  }),
  notifications: t.router({
    onNewMessage: t.procedure.subscription(async function* () {
      yield { message: 'hello' };
    }),
  }),
});

export type AppRouter = typeof appRouter;
EOF

RUN cd /home/user/app && \
    cat > src/client.ts <<'EOF'
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server';

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});
EOF

RUN cd /home/user/app && \
    cat > test/client.test.ts <<'EOF'
import { trpcClient } from '../src/client';
import { createTRPCClient, httpBatchLink, wsLink, splitLink } from '@trpc/client';

describe('tRPC Client Configuration', () => {
  it('should be configured with splitLink', () => {
    // We check the internal links array of the client
    const links = (trpcClient as any).links;
    expect(links).toBeDefined();
    
    // Check if splitLink is used (it returns a function)
    // We can't easily inspect the internal state of splitLink, but we can check if it's a function
    // and we can parse the source code of client.ts to verify the configuration
    const fs = require('fs');
    const path = require('path');
    const clientCode = fs.readFileSync(path.join(__dirname, '../src/client.ts'), 'utf-8');
    
    expect(clientCode).toContain('splitLink');
    expect(clientCode).toContain('wsLink');
    expect(clientCode).toContain('createWSClient');
    expect(clientCode).toContain('ws://localhost:3001');
    expect(clientCode).toContain('http://localhost:3000/trpc');
    expect(clientCode).toContain('notifications.onNewMessage');
    
    // Check if it's actually exported
    expect(trpcClient).toBeDefined();
  });
});
EOF

RUN cd /home/user/app && npm install

# Container contents:
#   - Node.js v24 for the tRPC v11 project
#   - /home/user/app  — tRPC v11 project with initial client setup
#   - /home/user/app/src/client.ts — client configuration to be updated

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
