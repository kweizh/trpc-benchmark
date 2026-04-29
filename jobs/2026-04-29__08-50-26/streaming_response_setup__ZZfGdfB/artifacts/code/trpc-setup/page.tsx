'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

export default function Home() {
  const [streamedWords, setStreamedWords] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const streamWords = trpc.streamWords.useMutation();

  const handleStream = async () => {
    setIsStreaming(true);
    setStreamedWords([]);

    try {
      const result = await streamWords.mutateAsync();
      setStreamedWords(result);
    } catch (error) {
      console.error('Stream error:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            tRPC v11 Streaming
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Click the button below to stream words from the server.
          </p>
          <div className="flex flex-col gap-4 items-center sm:items-start">
            <button
              onClick={handleStream}
              disabled={isStreaming}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isStreaming ? 'Streaming...' : 'Stream Words'}
            </button>
            {streamedWords.length > 0 && (
              <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <p className="text-xl font-medium text-black dark:text-zinc-50">
                  {streamedWords.join(' ')}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}