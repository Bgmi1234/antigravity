"use client";

import { useEffect, useState } from "react";

export default function SystemStats() {
  const [cpu, setCpu] = useState(12);
  const [mem, setMem] = useState(34);
  const [net, setNet] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(prev => Math.min(100, Math.max(0, prev + (Math.random() * 20 - 10))));
      setMem(prev => Math.min(100, Math.max(0, prev + (Math.random() * 5 - 2.5))));
      setNet(prev => Math.min(100, Math.max(0, Math.random() * 80 + 20)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-700/50 p-4 rounded-xl shadow-lg h-full flex flex-col justify-center gap-4">
      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
        System Health
      </h3>
      
      <div className="space-y-3">
        <StatBar label="CPU LOAD" value={cpu} color="bg-blue-500" glow="shadow-[0_0_10px_#3b82f6]" />
        <StatBar label="MEMORY" value={mem} color="bg-purple-500" glow="shadow-[0_0_10px_#a855f7]" />
        <StatBar label="NETWORK" value={net} color="bg-cyan-500" glow="shadow-[0_0_10px_#06b6d4]" />
      </div>
    </div>
  );
}

function StatBar({ label, value, color, glow }: { label: string, value: number, color: string, glow: string }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] text-zinc-400 mb-1 font-mono">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} ${glow} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}
