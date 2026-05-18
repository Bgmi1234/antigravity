"use client";

import { useState } from "react";
import { Settings, Database, Cpu, Eye, Volume2, Save, Terminal, Shield, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [dbStatus, setDbStatus] = useState("Connected");
  const [dbHost] = useState("aws-1-ap-southeast-2.pooler.supabase.com");
  const [dbPort] = useState("5432");
  
  // AI Settings
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [ollamaModel, setOllamaModel] = useState("llama3.1");
  const [anythingLlmUrl, setAnythingLlmUrl] = useState("http://localhost:3001");
  
  // OS Preferences
  const [scanlines, setScanlines] = useState(true);
  const [crtGlow, setCrtGlow] = useState(true);
  const [audioAlerts, setAudioAlerts] = useState(true);
  
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      triggerToast("SYS_PREF: Configuration saved successfully.");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 relative z-10 font-sans text-slate-850">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 z-50 bg-white/95 border border-slate-200 text-slate-800 px-4 py-3 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.08)] font-mono text-xs backdrop-blur-md font-bold"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white/70 p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div>
          <h2 className="text-3xl font-bold font-pixel text-slate-850 uppercase tracking-tight mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-indigo-650" />
            System Settings
          </h2>
          <p className="text-indigo-650 font-mono text-xs uppercase tracking-widest mt-2 flex items-center gap-2 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Sim.OS Central Command Registry
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Config Panels */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Engines Panel */}
          <div className="bg-white/80 border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <h3 className="text-xs font-pixel text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2 font-bold">
              <Cpu className="w-4 h-4 text-indigo-500" />
              Cognitive AI Co-Processors
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-slate-450 uppercase tracking-widest block font-bold text-[9px]">Ollama API URL</label>
                  <input
                    type="text"
                    value={ollamaUrl}
                    onChange={(e) => setOllamaUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-455 uppercase tracking-widest block font-bold text-[9px]">Default Model Seed</label>
                  <input
                    type="text"
                    value={ollamaModel}
                    onChange={(e) => setOllamaModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-slate-450 uppercase tracking-widest block font-bold text-[9px]">AnythingLLM Workspace URL</label>
                <input
                  type="text"
                  value={anythingLlmUrl}
                  onChange={(e) => setAnythingLlmUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Retro OS Controls */}
          <div className="bg-white/80 border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-450 to-emerald-450"></div>

            <h3 className="text-xs font-pixel text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2 font-bold">
              <Eye className="w-4 h-4 text-indigo-500" />
              OS Interface Calibration
            </h3>

            <div className="space-y-4 font-mono text-xs text-slate-600">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl shadow-inner">
                <div>
                  <p className="font-bold text-slate-800 uppercase tracking-wider">Cathode CRT Scanlines</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Render vintage scanline overlays</p>
                </div>
                <input
                  type="checkbox"
                  checked={scanlines}
                  onChange={(e) => setScanlines(e.target.checked)}
                  className="w-4 h-4 accent-indigo-650 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl shadow-inner">
                <div>
                  <p className="font-bold text-slate-800 uppercase tracking-wider">Phosphor CRT Screen Glow</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Enable visual glassmorphic reflections</p>
                </div>
                <input
                  type="checkbox"
                  checked={crtGlow}
                  onChange={(e) => setCrtGlow(e.target.checked)}
                  className="w-4 h-4 accent-indigo-650 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl shadow-inner">
                <div>
                  <p className="font-bold text-slate-800 uppercase tracking-wider">Synthesized Audio Alerts</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Play retro alerts on node termination</p>
                </div>
                <input
                  type="checkbox"
                  checked={audioAlerts}
                  onChange={(e) => setAudioAlerts(e.target.checked)}
                  className="w-4 h-4 accent-indigo-650 cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Diagnostic details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/80 border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h4 className="text-xs font-pixel text-slate-800 uppercase tracking-widest flex items-center gap-2 font-bold">
                  <Database className="w-5 h-5 text-emerald-500" />
                  Primary DB Node
                </h4>
                <span className="text-[9px] font-mono bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-lg uppercase tracking-wider font-bold">ONLINE</span>
              </div>

              <div className="space-y-4 font-mono text-[11px] text-slate-500 leading-relaxed font-semibold">
                <div>
                  <span className="text-slate-400 block uppercase tracking-widest mb-1 font-bold text-[9px]">Session Host Pooler</span>
                  <span className="text-slate-800 break-words block font-bold">{dbHost}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 block uppercase tracking-widest mb-1 font-bold text-[9px]">Port</span>
                    <span className="text-slate-800 font-bold">{dbPort}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase tracking-widest mb-1 font-bold text-[9px]">Type</span>
                    <span className="text-slate-800 font-bold">PostgreSQL</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 mt-8 space-y-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed uppercase font-mono text-xs tracking-wider cursor-pointer border-transparent"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-white" />
                    <span>Save Calibration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
