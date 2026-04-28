"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/trpc/client";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const { client } = trpc.useUtils();

  useEffect(() => {
    let active = true;

    const run = async () => {
      setMessages([]);
      const stream = await client.chatStream.query();

      for await (const message of stream) {
        if (!active) {
          break;
        }

        setMessages((prev) => [...prev, message]);
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [client]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold">tRPC Chat Stream</h1>
      <ul className="w-full max-w-md list-disc space-y-2 pl-6">
        {messages.map((message, index) => (
          <li key={`${message}-${index}`}>{message}</li>
        ))}
      </ul>
    </main>
  );
}
