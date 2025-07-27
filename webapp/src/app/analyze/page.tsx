'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import Instructions, { InstructionsProps } from '@app/components/Instructions';

const instructions: InstructionsProps['instructions'] = [
  {
    title: "Copy the Blog or Article URL",
    body: "Find the blog post or article you want to analyze and copy its URL from the browser’s address bar."
  },
  {
    title: "Click \"Search\"",
    body: "Paste the copied URL into the input box, then click the Search button to begin analysis."
  },
  {
    title: "View the Results",
    body: "Instantly see key insights, summaries, or extracted data based on the content of the page."
  }
]

export default function Analyze() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);

  const handleSearch = async () => {
  if (!url.trim()) return;

  setLoading(true);
  setError(null);
  setResult(null);
  setShowInstructions(false);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok || data.response.error) {
      throw new Error(data.response.error || 'Something went wrong');
    }

    setResult(JSON.stringify(data.response.keywords, null, 2));
  } catch (err: unknown) {
    console.log(err)
    setError('Request failed');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative w-full flex flex-col items-center">
        <div className="flex items-center w-full max-w-xl bg-white shadow-md border border-gray-300 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Discover what's behind a link"
            className="flex-grow bg-transparent focus:outline-none text-sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            className="text-gray-500 hover:text-blue-600 cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {showInstructions && (
          <Instructions instructions={instructions} />
        )}

        {loading && (
          <p className="mt-6 text-gray-600 text-center">Loading...</p>
        )}

        {result && (
          <pre className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
            {result}
          </pre>
        )}

        {error && (
          <div className="mt-6 flex items-center justify-center text-red-600">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
