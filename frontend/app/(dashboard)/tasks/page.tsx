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
    { id: 2, text: "Flush active cache buffers from PostgreSQL session pooler", status: "completed", loader: false },
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
      <div className="max-w-7xl mx-auto space-y-8 pb-12 relative z-10 font-sans text-slate-800">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white/70 p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div>
            <h2 className="text-3xl font-bold font-pixel text-slate-850 uppercase tracking-tight mb-2 flex items-center gap-3">
              <Layers className="w-8 h-8 text-indigo-650" />
              Task Queue
            </h2>
            <p className="text-indigo-600 font-mono text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Automated Task Orchestrator
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm font-mono text-xs font-bold">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span>CRITICAL_ERROR: {error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Option Card: Submit Prompt */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/85 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-xs font-pixel text-slate-450 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-500" />
                  Mission Dispatcher
                </h3>
                <p className="text-xs text-slate-500 font-mono leading-relaxed mt-2">
                  Type a task and let the EMPLOD AI model organize your employees, allocate budgets, and structure step-by-step pipelines automatically.
                </p>
              </div>

              <form onSubmit={handlePlanTask} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">MISSION TASK DESCRIPTION</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'Create a targeted marketing plan for our new SaaS platform'..."
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-mono text-xs leading-relaxed placeholder-slate-400 shadow-inner"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed uppercase font-mono text-xs tracking-wider cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Generating Plan...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Plan Mission</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Details Card: Plan View & Live Simulation */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {!currentTask && !loading && (
                <div className="bg-white/40 rounded-2xl p-16 text-center border border-slate-200/80 relative overflow-hidden h-full flex flex-col items-center justify-center min-h-[400px]">
                  <Server className="w-16 h-16 text-slate-300 mb-4 animate-pulse" />
                  <p className="text-slate-400 font-pixel text-[10px] uppercase tracking-widest font-bold">System idle. Awaiting mission entry...</p>
                </div>
              )}

              {currentTask && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white/80 border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <p className="text-[9px] font-pixel text-indigo-500 uppercase tracking-widest font-bold">Active Mission #{currentTask.task_id}</p>
                        <h3 className="text-xl font-bold font-mono text-slate-800 uppercase tracking-tight mt-1">{currentTask.task_summary}</h3>
                      </div>
                      
                      {!simulating ? (
                        <button
                          onClick={startSimulation}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-100 uppercase font-mono text-xs tracking-wider cursor-pointer border-transparent"
                        >
                          <Play className="w-4 h-4 fill-current text-white" />
                          <span>Deploy Simulation</span>
                        </button>
                      ) : (
                        <div className="bg-indigo-50 border border-indigo-200 text-indigo-650 font-mono text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 font-bold">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                          <span className="uppercase tracking-widest">Simulating Execution...</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-center">
                        <p className="text-[9px] font-pixel text-slate-400 uppercase tracking-widest mb-1 font-bold">Allocated Staff</p>
                        <p className="text-xl font-bold font-mono text-indigo-600">{currentTask.employee_count} Nodes</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-center">
                        <p className="text-[9px] font-pixel text-slate-400 uppercase tracking-widest mb-1 font-bold">Charge Required</p>
                        <p className="text-xl font-bold font-mono text-rose-500">{currentTask.charge_required ? "YES" : "NO"}</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-center">
                        <p className="text-[9px] font-pixel text-slate-400 uppercase tracking-widest mb-1 font-bold">Sim Price</p>
                        <p className="text-xl font-bold font-mono text-emerald-600">${currentTask.estimated_price}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <h4 className="text-xs font-pixel text-slate-450 uppercase tracking-widest mb-6 flex items-center gap-2 font-bold">
                      <Shield className="w-4 h-4 text-indigo-500" />
                      Orchestrated Pipeline Sequence
                    </h4>

                    <div className="space-y-4">
                      {currentTask.workflow_plan.map((step, idx) => {
                        const isActive = activeStepIndex === idx;
                        const isDone = activeStepIndex > idx;
                        
                        return (
                          <div 
                            key={idx}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-xl border transition-all duration-300",
                              isActive 
                                ? "bg-indigo-50/60 border-indigo-300 shadow-sm" 
                                : isDone
                                  ? "bg-slate-50 border-emerald-250 text-slate-500 opacity-80"
                                  : "bg-slate-50/30 border-slate-150 text-slate-400 opacity-60"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-lg border-2 flex items-center justify-center font-mono text-xs font-bold shrink-0",
                              isActive
                                ? "bg-indigo-100 border-indigo-305 text-indigo-700"
                                : isDone
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                                  : "bg-slate-100 border-slate-200 text-slate-400"
                            )}>
                              {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : idx + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-xs font-mono tracking-wide leading-relaxed",
                                isActive ? "text-indigo-800 font-bold" : isDone ? "text-slate-400 line-through" : "text-slate-500"
                              )}>
                                {step}
                              </p>
                            </div>

                            {isActive && (
                              <span className="text-[9px] font-pixel text-indigo-500 uppercase tracking-widest animate-pulse font-bold">Active</span>
                            )}
                          </div>
                        );
                      })}

                      {activeStepIndex === currentTask.workflow_plan.length && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-emerald-50 border border-emerald-350 p-4 rounded-xl text-center flex items-center justify-center gap-3 shadow-sm"
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span className="font-pixel text-[10px] text-emerald-600 uppercase tracking-widest font-bold">MISSION COMPLETED SUCCESSFULLY</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/80 border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <h4 className="text-xs font-pixel text-slate-450 uppercase tracking-widest mb-6 flex items-center gap-2 font-bold">
                      <Users className="w-4 h-4 text-indigo-500" />
                      Allocated Workforce Load
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {simEmployees.map((emp) => {
                        const isWorking = emp.status === "working";
                        const isFinished = emp.status === "done";
                        
                        return (
                          <div 
                            key={emp.id}
                            className={cn(
                              "bg-slate-50 border p-4 rounded-xl flex flex-col justify-between space-y-3 transition-colors",
                              isWorking 
                                ? "border-indigo-200 bg-indigo-50/40" 
                                : isFinished 
                                  ? "border-emerald-250 bg-emerald-50/40"
                                  : "border-slate-200"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-bold text-slate-800 font-sans">{emp.role}</p>
                                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">{emp.current_task}</p>
                              </div>
                              <span className={cn(
                                "text-[9px] font-pixel px-2 py-0.5 rounded border uppercase tracking-wider font-bold",
                                isWorking 
                                  ? "bg-indigo-100 text-indigo-650 border-indigo-200 animate-pulse" 
                                  : isFinished 
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                    : "bg-slate-200 text-slate-400 border-slate-250"
                              )}>
                                {emp.status}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 font-semibold">
                                <span>Process</span>
                                <span>{emp.progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full transition-all duration-300",
                                    isWorking ? "bg-indigo-600" : isFinished ? "bg-emerald-500" : "bg-slate-400"
                                  )}
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
    <div className="max-w-5xl mx-auto space-y-8 pb-12 relative z-10 font-mono text-slate-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white/70 p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div>
          <h2 className="text-3xl font-bold font-pixel text-slate-800 uppercase tracking-tight mb-2 flex items-center gap-3">
            <Layers className="w-8 h-8 text-emerald-500" />
            My Operating Checklists
          </h2>
          <p className="text-emerald-600 font-mono text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Daily Task Protocols Registry
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Queue Backlog</p>
          <p className="text-xl font-bold text-emerald-600">{pendingTasksCount} Protocols Pending</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Station Manual Instructions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/80 border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-xs font-pixel text-slate-800 uppercase tracking-widest flex items-center gap-2 font-bold">
              <Shield className="w-4 h-4 text-emerald-500" />
              Station Rules
            </h3>
            
            <div className="space-y-4 text-[11px] leading-relaxed text-slate-500">
              <p>
                <strong className="text-slate-700">Protocol 01:</strong> Ensure local Ollama model weight allocations match Supervisor targets before starting execution routines.
              </p>
              <p>
                <strong className="text-slate-700">Protocol 02:</strong> Periodic PostgreSQL pooler flushes are required to clear locked terminal threads from memory boards.
              </p>
              <p>
                <strong className="text-slate-700">Protocol 03:</strong> In the event of system error states (RED status), clear visual console buffers and run diagnostics directly.
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
                  "p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 bg-white relative overflow-hidden shadow-sm",
                  isCompleted 
                    ? "border-emerald-150 opacity-80" 
                    : "border-slate-200 hover:border-emerald-350 shadow-sm"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[10px] font-bold shrink-0",
                    isCompleted 
                      ? "bg-emerald-50 border-emerald-350 text-emerald-600" 
                      : "bg-slate-50 border-slate-200 text-slate-400"
                  )}>
                    {isCompleted ? "✓" : "!"}
                  </div>
                  
                  <p className={cn(
                    "text-xs font-mono tracking-wide leading-relaxed",
                    isCompleted ? "text-slate-400 line-through font-semibold" : "text-slate-750"
                  )}>
                    {task.text}
                  </p>
                </div>

                <div>
                  {isCompleted ? (
                    <span className="text-[9px] font-pixel text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg uppercase tracking-widest font-bold">COMPLETED</span>
                  ) : (
                    <button
                      onClick={() => runOperatorTask(task.id)}
                      disabled={task.loader}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-[9px] font-bold font-mono uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-100 disabled:opacity-50 border-transparent"
                    >
                      {task.loader ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>RUNNING...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 text-white fill-current animate-pulse" />
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
