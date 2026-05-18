"use client";

import { useState } from "react";
import { Employee } from "@/types";
import { motion } from "framer-motion";
import { Terminal, Settings, Hash, Activity } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border-slate-700/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-pixel text-cyan-400 uppercase tracking-widest border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
            <Terminal className="w-4 h-4" /> Operator Identity
          </h3>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Designation (Name) *</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
              placeholder="e.g. Data Processor Alpha"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Function (Role)</label>
            <input
              name="role"
              type="text"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
              placeholder="e.g. Data Analyst"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Sector (Dept)</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm appearance-none"
              >
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">State (Status)</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm appearance-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Training">Training</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-pixel text-purple-400 uppercase tracking-widest border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4" /> Core Directives
          </h3>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Primary Objective (Goal)</label>
            <textarea
              name="goal"
              rows={2}
              value={formData.goal}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-mono text-sm custom-scrollbar"
              placeholder="e.g. Optimize conversion rates."
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Equipment (Tools)</label>
            <input
              name="tools"
              type="text"
              value={formData.tools}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-mono text-sm"
              placeholder="Browser, Analytics API, Writer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Efficiency Level</label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  name="productivity"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.productivity}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Security Clearance</label>
              <input
                name="approval_rules"
                type="text"
                value={formData.approval_rules}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-mono text-sm"
                placeholder="Requires user approval"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8 border-t border-slate-800 pt-6">
        <button
          type="submit"
          disabled={isLoading || !formData.name}
          className="bg-cyan-950/40 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/60 font-bold py-2.5 px-8 rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 neon-text-cyan neon-border-cyan uppercase tracking-wider text-sm"
        >
          {isLoading ? "PROCESSING..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
