"use client";

import { useEffect, useState, useRef } from "react";
import { Terminal } from "lucide-react";

const fakeLogs = [
  "INITIALIZING SYS_KERNEL...",
  "LOADING NEURAL WEIGHTS [OK]",
  "CONNECTING TO SUPABASE CLUSTER...",
  "CONNECTION ESTABLISHED. LATENCY: 12ms",
  "[AGENT_01] Parsing user intent...",
  "[AGENT_01] Generating response matrix...",
  "[SYS] Memory garbage collection triggered.",
  "[AGENT_02] Awaiting task assignment...",
  "SYNCING GLOBAL STATE...",
  "[SECURITY] Firewall rules verified.",
];

export function ActivityTerminal() {
  const [logs, setLogs] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentIndex = 0;
    
    // Initial boot sequence
    const bootInterval = setInterval(() => {
      if (currentIndex < 4) {
        setLogs(prev => [...prev, fakeLogs[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(bootInterval);
        
        // Random activity afterwards
        setInterval(() => {
          const randomLog = fakeLogs[Math.floor(Math.random() * (fakeLogs.length - 4)) + 4];
          const timestamp = new Date().toISOString().substring(11, 19);
          setLogs(prev => {
            const newLogs = [...prev, `[${timestamp}] ${randomLog}`];
            return newLogs.slice(-20); // Keep only last 20 logs
          });
        }, 3000);
      }
    }, 500);

    return () => clearInterval(bootInterval);
  }, []);

  // Auto scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-[400px]">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal className="w-4 h-4" />
          <span className="text-xs font-mono tracking-widest uppercase">Live Activity</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 neon-border-cyan"></div>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="p-4 flex-1 overflow-y-auto font-mono text-xs sm:text-sm bg-black/50"
      >
        <div className="space-y-1.5">
          {logs.map((log, i) => (
            <div key={i} className="text-green-400 opacity-90">
              <span className="text-slate-500 mr-2">{">"}</span>
              {log}
            </div>
          ))}
          <div className="text-green-400 animate-pulse">
            <span className="text-slate-500 mr-2">{">"}</span>_
          </div>
        </div>
      </div>
    </div>
  );
}
