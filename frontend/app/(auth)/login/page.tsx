"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Terminal, Lock, Mail, AlertTriangle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [booting, setBooting] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const bootSequence = [
    "INIT SYSTEM.OS v9.4.2...",
    "VERIFYING ENCRYPTION KEYS [OK]",
    "ESTABLISHING SECURE CONNECTION...",
    "LOADING NEURAL INTERFACE...",
    "ACCESS GRANTED. AWAITING CREDENTIALS."
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < bootSequence.length) {
        setLogs(prev => [...prev, bootSequence[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 1000);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#020617] flex items-center justify-center overflow-hidden">
      {/* Animated Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #06b6d4 1px, transparent 1px),
            linear-gradient(to bottom, #06b6d4 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]"></div>
      </div>

      <AnimatePresence mode="wait">
        {booting ? (
          <motion.div 
            key="boot"
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl p-8 font-mono text-cyan-400 z-10"
          >
            {logs.map((log, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={i} 
                className="mb-2"
              >
                {">"} {log}
              </motion.div>
            ))}
            <motion.div 
              animate={{ opacity: [1, 0] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="mt-2"
            >
              _
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md z-10 relative"
          >
            {/* Glowing Accent */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-30 animate-pulse"></div>
            
            <div className="relative glass-panel rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 neon-border-cyan mb-6">
                  <Terminal className="w-8 h-8 text-cyan-400" />
                </div>
                <h1 className="text-2xl font-bold font-pixel text-slate-100 mb-2">EMPLOD</h1>
                <p className="text-slate-400 font-mono text-sm tracking-widest">SYSTEM.OS // SECURE LOGIN</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-950/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="font-mono text-sm">{error}</span>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Operator ID (Email)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                      placeholder="operator@sys.os"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Passcode</label>
                    <Link href="/forgot-password" className="text-xs font-mono text-cyan-500 hover:text-cyan-400">Forgot?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-8 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "AUTHENTICATING..." : "ACCESS TERMINAL"}
                  {!loading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="w-full mt-3 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-bold py-3 rounded-lg border border-cyan-500/30 transition-all flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest"
                >
                  <span>⚡ GUEST / DEMO BYPASS</span>
                </button>
              </form>

              <div className="mt-6 text-center pt-6">
                <p className="text-sm font-mono text-slate-400">
                  New Operator?{" "}
                  <Link href="/signup" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Request Access
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
