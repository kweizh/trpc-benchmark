FROM ubuntu:24.04

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl ca-certificates git python3 python3-pip python3-pytest bash \
        ffmpeg ripgrep libxcb-shm0 libx11-xcb1 libx11-6 libxcb1 libxext6 libxrandr2 \
        libxcomposite1 libxcursor1 libxdamage1 libxfixes3 libxi6 libgtk-3-0t64 \
        libpangocairo-1.0-0 libpango-1.0-0 libatk1.0-0t64 libcairo-gobject2 libcairo2 \
        libgdk-pixbuf-2.0-0 libxrender1 libasound2t64 libfreetype6 libfontconfig1 \
        libdbus-1-3 libnss3 libnspr4 libatk-bridge2.0-0t64 libdrm2 libxkbcommon0 \
        libatspi2.0-0t64 libcups2t64 libxshmfence1 libgbm1 && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    npm i -g @getpochi/cli agent-browser && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN agent-browser install

RUN mkdir -p /home/user && chmod 0755 /home/user

LABEL Author="any-task-builder"
LABEL Description="Next.js app with tRPC v11 and React Query v5 for optimistic updates task"

RUN mkdir -p /home/user/app/src/app/api/trpc/[trpc] && \
    mkdir -p /home/user/app/src/server && \
    mkdir -p /home/user/app/src/utils && \
    cd /home/user/app && \
    cat >package.json <<'EOF'
{
  "name": "trpc-optimistic",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18",
    "react-dom": "^18",
    "@trpc/server": "11.0.0-rc.344",
    "@trpc/client": "11.0.0-rc.344",
    "@trpc/react-query": "11.0.0-rc.344",
    "@trpc/next": "11.0.0-rc.344",
    "@tanstack/react-query": "^5",
    "zod": "^3",
    "superjson": "^2"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}
EOF

RUN cd /home/user/app && \
    cat >tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

RUN cd /home/user/app && \
    cat >src/server/trpc.ts <<'EOF'
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;

let messages: { id: string, text: string }[] = [{ id: '1', text: 'Hello World' }];

export const appRouter = router({
  getMessages: publicProcedure.query(() => {
    return messages;
  }),
  addMessage: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      // simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newMsg = { id: String(Date.now()), text: input.text };
      messages.push(newMsg);
      return newMsg;
    }),
});

export type AppRouter = typeof appRouter;
EOF

RUN cd /home/user/app && \
    cat >src/app/api/trpc/\[trpc\]/route.ts <<'EOF'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
EOF

RUN cd /home/user/app && \
    cat >src/utils/trpc.ts <<'EOF'
'use client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/trpc';
export const trpc = createTRPCReact<AppRouter>();
EOF

RUN cd /home/user/app && \
    cat >src/app/layout.tsx <<'EOF'
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import { httpBatchLink } from '@trpc/client';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    })
  );

  return (
    <html lang="en">
      <body>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </trpc.Provider>
      </body>
    </html>
  );
}
EOF

RUN cd /home/user/app && \
    cat >src/app/page.tsx <<'EOF'
'use client';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';

export default function Page() {
  const [text, setText] = useState('');
  const { data: messages, isLoading } = trpc.getMessages.useQuery();
  const addMessage = trpc.addMessage.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    // The task is to add optimistic updates here!
    addMessage.mutate({ text });
    
    setText('');
  };

  return (
    <main>
      <h1>Guestbook</h1>
      <form onSubmit={handleSubmit}>
        <input 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Type a message" 
        />
        <button type="submit">Submit</button>
      </form>
      
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {messages?.map((msg) => (
            <li key={msg.id}>{msg.text}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
EOF

RUN cd /home/user/app && npm install && npm run build

# Container contents:
#   - always required libs: curl ca-certificates git python3 python3-pip python3-pytest bash
#   - Node.js v24 for the Next.js task environment
#   - browser verification dependencies: Pochi CLI, agent-browser, ffmpeg, ripgrep, and more
#   - /home/user/app: base directory for the Next.js project with tRPC v11 and React Query v5

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
