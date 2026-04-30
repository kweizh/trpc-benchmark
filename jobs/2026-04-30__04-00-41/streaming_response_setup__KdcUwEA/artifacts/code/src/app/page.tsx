"use client";

import { useEffect, useState } from "react";
import { vanillaClient } from "@/utils/trpcClient";

export default function Home() {
  const [words, setWords] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const iterable = await vanillaClient.streamWords.query();
        for await (const word of iterable as AsyncIterable<string>) {
          if (cancelled) return;
          setWords((prev) => [...prev, word]);
        }
        if (!cancelled) setDone(true);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>tRPC v11 Streaming Demo</h1>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <>
          <p data-testid="streamed-text">{words.join(" ")}</p>
          <p>Status: {done ? "complete" : "streaming..."}</p>
        </>
      )}
    </main>
  );
}
