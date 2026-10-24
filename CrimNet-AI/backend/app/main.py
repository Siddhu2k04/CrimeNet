import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List

from app.config import settings
from app.models import (
    NodeModel, EdgeModel, ExtractRequest, ExtractResponse,
    NetworkResponse, SampleReport, SuspiciousPattern
)
from app.db import db, supabase_client
from app.nlp_extractor import extract_intelligence_pipeline
from app.graph_analytics import calculate_network_metrics
from app.sample_data import SAMPLE_REPORTS, INITIAL_NODES, INITIAL_EDGES

# Setup Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("crimnet.main")

def seed_initial_data_if_empty():
    """Populate baseline intelligence network if database is empty."""
    nodes = db.get_all_nodes()
    if not nodes or len(nodes) == 0:
        logger.info("Initializing baseline intelligence network dataset...")
        for n in INITIAL_NODES:
            db.upsert_node(n)
        for e in INITIAL_EDGES:
            db.upsert_edge(e)
        logger.info(f"Loaded {len(INITIAL_NODES)} nodes and {len(INITIAL_EDGES)} edges.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_initial_data_if_empty()
    yield

app = FastAPI(
    title=settings.APP_NAME,
    description="Neural NLP Criminal Intelligence Knowledge Graph & Network Analytics Engine",
    version=settings.VERSION,
    lifespan=lifespan
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "system": settings.APP_NAME,
        "version": settings.VERSION,
        "nlp_engine": "Local Neural-Heuristic Parser (Active)",
        "database": "PostgreSQL / SQLite Graph Cache"
    }

@app.get("/api/sample-reports", response_model=List[SampleReport])
async def get_sample_reports():
    """Retrieve pre-built intelligence case reports for evaluation."""
    return SAMPLE_REPORTS

@app.get("/api/network", response_model=NetworkResponse)
async def get_network():
    """Fetch complete knowledge graph, centrality metrics, key influencers, and suspicious patterns."""
    raw_nodes = db.get_all_nodes()
    raw_edges = db.get_all_edges()

    if not raw_nodes:
        seed_initial_data_if_empty()
        raw_nodes = db.get_all_nodes()
        raw_edges = db.get_all_edges()

    # Calculate metrics with NetworkX
    analysis = calculate_network_metrics(raw_nodes, raw_edges)
    
    # Format links for graph rendering
    links = []
    for e in raw_edges:
        links.append({
            "id": e.get("id"),
            "source": e.get("source"),
            "target": e.get("target"),
            "relationship": e.get("relationship", "CONNECTED_TO"),
            "weight": e.get("weight", 1.0),
            "evidence": e.get("evidence", "")
        })

    categories = list(set([n.get("category", "Person") for n in raw_nodes]))

    return NetworkResponse(
        nodes=analysis["enriched_nodes"],
        links=links,
        stats=analysis["stats"],
        key_influencers=analysis["key_influencers"],
        suspicious_patterns=analysis["suspicious_patterns"],
        categories=categories
    )

@app.post("/api/extract", response_model=ExtractResponse)
async def extract_intelligence(req: ExtractRequest):
    """
    Ingests unstructured criminal intelligence, FIRs, CDRs, or Hawala reports,
    executes neural NLP entity & relationship extraction, persists them to graph store,
    and returns updated topology.
    """
    try:
        extracted_data = await extract_intelligence_pipeline(req.text)
        
        extracted_nodes = extracted_data.get("nodes", [])
        extracted_edges = extracted_data.get("edges", [])
        summary = extracted_data.get("summary", "Intelligence report processed.")
        raw_patterns = extracted_data.get("suspicious_patterns", [])

        if not req.append_mode:
            db.clear_graph()

        new_nodes_saved = []
        new_edges_saved = []

        # Upsert nodes
        for node_dict in extracted_nodes:
            saved = db.upsert_node(node_dict)
            new_nodes_saved.append(NodeModel(**saved))

        # Upsert edges
        for edge_dict in extracted_edges:
            saved = db.upsert_edge(edge_dict)
            new_edges_saved.append(EdgeModel(**saved))

        all_nodes = db.get_all_nodes()
        all_edges = db.get_all_edges()

        # Re-compute network metrics
        analysis = calculate_network_metrics(all_nodes, all_edges)
        
        # Merge pattern alerts
        suspicious_patterns = []
        for p in raw_patterns:
            suspicious_patterns.append(SuspiciousPattern(
                pattern_type=p.get("pattern_type", "Suspicious Activity"),
                severity=p.get("severity", "High"),
                description=p.get("description", ""),
                involved_nodes=p.get("involved_nodes", []),
                confidence=p.get("confidence", 0.9)
            ))
        
        suspicious_patterns.extend(analysis.get("suspicious_patterns", []))

        return ExtractResponse(
            success=True,
            summary=summary,
            extracted_nodes=new_nodes_saved,
            extracted_edges=new_edges_saved,
            suspicious_patterns=suspicious_patterns[:8],
            new_nodes_count=len(new_nodes_saved),
            new_edges_count=len(new_edges_saved),
            total_nodes=len(all_nodes),
            total_edges=len(all_edges)
        )
    except Exception as e:
        logger.error(f"Intelligence extraction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Knowledge Graph Extraction failed: {str(e)}")

@app.post("/api/reset")
async def reset_network():
    """Reset network back to baseline dataset."""
    db.clear_graph()
    for n in INITIAL_NODES:
        db.upsert_node(n)
    for e in INITIAL_EDGES:
        db.upsert_edge(e)
    return {"message": "Knowledge graph reset to default baseline dataset."}

@app.delete("/api/nodes/{node_id}")
async def delete_node(node_id: str):
    """Delete a node and connected edges."""
    if supabase_client:
        try:
            supabase_client.table("nodes").delete().eq("id", node_id).execute()
        except Exception:
            pass
    import sqlite3
    conn = sqlite3.connect("crimnet_database.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM local_nodes WHERE id = ?", (node_id,))
    cursor.execute("DELETE FROM local_edges WHERE source = ? OR target = ?", (node_id, node_id))
    conn.commit()
    conn.close()
    return {"message": f"Node {node_id} deleted."}

@app.post("/api/nodes")
async def create_node(node: NodeModel):
    saved = db.upsert_node(node.model_dump())
    return saved

@app.post("/api/edges")
async def create_edge(edge: EdgeModel):
    saved = db.upsert_edge(edge.model_dump())
    return saved

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
