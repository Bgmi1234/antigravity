"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEmployee, Employee } from "@/services/api";
import EmployeeForm from "@/components/employees/EmployeeForm";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewEmployeePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Partial<Employee>) => {
    setIsLoading(true);
    setError(null);
    try {
      await createEmployee(data);
      router.push("/employees");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to deploy node");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/employees" className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-650 p-2.5 rounded-lg transition-all shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-pixel text-slate-850 tracking-tight uppercase">Deploy Operator</h1>
          <p className="text-indigo-650 font-mono text-xs uppercase tracking-widest mt-1.5 font-bold">Configure a new autonomous node for the network.</p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-950/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="font-mono text-sm">SYS_ERROR: {error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <EmployeeForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        submitLabel="INITIALIZE NODE" 
      />
    </div>
  );
}
