"use client";

import { useEffect, useState, useRef } from "react";
import { getEmployees } from "@/services/api";
import { Employee } from "@/types";
import { EmployeeCard } from "@/components/employees/employee-card";
import { Server, Users, CheckCircle, Activity, Terminal, AlertTriangle, Zap, HardDrive, Cpu, Play, Trash2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [role, setRole] = useState<"admin" | "user">("admin");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fake logs for Admin feed
  const [logs, setLogs] = useState<{ id: number; text: string; type: string; time: string }[]>([
    { id: 1, type: "system", text: "SYSTEM.OS v9.4 Initialized", time: "09:00" },
    { id: 2, type: "info", text: "Daily backup completed.", time: "09:05" },
    { id: 3, type: "agent", text: "Agent 'Alpha' started data scrape.", time: "10:12" },
  ]);

  // Operator Station Live Logs & Inputs
  const [operatorLogs, setOperatorLogs] = useState<{ text: string; type: "sys" | "out" | "err" }[]>([
    { text: "Sim.OS operator terminal version 9.4.2 active.", type: "sys" },
    { text: "Connected securely to host: aws-1-ap-southeast-2.pooler.supabase.com", type: "sys" },
    { text: "Awaiting operator protocol input. Type 'help' for command registry.", type: "out" },
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("emplod_role") as "admin" | "user" | null;
    if (savedRole) {
      setRole(savedRole);
    }

    const handleRoleChange = () => {
      const updatedRole = localStorage.getItem("emplod_role") as "admin" | "user" | null;
      if (updatedRole) {
        setRole(updatedRole);
      }
    };
    window.addEventListener("role-change", handleRoleChange);
    return () => window.removeEventListener("role-change", handleRoleChange);
  }, []);

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

  // Simulate incoming logs for Admin Command Center
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

  // Auto scroll operator terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [operatorLogs]);

  const activeAgents = employees.filter(e => e.status === "Active").length;
  const trainingAgents = employees.filter(e => e.status === "Training").length;
  const computeUsage = Math.floor((activeAgents / (employees.length || 1)) * 100);

  // Trigger simulated cascade execution sequence
  const runSequence = () => {
    setOperatorLogs(prev => [
      ...prev,
      { text: ">> INITIALIZING AUTOMATION PIPELINE...", type: "sys" },
    ]);

    const steps = [
      "ESTABLISHING SECURE PROTOCOL HANDSHAKE... [OK]",
      "LOADING AI NEURAL SYNAPSE WEIGHTS [llama3.1]... [OK]",
      "FETCHING ACTIVE GOAL PARAMETERS... [FOUND]",
      "NODE CORES OPERATING AT 82% CAPACITY [TEMP OPTIMAL]",
      "SCRAPING SPECIFIED DOM TARGETS... [5/5 PAGES COMPLETED]",
      "WRITING DATA BATCHES BACK TO SUPABASE... [PERSISTED]",
      ">> ROUTINE EXECUTION PIPELINE FULLY COMPLETED. STATUS: GREEN."
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setOperatorLogs(prev => [
          ...prev,
          { text: step, type: step.startsWith(">>") || step.includes("[OK]") ? "sys" : "out" }
        ]);
      }, (index + 1) * 600);
    });
  };

  // Handle Interactive Terminal Inputs
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const input = terminalInput.trim().toLowerCase();
    const newLogs = [...operatorLogs, { text: `> ${terminalInput}`, type: "out" as const }];
    setOperatorLogs(newLogs);
    setTerminalInput("");

    setTimeout(() => {
      if (input === "help") {
        setOperatorLogs(prev => [
          ...prev,
          { text: "Sim.OS Operator Registry Commands:", type: "sys" },
          { text: "  status   : Display local core calibrations, memory buffers & node nodes", type: "out" },
          { text: "  execute  : Run routine diagnostic sequence & pipeline script", type: "out" },
          { text: "  clear    : Wipe visual log buffers", type: "out" },
          { text: "  help     : Open this utility guide", type: "out" },
        ]);
      } else if (input === "status") {
        setOperatorLogs(prev => [
          ...prev,
          { text: "CALIBRATION STATUS: OPTIMAL", type: "sys" },
          { text: `  Primary host : aws-1-ap-southeast-2.pooler.supabase.com`, type: "out" },
          { text: `  Active Nodes : ${employees.length} deployed on office floor`, type: "out" },
          { text: "  Thermal Index: 42°C (Optimal CPU limit)", type: "out" },
          { text: "  Ollama local : http://localhost:11434 (Connected: llama3.1)", type: "out" },
        ]);
      } else if (input === "execute") {
        runSequence();
      } else if (input === "clear") {
        setOperatorLogs([]);
      } else {
        setOperatorLogs(prev => [
          ...prev,
          { text: `Operator command '${input}' registered. Sending task context to central model...`, type: "sys" },
          { text: `Sim.OS Response: Central model processed prompt context safely. Command action logged.`, type: "out" },
        ]);
      }
    }, 300);
  };

  const isUser = role === "user";

  // ----------------------------------------------------
  // 1. ADMIN USER INTERFACE (CEO Command Center)
  // ----------------------------------------------------
  if (!isUser) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-12 relative z-10 font-sans text-slate-800">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white/70 p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div>
            <h2 className="text-3xl font-bold font-pixel text-slate-850 uppercase tracking-tight mb-2 flex items-center gap-3">
              <Server className="w-8 h-8 text-indigo-600" />
              Command Center
            </h2>
            <p className="text-indigo-600 font-mono text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Supervisor Active
            </p>
          </div>
          <div className="text-right font-mono">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Company Funds</p>
            <p className="text-2xl font-bold text-emerald-600">$2,450,900</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span className="font-mono text-xs font-bold">CRITICAL_ERROR: {error}</span>
          </div>
        )}

        {/* Analytics Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 font-sans">
          {[
            { label: "Active Nodes", value: isLoading ? "..." : `${activeAgents}/${employees.length}`, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", progress: (activeAgents/(employees.length||1))*100 },
            { label: "Compute Load", value: isLoading ? "..." : `${computeUsage}%`, icon: Cpu, color: "text-purple-600", bg: "bg-purple-50", progress: computeUsage },
            { label: "Network IO", value: "1.2 TB/s", icon: Activity, color: "text-pink-600", bg: "bg-pink-50", progress: 65 },
            { label: "Storage Cap", value: "85%", icon: HardDrive, color: "text-amber-600", bg: "bg-amber-50", progress: 85 }
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={stat.label} 
              className="bg-white/80 p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-all"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon className={`w-16 h-16 ${stat.color}`} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <p className="text-[9px] font-pixel text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
                <h3 className={`text-2xl font-bold font-mono mt-1 ${stat.color}`}>{stat.value}</h3>
                
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn("h-full", stat.color.replace('text-', 'bg-'))}
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
            <div className="flex items-center justify-between mb-4 bg-white/70 p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <h3 className="text-xs font-pixel text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Office Floor Nodes
              </h3>
              <div className="flex gap-4 text-[10px] font-mono">
                <span className="text-emerald-600 flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 
                  {activeAgents} Online
                </span>
                <span className="text-amber-600 flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> 
                  {trainingAgents} Training
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white/50 border border-slate-200 rounded-2xl h-48 animate-pulse" />
                ))}
              </div>
            ) : employees.length === 0 ? (
              <div className="bg-white/50 rounded-2xl p-16 text-center border-2 border-dashed border-slate-200 relative overflow-hidden">
                <Terminal className="w-16 h-16 text-slate-300 mx-auto mb-6 relative z-10" />
                <p className="text-slate-400 font-pixel text-xs uppercase tracking-widest relative z-10 mb-6">NO ACTIVE AGENTS DEPLOYED</p>
                <Link href="/employees/new" className="relative z-10 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold font-mono text-xs tracking-widest shadow-md shadow-indigo-100 transition-colors uppercase">
                  Purchase Node
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {employees.map((employee, i) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
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
            <div className="flex items-center justify-between mb-4 bg-white/70 p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <h3 className="text-xs font-pixel text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Live Feed
              </h3>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            </div>

            {/* Dark contrasting activity feed terminal view */}
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-[10px] overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.85)] min-h-[400px]">
              <div className="absolute inset-0 bg-scanlines opacity-10 pointer-events-none z-10"></div>
              
              <div className="space-y-3 overflow-y-auto h-full custom-scrollbar pr-2 relative z-20">
                <AnimatePresence>
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-2.5 border-b border-slate-800/40 pb-2.5"
                    >
                      <span className="text-slate-600 shrink-0">[{log.time}]</span>
                      <span className={cn(
                        "font-bold shrink-0",
                        log.type === 'alert' ? 'text-rose-400' : 
                        log.type === 'agent' ? 'text-indigo-400' : 
                        'text-emerald-400'
                      )}>
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

  // ----------------------------------------------------
  // 2. STANDARD OPERATOR USER INTERFACE (White Glass Workstation)
  // ----------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 relative z-10 font-mono text-slate-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white/70 p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div>
          <h2 className="text-3xl font-bold font-pixel text-slate-800 uppercase tracking-tight mb-2 flex items-center gap-3">
            <Terminal className="w-8 h-8 text-emerald-500" />
            Operator Workstation
          </h2>
          <p className="text-emerald-600 font-mono text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Deck_04 Secured Line
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Synchronicity</p>
          <p className="text-xl font-bold text-emerald-600 font-sans">98.4% [SYS OK]</p>
        </div>
      </div>

      {/* Operator Dials */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Stress Load", value: "24% [LOW]", progress: 24 },
          { label: "Neural Sync Speed", value: "880 MB/s", progress: 88 },
          { label: "Local model Buffer", value: "llama3.1 [OK]", progress: 100 },
          { label: "Session Counter", value: "04:12:30 UPTIME", progress: 75 }
        ].map((dial, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            key={dial.label}
            className="bg-white/80 p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group"
          >
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{dial.label}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <p className="text-lg font-bold text-slate-800">{dial.value}</p>
              
              {/* Progress Dotted dial */}
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                {Array.from({ length: 10 }).map((_, stepIdx) => (
                  <div 
                    key={stepIdx} 
                    className={cn(
                      "h-full flex-1 transition-all duration-300",
                      stepIdx * 10 < dial.progress ? "bg-emerald-500" : "bg-slate-200"
                    )}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Operator Command Viewport */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Full-screen terminal command prompt shell */}
        <div className="xl:col-span-2 space-y-4 flex flex-col">
          <div className="flex items-center justify-between bg-white/70 p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <h3 className="text-xs font-pixel text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Terminal Console Command Prompt
            </h3>
            
            <button
              onClick={runSequence}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-[9px] font-bold font-mono uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-100 border-transparent"
            >
              <Play className="w-3.5 h-3.5 fill-current text-white" />
              Execute Sequencer
            </button>
          </div>

          {/* Focused dark retro terminal shell */}
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col h-[480px] shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] relative overflow-hidden">
            <div className="absolute inset-0 bg-scanlines opacity-10 pointer-events-none z-10"></div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-2 z-20 text-[10px] leading-relaxed">
              {operatorLogs.map((log, index) => (
                <div 
                  key={index}
                  className={cn(
                    "break-words font-mono",
                    log.type === "sys" ? "text-emerald-400 font-bold" :
                    log.type === "err" ? "text-rose-400 font-bold" : "text-slate-300"
                  )}
                >
                  {log.text}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleTerminalSubmit} className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-3 z-20">
              <span className="text-emerald-400 font-bold text-sm animate-pulse">&gt;_</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type 'help' or enter operator prompt sequence..."
                className="flex-1 bg-transparent border-none outline-none text-emerald-400 font-mono text-[11px] focus:ring-0 focus:outline-none placeholder:text-slate-700"
              />
              <button
                type="submit"
                className="p-2 bg-slate-900 border border-slate-800 text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right 1 Column: Assigned Node Operations List */}
        <div className="xl:col-span-1 space-y-4">
          <div className="flex items-center justify-between bg-white/70 p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <h3 className="text-xs font-pixel text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              Assigned Node Units
            </h3>
          </div>

          <div className="bg-white/50 border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm h-[480px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white/80 border border-slate-150 rounded-xl h-20 animate-pulse" />
                ))}
              </div>
            ) : employees.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-12 uppercase tracking-widest font-bold">No active units deployed by supervisor.</p>
            ) : (
              <div className="space-y-3">
                {employees.map((employee) => (
                  <div 
                    key={employee.id}
                    className="p-3.5 bg-white border border-slate-200/85 rounded-xl flex items-center justify-between hover:border-emerald-300 transition-colors duration-200 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-150 flex items-center justify-center font-pixel text-[10px] font-bold text-emerald-600">
                        {employee.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 font-sans">{employee.name}</p>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">{employee.department}</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-150 uppercase tracking-wider font-bold">ONLINE</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
