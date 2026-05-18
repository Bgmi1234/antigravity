"use client";

import { useEffect, useRef } from "react";

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "system";
}

export default function ExecutionLogPanel({ logs }: { logs: LogEntry[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 shadow-2xl flex flex-col h-full relative overflow-hidden font-mono">
      {/* Subtle scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      
      <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2 z-10">
        <h2 className="text-gray-400 text-xs tracking-wider uppercase">Execution Logs</h2>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
          <span className="text-emerald-500 text-[10px] uppercase">System Online</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 z-10 custom-scrollbar text-xs">
        {logs.length === 0 ? (
          <div className="text-gray-600 italic mt-4 text-center">Awaiting task input...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="font-mono flex items-start gap-3 opacity-90 hover:opacity-100 hover:bg-white/[0.02] p-1 rounded transition-colors">
              <span className="text-gray-500 whitespace-nowrap">[{log.timestamp}]</span>
              <span className={`
                ${log.type === "system" ? "text-blue-400" : ""}
                ${log.type === "info" ? "text-gray-300" : ""}
                ${log.type === "success" ? "text-emerald-400" : ""}
                ${log.type === "warning" ? "text-amber-400" : ""}
              `}>
                {log.type === "system" && <span className="mr-2 text-blue-500">›</span>}
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
