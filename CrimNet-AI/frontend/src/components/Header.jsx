import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  RotateCcw, 
  Download, 
  PlusCircle, 
  Cpu, 
  RefreshCw,
  Database,
  Radio
} from 'lucide-react';

export default function Header({ 
  stats, 
  onReset, 
  onRefresh, 
  onOpenAddModal, 
  onExport,
  loading,
  criticalCount 
}) {
  return (
    <header className="h-16 px-5 border-b border-cyber-800 bg-cyber-900/90 backdrop-blur-md flex items-center justify-between z-30 select-none">
      {/* Brand & System Status */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-red-950/60 border border-red-500/40 text-red-500 shadow-glow-crimson">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-wider font-mono text-white flex items-center gap-1.5">
              CRIMNET<span className="text-red-500 font-extrabold">.AI</span>
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase rounded bg-red-950/80 border border-red-600/50 text-red-400 font-semibold">
              LIVE INTEL
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            CRIMINAL INTELLIGENCE & SYNDICATE TOPOLOGY ENGINE
          </p>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 rounded-lg bg-cyber-950/80 border border-cyber-800/80 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">TARGETS:</span>
          <span className="font-bold text-cyan-400 text-sm">{stats.total_nodes || 0}</span>
        </div>
        <div className="h-4 w-px bg-cyber-800" />
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400">CONNECTIONS:</span>
          <span className="font-bold text-indigo-400 text-sm">{stats.total_edges || 0}</span>
        </div>
        <div className="h-4 w-px bg-cyber-800" />
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">DENSITY:</span>
          <span className="font-bold text-amber-400 text-sm">{((stats.density || 0) * 100).toFixed(1)}%</span>
        </div>
        <div className="h-4 w-px bg-cyber-800" />
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-red-400" />
          <span className="text-slate-400">CRITICAL THREATS:</span>
          <span className="font-bold text-red-500 text-sm">{criticalCount}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md bg-cyber-800 hover:bg-cyber-700 border border-cyber-700 text-slate-200 transition-all shadow-sm"
          title="Manually Insert Entity or Edge"
        >
          <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Add Entity</span>
        </button>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 text-xs rounded-md bg-cyber-800 hover:bg-cyber-700 border border-cyber-700 text-slate-300 transition-all disabled:opacity-50"
          title="Refresh Network Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 transition-all"
          title="Reset to Baseline Syndicate Data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Graph</span>
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/60 text-cyan-300 transition-all"
          title="Export Network Dossier (JSON)"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Dossier</span>
        </button>
      </div>
    </header>
  );
}
