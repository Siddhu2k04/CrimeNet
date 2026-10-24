import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import FilterToolbar from './components/FilterToolbar';
import GraphView from './components/GraphView';
import IngestionPanel from './components/IngestionPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import EntityInspector from './components/EntityInspector';
import ManualEntityModal from './components/ManualEntityModal';
import { 
  fetchNetwork, 
  extractIntelligence, 
  fetchSampleReports, 
  resetNetwork, 
  deleteNode, 
  createNode, 
  createEdge 
} from './services/api';

export default function App() {
  // Graph & System state
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [stats, setStats] = useState({ total_nodes: 0, total_edges: 0, density: 0, avg_degree: 0 });
  const [influencers, setInfluencers] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [sampleReports, setSampleReports] = useState([]);
  
  // Interaction state
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightCategory, setHighlightCategory] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('ingest');
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [lastExtractionResult, setLastExtractionResult] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'info') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [netData, reports] = await Promise.all([
        fetchNetwork(),
        fetchSampleReports()
      ]);
      setGraphData({ nodes: netData.nodes || [], links: netData.links || [] });
      setStats(netData.stats || {});
      setInfluencers(netData.key_influencers || []);
      setPatterns(netData.suspicious_patterns || []);
      setSampleReports(reports || []);
    } catch (err) {
      console.error('Failed to load graph data:', err);
      showToast('Could not reach backend API. Retrying...', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const allNodesMap = useMemo(() => {
    const map = {};
    (graphData.nodes || []).forEach(n => {
      map[n.id] = n;
    });
    return map;
  }, [graphData.nodes]);

  const selectedNodeEdges = useMemo(() => {
    if (!selectedNode || !graphData.links) return [];
    return graphData.links.filter(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      return sourceId === selectedNode.id || targetId === selectedNode.id;
    });
  }, [selectedNode, graphData.links]);

  const criticalCount = useMemo(() => {
    return (graphData.nodes || []).filter(n => n.risk_level === 'Critical').length;
  }, [graphData.nodes]);

  const handleExtract = async (text, sourceType, appendMode) => {
    setExtracting(true);
    try {
      const result = await extractIntelligence(text, sourceType, appendMode);
      setLastExtractionResult(result);
      showToast(`Extracted ${result.new_nodes_count} entities & ${result.new_edges_count} relationships!`, 'success');
      await loadData();
    } catch (err) {
      console.error('Extraction error:', err);
      showToast(err.message || 'AI extraction failed.', 'error');
    } finally {
      setExtracting(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset network to default baseline syndicate intelligence data?')) {
      try {
        await resetNetwork();
        setSelectedNode(null);
        setLastExtractionResult(null);
        showToast('Network reset to baseline syndicate dataset.', 'info');
        await loadData();
      } catch (err) {
        showToast('Failed to reset network.', 'error');
      }
    }
  };

  const handleDeleteNode = async (nodeId) => {
    if (window.confirm(`Delete entity '${nodeId}' from intelligence graph?`)) {
      try {
        await deleteNode(nodeId);
        setSelectedNode(null);
        showToast(`Target ${nodeId} deleted.`, 'info');
        await loadData();
      } catch (err) {
        showToast('Failed to delete entity.', 'error');
      }
    }
  };

  const handleAddNode = async (newNode) => {
    try {
      await createNode(newNode);
      showToast(`Added entity ${newNode.label}`, 'success');
      await loadData();
    } catch (err) {
      showToast('Failed to create entity.', 'error');
    }
  };

  const handleAddEdge = async (newEdge) => {
    try {
      await createEdge(newEdge);
      showToast(`Linked ${newEdge.source} ➔ ${newEdge.target}`, 'success');
      await loadData();
    } catch (err) {
      showToast('Failed to create link.', 'error');
    }
  };

  const handleSelectNodeById = (nodeId) => {
    const node = allNodesMap[nodeId];
    if (node) {
      setSelectedNode(node);
    }
  };

  const handleExport = () => {
    const exportData = {
      project: "CrimNet AI Criminal Intelligence Network",
      export_timestamp: new Date().toISOString(),
      stats,
      key_influencers: influencers,
      suspicious_patterns: patterns,
      nodes: graphData.nodes,
      edges: graphData.links
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CrimNet_Intelligence_Dossier_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported Intelligence Dossier successfully.', 'success');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-cyber-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Header */}
      <Header
        stats={stats}
        onReset={handleReset}
        onRefresh={loadData}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onExport={handleExport}
        loading={loading}
        criticalCount={criticalCount}
      />

      {/* Filter & Sub-Nav Toolbar */}
      <FilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        highlightCategory={highlightCategory}
        onCategoryChange={setHighlightCategory}
        riskFilter={riskFilter}
        onRiskChange={setRiskFilter}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Side: Ingestion Panel */}
        {activeTab === 'ingest' && (
          <div className="w-80 lg:w-96 shrink-0 z-20 shadow-xl">
            <IngestionPanel
              sampleReports={sampleReports}
              onExtract={handleExtract}
              extracting={extracting}
              lastResult={lastExtractionResult}
            />
          </div>
        )}

        {/* Center: Force-Directed Graph */}
        <div className="flex-1 relative h-full">
          <GraphView
            graphData={graphData}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            highlightCategory={highlightCategory}
            searchQuery={searchQuery}
            riskFilter={riskFilter}
          />

          {/* Deep Inspector Drawer */}
          {selectedNode && (
            <EntityInspector
              node={selectedNode}
              connectedEdges={selectedNodeEdges}
              allNodesMap={allNodesMap}
              onClose={() => setSelectedNode(null)}
              onSelectNode={setSelectedNode}
              onDeleteNode={handleDeleteNode}
            />
          )}
        </div>

        {/* Right Side: Analytics Panel */}
        {activeTab === 'analytics' && (
          <div className="w-80 lg:w-96 shrink-0 z-20 shadow-xl">
            <AnalyticsPanel
              influencers={influencers}
              patterns={patterns}
              stats={stats}
              onSelectNodeById={handleSelectNodeById}
              onHighlightPattern={(nodes) => {
                if (nodes && nodes.length > 0) {
                  const firstNode = allNodesMap[nodes[0]];
                  if (firstNode) setSelectedNode(firstNode);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Manual Intel Entry Modal */}
      <ManualEntityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        existingNodes={graphData.nodes}
        onAddNode={handleAddNode}
        onAddEdge={handleAddEdge}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg border font-mono text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 ${
          toastMessage.type === 'error'
            ? 'bg-red-950/90 border-red-500 text-red-300'
            : toastMessage.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
            : 'bg-cyber-900/90 border-cyan-500 text-cyan-300'
        }`}>
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
