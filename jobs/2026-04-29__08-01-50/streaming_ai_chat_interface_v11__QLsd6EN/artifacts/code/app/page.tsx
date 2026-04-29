'use client';

import { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc';

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const utils = trpc.useUtils();

  useEffect(() => {
    let active = true;

    async function fetchStream() {
      try {
        const iterable = await utils.client.chatStream.query();
        for await (const msg of iterable as any) {
          if (!active) break;
          setMessages((prev) => [...prev, msg]);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchStream();

    return () => {
      active = false;
    };
  }, [utils]);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">AI Chat Stream</h1>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </main>
  );
}
