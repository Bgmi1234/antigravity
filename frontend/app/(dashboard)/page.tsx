"use client";

import { useEffect, useState } from "react";
import { getEmployees } from "@/services/api";
import { Employee } from "@/types";
import { EmployeeCard } from "@/components/employees/employee-card";
import { Server, Users, CheckCircle, Activity, Terminal, AlertTriangle, Zap, HardDrive } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fake logs for the activity feed
  const [logs, setLogs] = useState<{ id: number; text: string; type: string; time: string }[]>([
    { id: 1, type: "system", text: "SYSTEM.OS v9.4 Initialized", time: "09:00" },
    { id: 2, type: "info", text: "Daily backup completed.", time: "09:05" },
    { id: 3, type: "agent", text: "Agent 'Alpha' started data scrape.", time: "10:12" },
  ]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (err: any) {
        setError(err.message || "Failed to load employees.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Simulate incoming logs
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newLog = {
          id: Date.now(),
          type: Math.random() > 0.8 ? "alert" : "agent",
          text: Math.random() > 0.8 ? "High CPU usage detected on Node 3." : "Agent completed routine task.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        setLogs(prev => [newLog, ...prev].slice(0, 10)); // keep last 10
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const activeAgents = employees.filter(e => e.status === "Active").length;
  const trainingAgents = employees.filter(e => e.status === "Training").length;
  const computeUsage = Math.floor((activeAgents / (employees.length || 1)) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-inner bg-animated-grid">
        <div>
          <h2 className="text-3xl font-bold font-pixel text-slate-100 uppercase tracking-tight mb-2 flex items-center gap-3">
            <Server className="w-8 h-8 text-cyan-400" />
            Command Center
          </h2>
          <p className="text-cyan-400 font-mono text-sm uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Monitoring Active
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Company Funds</p>
          <p className="text-2xl font-bold font-mono text-green-400 neon-text-cyan">$2,450,900</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/80 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-mono text-sm">CRITICAL_ERROR: {error}</span>
        </div>
      )}

      {/* Analytics Widgets (Tycoon Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Active Nodes", value: isLoading ? "..." : `${activeAgents}/${employees.length}`, icon: Users, color: "text-cyan-400", border: "neon-border-cyan", progress: (activeAgents/(employees.length||1))*100 },
          { label: "Compute Load", value: isLoading ? "..." : `${computeUsage}%`, icon: CpuIcon, color: "text-purple-400", border: "neon-border-purple", progress: computeUsage },
          { label: "Network IO", value: "1.2 TB/s", icon: Activity, color: "text-pink-400", border: "border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.3)]", progress: 65 },
          { label: "Storage Cap", value: "85%", icon: HardDrive, color: "text-yellow-400", border: "border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]", progress: 85 }
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className={`bg-slate-900/80 p-5 rounded-xl border ${stat.border} relative overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className={`w-16 h-16 ${stat.color}`} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <p className="text-[10px] font-pixel text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
              <h3 className={`text-2xl font-bold font-mono mt-1 ${stat.color}`}>{stat.value}</h3>
              
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${stat.color.replace('text-', 'bg-')}`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Office Floor & Terminal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left: Office Floor */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <h3 className="text-sm font-pixel text-slate-100 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Office Floor
            </h3>
            <div className="flex gap-4 text-xs font-mono">
              <span className="text-green-400 flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full"></span> {activeAgents} Online</span>
              <span className="text-yellow-400 flex items-center gap-1"><span className="w-2 h-2 bg-yellow-400 rounded-full"></span> {trainingAgents} Training</span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-slate-900/50 rounded-xl h-48 animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : employees.length === 0 ? (
            <div className="bg-slate-900/50 rounded-2xl p-16 text-center border-2 border-dashed border-slate-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-scanlines opacity-50"></div>
              <Terminal className="w-16 h-16 text-slate-600 mx-auto mb-6 relative z-10" />
              <p className="text-slate-400 font-pixel text-sm uppercase tracking-widest relative z-10 mb-6">NO AGENTS DEPLOYED</p>
              <Link href="/employees/new" className="relative z-10 bg-cyan-950 border border-cyan-500 text-cyan-400 px-6 py-3 rounded uppercase font-bold text-xs tracking-widest pixel-button hover:bg-cyan-900 transition-colors">
                Purchase Node
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {employees.map((employee, i) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={employee.id}
                  className="h-full"
                >
                  <EmployeeCard employee={employee} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Live Activity Feed */}
        <div className="xl:col-span-1 flex flex-col h-full max-h-[800px]">
          <div className="flex items-center justify-between mb-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <h3 className="text-sm font-pixel text-purple-400 uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Live Feed
            </h3>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
          </div>

          <div className="flex-1 bg-[#050510] border-2 border-slate-800 rounded-xl p-4 font-mono text-xs overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
            <div className="absolute inset-0 bg-scanlines opacity-30 pointer-events-none z-10"></div>
            
            <div className="space-y-3 overflow-y-auto h-full custom-scrollbar pr-2 relative z-20">
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-3 border-b border-slate-800/50 pb-2"
                  >
                    <span className="text-slate-600 shrink-0">[{log.time}]</span>
                    <span className={`${
                      log.type === 'alert' ? 'text-red-400' : 
                      log.type === 'agent' ? 'text-cyan-400' : 
                      'text-green-400'
                    }`}>
                      {log.type === 'alert' ? 'WARN:' : log.type === 'agent' ? 'EXEC:' : 'SYS:'}
                    </span>
                    <span className="text-slate-300 break-words">{log.text}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper icon component
function CpuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  )
}
