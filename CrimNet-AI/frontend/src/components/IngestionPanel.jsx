import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Send, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  Cpu
} from 'lucide-react';

export default function IngestionPanel({ 
  sampleReports, 
  onExtract, 
  extracting, 
  lastResult 
}) {
  const [reportText, setReportText] = useState('');
  const [sourceType, setSourceType] = useState('police_report');
  const [appendMode, setAppendMode] = useState(true);
  const [selectedSampleId, setSelectedSampleId] = useState('');

  const handleSelectSample = (sample) => {
    setSelectedSampleId(sample.id);
    setReportText(sample.text);
    if (sample.category.toLowerCase().includes('narcotics')) setSourceType('police_report');
    else if (sample.category.toLowerCase().includes('arms')) setSourceType('surveillance');
    else if (sample.category.toLowerCase().includes('cyber')) setSourceType('financial');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reportText.trim() || extracting) return;
    onExtract(reportText, sourceType, appendMode);
  };

  return (
    <div className="h-full flex flex-col p-4 bg-cyber-900 border-r border-cyber-800 overflow-y-auto text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyber-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-cyan-950/70 border border-cyan-700/50 text-cyan-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 font-mono tracking-wide">INTELLIGENCE INGESTION</h2>
            <p className="text-[10px] text-slate-400">Neural NLP Knowledge Graph Extractor</p>
          </div>
        </div>
      </div>

      {/* Preset Case Reports */}
      <div className="mt-4">
        <label className="block text-[11px] font-mono font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          CASE INTELLIGENCE DOSSIERS:
        </label>
        <div className="flex flex-col gap-1.5">
          {sampleReports.map(sample => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                selectedSampleId === sample.id 
                  ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 shadow-md' 
                  : 'bg-cyber-950/60 border-cyber-800 text-slate-300 hover:border-slate-700 hover:bg-cyber-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 font-mono text-[11px]">{sample.title}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyber-800 text-slate-400 font-mono">
                  {sample.category}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1 mt-1">{sample.summary}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Ingestion Form */}
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col flex-1 gap-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-mono font-semibold text-slate-300">
              RAW POLICE REPORT / FIR / CDR LOGS:
            </label>
            <span className="text-[10px] font-mono text-slate-400">
              {reportText.length} chars
            </span>
          </div>
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Paste police FIR transcript, CDR wiretap logs, bank accounts, suspect names, vehicle numbers, or intelligence briefs here..."
            rows={7}
            className="w-full p-2.5 rounded-lg bg-cyber-950 border border-cyber-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500 transition-colors resize-y placeholder:text-slate-600"
          />
        </div>

        {/* Source Type & Ingestion Options */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">SOURCE FORMAT:</label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              className="w-full p-1.5 rounded bg-cyber-950 border border-cyber-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="police_report">Police FIR / Incident</option>
              <option value="cdr">CDR / Telecommunications</option>
              <option value="financial">Financial / Hawala Ledger</option>
              <option value="surveillance">Surveillance Intercept</option>
              <option value="intelligence_brief">General Intel Brief</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">GRAPH MODE:</label>
            <select
              value={appendMode ? 'append' : 'replace'}
              onChange={(e) => setAppendMode(e.target.value === 'append')}
              className="w-full p-1.5 rounded bg-cyber-950 border border-cyber-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="append">Merge into Existing Graph</option>
              <option value="replace">Clear & Build New Graph</option>
            </select>
          </div>
        </div>

        {/* Submit Extraction Button */}
        <button
          type="submit"
          disabled={!reportText.trim() || extracting}
          className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono font-semibold tracking-wider text-xs flex items-center justify-center gap-2 shadow-glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {extracting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>PARSING ENTITIES & RELATIONS...</span>
            </>
          ) : (
            <>
              <Cpu className="w-4 h-4" />
              <span>ANALYZE & EXTRACT GRAPH</span>
            </>
          )}
        </button>
      </form>

      {/* Extraction Result Summary Banner */}
      {lastResult && (
        <div className="mt-4 p-3 rounded-lg bg-cyber-950/80 border border-emerald-500/40 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-[11px] mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>KNOWLEDGE GRAPH UPDATED</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
            {lastResult.summary}
          </p>
          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400 pt-2 border-t border-cyber-800">
            <span>+{lastResult.new_nodes_count} Targets</span>
            <span>+{lastResult.new_edges_count} Links</span>
            <span>Total: {lastResult.total_nodes} nodes</span>
          </div>
        </div>
      )}
    </div>
  );
}
