"use client";

import { useState, useEffect } from "react";
import { planTask, TaskPlanResponse, TaskEmployeeStatus } from "@/services/api";
import { Play, Sparkles, Terminal, CheckCircle2, Loader2, AlertTriangle, ArrowRight, Server, Shield, Layers, Users, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TaskQueuePage() {
  const [role, setRole] = useState<"admin" | "user">("admin");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTask, setCurrentTask] = useState<TaskPlanResponse | null>(null);
  
  // Simulation states
  const [simulating, setSimulating] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [simEmployees, setSimEmployees] = useState<TaskEmployeeStatus[]>([]);

  // Operator task checklist states
  const [operatorTasks, setOperatorTasks] = useState([
    { id: 1, text: "Synchronize local weights file on Ollama nodes", status: "completed", loader: false },
    { id: 2, text: "Flush active cache buffers from Postgres session pooler", status: "completed", loader: false },
    { id: 3, text: "Run routine data pipeline diagnostics sequence", status: "pending", loader: false },
    { id: 4, text: "Re-index Supabase database schemas for network operators", status: "pending", loader: false },
  ]);

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

  const handlePlanTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setCurrentTask(null);
    setSimulating(false);
    setActiveStepIndex(-1);

    try {
      const plan = await planTask(prompt);
      setCurrentTask(plan);
      setSimEmployees(plan.employees_needed);
    } catch (err: any) {
      setError(err.message || "Failed to generate task workflow plan.");
    } finally {
      setLoading(false);
    }
  };

  const startSimulation = () => {
    if (!currentTask) return;
    setSimulating(true);
    setActiveStepIndex(0);

    let currentStep = 0;
    const totalSteps = currentTask.workflow_plan.length;
    const updatedEmployees = [...currentTask.employees_needed];
    
    const interval = setInterval(() => {
      if (currentStep < totalSteps) {
        setActiveStepIndex(currentStep);
        const empIndex = currentStep % updatedEmployees.length;
        
        if (currentStep > 0) {
          const prevEmpIndex = (currentStep - 1) % updatedEmployees.length;
          updatedEmployees[prevEmpIndex].status = "done";
          updatedEmployees[prevEmpIndex].progress = 100;
        }

        updatedEmployees[empIndex].status = "working";
        updatedEmployees[empIndex].progress = 20;
        setSimEmployees([...updatedEmployees]);

        let progress = 20;
        const progressInterval = setInterval(() => {
          if (progress < 100) {
            progress += 20;
            updatedEmployees[empIndex].progress = progress;
            setSimEmployees([...updatedEmployees]);
          } else {
            clearInterval(progressInterval);
          }
        }, 300);

        currentStep++;
      } else {
        clearInterval(interval);
        updatedEmployees.forEach(e => {
          e.status = "done";
          e.progress = 100;
        });
        setSimEmployees([...updatedEmployees]);
        setActiveStepIndex(totalSteps);
      }
    }, 2500);
  };

  // Run single operator task routine
  const runOperatorTask = (taskId: number) => {
    setOperatorTasks(prev => 
      prev.map(t => t.id === taskId ? { ...t, loader: true } : t)
    );

    setTimeout(() => {
      setOperatorTasks(prev =>
        prev.map(t => t.id === taskId ? { ...t, status: "completed", loader: false } : t)
      );
    }, 1800);
  };

  const isUser = role === "user";

  // ----------------------------------------------------
  // 1. ADMIN USER INTERFACE (Supervisor Planner)
  // ----------------------------------------------------
  if (!isUser) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-12 relative z-10 font-sans">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-inner bg-animated-grid">
          <div>
            <h2 className="text-3xl font-bold font-pixel text-slate-100 uppercase tracking-tight mb-2 flex items-center gap-3">
              <Layers className="w-8 h-8 text-purple-400" />
              Task Queue
            </h2>
            <p className="text-purple-400 font-mono text-sm uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              Automated Task Orchestrator
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/80 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 shadow-[0_0_15px_rgba(239,68,68,0.2)] font-mono text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>CRITICAL_ERROR: {error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
          {/* Left Option Card: Submit Prompt */}
          <div className="lg:col-span-1 space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative glass-panel rounded-2xl p-6 border border-slate-700/50 shadow-2xl space-y-6">
                <div>
                  <h3 className="text-xs font-pixel text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    Mission Dispatcher
                  </h3>
                  <p className="text-xs text-slate-400 font-mono leading-relaxed mt-2">
                    Type a task and let the EMPLOD AI model organize your employees, allocate budgets, and structure step-by-step pipelines automatically.
                  </p>
                </div>

                <form onSubmit={handlePlanTask} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">MISSION TASK DESCRIPTION</label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., 'Create a targeted marketing plan for our new SaaS platform'..."
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono text-xs leading-relaxed placeholder-slate-700"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="w-full bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed uppercase font-mono text-xs tracking-wider"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating Plan...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Plan Mission</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Details Card: Plan View & Live Simulation */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {!currentTask && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-slate-900/30 rounded-2xl p-16 text-center border border-slate-800/80 relative overflow-hidden h-full flex flex-col items-center justify-center min-h-[400px]"
                >
                  <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none"></div>
                  <Server className="w-16 h-16 text-slate-700 mb-4 animate-pulse" />
                  <p className="text-slate-500 font-pixel text-[10px] uppercase tracking-widest">System idle. Awaiting mission entry...</p>
                </motion.div>
              )}

              {currentTask && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="glass-panel border border-slate-800 p-6 rounded-2xl shadow-xl bg-slate-900/40 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
                      <div>
                        <p className="text-[10px] font-pixel text-purple-400 uppercase tracking-widest">Active Mission #{currentTask.task_id}</p>
                        <h3 className="text-xl font-bold font-mono text-slate-100 uppercase tracking-tight mt-1">{currentTask.task_summary}</h3>
                      </div>
                      
                      {!simulating ? (
                        <button
                          onClick={startSimulation}
                          className="bg-green-500 hover:bg-green-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(34,197,94,0.4)] uppercase font-mono text-xs tracking-wider"
                        >
                          <Play className="w-4 h-4 fill-current text-slate-950" />
                          <span>Deploy Simulation</span>
                        </button>
                      ) : (
                        <div className="bg-purple-950/60 border border-purple-500/40 text-purple-400 font-mono text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span className="uppercase tracking-widest font-bold">Simulating Execution...</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex flex-col justify-center">
                        <p className="text-[9px] font-pixel text-slate-500 uppercase tracking-wider mb-1">Allocated Staff</p>
                        <p className="text-xl font-bold font-mono text-cyan-400">{currentTask.employee_count} Nodes</p>
                      </div>
                      <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex flex-col justify-center">
                        <p className="text-[9px] font-pixel text-slate-500 uppercase tracking-wider mb-1">Charge Required</p>
                        <p className="text-xl font-bold font-mono text-pink-400">{currentTask.charge_required ? "YES" : "NO"}</p>
                      </div>
                      <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex flex-col justify-center">
                        <p className="text-[9px] font-pixel text-slate-500 uppercase tracking-wider mb-1">Sim Price</p>
                        <p className="text-xl font-bold font-mono text-green-400">${currentTask.estimated_price}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel border border-slate-800 p-6 rounded-2xl shadow-xl bg-slate-900/40">
                    <h4 className="text-xs font-pixel text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-400" />
                      Orchestrated Pipeline Sequence
                    </h4>

                    <div className="space-y-4">
                      {currentTask.workflow_plan.map((step, idx) => {
                        const isActive = activeStepIndex === idx;
                        const isDone = activeStepIndex > idx;
                        
                        return (
                          <div 
                            key={idx}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                              isActive 
                                ? "bg-purple-950/40 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                                : isDone
                                  ? "bg-slate-900/20 border-green-500/20 opacity-70"
                                  : "bg-slate-950/60 border-slate-800/80 opacity-60"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-mono text-xs font-bold ${
                              isActive
                                ? "bg-purple-900/50 border-purple-500 text-purple-300"
                                : isDone
                                  ? "bg-green-950/50 border-green-500 text-green-400"
                                  : "bg-slate-900 border-slate-700 text-slate-500"
                            }`}>
                              {isDone ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : idx + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-mono tracking-wide ${isActive ? "text-purple-300 font-bold" : isDone ? "text-slate-400 line-through" : "text-slate-500"}`}>
                                {step}
                              </p>
                            </div>

                            {isActive && (
                              <span className="text-[10px] font-pixel text-purple-400 uppercase tracking-widest animate-pulse">Active</span>
                            )}
                          </div>
                        );
                      })}

                      {activeStepIndex === currentTask.workflow_plan.length && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-green-950/30 border border-green-500/40 p-4 rounded-xl text-center flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          <span className="font-pixel text-[10px] text-green-400 uppercase tracking-widest">MISSION COMPLETED SUCCESSFULLY</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="glass-panel border border-slate-800 p-6 rounded-2xl shadow-xl bg-slate-900/40">
                    <h4 className="text-xs font-pixel text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-400" />
                      Allocated Workforce Load
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {simEmployees.map((emp) => {
                        const isWorking = emp.status === "working";
                        const isFinished = emp.status === "done";
                        
                        return (
                          <div 
                            key={emp.id}
                            className={`bg-slate-950/60 border p-4 rounded-xl flex flex-col justify-between space-y-3 transition-colors ${
                              isWorking 
                                ? "border-purple-500/40 bg-purple-950/20" 
                                : isFinished 
                                  ? "border-green-500/20 bg-green-950/5"
                                  : "border-slate-850"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-bold text-slate-200 font-sans">{emp.role}</p>
                                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">{emp.current_task}</p>
                              </div>
                              <span className={`text-[9px] font-pixel px-2 py-0.5 rounded border uppercase tracking-wider ${
                                isWorking 
                                  ? "bg-purple-950 text-purple-400 border-purple-500/30 animate-pulse" 
                                  : isFinished 
                                    ? "bg-green-950 text-green-400 border-green-500/30"
                                    : "bg-slate-900 text-slate-500 border-slate-800"
                              }`}>
                                {emp.status}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                                <span>Process</span>
                                <span>{emp.progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-300 ${isWorking ? "bg-purple-500" : isFinished ? "bg-green-500" : "bg-slate-700"}`}
                                  style={{ width: `${emp.progress}%` }}
                               />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. STANDARD OPERATOR USER INTERFACE (Daily Task List)
  // ----------------------------------------------------
  const pendingTasksCount = operatorTasks.filter(t => t.status === "pending").length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 relative z-10 font-mono text-slate-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-slate-900/40 p-6 rounded-2xl border border-emerald-500/20 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)] relative overflow-hidden">
        <div className="absolute inset-0 bg-scanlines opacity-10 pointer-events-none"></div>
        <div>
          <h2 className="text-3xl font-bold font-pixel text-emerald-400 uppercase tracking-tight mb-2 flex items-center gap-3">
            <Layers className="w-8 h-8 text-emerald-400" />
            My Operating Checklists
          </h2>
          <p className="text-emerald-500 font-mono text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Daily Task Protocols Registry
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Queue Backlog</p>
          <p className="text-xl font-bold text-emerald-400">{pendingTasksCount} Protocols Pending</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Station Manual Instructions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel border border-emerald-500/20 p-6 rounded-2xl shadow-xl bg-slate-950/50 space-y-6">
            <h3 className="text-xs font-pixel text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Station Rules
            </h3>
            
            <div className="space-y-4 text-[11px] leading-relaxed text-slate-400">
              <p>
                <strong className="text-slate-200">Protocol 01:</strong> Ensure local Ollama model weight allocations match Supervisor targets before starting execution routines.
              </p>
              <p>
                <strong className="text-slate-200">Protocol 02:</strong> Periodic PostgreSQL pooler flushes are required to clear locked terminal threads from memory boards.
              </p>
              <p>
                <strong className="text-slate-200">Protocol 03:</strong> In the event of system error states (RED status), clear visual console buffers and run diagnostics directly.
              </p>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Operator checklist items list */}
        <div className="lg:col-span-2 space-y-4">
          {operatorTasks.map((task) => {
            const isCompleted = task.status === "completed";
            
            return (
              <div 
                key={task.id}
                className={cn(
                  "p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 bg-slate-900/40 relative overflow-hidden",
                  isCompleted 
                    ? "border-green-500/20 shadow-[inset_0_0_10px_rgba(16,185,129,0.02)] opacity-80" 
                    : "border-emerald-500/20 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)] hover:border-emerald-500/40"
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Status Indicator circle */}
                  <div className={cn(
                    "w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[10px] font-bold shrink-0",
                    isCompleted 
                      ? "bg-green-950 border-green-500 text-green-400" 
                      : "bg-slate-950 border-emerald-500/30 text-emerald-500/60"
                  )}>
                    {isCompleted ? "✓" : "!"}
                  </div>
                  
                  <p className={cn(
                    "text-xs font-mono tracking-wide leading-relaxed",
                    isCompleted ? "text-slate-500 line-through" : "text-slate-200"
                  )}>
                    {task.text}
                  </p>
                </div>

                <div>
                  {isCompleted ? (
                    <span className="text-[9px] font-pixel text-green-400 bg-green-950 border border-green-500/30 px-3 py-1 rounded uppercase tracking-widest font-bold">COMPLETED</span>
                  ) : (
                    <button
                      onClick={() => runOperatorTask(task.id)}
                      disabled={task.loader}
                      className="bg-emerald-950 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/60 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)] disabled:opacity-50"
                    >
                      {task.loader ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>RUNNING...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 text-emerald-400" />
                          <span>EXECUTE</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
