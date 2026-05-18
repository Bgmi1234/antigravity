"use client";

import { useState } from "react";
import { Employee } from "@/types";
import { motion } from "framer-motion";
import { Terminal, Settings, Hash, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeFormProps {
  initialData?: Partial<Employee>;
  onSubmit: (data: Partial<Employee>) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
}

export default function EmployeeForm({ initialData, onSubmit, isLoading, submitLabel }: EmployeeFormProps) {
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: initialData?.name || "",
    role: initialData?.role || "",
    department: initialData?.department || "Engineering",
    status: initialData?.status || "Active",
    productivity: initialData?.productivity || 100,
    goal: initialData?.goal || "",
    tools: initialData?.tools || "",
    approval_rules: initialData?.approval_rules || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate a pixel avatar based on the name if it's a new employee
    const submissionData = { ...formData };
    if (!initialData?.id && submissionData.name) {
      submissionData.avatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(submissionData.name)}`;
    }
    
    await onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden font-mono text-xs">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xs font-pixel text-indigo-650 uppercase tracking-widest border-b border-slate-100 pb-2.5 mb-4 flex items-center gap-2 font-bold">
            <Terminal className="w-4 h-4 text-indigo-500 shrink-0" /> Operator Identity
          </h3>

          <div>
            <label className="text-[10px] font-mono text-slate-450 uppercase tracking-widest block mb-1.5 font-bold">Designation (Name) *</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-mono shadow-inner"
              placeholder="e.g. Data Processor Alpha"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-450 uppercase tracking-widest block mb-1.5 font-bold">Function (Role)</label>
            <input
              name="role"
              type="text"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-mono shadow-inner"
              placeholder="e.g. Data Analyst"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-slate-450 uppercase tracking-widest block mb-1.5 font-bold">Sector (Dept)</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-mono cursor-pointer shadow-inner"
              >
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-450 uppercase tracking-widest block mb-1.5 font-bold">State (Status)</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-mono cursor-pointer shadow-inner"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Training">Training</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-pixel text-purple-650 uppercase tracking-widest border-b border-slate-100 pb-2.5 mb-4 flex items-center gap-2 font-bold">
            <Settings className="w-4 h-4 text-purple-500 shrink-0" /> Core Directives
          </h3>

          <div>
            <label className="text-[10px] font-mono text-slate-450 uppercase tracking-widest block mb-1.5 font-bold">Primary Objective (Goal)</label>
            <textarea
              name="goal"
              rows={2}
              value={formData.goal}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-mono shadow-inner"
              placeholder="e.g. Optimize conversion rates."
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-450 uppercase tracking-widest block mb-1.5 font-bold">Equipment (Tools)</label>
            <input
              name="tools"
              type="text"
              value={formData.tools}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-mono shadow-inner"
              placeholder="Browser, Analytics API, Writer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-slate-450 uppercase tracking-widest block mb-1.5 font-bold">Efficiency Level</label>
              <div className="relative">
                <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="productivity"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.productivity}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-4 text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-mono shadow-inner"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-450 uppercase tracking-widest block mb-1.5 font-bold">Security Clearance</label>
              <input
                name="approval_rules"
                type="text"
                value={formData.approval_rules}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-mono shadow-inner"
                placeholder="Requires user approval"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8 border-t border-slate-100 pt-6">
        <button
          type="submit"
          disabled={isLoading || !formData.name}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-8 rounded-lg transition-all shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border-transparent uppercase tracking-wider text-xs cursor-pointer"
        >
          {isLoading ? "PROCESSING..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
