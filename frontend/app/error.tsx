"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-50 p-4">
      <div className="bg-red-950/30 border border-red-900 rounded-xl p-8 max-w-lg w-full text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/50">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
        <p className="text-gray-400 mb-6 font-mono text-sm break-all">{error.message || "An unexpected error occurred in the React tree."}</p>
        <button
          onClick={() => reset()}
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-red-600/20"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
