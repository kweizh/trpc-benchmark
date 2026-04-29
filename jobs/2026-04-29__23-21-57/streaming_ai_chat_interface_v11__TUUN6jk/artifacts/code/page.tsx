"use client";

import { trpc } from "@/client/trpc";
import { useEffect, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const chatStream = trpc.chatStream.useQuery(undefined, {
    enabled: true,
  });

  useEffect(() => {
    if (chatStream.data) {
      chatStream.data.subscribe((message) => {
        setMessages((prev) => [...prev, message]);
      });
    }
  }, [chatStream.data]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">tRPC v11 AI Chat Streaming</h1>
        <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-2xl font-semibold mb-4">Streamed Messages:</h2>
          <ul className="space-y-2">
            {messages.map((message, index) => (
              <li key={index} className="text-lg">
                {message}
              </li>
            ))}
            {messages.length === 0 && (
              <li className="text-gray-500">Waiting for messages...</li>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}