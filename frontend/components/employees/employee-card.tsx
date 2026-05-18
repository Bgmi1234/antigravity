"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Edit3, Activity } from "lucide-react";
import Link from "next/link";
import { Employee } from "@/services/api";
import { cn } from "@/lib/utils";

export function EmployeeCard({ employee, onEdit }: { employee: Employee; onEdit?: (employee: Employee) => void }) {
  const [role, setRole] = useState<"admin" | "user">("admin");

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

  const status = employee.status || "Active"; 
  const isOnline = status === "Active";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-panel rounded-xl overflow-hidden group relative h-full flex flex-col"
    >
      {/* Top Accent Line */}
      <div className={`h-1 w-full absolute top-0 left-0 ${isOnline ? 'bg-cyan-500 neon-border-cyan' : status === 'Training' ? 'bg-purple-500' : 'bg-slate-700'}`} />

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center relative overflow-hidden">
              {employee.avatar ? (
                <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-pixel text-xl text-slate-300">
                  {employee.name.substring(0, 1).toUpperCase()}
                </span>
              )}
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${isOnline ? 'bg-green-500 neon-border-cyan' : status === 'Training' ? 'bg-yellow-500' : 'bg-slate-600'}`} />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 font-sans tracking-tight group-hover:text-cyan-400 transition-colors">
                {employee.name}
              </h3>
              <p className="text-xs font-mono text-slate-500 mt-1">ID: SYS_{employee.id.toString().padStart(4, '0')}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className={`text-[10px] font-mono uppercase px-2 py-1 rounded border ${
            isOnline ? 'border-green-500/30 text-green-400 bg-green-500/10' : status === 'Training' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' : 'border-slate-700 text-slate-500 bg-slate-800/50'
          }`}>
            {status}
          </span>
          {employee.department && (
            <span className="text-[10px] font-mono uppercase px-2 py-1 rounded border border-slate-700 text-slate-400 bg-slate-800/30">
              {employee.department}
            </span>
          )}
        </div>

        <div className="space-y-4 mb-6 flex-1">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Role / Function</p>
            <p className="text-sm text-slate-300 font-mono truncate">
              {employee.role || "Generic Agent"}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Activity className="w-4 h-4 text-purple-400" />
            Productivity: <span className="text-slate-200">{employee.productivity ?? 100}%</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-800/50 mt-auto">
          {role === "admin" && (
            onEdit ? (
              <button 
                onClick={() => onEdit(employee)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 py-2 rounded flex items-center justify-center gap-2 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                Config
              </button>
            ) : (
              <Link 
                href={`/employees/${employee.id}`}
                className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 py-2 rounded flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                Config
              </Link>
            )
          )}
          <Link 
            href={`/employees/${employee.id}`}
            className={cn(
              "flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded border transition-all duration-200 uppercase tracking-widest",
              role === "admin"
                ? "flex-1 bg-cyan-950/40 hover:bg-cyan-900/60 border-cyan-500/30 text-cyan-400 neon-text-cyan group-hover:neon-border-cyan cursor-pointer"
                : "w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] border-transparent text-center font-mono text-[10px]"
            )}
          >
            <Terminal className="w-3.5 h-3.5" />
            Terminal Console
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
