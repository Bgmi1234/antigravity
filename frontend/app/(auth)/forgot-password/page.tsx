"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Terminal, Mail, AlertTriangle, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
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

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10 relative p-4"
      >
        {/* Glowing Accent */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl blur opacity-30 animate-pulse"></div>
        
        <div className="relative glass-panel rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 neon-border-pink mb-6">
              <Terminal className="w-8 h-8 text-pink-400" />
            </div>
            <h1 className="text-2xl font-bold font-pixel text-slate-100 mb-2">EMPLOD</h1>
            <p className="text-slate-400 font-mono text-sm tracking-widest">SYSTEM.OS // RECOVERY</p>
          </div>

          {success ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/50">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100 font-sans">Recovery Initiated</h3>
                <p className="text-slate-400 font-mono text-sm mt-2">If an operator identity matches this email, a reset sequence has been dispatched.</p>
              </div>
              <Link href="/login" className="block w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-all text-center">
                Return to Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleReset} className="space-y-5">
              {error && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-950/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="font-mono text-sm">{error}</span>
                </motion.div>
              )}

              <p className="text-slate-400 text-sm font-mono mb-6">
                Enter your Operator ID. A secure link will be dispatched to reset your passcode.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Operator ID (Email)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-mono"
                    placeholder="operator@sys.os"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(236,72,153,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "PROCESSING..." : "DISPATCH RESET LINK"}
                {!loading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          )}

          <div className="mt-6 text-center pt-6">
            <Link href="/login" className="text-sm font-mono text-cyan-400 hover:text-cyan-300 transition-colors">
              {"< ABORT RECOVERY AND RETURN"}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
