"use client";

import { Search, Bell, Cpu, X, Terminal, Activity } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Topbar() {
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

  return (
    <header className="h-20 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 md:px-10 sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search network..." 
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 hidden sm:flex bg-slate-900/80 px-3 py-1.5 rounded border border-slate-700/50 shadow-inner">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse neon-border-cyan"></div>
          SYS_ONLINE
        </div>

        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-slate-400 hover:text-cyan-400 transition-colors rounded-lg hover:bg-slate-800/50"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full neon-border-purple animate-pulse"></span>
          </button>

          {/* Notification Modal */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 glass-panel border border-slate-700 shadow-2xl rounded-xl overflow-hidden z-50"
              >
                <div className="bg-slate-900 p-3 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-pixel text-xs text-slate-200 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3 h-3 text-cyan-400" /> Comm Link
                  </h3>
                  <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-500 hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2 space-y-1 bg-slate-950/90">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-3 hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-700 cursor-default group">
                      <div className="flex items-start gap-3">
                        <Terminal className={`w-4 h-4 mt-0.5 shrink-0 ${notif.type === 'alert' ? 'text-red-400' : notif.type === 'system' ? 'text-green-400' : 'text-cyan-400'}`} />
                        <div>
                          <p className="text-xs font-bold font-sans text-slate-200 group-hover:text-cyan-400 transition-colors">{notif.title}</p>
                          <p className="text-xs text-slate-400 font-mono mt-1 leading-relaxed">{notif.message}</p>
                          <p className="text-[10px] text-slate-600 font-mono mt-2">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-900 p-2 border-t border-slate-800 text-center">
                  <button className="text-[10px] font-mono text-cyan-500 hover:text-cyan-400 uppercase tracking-widest p-1 w-full rounded hover:bg-slate-800 transition-colors">
                    Clear Log
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link 
          href="/employees/new"
          className="flex items-center gap-2 bg-cyan-950/80 border-cyan-500/50 text-cyan-400 hover:bg-cyan-900 px-5 py-2.5 rounded text-xs font-bold transition-all neon-border-cyan group pixel-button uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          <Cpu className="w-4 h-4 group-hover:animate-pulse" />
          Deploy Agent
        </Link>
      </div>
    </header>
  );
}
