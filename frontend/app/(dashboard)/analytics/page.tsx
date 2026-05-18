"use client";

import { useState, useEffect } from "react";
import { BarChart, Server, Activity, Cpu, HardDrive, Thermometer, DollarSign, RefreshCw, Radio, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const [sysTemp, setSysTemp] = useState(42);
  const [sysLoad, setSysLoad] = useState(65);
  const [netSpeed, setNetSpeed] = useState(1.2);
  const [uptime, setUptime] = useState("02:45:12");

  // Simulate updating data
  useEffect(() => {
    const timer = setInterval(() => {
      setSysTemp(prev => Math.min(85, Math.max(35, prev + Math.floor(Math.random() * 5) - 2)));
      setSysLoad(prev => Math.min(100, Math.max(10, prev + Math.floor(Math.random() * 11) - 5)));
      setNetSpeed(prev => parseFloat(Math.min(3.5, Math.max(0.5, prev + (Math.random() * 0.4) - 0.2)).toFixed(2)));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Format uptime count
  useEffect(() => {
    let seconds = 9912;
    const uptimeTimer = setInterval(() => {
      seconds++;
      const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      setUptime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(uptimeTimer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 relative z-10 font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white/70 p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div>
          <h2 className="text-3xl font-bold font-pixel text-slate-850 uppercase tracking-tight mb-2 flex items-center gap-3">
            <BarChart className="w-8 h-8 text-indigo-650" />
            Company Stats
          </h2>
          <p className="text-indigo-650 font-mono text-xs uppercase tracking-widest mt-2 flex items-center gap-2 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Real-Time Resource Diagnostic Terminal
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "SYSTEM CORE TEMP", value: `${sysTemp}°C`, icon: Thermometer, color: sysTemp > 75 ? "text-rose-600" : "text-amber-600", border: sysTemp > 75 ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white/80" },
          { title: "BANDWIDTH IN/OUT", value: `${netSpeed} GB/s`, icon: Radio, color: "text-indigo-600", border: "border-slate-200 bg-white/80" },
          { title: "OPERATING BUDGET", value: "$2.4M", icon: DollarSign, color: "text-emerald-600", border: "border-slate-200 bg-white/80" },
          { title: "HOST UPTIME", value: uptime, icon: Activity, color: "text-purple-600", border: "border-slate-200 bg-white/80" }
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            key={stat.title}
            className={cn("p-6 rounded-2xl border shadow-sm relative overflow-hidden group", stat.border)}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-pixel text-slate-400 uppercase tracking-widest font-bold">{stat.title}</span>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <h3 className={cn("text-2xl font-bold font-mono", stat.color)}>{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Grid Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Stats: CPU and Core load */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white/80 border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h4 className="text-xs font-pixel text-slate-800 uppercase tracking-widest flex items-center gap-2 font-bold">
                <Cpu className="w-5 h-5 text-indigo-500" />
                Virtual Host Matrix
              </h4>
              <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            {/* Simulated Server Cores Load */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-500 font-semibold">
                  <span>Cluster Load Capacity</span>
                  <span className="text-indigo-650 font-bold">{sysLoad}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 border border-slate-200/80 rounded-full overflow-hidden p-0.5">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    animate={{ width: `${sysLoad}%` }}
                    transition={{ type: "spring", stiffness: 80 }}
                  />
                </div>
              </div>

              {/* Grid of Virtual Cores */}
              <div className="pt-4">
                <p className="text-[9px] font-pixel text-slate-400 uppercase tracking-widest mb-3 font-bold">Processor Cores Allocation</p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {Array.from({ length: 16 }).map((_, idx) => {
                    const coreLoad = Math.min(100, Math.max(0, Math.floor(sysLoad + (Math.random() * 40 - 20))));
                    
                    return (
                      <div 
                        key={idx} 
                        className={cn(
                          "border p-2.5 rounded-xl text-center font-mono space-y-1 bg-slate-50 transition-colors duration-300 shadow-inner",
                          coreLoad > 85 
                            ? "border-rose-200 bg-rose-50/50" 
                            : coreLoad > 60 
                              ? "border-amber-200 bg-amber-50/40" 
                              : "border-slate-200"
                        )}
                      >
                        <p className="text-[8px] text-slate-400 font-pixel font-bold">C{idx.toString().padStart(2, '0')}</p>
                        <p className={cn(
                          "text-xs font-bold",
                          coreLoad > 85 
                            ? "text-rose-600 animate-pulse" 
                            : coreLoad > 60 
                              ? "text-amber-600" 
                              : "text-emerald-600"
                        )}>{coreLoad}%</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Stats: Storage Diagnostic Console */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white/80 border border-slate-200 p-6 rounded-2xl shadow-sm h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h4 className="text-xs font-pixel text-slate-800 uppercase tracking-widest flex items-center gap-2 font-bold">
                  <HardDrive className="w-5 h-5 text-indigo-500" />
                  Cluster Storage
                </h4>
                <span className="text-[9px] font-mono bg-indigo-50 text-indigo-650 border border-indigo-200 px-2 py-0.5 rounded-lg uppercase tracking-wider font-bold">OK</span>
              </div>

              <div className="space-y-6 font-mono text-xs text-slate-500 font-semibold">
                <div className="flex items-center justify-between">
                  <span>Sector Allocation</span>
                  <span className="text-slate-800 font-bold">854.2 GB / 1024 GB</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Data Redundancy</span>
                  <span className="text-emerald-600 font-bold">3x Replication Active</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Active Workers Connected</span>
                  <span className="text-indigo-600 font-bold">5 Autonomous Nodes</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Pipeline Task Latency</span>
                  <span className="text-slate-800 font-bold">&lt; 45ms</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 mt-8">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-inner">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-150 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-indigo-650 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <div>
                  <p className="text-xs font-bold font-sans text-slate-800">Auto-Optimization Active</p>
                  <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest mt-0.5 font-bold">Load balanced dynamically</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
