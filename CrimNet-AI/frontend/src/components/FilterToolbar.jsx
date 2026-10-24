import React from 'react';
import { 
  Search, 
  Filter, 
  X,
  FileText,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';

const CATEGORIES = [
  'ALL',
  'Person',
  'Organization',
  'Phone',
  'Vehicle',
  'FinancialAccount',
  'Location'
];

const RISKS = ['ALL', 'Critical', 'High', 'Medium', 'Low'];

export default function FilterToolbar({
  searchQuery,
  onSearchChange,
  highlightCategory,
  onCategoryChange,
  riskFilter,
  onRiskChange,
  activeTab,
  onTabChange
}) {
  return (
    <div className="h-12 px-4 bg-cyber-950 border-b border-cyber-800 flex items-center justify-between gap-4 font-mono text-xs z-20">
      {/* Search Input */}
      <div className="relative flex-1 max-w-xs">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search suspects, phones, plates, accounts..."
          className="w-full pl-8 pr-7 py-1.5 rounded-md bg-cyber-900 border border-cyber-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 placeholder:text-slate-600 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="hidden xl:flex items-center gap-1">
        <span className="text-[10px] text-slate-500 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> CATEGORY:
        </span>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-2 py-1 rounded text-[11px] transition-all ${
              highlightCategory === cat
                ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold shadow-sm'
                : 'bg-cyber-900 border border-cyber-800 text-slate-400 hover:text-slate-200 hover:bg-cyber-850'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Threat Filter */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-slate-500 hidden sm:inline">THREAT:</span>
        <select
          value={riskFilter}
          onChange={(e) => onRiskChange(e.target.value)}
          className="px-2 py-1 rounded bg-cyber-900 border border-cyber-800 text-slate-300 text-xs focus:outline-none focus:border-cyan-500"
        >
          {RISKS.map(r => (
            <option key={r} value={r}>
              {r === 'ALL' ? 'All Threats' : `${r} Threat`}
            </option>
          ))}
        </select>
      </div>

      {/* View Toggle Tabs */}
      <div className="flex items-center gap-1 bg-cyber-900 p-0.5 rounded-lg border border-cyber-800">
        <button
          onClick={() => onTabChange('ingest')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
            activeTab === 'ingest'
              ? 'bg-cyan-600 text-white font-semibold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ingest</span>
        </button>
        <button
          onClick={() => onTabChange('analytics')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
            activeTab === 'analytics'
              ? 'bg-amber-600 text-white font-semibold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Analytics</span>
        </button>
        <button
          onClick={() => onTabChange('graph_only')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
            activeTab === 'graph_only'
              ? 'bg-indigo-600 text-white font-semibold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Full Graph</span>
        </button>
      </div>
    </div>
  );
}
