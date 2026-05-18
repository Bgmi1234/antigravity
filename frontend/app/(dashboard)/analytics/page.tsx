"use client";

import { useState, useEffect } from "react";
import { BarChart, Server, Activity, Cpu, HardDrive, Thermometer, DollarSign, RefreshCw, Radio, Settings } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="max-w-7xl mx-auto space-y-8 pb-12 relative z-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-inner bg-animated-grid">
        <div>
          <h2 className="text-3xl font-bold font-pixel text-slate-100 uppercase tracking-tight mb-2 flex items-center gap-3">
            <BarChart className="w-8 h-8 text-pink-400" />
            Company Stats
          </h2>
          <p className="text-pink-400 font-mono text-sm uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            Real-Time Resource Diagnostic Terminal
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "SYSTEM CORE TEMP", value: `${sysTemp}°C`, icon: Thermometer, color: sysTemp > 75 ? "text-red-400" : "text-orange-400", border: sysTemp > 75 ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "border-orange-500/30" },
          { title: "BANDWIDTH IN/OUT", value: `${netSpeed} GB/s`, icon: Radio, color: "text-cyan-400", border: "border-cyan-500/30" },
          { title: "OPERATING BUDGET", value: "$2.4M", icon: DollarSign, color: "text-green-400", border: "border-green-500/30" },
          { title: "HOST UPTIME", value: uptime, icon: Activity, color: "text-purple-400", border: "border-purple-500/30" }
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.title}
            className={`glass-panel p-6 rounded-2xl border ${stat.border} bg-slate-900/40 relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-pixel text-slate-500 uppercase tracking-wider">{stat.title}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <h3 className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Grid Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Stats: CPU and Core load */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-panel border border-slate-800 p-6 rounded-2xl shadow-xl bg-slate-900/40 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
              <h4 className="text-xs font-pixel text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                Virtual Host Matrix
              </h4>
              <RefreshCw className="w-4 h-4 text-slate-500 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            {/* Simulated Server Cores Load */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Cluster Load Capacity</span>
                  <span className="text-cyan-400 font-bold">{sysLoad}%</span>
                </div>
                <div className="w-full h-3 bg-slate-950 border border-slate-850 rounded-full overflow-hidden p-0.5">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                    animate={{ width: `${sysLoad}%` }}
                    transition={{ type: "spring", stiffness: 80 }}
                  />
                </div>
              </div>

              {/* Grid of Virtual Cores */}
              <div className="pt-4">
                <p className="text-[10px] font-pixel text-slate-500 uppercase tracking-wider mb-3">Processor Cores Allocation</p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {Array.from({ length: 16 }).map((_, idx) => {
                    // Give cores different dynamic loads
                    const coreLoad = Math.min(100, Math.max(0, Math.floor(sysLoad + (Math.random() * 40 - 20))));
                    
                    return (
                      <div 
                        key={idx} 
                        className={`border p-2.5 rounded-lg text-center font-mono space-y-1 bg-slate-950/80 ${
                          coreLoad > 85 
                            ? "border-red-500/40 bg-red-950/10" 
                            : coreLoad > 60 
                              ? "border-yellow-500/30" 
                              : "border-slate-800"
                        }`}
                      >
                        <p className="text-[8px] text-slate-500 font-pixel">C{idx.toString().padStart(2, '0')}</p>
                        <p className={`text-xs font-bold ${
                          coreLoad > 85 
                            ? "text-red-400 animate-pulse" 
                            : coreLoad > 60 
                              ? "text-yellow-400" 
                              : "text-green-400"
                        }`}>{coreLoad}%</p>
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
          <div className="glass-panel border border-slate-800 p-6 rounded-2xl shadow-xl bg-slate-900/40 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 mb-6">
                <h4 className="text-xs font-pixel text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-purple-400" />
                  Cluster Storage
                </h4>
                <span className="text-[9px] font-mono bg-purple-950 text-purple-400 border border-purple-800/40 px-2 py-0.5 rounded uppercase tracking-wider">OK</span>
              </div>

              <div className="space-y-6 font-mono text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Sector Allocation</span>
                  <span className="text-slate-200">854.2 GB / 1024 GB</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Data Redundancy</span>
                  <span className="text-green-400">3x Replication Active</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Active Workers Connected</span>
                  <span className="text-cyan-400">5 Autonomous Nodes</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Pipeline Task Latency</span>
                  <span className="text-slate-200">&lt; 45ms</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-850 mt-8">
              <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-950/40 border border-pink-500/40 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-pink-400 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold font-sans text-slate-200">Auto-Optimization Active</p>
                  <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Matrix load balanced dynamically</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
