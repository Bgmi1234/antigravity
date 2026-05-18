"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CheckSquare, BarChart, Settings, LogOut, Terminal, Layers, ShieldAlert, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Command Center", href: "/", icon: LayoutDashboard },
  { name: "Office Floor", href: "/employees", icon: Users },
  { name: "Task Queue", href: "/tasks", icon: CheckSquare },
  { name: "Company Stats", href: "/analytics", icon: BarChart },
];

export function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<"admin" | "user">("admin");

  useEffect(() => {
    const savedRole = localStorage.getItem("emplod_role") as "admin" | "user" | null;
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const toggleRole = () => {
    const newRole = role === "admin" ? "user" : "admin";
    setRole(newRole);
    localStorage.setItem("emplod_role", newRole);
    window.dispatchEvent(new Event("role-change"));
  };

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/90 backdrop-blur-xl p-6 hidden md:flex flex-col z-40 relative shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-lg bg-slate-900 border-2 border-slate-700 flex items-center justify-center neon-border-cyan relative overflow-hidden group cursor-default">
          <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Layers className="w-6 h-6 text-cyan-400 relative z-10" />
        </div>
        <div>
          <h1 className="text-lg font-bold font-pixel text-slate-100 uppercase tracking-tighter leading-tight mt-1">EMPLOD</h1>
          <p className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase mt-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></span>
            Sim.OS v9.4
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="space-y-2 flex-1">
        <p className="text-[10px] font-pixel text-slate-500 mb-4 px-2 tracking-widest uppercase">Navigation</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded text-sm transition-all duration-200 relative group overflow-hidden font-mono",
                isActive 
                  ? "bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 shadow-[inset_4px_0_0_rgba(6,182,212,1)]" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent hover:border-slate-700"
              )}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-400 transition-colors")} />
              <span className={cn("tracking-wide", isActive && "font-bold")}>{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-6 mt-6 border-t border-slate-800/80 border-dashed">
          <p className="text-[10px] font-pixel text-slate-500 mb-4 px-2 tracking-widest uppercase">System</p>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all duration-200 border border-transparent hover:border-slate-700 font-mono"
          >
            <Settings className="w-4 h-4 shrink-0 text-slate-500" />
            <span className="tracking-wide">Settings</span>
          </Link>
        </div>
      </nav>

      {/* User / Logout */}
      <div className="mt-auto pt-6">
        {/* Role Toggle Switcher */}
        <button
          onClick={toggleRole}
          type="button"
          className={cn(
            "w-full mb-3 py-2 rounded flex items-center justify-center gap-2 text-xs font-semibold font-mono border transition-all uppercase tracking-widest cursor-pointer",
            role === "admin"
              ? "bg-purple-950/30 hover:bg-purple-900/40 border-purple-500/30 text-purple-400"
              : "bg-cyan-950/30 hover:bg-cyan-900/40 border-cyan-500/30 text-cyan-400"
          )}
        >
          {role === "admin" ? (
            <>
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              <span>Admin Mode</span>
            </>
          ) : (
            <>
              <User className="w-3.5 h-3.5 animate-pulse" />
              <span>Operator Mode</span>
            </>
          )}
        </button>

        <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex items-center gap-3 mb-3 shadow-inner">
          <div className={cn(
            "w-10 h-10 border flex items-center justify-center relative pixel-button border-b-2",
            role === "admin"
              ? "bg-pink-950 border-pink-500/50"
              : "bg-cyan-950 border-cyan-500/50"
          )}>
            <span className={cn(
              "font-pixel text-[10px]",
              role === "admin" ? "text-pink-400" : "text-cyan-400"
            )}>
              {role === "admin" ? "AD" : "OP"}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-slate-200 truncate font-sans">
              {role === "admin" ? "CEO / Admin" : "Standard Operator"}
            </p>
            <p className={cn(
              "text-[10px] font-mono truncate uppercase tracking-widest",
              role === "admin" ? "text-pink-400" : "text-cyan-400"
            )}>
              {role === "admin" ? "Level 99 Boss" : "Sect_04 // Level 1"}
            </p>
          </div>
        </div>

        <button 
          onClick={async () => {
            document.cookie = "is_guest=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-mono font-bold text-slate-400 bg-slate-900 hover:bg-red-950 hover:text-red-400 border border-slate-800 hover:border-red-900 transition-colors rounded pixel-button border-b-4 hover:border-b-4 active:border-b-0 uppercase tracking-widest"
        >
          <LogOut className="w-3.5 h-3.5" />
          Disconnect
        </button>
      </div>
    </aside>
  );
}
