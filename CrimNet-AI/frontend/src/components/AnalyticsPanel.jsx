import React from 'react';
import { 
  TrendingUp, 
  AlertOctagon, 
  Award, 
  Zap
} from 'lucide-react';

const RISK_BADGES = {
  Critical: 'bg-red-950/80 border-red-500 text-red-400 font-bold',
  High: 'bg-amber-950/80 border-amber-500 text-amber-400 font-semibold',
  Medium: 'bg-cyan-950/80 border-cyan-500 text-cyan-400',
  Low: 'bg-slate-800 border-slate-600 text-slate-300'
};

export default function AnalyticsPanel({
  influencers,
  patterns,
  stats,
  onSelectNodeById,
  onHighlightPattern
}) {
  return (
    <div className="h-full flex flex-col p-4 bg-cyber-900 border-l border-cyber-800 overflow-y-auto text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyber-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-amber-950/70 border border-amber-700/50 text-amber-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 font-mono tracking-wide">INVESTIGATOR ANALYTICS</h2>
            <p className="text-[10px] text-slate-400">Graph Theory & Syndicate Topology Metrics</p>
          </div>
        </div>
      </div>

      {/* Network Metrics Overview */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-lg bg-cyber-950/80 border border-cyber-800">
          <div className="text-[10px] text-slate-400 font-mono">AVG CONNECTIONS</div>
          <div className="text-base font-bold text-cyan-400 font-mono mt-0.5">
            {stats?.avg_degree || 0} / node
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-cyber-950/80 border border-cyber-800">
          <div className="text-[10px] text-slate-400 font-mono">SUB-NETWORKS</div>
          <div className="text-base font-bold text-indigo-400 font-mono mt-0.5">
            {stats?.connected_components || 1} clusters
          </div>
        </div>
      </div>

      {/* Suspicious Pattern & Anomaly Alerts */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
            DETECTED SUSPICIOUS PATTERNS:
          </label>
          <span className="px-1.5 py-0.2 text-[9px] font-mono bg-red-950 border border-red-800 text-red-400 rounded">
            {patterns?.length || 0} FLAGS
          </span>
        </div>

        {(!patterns || patterns.length === 0) ? (
          <div className="p-3 text-center text-slate-500 rounded bg-cyber-950/50 border border-cyber-800 font-mono text-[11px]">
            No critical anomalies flagged currently.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {patterns.map((pat, idx) => (
              <div
                key={idx}
                onClick={() => onHighlightPattern && onHighlightPattern(pat.involved_nodes)}
                className="p-2.5 rounded-lg bg-red-950/30 hover:bg-red-950/50 border border-red-900/60 hover:border-red-600/70 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-red-400 font-mono text-[11px] flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    {pat.pattern_type}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${RISK_BADGES[pat.severity] || RISK_BADGES.High}`}>
                    {pat.severity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{pat.description}</p>
                {pat.involved_nodes && pat.involved_nodes.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {pat.involved_nodes.map(nid => (
                      <span
                        key={nid}
                        onClick={(e) => { e.stopPropagation(); onSelectNodeById(nid); }}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyber-900 border border-cyber-700 text-cyan-300 hover:border-cyan-400 transition-colors"
                      >
                        {nid}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Key Influencers Leaderboard */}
      <div className="mt-5 flex-1">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            TOP SYNDICATE INFLUENCERS:
          </label>
        </div>

        {(!influencers || influencers.length === 0) ? (
          <div className="p-3 text-center text-slate-500 rounded bg-cyber-950/50 border border-cyber-800 font-mono text-[11px]">
            No influencer data available.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {influencers.map((inf, idx) => (
              <div
                key={inf.node_id}
                onClick={() => onSelectNodeById(inf.node_id)}
                className="p-2.5 rounded-lg bg-cyber-950/80 hover:bg-cyber-850 border border-cyber-800 hover:border-cyan-500/60 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyber-800 text-cyan-400 font-mono font-bold text-[10px] shrink-0 border border-cyber-700">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-100 font-mono text-xs truncate group-hover:text-cyan-300">
                        {inf.label}
                      </span>
                      <span className={`text-[8px] px-1 py-0.2 rounded border font-mono ${RISK_BADGES[inf.risk_level] || RISK_BADGES.Medium}`}>
                        {inf.risk_level}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                      {inf.role_description} • {inf.degree} connections
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="text-xs font-mono font-bold text-amber-400">
                    {inf.influence_score}
                  </div>
                  <div className="text-[8px] font-mono text-slate-500">SCORE</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
