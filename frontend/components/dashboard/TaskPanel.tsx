"use client";

import { useState } from "react";

interface TaskPanelProps {
  onStart: (task: string) => void;
  isSimulating: boolean;
}

export default function TaskPanel({ onStart, isSimulating }: TaskPanelProps) {
  const [task, setTask] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() && !isSimulating) {
      onStart(task);
      setTask("");
    }
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">SkyOffice Orchestrator</h1>
          <p className="text-gray-400 text-sm">Autonomous AI Workforce Visualization</p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 w-full md:max-w-2xl flex gap-3">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter objective (e.g. 'Build marketing campaign')..."
            className="flex-1 bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-500 px-4 py-3 rounded-lg outline-none focus:border-indigo-500 transition-colors font-mono text-sm"
            disabled={isSimulating}
          />
          <button
            type="submit"
            disabled={isSimulating || !task.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:shadow-none whitespace-nowrap"
          >
            Start AI Workforce
          </button>
        </form>
      </div>
    </div>
  );
}
