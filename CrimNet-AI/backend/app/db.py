import logging
import sqlite3
import json
from typing import List, Dict, Any, Optional
from app.config import settings

logger = logging.getLogger("crimnet.db")

# Initialize Supabase client
supabase_client = None
try:
    from supabase import create_client, Client
    if settings.SUPABASE_URL and settings.SUPABASE_KEY:
        supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        logger.info("Supabase PostgreSQL client connected.")
except Exception as e:
    logger.warning(f"Supabase connection notice: {e}. Resilient local database engine active.")

# Local resilient SQLite backup for persistent graph cache
DB_PATH = "crimnet_database.db"

def init_local_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS local_nodes (
            id TEXT PRIMARY KEY,
            label TEXT NOT NULL,
            category TEXT NOT NULL,
            risk_level TEXT DEFAULT 'Medium',
            properties TEXT DEFAULT '{}',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS local_edges (
            id TEXT PRIMARY KEY,
            source TEXT NOT NULL,
            target TEXT NOT NULL,
            relationship TEXT NOT NULL,
            weight REAL DEFAULT 1.0,
            evidence TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_local_db()

class GraphDatabase:
    @staticmethod
    def upsert_node(node: Dict[str, Any]) -> Dict[str, Any]:
        """Upsert entity node to graph storage."""
        node_id = str(node.get("id")).strip()
        label = str(node.get("label", node_id)).strip()
        category = str(node.get("category", "Person")).strip()
        risk_level = str(node.get("risk_level", "Medium")).strip()
        props = node.get("properties", {})
        if isinstance(props, str):
            try:
                props = json.loads(props)
            except:
                props = {"raw": props}

        payload = {
            "id": node_id,
            "label": label,
            "category": category,
            "risk_level": risk_level,
            "properties": props
        }

        # 1. Save to local SQLite
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO local_nodes (id, label, category, risk_level, properties)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    label=excluded.label,
                    category=excluded.category,
                    risk_level=excluded.risk_level,
                    properties=excluded.properties
            """, (node_id, label, category, risk_level, json.dumps(props)))
            conn.commit()
            conn.close()
        except Exception as e:
            logger.error(f"Local database upsert error: {e}")

        # 2. Sync to Supabase if connected
        if supabase_client:
            try:
                supabase_client.table("nodes").upsert(payload).execute()
            except Exception as e:
                logger.debug(f"Supabase sync notice: {e}")

        return payload

    @staticmethod
    def upsert_edge(edge: Dict[str, Any]) -> Dict[str, Any]:
        """Upsert relationship edge to graph storage."""
        edge_id = str(edge.get("id", f"{edge.get('source')}-{edge.get('relationship')}-{edge.get('target')}")).strip()
        source = str(edge.get("source")).strip()
        target = str(edge.get("target")).strip()
        relationship = str(edge.get("relationship", "ASSOCIATE_OF")).strip().upper()
        weight = float(edge.get("weight", 1.0))
        evidence = str(edge.get("evidence", "")).strip()

        payload = {
            "id": edge_id,
            "source": source,
            "target": target,
            "relationship": relationship,
            "weight": weight,
            "evidence": evidence
        }

        # 1. Save to local SQLite
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO local_edges (id, source, target, relationship, weight, evidence)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    relationship=excluded.relationship,
                    weight=excluded.weight,
                    evidence=excluded.evidence
            """, (edge_id, source, target, relationship, weight, evidence))
            conn.commit()
            conn.close()
        except Exception as e:
            logger.error(f"Local edge upsert error: {e}")

        # 2. Sync to Supabase
        if supabase_client:
            try:
                supabase_client.table("edges").upsert(payload).execute()
            except Exception as e:
                logger.debug(f"Supabase sync notice: {e}")

        return payload

    @staticmethod
    def get_all_nodes() -> List[Dict[str, Any]]:
        """Fetch all nodes."""
        if supabase_client:
            try:
                res = supabase_client.table("nodes").select("*").execute()
                if res.data and len(res.data) > 0:
                    return res.data
            except Exception:
                pass

        # Fallback to local DB
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, label, category, risk_level, properties, created_at FROM local_nodes")
        rows = cursor.fetchall()
        conn.close()

        nodes = []
        for r in rows:
            props = {}
            if r[4]:
                try:
                    props = json.loads(r[4])
                except:
                    pass
            nodes.append({
                "id": r[0],
                "label": r[1],
                "category": r[2],
                "risk_level": r[3],
                "properties": props,
                "created_at": r[5]
            })
        return nodes

    @staticmethod
    def get_all_edges() -> List[Dict[str, Any]]:
        """Fetch all edges."""
        if supabase_client:
            try:
                res = supabase_client.table("edges").select("*").execute()
                if res.data and len(res.data) > 0:
                    return res.data
            except Exception:
                pass

        # Fallback to local DB
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, source, target, relationship, weight, evidence, created_at FROM local_edges")
        rows = cursor.fetchall()
        conn.close()

        edges = []
        for r in rows:
            edges.append({
                "id": r[0],
                "source": r[1],
                "target": r[2],
                "relationship": r[3],
                "weight": r[4],
                "evidence": r[5],
                "created_at": r[6]
            })
        return edges

    @staticmethod
    def clear_graph():
        """Clear all nodes and edges."""
        if supabase_client:
            try:
                supabase_client.table("edges").delete().neq("id", "none").execute()
                supabase_client.table("nodes").delete().neq("id", "none").execute()
            except Exception:
                pass

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM local_edges")
        cursor.execute("DELETE FROM local_nodes")
        conn.commit()
        conn.close()

db = GraphDatabase()
