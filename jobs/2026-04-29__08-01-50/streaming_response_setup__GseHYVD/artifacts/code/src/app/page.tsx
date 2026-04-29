'use client';

import { trpc } from '@/utils/trpc';
import { useEffect, useState } from 'react';

export default function Home() {
  const [words, setWords] = useState<string[]>([]);
  const { data } = trpc.streamWords.useQuery();

  useEffect(() => {
    if (!data) return;

    let isMounted = true;

    const readStream = async () => {
      try {
        const newWords = [];
        for await (const word of data) {
          if (!isMounted) break;
          newWords.push(word);
          setWords([...newWords]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    readStream();

    return () => {
      isMounted = false;
    };
  }, [data]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div id="content">
        {words.length > 0 ? words.join(' ') : 'Loading...'}
      </div>
    </main>
  );
}
