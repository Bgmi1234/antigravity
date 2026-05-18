"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getEmployee, updateEmployee, getEmployeeSteps, createWorkflowStep, Employee, WorkflowStep } from "@/services/api";
import EmployeeForm from "@/components/employees/EmployeeForm";
import Link from "next/link";
import { ArrowLeft, Terminal, AlertTriangle, Plus, ListOrdered } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
      <div className="flex flex-col items-center justify-center py-32 space-y-4 text-slate-800">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="font-mono text-indigo-600 text-xs font-bold uppercase tracking-widest animate-pulse">Decrypting data...</p>
      </div>
    );
  }

  if (pageError && !employee) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-800">
        <div className="bg-white/80 p-8 rounded-2xl max-w-md text-center border border-slate-200 shadow-xl">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-pixel text-slate-850 mb-2">ACCESS DENIED</h2>
          <p className="text-slate-500 font-mono text-xs mb-6 font-bold uppercase tracking-widest leading-relaxed">{pageError}</p>
          <Link href="/employees" className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg font-mono text-xs font-bold transition-all shadow-sm">
            <ArrowLeft className="w-4 h-4 text-slate-650" />
            RETURN TO NETWORK
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 relative text-slate-800 font-mono text-xs">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 z-50 bg-white/95 border border-slate-200 text-slate-800 px-4 py-3 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.08)] font-mono text-xs font-bold backdrop-blur-md"
          >
            SYS_MSG: {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4">
        <Link href="/employees" className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-650 p-2.5 rounded-lg transition-all shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-pixel text-slate-850 tracking-tight uppercase flex items-center gap-3">
            {employee?.avatar && (
              <img src={employee.avatar} alt="avatar" className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200" />
            )}
            {employee?.name} Configuration
          </h1>
          <p className="text-[10px] text-indigo-650 font-mono mt-1 font-bold uppercase tracking-widest">
            NODE_ID: {employee?.id.toString().padStart(4, '0')} | INIT: {employee?.created_at && new Date(employee.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {pageError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-3 font-mono text-xs font-bold shadow-sm">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <span>SYS_ERROR: {pageError}</span>
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
          <div className="bg-white/80 rounded-2xl p-6 border border-slate-200 shadow-sm h-[600px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
              <ListOrdered className="w-5 h-5 text-indigo-500" />
              <div>
                <h2 className="font-pixel text-[11px] text-indigo-650 uppercase tracking-widest font-bold">Protocol Sequence</h2>
                <p className="text-[9px] text-slate-400 font-mono mt-1 uppercase tracking-widest font-bold">Automated execution steps</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar mb-6">
              {steps.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-250 rounded-xl bg-slate-50/50">
                  <Terminal className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest font-bold">No protocols established</p>
                </div>
              ) : (
                steps.map((step, idx) => (
                  <div key={step.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex gap-4 group hover:border-indigo-300 transition-colors shadow-inner">
                    <div className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-xs font-mono shrink-0 font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-slate-700 font-mono leading-relaxed">{step.instruction}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddStep} className="mt-auto border-t border-slate-100 pt-4 space-y-3">
              <label className="block text-[9px] font-mono text-slate-450 uppercase tracking-widest font-bold">Append Protocol Step</label>
              <textarea
                value={newStepInstruction}
                onChange={(e) => setNewStepInstruction(e.target.value)}
                placeholder="Declare new instruction..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-mono text-xs resize-none shadow-inner"
              />
              <button
                type="submit"
                disabled={isAddingStep || !newStepInstruction.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-all shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-transparent uppercase tracking-wider text-xs cursor-pointer"
              >
                {isAddingStep ? "WRITING TO DISK..." : "APPEND PROTOCOL"}
                {!isAddingStep && <Plus className="w-4 h-4 text-white" />}
              </button>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
}
