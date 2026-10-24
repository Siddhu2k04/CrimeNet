const API_BASE = '/api';

export async function fetchNetwork() {
  const res = await fetch(`${API_BASE}/network`);
  if (!res.ok) throw new Error(`Network fetch error: ${res.statusText}`);
  return res.json();
}

export async function extractIntelligence(text, sourceType = 'police_report', appendMode = true) {
  const res = await fetch(`${API_BASE}/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, source_type: sourceType, append_mode: appendMode }),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Extraction error: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchSampleReports() {
  const res = await fetch(`${API_BASE}/sample-reports`);
  if (!res.ok) throw new Error(`Reports fetch error: ${res.statusText}`);
  return res.json();
}

export async function resetNetwork() {
  const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
  if (!res.ok) throw new Error(`Reset error: ${res.statusText}`);
  return res.json();
}

export async function deleteNode(nodeId) {
  const res = await fetch(`${API_BASE}/nodes/${encodeURIComponent(nodeId)}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Delete error: ${res.statusText}`);
  return res.json();
}

export async function createNode(node) {
  const res = await fetch(`${API_BASE}/nodes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(node)
  });
  if (!res.ok) throw new Error(`Create node error: ${res.statusText}`);
  return res.json();
}

export async function createEdge(edge) {
  const res = await fetch(`${API_BASE}/edges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(edge)
  });
  if (!res.ok) throw new Error(`Create edge error: ${res.statusText}`);
  return res.json();
}
