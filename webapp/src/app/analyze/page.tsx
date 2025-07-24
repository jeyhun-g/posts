import { Search } from 'lucide-react';

export default function Analyze() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative w-full max-w-xl">
        <input
          type="text"
          placeholder="Discover what's behind a link"
          className="w-full py-3 px-5 pr-12 rounded-full shadow-md border border-gray-300 focus:outline-none"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 cursor-pointer">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
