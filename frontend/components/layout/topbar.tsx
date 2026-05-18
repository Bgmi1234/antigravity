"use client";

import { Search, Bell, Cpu, X, Terminal, Activity } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Topbar() {
  const [role, setRole] = useState<"admin" | "user">("admin");

  useEffect(() => {
    // Initial fetch
    const savedRole = localStorage.getItem("emplod_role") as "admin" | "user" | null;
    if (savedRole) {
      setRole(savedRole);
    }

    // Listener for real-time role changes
    const handleRoleChange = () => {
      const updatedRole = localStorage.getItem("emplod_role") as "admin" | "user" | null;
      if (updatedRole) {
        setRole(updatedRole);
      }
    };
    window.addEventListener("role-change", handleRoleChange);
    return () => window.removeEventListener("role-change", handleRoleChange);
  }, []);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, type: "system", title: "SYSTEM OPTIMAL", message: "All sectors operating at peak efficiency.", time: "Just now" },
    { id: 2, type: "alert", title: "NODE TERMINATED", message: "Data Processor Alpha offline.", time: "2m ago" },
    { id: 3, type: "info", title: "NEW PROTOCOL", message: "Marketing agent successfully updated.", time: "1hr ago" },
  ];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isUser = role === "user";

  return (
    <header className="h-20 border-b border-slate-200/80 bg-white/70 backdrop-blur-xl flex items-center justify-between px-6 md:px-10 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:block group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search active node cores..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-mono shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 hidden sm:flex bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            isUser ? "bg-emerald-500" : "bg-indigo-500"
          )}></div>
          <span>{isUser ? "USER_CONNECTED" : "SYS_ADMIN_ONLINE"}</span>
        </div>

        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-slate-500 hover:text-indigo-600 transition-colors rounded-lg hover:bg-slate-100/50 cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
          </button>

          {/* Notification Modal */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 glass-panel border border-slate-200 shadow-2xl rounded-2xl overflow-hidden z-50 bg-white"
              >
                <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-pixel text-[10px] text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-indigo-500" /> Comm Link
                  </h3>
                  <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2 space-y-1 bg-white">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100 cursor-default group">
                      <div className="flex items-start gap-3">
                        <Terminal className={cn(
                          "w-4 h-4 mt-0.5 shrink-0",
                          notif.type === 'alert' ? 'text-rose-500' : notif.type === 'system' ? 'text-emerald-500' : 'text-indigo-500'
                        )} />
                        <div>
                          <p className="text-xs font-bold font-sans text-slate-800 group-hover:text-indigo-600 transition-colors">{notif.title}</p>
                          <p className="text-xs text-slate-500 font-mono mt-1 leading-relaxed">{notif.message}</p>
                          <p className="text-[9px] text-slate-400 font-mono mt-2">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 p-2 border-t border-slate-200 text-center">
                  <button className="text-[10px] font-mono text-indigo-600 hover:text-indigo-800 uppercase tracking-widest p-1 w-full rounded hover:bg-slate-100 transition-colors cursor-pointer">
                    Clear Log
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {role === "admin" && (
          <Link 
            href="/employees/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold font-mono tracking-wider transition-all uppercase shadow-md shadow-indigo-100 cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            Deploy Agent
          </Link>
        )}
      </div>
    </header>
  );
}
