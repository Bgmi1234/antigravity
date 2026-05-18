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
    <aside className="w-64 border-r border-slate-200/80 bg-white/80 backdrop-blur-xl p-6 hidden md:flex flex-col z-40 relative shadow-[5px_0_20px_rgba(0,0,0,0.015)]">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10">
        <div className={cn(
          "w-12 h-12 rounded-xl bg-slate-50 border flex items-center justify-center relative overflow-hidden group cursor-default transition-all duration-300",
          isUser ? "border-emerald-200 shadow-[0_4px_12px_rgba(16,185,129,0.08)]" : "border-indigo-200 shadow-[0_4px_12px_rgba(99,102,241,0.08)]"
        )}>
          <Layers className={cn("w-6 h-6 relative z-10 transition-colors duration-300", isUser ? "text-emerald-500" : "text-indigo-500")} />
        </div>
        <div>
          <h1 className="text-base font-bold font-pixel text-slate-800 uppercase tracking-tighter leading-tight mt-1">EMPLOD</h1>
          <p className="text-[9px] font-mono tracking-widest uppercase mt-1 flex items-center gap-1">
            <span className={cn("w-1.5 h-1.5 rounded-full", isUser ? "bg-emerald-500" : "bg-indigo-500")}></span>
            <span className="text-slate-500">{isUser ? "Operator.OS" : "Supervisor.OS"}</span>
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="space-y-1.5 flex-1">
        <p className="text-[10px] font-pixel text-slate-400 mb-4 px-2 tracking-widest uppercase">
          {isUser ? "Operator Terminals" : "Control Panels"}
        </p>
        {(isUser ? userNavItems : adminNavItems).map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-xs transition-all duration-200 relative group overflow-hidden font-mono",
                isActive 
                  ? isUser
                    ? "bg-emerald-50/60 text-emerald-600 border border-emerald-200/50 shadow-sm font-bold"
                    : "bg-indigo-50/60 text-indigo-600 border border-indigo-200/50 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 border border-transparent"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 shrink-0 transition-colors duration-200", 
                isActive 
                  ? isUser ? "text-emerald-500" : "text-indigo-500" 
                  : cn("text-slate-400", isUser ? "group-hover:text-emerald-500" : "group-hover:text-indigo-500")
              )} />
              <span className="tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        {/* Role Toggle Switcher */}
        <button
          onClick={toggleRole}
          type="button"
          className={cn(
            "w-full mb-3 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold font-mono border transition-all uppercase tracking-widest cursor-pointer",
            isUser
              ? "bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200 text-emerald-600"
              : "bg-indigo-50 hover:bg-indigo-100/70 border-indigo-200 text-indigo-600"
          )}
        >
          {isUser ? (
            <>
              <User className="w-3.5 h-3.5 text-emerald-500" />
              <span>Operator Mode</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" />
              <span>Admin Mode</span>
            </>
          )}
        </button>

        <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-center gap-3 mb-3 shadow-sm">
          <div className={cn(
            "w-10 h-10 border flex items-center justify-center relative rounded-lg border-b-2 transition-all duration-300",
            isUser ? "bg-emerald-50 border-emerald-200" : "bg-indigo-50 border-indigo-200"
          )}>
            <span className={cn(
              "font-pixel text-[10px] font-bold transition-colors duration-300",
              isUser ? "text-emerald-600" : "text-indigo-600"
            )}>
              {isUser ? "OP" : "AD"}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-slate-800 truncate font-sans">
              {isUser ? "Standard Operator" : "CEO / Admin"}
            </p>
            <p className={cn(
              "text-[9px] font-mono truncate uppercase tracking-widest transition-colors duration-300",
              isUser ? "text-emerald-500" : "text-indigo-500"
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
          className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-mono font-bold text-slate-600 bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-colors rounded-lg uppercase tracking-widest cursor-pointer shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          Disconnect
        </button>
      </div>
    </aside>
  );
}
