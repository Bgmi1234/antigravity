"use client";

import { useState } from "react";
import { Settings, Database, Cpu, Eye, Volume2, Save, Terminal, Shield, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="max-w-5xl mx-auto space-y-8 pb-12 relative z-10 font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 z-50 bg-cyan-950/90 border border-cyan-500/50 text-cyan-400 px-4 py-3 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] font-mono text-sm backdrop-blur-md"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-inner bg-animated-grid">
        <div>
          <h2 className="text-3xl font-bold font-pixel text-slate-100 uppercase tracking-tight mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-cyan-400" />
            System Settings
          </h2>
          <p className="text-cyan-400 font-mono text-sm uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            Sim.OS Central Command Registry
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Config Panels */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Engines Panel */}
          <div className="glass-panel border border-slate-800 p-6 rounded-2xl shadow-xl bg-slate-900/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            
            <h3 className="text-sm font-pixel text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              Cognitive AI Co-Processors
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-slate-400 uppercase tracking-wider block font-bold">Ollama API URL</label>
                  <input
                    type="text"
                    value={ollamaUrl}
                    onChange={(e) => setOllamaUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-400 uppercase tracking-wider block font-bold">Default Model seed</label>
                  <input
                    type="text"
                    value={ollamaModel}
                    onChange={(e) => setOllamaModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-slate-400 uppercase tracking-wider block font-bold">AnythingLLM Workspace URL</label>
                <input
                  type="text"
                  value={anythingLlmUrl}
                  onChange={(e) => setAnythingLlmUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Retro OS Controls */}
          <div className="glass-panel border border-slate-800 p-6 rounded-2xl shadow-xl bg-slate-900/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-emerald-500"></div>

            <h3 className="text-sm font-pixel text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              OS Interface Calibration
            </h3>

            <div className="space-y-4 font-mono text-xs text-slate-300">
              <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                <div>
                  <p className="font-bold text-slate-200 uppercase tracking-wider">Cathode CRT Scanlines</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Render vintage scanline overlays</p>
                </div>
                <input
                  type="checkbox"
                  checked={scanlines}
                  onChange={(e) => setScanlines(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                <div>
                  <p className="font-bold text-slate-200 uppercase tracking-wider">Phosphor CRT Screen Glow</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Enable visual glassmorphic screen reflections</p>
                </div>
                <input
                  type="checkbox"
                  checked={crtGlow}
                  onChange={(e) => setCrtGlow(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                <div>
                  <p className="font-bold text-slate-200 uppercase tracking-wider">Synthesized Audio Alerts</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Play retro synthesized sounds on alerts</p>
                </div>
                <input
                  type="checkbox"
                  checked={audioAlerts}
                  onChange={(e) => setAudioAlerts(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Diagnostic details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel border border-slate-800 p-6 rounded-2xl shadow-xl bg-slate-900/40 relative overflow-hidden h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
                <h4 className="text-xs font-pixel text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <Database className="w-5 h-5 text-green-400" />
                  Primary DB Node
                </h4>
                <span className="text-[9px] font-mono bg-green-950 text-green-400 border border-green-800/40 px-2 py-0.5 rounded uppercase tracking-wider">ONLINE</span>
              </div>

              <div className="space-y-4 font-mono text-[11px] text-slate-400 leading-relaxed">
                <div>
                  <span className="text-slate-500 block uppercase tracking-wider mb-1">Session Host Pooler</span>
                  <span className="text-slate-200 break-words block">{dbHost}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider mb-1">Port</span>
                    <span className="text-slate-200">{dbPort}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider mb-1">Type</span>
                    <span className="text-slate-200">PostgreSQL</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-850 mt-8 space-y-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-cyan-950/40 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/60 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed uppercase font-mono text-xs tracking-wider"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synchronizing...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
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
