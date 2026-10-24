-- ==========================================================
-- CrimNet AI - Criminal Intelligence Knowledge Graph Schema
-- PostgreSQL / Supabase DDL
-- ==========================================================

-- 1. Nodes Table (Entities: Suspects, Phones, Locations, Vehicles, Accounts)
CREATE TABLE IF NOT EXISTS nodes (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    category TEXT NOT NULL,
    risk_level TEXT DEFAULT 'Medium',
    properties JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Edges Table (Relationships: COMMANDS, FUNDS, OPERATES_OUT_OF, CALLS, etc.)
CREATE TABLE IF NOT EXISTS edges (
    id TEXT PRIMARY KEY,
    source TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    target TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    relationship TEXT NOT NULL,
    weight NUMERIC DEFAULT 1.0,
    evidence TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_nodes_category ON nodes(category);
CREATE INDEX IF NOT EXISTS idx_nodes_risk ON nodes(risk_level);
CREATE INDEX IF NOT EXISTS idx_edges_source ON edges(source);
CREATE INDEX IF NOT EXISTS idx_edges_target ON edges(target);
CREATE INDEX IF NOT EXISTS idx_edges_rel ON edges(relationship);

-- Row Level Security
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE edges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read nodes" ON nodes FOR SELECT USING (true);
CREATE POLICY "Public write nodes" ON nodes FOR ALL USING (true);
CREATE POLICY "Public read edges" ON edges FOR SELECT USING (true);
CREATE POLICY "Public write edges" ON edges FOR ALL USING (true);
