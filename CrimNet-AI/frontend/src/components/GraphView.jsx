import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  Eye
} from 'lucide-react';

const CATEGORY_COLORS = {
  Person: '#ef4444',            // Crimson Red
  Organization: '#8b5cf6',      // Violet Purple
  Phone: '#06b6d4',             // Cyan
  Vehicle: '#10b981',           // Emerald Green
  FinancialAccount: '#f59e0b',  // Amber Gold
  Location: '#3b82f6',          // Ocean Blue
  Event: '#ec4899',             // Hot Pink
  Contraband: '#f43f5e',        // Rose
  Default: '#94a3b8'            // Slate
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

const RELATIONSHIP_COLORS = {
  COMMANDS: '#ef4444',
  FUNDS: '#f59e0b',
  CALLS: '#06b6d4',
  OPERATES_OUT_OF: '#3b82f6',
  ASSOCIATE_OF: '#a855f7',
  OWNS_VEHICLE: '#10b981',
  MEETS_WITH: '#ec4899',
  DEFAULT: '#64748b'
};

export default function GraphView({
  graphData,
  selectedNode,
  onSelectNode,
  highlightCategory,
  searchQuery,
  riskFilter
}) {
  const fgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoverNode, setHoverNode] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [isPhysicsRunning, setIsPhysicsRunning] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const filteredData = useMemo(() => {
    if (!graphData || !graphData.nodes) return { nodes: [], links: [] };

    let filteredNodes = graphData.nodes.filter(node => {
      if (highlightCategory && highlightCategory !== 'ALL' && node.category !== highlightCategory) {
        return false;
      }
      if (riskFilter && riskFilter !== 'ALL' && node.risk_level !== riskFilter) {
        return false;
      }
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchLabel = (node.label || '').toLowerCase().includes(q);
        const matchId = (node.id || '').toLowerCase().includes(q);
        const matchRole = (node.properties?.role || '').toLowerCase().includes(q);
        const matchAlias = (node.properties?.alias || '').toLowerCase().includes(q);
        if (!matchLabel && !matchId && !matchRole && !matchAlias) return false;
      }
      return true;
    });

    const activeNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = (graphData.links || []).filter(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      return activeNodeIds.has(sourceId) && activeNodeIds.has(targetId);
    });

    return { nodes: filteredNodes, links: filteredLinks };
  }, [graphData, highlightCategory, riskFilter, searchQuery]);

  const handleNodeHover = useCallback((node) => {
    setHoverNode(node || null);
    const nodes = new Set();
    const links = new Set();

    if (node && filteredData.links) {
      nodes.add(node.id);
      filteredData.links.forEach(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        if (sourceId === node.id || targetId === node.id) {
          links.add(link);
          nodes.add(sourceId);
          nodes.add(targetId);
        }
      });
    }

    setHighlightNodes(nodes);
    setHighlightLinks(links);
  }, [filteredData]);

  const handleNodeClick = useCallback((node) => {
    onSelectNode(node);
    if (fgRef.current && node.x !== undefined && node.y !== undefined) {
      fgRef.current.centerAt(node.x, node.y, 800);
      fgRef.current.zoom(2.5, 800);
    }
  }, [onSelectNode]);

  const handleZoomIn = () => fgRef.current && fgRef.current.zoom(fgRef.current.zoom() * 1.3, 400);
  const handleZoomOut = () => fgRef.current && fgRef.current.zoom(fgRef.current.zoom() / 1.3, 400);
  const handleZoomFit = () => fgRef.current && fgRef.current.zoomToFit(600, 50);

  const paintNode = useCallback((node, ctx, globalScale) => {
    const isSelected = selectedNode && selectedNode.id === node.id;
    const isHovered = hoverNode && hoverNode.id === node.id;
    const isHighlighted = highlightNodes.size === 0 || highlightNodes.has(node.id);
    const isKeyInfluencer = node.is_key_influencer || (node.degree && node.degree >= 4);
    const isCriticalRisk = node.risk_level === 'Critical';

    const baseRadius = 6 + Math.min(10, (node.degree || 1) * 1.8);
    const color = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.Default;

    ctx.save();
    ctx.globalAlpha = isHighlighted ? 1.0 : 0.15;

    // Glowing halo for key influencers / critical threats
    if (isKeyInfluencer || isCriticalRisk || isSelected) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, baseRadius + 7, 0, 2 * Math.PI, false);
      ctx.fillStyle = isCriticalRisk ? 'rgba(239, 68, 68, 0.25)' : 'rgba(6, 182, 212, 0.25)';
      ctx.fill();

      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.arc(node.x, node.y, baseRadius + 10, 0, 2 * Math.PI, false);
      ctx.strokeStyle = isCriticalRisk ? '#ef4444' : '#06b6d4';
      ctx.lineWidth = 1.2 / globalScale;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Node core circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, baseRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = (isSelected || isHovered) ? 15 : 6;
    ctx.fill();

    ctx.lineWidth = (isSelected ? 3 : 1.5) / globalScale;
    ctx.strokeStyle = isSelected ? '#ffffff' : '#0a0f18';
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Category icon
    const icon = CATEGORY_ICONS[node.category] || '•';
    const iconFontSize = Math.max(8, baseRadius * 0.95);
    ctx.font = `${iconFontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(icon, node.x, node.y);

    // Label banner
    if (showLabels || isSelected || isHovered || isKeyInfluencer || globalScale > 1.4) {
      const label = node.label || node.id;
      const fontSize = Math.max(10, 12 / globalScale);
      ctx.font = `600 ${fontSize}px 'JetBrains Mono', monospace`;
      
      const textWidth = ctx.measureText(label).width;
      const bgHeight = fontSize + 4;
      const bgY = node.y + baseRadius + 4;

      ctx.fillStyle = 'rgba(10, 15, 24, 0.85)';
      ctx.strokeStyle = isSelected ? '#ffffff' : (isCriticalRisk ? '#ef4444' : 'rgba(255,255,255,0.15)');
      ctx.lineWidth = 1 / globalScale;
      ctx.fillRect(node.x - textWidth / 2 - 4, bgY, textWidth + 8, bgHeight);
      ctx.strokeRect(node.x - textWidth / 2 - 4, bgY, textWidth + 8, bgHeight);

      ctx.fillStyle = isSelected ? '#38bdf8' : (isCriticalRisk ? '#fca5a5' : '#f1f5f9');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, node.x, bgY + bgHeight / 2);

      if (node.properties?.role && (isSelected || isHovered || globalScale > 2.0)) {
        const role = node.properties.role;
        const roleFontSize = Math.max(8, 9 / globalScale);
        ctx.font = `${roleFontSize}px 'Inter', sans-serif`;
        const roleWidth = ctx.measureText(role).width;
        const roleY = bgY + bgHeight + 2;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(node.x - roleWidth / 2 - 3, roleY, roleWidth + 6, roleFontSize + 4);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(role, node.x, roleY + (roleFontSize + 4) / 2);
      }
    }

    ctx.restore();
  }, [selectedNode, hoverNode, highlightNodes, showLabels]);

  const getLinkColor = useCallback((link) => {
    const isHighlighted = highlightLinks.size === 0 || highlightLinks.has(link);
    if (!isHighlighted) return 'rgba(30, 41, 59, 0.15)';
    return RELATIONSHIP_COLORS[link.relationship] || RELATIONSHIP_COLORS.DEFAULT;
  }, [highlightLinks]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-cyber-950 tactical-grid overflow-hidden">
      {/* Floating Tactical Overlay Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 p-1.5 rounded-lg glass-panel font-mono text-xs shadow-lg">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded hover:bg-cyber-800 text-slate-300 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded hover:bg-cyber-800 text-slate-300 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomFit}
            className="p-1.5 rounded hover:bg-cyber-800 text-slate-300 hover:text-white transition-colors"
            title="Fit to Screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-cyber-800" />
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`p-1.5 rounded transition-colors ${showLabels ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60' : 'hover:bg-cyber-800 text-slate-400'}`}
            title="Toggle All Node Labels"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (isPhysicsRunning) {
                fgRef.current.pauseAnimation();
              } else {
                fgRef.current.resumeAnimation();
              }
              setIsPhysicsRunning(!isPhysicsRunning);
            }}
            className={`p-1.5 rounded transition-colors ${isPhysicsRunning ? 'hover:bg-cyber-800 text-emerald-400' : 'bg-amber-950 text-amber-400 border border-amber-800/60'}`}
            title={isPhysicsRunning ? 'Pause Physics Force' : 'Resume Physics'}
          >
            {isPhysicsRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ForceGraph2D Canvas */}
      {dimensions.width > 0 && (
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={filteredData}
          nodeId="id"
          nodeLabel={node => `${node.label} [${node.category} - ${node.risk_level} Risk]`}
          nodeCanvasObject={paintNode}
          nodeCanvasObjectMode={() => 'replace'}
          nodePointerAreaPaint={(node, color, ctx) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 16, 0, 2 * Math.PI, false);
            ctx.fill();
          }}
          linkColor={getLinkColor}
          linkWidth={link => (highlightLinks.has(link) ? 2.8 : 1.2)}
          linkDirectionalArrowLength={5}
          linkDirectionalArrowRelPos={0.85}
          linkDirectionalArrowColor={getLinkColor}
          linkDirectionalParticles={link => (highlightLinks.has(link) || link.relationship === 'COMMANDS' || link.relationship === 'FUNDS' ? 3 : 0)}
          linkDirectionalParticleSpeed={0.008}
          linkDirectionalParticleWidth={2.5}
          linkDirectionalParticleColor={getLinkColor}
          linkLabel={link => `<div class="bg-cyber-900 border border-cyber-700 text-xs px-2 py-1 rounded text-cyan-300 font-mono"><b>${link.relationship}</b><br/>${link.evidence || ''}</div>`}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          onBackgroundClick={() => onSelectNode(null)}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          cooldownTicks={100}
        />
      )}

      {/* Legend Footer */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-3 px-3 py-2 rounded-lg glass-panel text-[11px] font-mono text-slate-300 border border-cyber-800">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">LEGEND:</span>
        {Object.entries(CATEGORY_COLORS).filter(([k]) => k !== 'Default').map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span>{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
