"use client";

import { useState } from "react";

interface TaskInputProps {
  onSubmit: (task: string) => void;
  disabled: boolean;
}

export default function TaskInput({ onSubmit, disabled }: TaskInputProps) {
  const [task, setTask] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() && !disabled) {
      onSubmit(task);
      setTask("");
    }
  };

  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-700/50 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <h2 className="text-sm font-bold text-zinc-300 mb-3 uppercase tracking-[0.2em] flex items-center gap-2 font-sans">
        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]"></span>
        Mission Objective
      </h2>
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task to simulate (e.g. 'Build a marketing campaign')..."
          className="flex-1 bg-zinc-950/50 border border-zinc-700/50 text-indigo-200 placeholder-zinc-600 px-5 py-4 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !task.trim()}
          className="bg-indigo-600/90 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:border-zinc-700 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl border border-indigo-400/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all uppercase tracking-wider text-sm flex items-center gap-2 group"
        >
          <span>Deploy</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
}
