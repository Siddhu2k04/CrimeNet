import React from 'react';
import { 
  Trash2, 
  X, 
  Link, 
  Crosshair,
  Tag
} from 'lucide-react';

const RISK_BADGES = {
  Critical: 'bg-red-950/80 border-red-500 text-red-400 font-bold',
  High: 'bg-amber-950/80 border-amber-500 text-amber-400 font-semibold',
  Medium: 'bg-cyan-950/80 border-cyan-500 text-cyan-400',
  Low: 'bg-slate-800 border-slate-600 text-slate-300'
};

const CATEGORY_ICONS = {
  Person: '👤',
  Organization: '🏢',
  Phone: '📱',
  Vehicle: '🚗',
  FinancialAccount: '💳',
  Location: '📍',
  Event: '⚡',
  Contraband: '📦',
  Default: '🔹'
};

export default function EntityInspector({
  node,
  connectedEdges,
  allNodesMap,
  onClose,
  onSelectNode,
  onDeleteNode
}) {
  if (!node) return null;

  return (
    <div className="absolute right-4 top-20 bottom-4 w-96 glass-panel rounded-xl shadow-2xl border border-cyber-700/70 p-5 flex flex-col z-30 overflow-hidden font-mono text-xs backdrop-blur-xl animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Top Banner */}
      <div className="flex items-start justify-between pb-3 border-b border-cyber-800">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="text-2xl p-2 rounded-lg bg-cyber-900 border border-cyber-700">
            {CATEGORY_ICONS[node.category] || '🔹'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-mono ${RISK_BADGES[node.risk_level] || RISK_BADGES.Medium}`}>
                {node.risk_level} THREAT
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {node.category}
              </span>
            </div>
            <h3 className="font-bold text-slate-100 text-sm truncate mt-0.5" title={node.label}>
              {node.label}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-cyber-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto py-3.5 space-y-4">
        {/* Identifiers & Threat Metrics */}
        <div className="grid grid-cols-2 gap-2 bg-cyber-950/70 p-2.5 rounded-lg border border-cyber-800">
          <div>
            <span className="text-[9px] text-slate-500 uppercase">ENTITY ID</span>
            <div className="text-slate-200 font-semibold truncate text-[11px]" title={node.id}>
              {node.id}
            </div>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 uppercase">CONNECTIONS</span>
            <div className="text-cyan-400 font-bold text-sm">
              {node.degree || connectedEdges?.length || 0} links
            </div>
          </div>
          {node.centrality !== undefined && (
            <div>
              <span className="text-[9px] text-slate-500 uppercase">BETWEENNESS</span>
              <div className="text-indigo-400 font-semibold text-xs">
                {node.centrality}
              </div>
            </div>
          )}
          {node.influence_score !== undefined && (
            <div>
              <span className="text-[9px] text-slate-500 uppercase">INFLUENCE SCORE</span>
              <div className="text-amber-400 font-bold text-xs">
                {node.influence_score}
              </div>
            </div>
          )}
        </div>

        {/* Metadata Properties */}
        {node.properties && Object.keys(node.properties).length > 0 && (
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase mb-1.5 flex items-center gap-1">
              <Tag className="w-3 h-3 text-cyan-400" />
              INTELLIGENCE ATTRIBUTES:
            </div>
            <div className="bg-cyber-950/70 rounded-lg p-2.5 border border-cyber-800 space-y-1.5">
              {Object.entries(node.properties).map(([key, val]) => (
                <div key={key} className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 uppercase text-[10px] shrink-0">{key}:</span>
                  <span className="text-slate-200 text-right text-[11px] font-mono break-all">
                    {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connected Associates & Links */}
        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase mb-1.5 flex items-center gap-1">
            <Link className="w-3 h-3 text-indigo-400" />
            DIRECT SYNDICATE LINKS ({connectedEdges?.length || 0}):
          </div>
          {(!connectedEdges || connectedEdges.length === 0) ? (
            <div className="text-slate-500 p-2 text-center bg-cyber-950/50 rounded border border-cyber-800">
              No direct connections recorded.
            </div>
          ) : (
            <div className="space-y-1.5">
              {connectedEdges.map((edge, idx) => {
                const isSource = edge.source === node.id || edge.source?.id === node.id;
                const otherId = isSource 
                  ? (typeof edge.target === 'object' ? edge.target.id : edge.target)
                  : (typeof edge.source === 'object' ? edge.source.id : edge.source);
                const otherNode = allNodesMap[otherId];

                return (
                  <div
                    key={idx}
                    onClick={() => otherNode && onSelectNode(otherNode)}
                    className="p-2 rounded bg-cyber-950/90 hover:bg-cyber-850 border border-cyber-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-200 group-hover:text-cyan-300">
                        <span className="text-xs">{CATEGORY_ICONS[otherNode?.category] || '•'}</span>
                        <span className="truncate">{otherNode?.label || otherId}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 border border-indigo-800 text-indigo-300">
                        {edge.relationship}
                      </span>
                    </div>
                    {edge.evidence && (
                      <p className="text-[10px] text-slate-400 mt-1 italic border-l-2 border-slate-700 pl-1.5 line-clamp-2">
                        "{edge.evidence}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-cyber-800 flex items-center justify-between">
        <button
          onClick={() => onDeleteNode(node.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 transition-colors text-[11px]"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Node</span>
        </button>

        <button
          onClick={() => onSelectNode(node)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-700/60 text-cyan-300 transition-colors text-[11px]"
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>Focus Target</span>
        </button>
      </div>
    </div>
  );
}
