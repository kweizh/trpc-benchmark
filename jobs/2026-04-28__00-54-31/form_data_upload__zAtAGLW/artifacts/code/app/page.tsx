'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc-client';
import Image from 'next/image';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const uploadMutation = trpc.uploadFile.useMutation({
    onSuccess: (data) => {
      setUploadedUrl(data.url);
      setFile(null);
    },
    onError: (error) => {
      alert(`Upload failed: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    uploadMutation.mutate(formData);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-gray-50 dark:bg-zinc-950">
      <div className="z-10 max-w-xl w-full flex flex-col items-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center text-zinc-900 dark:text-zinc-50">tRPC v11 File Upload</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg w-full border border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col space-y-2 w-full">
            <label htmlFor="file" className="font-semibold text-zinc-700 dark:text-zinc-300">Select Image</label>
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-zinc-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                dark:file:bg-blue-900/30 dark:file:text-blue-400
                hover:file:bg-blue-100 dark:hover:file:bg-blue-900/40"
            />
          </div>
          
          <button
            type="submit"
            disabled={!file || uploadMutation.isPending}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-zinc-400 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.98]"
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Upload File'}
          </button>
        </form>

        {uploadedUrl && (
          <div className="mt-12 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Uploaded Successfully!</h2>
            <div className="relative w-80 h-80 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xl bg-white dark:bg-zinc-900">
              <Image
                src={uploadedUrl}
                alt="Uploaded file"
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="mt-4 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 w-full text-center truncate">
              <span className="text-zinc-500 dark:text-zinc-400 mr-2 font-semibold">URL:</span>
              <code className="text-blue-600 dark:text-blue-400">{uploadedUrl}</code>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
