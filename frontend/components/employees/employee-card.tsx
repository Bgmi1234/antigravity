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
      whileHover={{ y: -4 }}
      className="glass-panel rounded-2xl overflow-hidden group relative h-full flex flex-col transition-all duration-300"
    >
      {/* Top Accent Line */}
      <div className={cn(
        "h-1.5 w-full absolute top-0 left-0 transition-colors duration-300",
        isOnline ? 'bg-emerald-500' : status === 'Training' ? 'bg-amber-500' : 'bg-slate-400'
      )} />

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center relative overflow-hidden shrink-0 shadow-sm">
              {employee.avatar ? (
                <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover animate-in fade-in duration-300" />
              ) : (
                <span className="font-pixel text-lg font-bold text-slate-500">
                  {employee.name.substring(0, 1).toUpperCase()}
                </span>
              )}
              {/* Online/offline circular tag indicator */}
              <div className={cn(
                "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white transition-colors duration-300",
                isOnline ? 'bg-emerald-500' : status === 'Training' ? 'bg-amber-500' : 'bg-slate-400'
              )} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 font-sans tracking-tight group-hover:text-indigo-600 transition-colors">
                {employee.name}
              </h3>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">ID: SYS_{employee.id.toString().padStart(4, '0')}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className={cn(
            "text-[9px] font-mono uppercase px-2.5 py-1 rounded-md border font-semibold transition-colors duration-300",
            isOnline 
              ? 'border-emerald-200 text-emerald-600 bg-emerald-50' 
              : status === 'Training' 
                ? 'border-amber-200 text-amber-600 bg-amber-50' 
                : 'border-slate-200 text-slate-500 bg-slate-50'
          )}>
            {status}
          </span>
          {employee.department && (
            <span className="text-[9px] font-mono uppercase px-2.5 py-1 rounded-md border border-slate-150 text-slate-500 bg-slate-50/50">
              {employee.department}
            </span>
          )}
        </div>

        <div className="space-y-4 mb-6 flex-1">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Role / Function</p>
            <p className="text-xs text-slate-600 font-mono truncate">
              {employee.role || "Generic Node Agent"}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <Activity className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>Productivity: <span className="text-slate-700 font-bold">{employee.productivity ?? 100}%</span></span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-auto">
          {role === "admin" && (
            onEdit ? (
              <button 
                onClick={() => onEdit(employee)}
                className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold font-mono tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                <Edit3 className="w-3 h-3" />
                Config
              </button>
            ) : (
              <Link 
                href={`/employees/${employee.id}`}
                className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold font-mono tracking-wider transition-colors shadow-sm"
              >
                <Edit3 className="w-3 h-3" />
                Config
              </Link>
            )
          )}
          <Link 
            href={`/employees/${employee.id}`}
            className={cn(
              "flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-lg border transition-all duration-200 uppercase tracking-widest font-mono text-[10px]",
              role === "admin"
                ? "flex-1 bg-indigo-50 hover:bg-indigo-100/70 border-indigo-200 text-indigo-600 cursor-pointer shadow-sm"
                : "w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 shadow-[0_4px_12px_rgba(16,185,129,0.25)] border-transparent text-center"
            )}
          >
            <Terminal className="w-3.5 h-3.5" />
            Console
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
