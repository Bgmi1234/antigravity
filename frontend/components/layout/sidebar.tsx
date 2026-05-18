"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CheckSquare, BarChart, Settings, LogOut, Terminal, Layers, ShieldAlert, User } from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { name: "Command Center", href: "/", icon: LayoutDashboard },
  { name: "Office Floor", href: "/employees", icon: Users },
  { name: "Task Queue", href: "/tasks", icon: CheckSquare },
  { name: "Company Stats", href: "/analytics", icon: BarChart },
];

const userNavItems = [
  { name: "My Workstation", href: "/", icon: LayoutDashboard },
  { name: "My Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Calibrate Screen", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
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

  const toggleRole = () => {
    const newRole = role === "admin" ? "user" : "admin";
    setRole(newRole);
    localStorage.setItem("emplod_role", newRole);
    window.dispatchEvent(new Event("role-change"));
  };

  const isUser = role === "user";

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/90 backdrop-blur-xl p-6 hidden md:flex flex-col z-40 relative shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10">
        <div className={cn(
          "w-12 h-12 rounded-lg bg-slate-900 border-2 flex items-center justify-center relative overflow-hidden group cursor-default transition-all duration-300",
          isUser ? "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        )}>
          <div className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            isUser ? "bg-emerald-500/10" : "bg-cyan-500/10"
          )}></div>
          <Layers className={cn("w-6 h-6 relative z-10 transition-colors duration-300", isUser ? "text-emerald-400" : "text-cyan-400")} />
        </div>
        <div>
          <h1 className="text-lg font-bold font-pixel text-slate-100 uppercase tracking-tighter leading-tight mt-1">EMPLOD</h1>
          <p className="text-[9px] font-mono tracking-widest uppercase mt-1 flex items-center gap-1">
            <span className={cn("w-1 h-1 rounded-full animate-pulse", isUser ? "bg-emerald-400" : "bg-cyan-400")}></span>
            {isUser ? "Operator.OS" : "Supervisor.OS"}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="space-y-2 flex-1">
        <p className="text-[10px] font-pixel text-slate-500 mb-4 px-2 tracking-widest uppercase">
          {isUser ? "Operator Terminals" : "Control Panels"}
        </p>
        {(isUser ? userNavItems : adminNavItems).map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded text-sm transition-all duration-200 relative group overflow-hidden font-mono",
                isActive 
                  ? isUser
                    ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 shadow-[inset_4px_0_0_rgba(16,185,129,1)]"
                    : "bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 shadow-[inset_4px_0_0_rgba(6,182,212,1)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent hover:border-slate-700"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 shrink-0 transition-colors duration-200", 
                isActive 
                  ? isUser ? "text-emerald-400" : "text-cyan-400" 
                  : cn("text-slate-500", isUser ? "group-hover:text-emerald-400" : "group-hover:text-cyan-400")
              )} />
              <span className={cn("tracking-wide", isActive && "font-bold")}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="mt-auto pt-6">
        {/* Role Toggle Switcher */}
        <button
          onClick={toggleRole}
          type="button"
          className={cn(
            "w-full mb-3 py-2 rounded flex items-center justify-center gap-2 text-xs font-semibold font-mono border transition-all uppercase tracking-widest cursor-pointer",
            isUser
              ? "bg-emerald-950/30 hover:bg-emerald-900/40 border-emerald-500/30 text-emerald-400"
              : "bg-purple-950/30 hover:bg-purple-900/40 border-purple-500/30 text-purple-400"
          )}
        >
          {isUser ? (
            <>
              <User className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Operator Mode</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-purple-400" />
              <span>Admin Mode</span>
            </>
          )}
        </button>

        <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex items-center gap-3 mb-3 shadow-inner">
          <div className={cn(
            "w-10 h-10 border flex items-center justify-center relative pixel-button border-b-2 transition-all duration-300",
            isUser ? "bg-emerald-950 border-emerald-500/50" : "bg-pink-950 border-pink-500/50"
          )}>
            <span className={cn(
              "font-pixel text-[10px] transition-colors duration-300",
              isUser ? "text-emerald-400" : "text-pink-400"
            )}>
              {isUser ? "OP" : "AD"}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-slate-200 truncate font-sans">
              {isUser ? "Standard Operator" : "CEO / Admin"}
            </p>
            <p className={cn(
              "text-[10px] font-mono truncate uppercase tracking-widest transition-colors duration-300",
              isUser ? "text-emerald-400" : "text-pink-400"
            )}>
              {isUser ? "Sect_04 // Level 1" : "Level 99 Boss"}
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
