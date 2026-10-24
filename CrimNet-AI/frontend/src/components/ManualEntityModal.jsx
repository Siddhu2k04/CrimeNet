import React, { useState } from 'react';
import { X, ShieldAlert } from 'lucide-react';

export default function ManualEntityModal({ 
  isOpen, 
  onClose, 
  existingNodes, 
  onAddNode, 
  onAddEdge 
}) {
  const [activeTab, setActiveTab] = useState('node');
  
  // Node Form
  const [nodeId, setNodeId] = useState('');
  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeCategory, setNodeCategory] = useState('Person');
  const [nodeRisk, setNodeRisk] = useState('Medium');
  const [nodeRole, setNodeRole] = useState('');
  const [nodeNotes, setNodeNotes] = useState('');

  // Edge Form
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [relationship, setRelationship] = useState('ASSOCIATE_OF');
  const [edgeEvidence, setEdgeEvidence] = useState('');

  if (!isOpen) return null;

  const handleCreateNode = (e) => {
    e.preventDefault();
    if (!nodeLabel) return;
    const cleanId = nodeId.trim() || `node_${nodeCategory.toLowerCase()}_${Date.now()}`;
    onAddNode({
      id: cleanId,
      label: nodeLabel.trim(),
      category: nodeCategory,
      risk_level: nodeRisk,
      properties: {
        role: nodeRole.trim() || undefined,
        notes: nodeNotes.trim() || undefined
      }
    });
    onClose();
  };

  const handleCreateEdge = (e) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) return;
    onAddEdge({
      id: `${sourceId}-${relationship}-${targetId}`,
      source: sourceId,
      target: targetId,
      relationship: relationship,
      weight: 1.0,
      evidence: edgeEvidence.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-cyber-900 border border-cyber-700 rounded-xl p-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyber-800">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>MANUAL INTEL ENTRY</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 my-3 p-1 bg-cyber-950 rounded-lg border border-cyber-800">
          <button
            onClick={() => setActiveTab('node')}
            className={`flex-1 py-1.5 rounded text-center transition-all ${
              activeTab === 'node' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Add Target / Node
          </button>
          <button
            onClick={() => setActiveTab('edge')}
            className={`flex-1 py-1.5 rounded text-center transition-all ${
              activeTab === 'edge' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Add Connection / Edge
          </button>
        </div>

        {activeTab === 'node' ? (
          <form onSubmit={handleCreateNode} className="space-y-3">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">LABEL / DISPLAY NAME *</label>
              <input
                type="text"
                required
                value={nodeLabel}
                onChange={(e) => setNodeLabel(e.target.value)}
                placeholder="e.g., Vikram Singhania, +91-98765-43210"
                className="w-full p-2 rounded bg-cyber-950 border border-cyber-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">CATEGORY</label>
                <select
                  value={nodeCategory}
                  onChange={(e) => setNodeCategory(e.target.value)}
                  className="w-full p-2 rounded bg-cyber-950 border border-cyber-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Person">Person / Suspect</option>
                  <option value="Organization">Organization / Shell</option>
                  <option value="Phone">Phone / SIM</option>
                  <option value="Vehicle">Vehicle / Transport</option>
                  <option value="FinancialAccount">Financial Account</option>
                  <option value="Location">Location / Safehouse</option>
                  <option value="Contraband">Contraband / Cache</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">THREAT LEVEL</label>
                <select
                  value={nodeRisk}
                  onChange={(e) => setNodeRisk(e.target.value)}
                  className="w-full p-2 rounded bg-cyber-950 border border-cyber-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Critical">Critical Threat</option>
                  <option value="High">High Threat</option>
                  <option value="Medium">Medium Threat</option>
                  <option value="Low">Low Threat</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">ROLE / ALIAS</label>
              <input
                type="text"
                value={nodeRole}
                onChange={(e) => setNodeRole(e.target.value)}
                placeholder="e.g., Kingpin, Hawala Operator, Arms Courier"
                className="w-full p-2 rounded bg-cyber-950 border border-cyber-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">NOTES</label>
              <textarea
                value={nodeNotes}
                onChange={(e) => setNodeNotes(e.target.value)}
                rows={2}
                placeholder="Additional case background..."
                className="w-full p-2 rounded bg-cyber-950 border border-cyber-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-wider mt-2 transition-colors"
            >
              SAVE TARGET TO GRAPH
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreateEdge} className="space-y-3">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">SOURCE TARGET *</label>
              <select
                required
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="w-full p-2 rounded bg-cyber-950 border border-cyber-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Select Source Node --</option>
                {existingNodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.label} [{n.category}]
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">RELATIONSHIP TYPE</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full p-2 rounded bg-cyber-950 border border-cyber-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="COMMANDS">COMMANDS</option>
                <option value="FUNDS">FUNDS</option>
                <option value="CALLS">CALLS</option>
                <option value="OPERATES_OUT_OF">OPERATES_OUT_OF</option>
                <option value="ASSOCIATE_OF">ASSOCIATE_OF</option>
                <option value="OWNS_VEHICLE">OWNS_VEHICLE</option>
                <option value="MEETS_WITH">MEETS_WITH</option>
                <option value="TRANSFERS_TO">TRANSFERS_TO</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">TARGET NODE *</label>
              <select
                required
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full p-2 rounded bg-cyber-950 border border-cyber-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Select Target Node --</option>
                {existingNodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.label} [{n.category}]
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">EVIDENCE / INTELLIGENCE PROOF</label>
              <textarea
                value={edgeEvidence}
                onChange={(e) => setEdgeEvidence(e.target.value)}
                rows={2}
                placeholder="Excerpt from police wiretap, bank statement, or surveillance log..."
                className="w-full p-2 rounded bg-cyber-950 border border-cyber-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wider mt-2 transition-colors"
            >
              LINK ENTITIES IN GRAPH
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
