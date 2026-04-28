"use client";

import { useEffect, useState } from "react";
import { trpcClient } from "@/trpc/client";

export default function Home() {
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    let isActive = true;

    const loadWords = async () => {
      const stream = await trpcClient.streamWords.query();
      const collected: string[] = [];

      for await (const word of stream) {
        if (!isActive) {
          break;
        }
        collected.push(word);
        setWords([...collected]);
      }
    };

    loadWords();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-3xl font-semibold text-black">
      {words.join(" ")}
    </main>
  );
}
