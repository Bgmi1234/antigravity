"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getEmployee, updateEmployee, getEmployeeSteps, createWorkflowStep, Employee, WorkflowStep } from "@/services/api";
import EmployeeForm from "@/components/employees/EmployeeForm";
import Link from "next/link";
import { ArrowLeft, Terminal, AlertTriangle, Plus, ListOrdered } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const employeeId = parseInt(resolvedParams.id, 10);

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Step Form State
  const [newStepInstruction, setNewStepInstruction] = useState("");
  const [isAddingStep, setIsAddingStep] = useState(false);

  useEffect(() => {
    if (!employeeId) return;
    
    const fetchData = async () => {
      try {
        const empData = await getEmployee(employeeId);
        setEmployee(empData);
        
        const stepsData = await getEmployeeSteps(employeeId);
        setSteps(stepsData);
      } catch (err: any) {
        setPageError(err.message || "Failed to load employee details.");
      } finally {
        setIsPageLoading(false);
      }
    };
    
    fetchData();
  }, [employeeId]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateEmployee = async (data: Partial<Employee>) => {
    setIsUpdating(true);
    setPageError(null);
    try {
      const updated = await updateEmployee(employeeId, data);
      setEmployee(updated);
      showToast("Node configuration updated successfully");
    } catch (err: any) {
      setPageError(err.message || "Failed to update node");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepInstruction.trim()) return;
    
    setIsAddingStep(true);
    try {
      const stepOrder = steps.length > 0 ? Math.max(...steps.map(s => s.step_order)) + 1 : 1;
      const newStep = await createWorkflowStep(employeeId, {
        step_order: stepOrder,
        instruction: newStepInstruction
      });
      setSteps([...steps, newStep]);
      setNewStepInstruction("");
      showToast("Protocol step added");
    } catch (err: any) {
      setPageError(err.message || "Failed to add protocol step");
    } finally {
      setIsAddingStep(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="font-mono text-cyan-500 text-sm animate-pulse">DECRYPTING DATA...</p>
      </div>
    );
  }

  if (pageError && !employee) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="glass-panel p-8 rounded-2xl max-w-md text-center border-red-500/30">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-pixel text-slate-100 mb-2">ACCESS DENIED</h2>
          <p className="text-slate-400 font-mono text-sm mb-6">{pageError}</p>
          <Link href="/employees" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-mono text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            RETURN TO NETWORK
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 z-50 bg-cyan-950/90 border border-cyan-500/50 text-cyan-400 px-4 py-3 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] font-mono text-sm backdrop-blur-md"
          >
            SYS_MSG: {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4">
        <Link href="/employees" className="bg-slate-900/50 hover:bg-slate-800 border border-slate-700 text-slate-400 p-2 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-pixel text-slate-100 tracking-tight uppercase flex items-center gap-3">
            {employee?.avatar && (
              <img src={employee.avatar} alt="avatar" className="w-8 h-8 rounded-md bg-slate-900 border border-slate-700" />
            )}
            {employee?.name} Configuration
          </h1>
          <p className="text-sm text-cyan-400 font-mono mt-1">NODE_ID: {employee?.id.toString().padStart(4, '0')} | INIT: {employee?.created_at && new Date(employee.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      {pageError && (
        <div className="bg-red-950/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-mono text-sm">SYS_ERROR: {pageError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Edit Employee */}
        <div className="lg:col-span-2">
          {employee && (
            <EmployeeForm 
              initialData={employee}
              onSubmit={handleUpdateEmployee}
              isLoading={isUpdating}
              submitLabel="SYNC CONFIGURATION"
            />
          )}
        </div>

        {/* Right Column: Workflow Steps */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 border-slate-700/50 h-[600px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            
            <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4">
              <ListOrdered className="w-5 h-5 text-indigo-400" />
              <div>
                <h2 className="font-pixel text-sm text-indigo-400 uppercase tracking-widest">Protocol Sequence</h2>
                <p className="text-xs text-slate-500 font-mono mt-1">Automated execution steps</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar mb-6">
              {steps.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-700 rounded-xl bg-slate-900/30">
                  <Terminal className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 font-mono text-xs uppercase">No protocols established</p>
                </div>
              ) : (
                steps.map((step, idx) => (
                  <div key={step.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex gap-4 group hover:border-indigo-500/30 transition-colors">
                    <div className="w-6 h-6 rounded-md bg-indigo-950 border border-indigo-500/50 text-indigo-400 flex items-center justify-center text-xs font-mono shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-300 font-mono leading-relaxed">{step.instruction}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddStep} className="mt-auto border-t border-slate-800 pt-4 space-y-3">
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Append Protocol Step</label>
              <textarea
                value={newStepInstruction}
                onChange={(e) => setNewStepInstruction(e.target.value)}
                placeholder="Declare new instruction..."
                rows={2}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm resize-none custom-scrollbar"
              />
              <button
                type="submit"
                disabled={isAddingStep || !newStepInstruction.trim()}
                className="w-full bg-indigo-950/40 border border-indigo-500/50 text-indigo-400 hover:bg-indigo-900/60 font-bold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 neon-text-purple uppercase tracking-widest text-xs"
              >
                {isAddingStep ? "WRITING TO DISK..." : "APPEND PROTOCOL"}
                {!isAddingStep && <Plus className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
}
