'use client';

import { useEffect, useState } from 'react';
import { trpc } from './trpc/client';

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const subscription = trpc.chatStream.subscribe(undefined, {
      onData(data) {
        setMessages((prev) => [...prev, data]);
      },
      onError(err) {
        console.error('Streaming error:', err);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">tRPC v11 Streaming Chat</h1>
      <ul className="w-full max-w-md border rounded-lg p-4 space-y-2 bg-zinc-900/50">
        {messages.map((msg, i) => (
          <li key={i} className="p-2 border-b border-zinc-700 last:border-0">
            {msg}
          </li>
        ))}
        {messages.length === 0 && (
          <li className="text-zinc-500 italic">Waiting for messages...</li>
        )}
      </ul>
    </main>
  );
}
