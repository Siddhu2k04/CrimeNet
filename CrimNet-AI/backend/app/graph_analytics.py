import networkx as nx
from typing import List, Dict, Any, Tuple
from app.models import KeyInfluencer, SuspiciousPattern

def build_nx_graph(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> nx.DiGraph:
    """Construct NetworkX directed graph from nodes and edges."""
    G = nx.DiGraph()
    for n in nodes:
        G.add_node(n["id"], **n)
    for e in edges:
        G.add_edge(e["source"], e["target"], id=e.get("id"), relationship=e.get("relationship"), weight=e.get("weight", 1.0))
    return G

def calculate_network_metrics(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate centrality metrics, identify key influencers, and detect suspicious patterns."""
    if not nodes:
        return {
            "stats": {"total_nodes": 0, "total_edges": 0, "density": 0.0, "avg_degree": 0.0, "connected_components": 0},
            "key_influencers": [],
            "suspicious_patterns": [],
            "enriched_nodes": []
        }

    G = build_nx_graph(nodes, edges)
    G_undirected = G.to_undirected()

    # Centralities
    degree_dict = dict(G.degree())
    betweenness_dict = nx.betweenness_centrality(G_undirected) if len(nodes) > 2 else {n["id"]: 0.0 for n in nodes}
    
    # Calculate density & stats
    num_nodes = len(nodes)
    num_edges = len(edges)
    density = nx.density(G) if num_nodes > 1 else 0.0
    avg_degree = (2.0 * num_edges / num_nodes) if num_nodes > 0 else 0.0

    # Risk level multipliers
    risk_multipliers = {
        "Critical": 2.5,
        "High": 1.8,
        "Medium": 1.2,
        "Low": 1.0,
        "Unknown": 1.0
    }

    # Enrich nodes with metrics
    enriched_nodes = []
    influencer_candidates = []

    for n in nodes:
        nid = n["id"]
        deg = degree_dict.get(nid, 0)
        bet = betweenness_dict.get(nid, 0.0)
        risk = n.get("risk_level", "Medium")
        mult = risk_multipliers.get(risk, 1.0)
        
        # Influence score is a composite of degree, structural betweenness, and threat level
        influence_score = round((deg * 1.5 + bet * 10.0) * mult, 2)

        node_copy = dict(n)
        node_copy["degree"] = deg
        node_copy["centrality"] = round(bet, 4)
        node_copy["influence_score"] = influence_score
        enriched_nodes.append(node_copy)

        influencer_candidates.append({
            "node_id": nid,
            "label": n.get("label", nid),
            "category": n.get("category", "Person"),
            "risk_level": risk,
            "degree": deg,
            "betweenness": round(bet, 4),
            "role_description": n.get("properties", {}).get("role", f"Active {n.get('category', 'Entity')}"),
            "influence_score": influence_score
        })

    # Sort influencers descending
    influencer_candidates.sort(key=lambda x: x["influence_score"], reverse=True)
    top_influencers = [KeyInfluencer(**cand) for cand in influencer_candidates[:6]]

    # Mark top 3 as key influencers in enriched nodes
    top_ids = {inf.node_id for inf in top_influencers[:3]}
    for n in enriched_nodes:
        n["is_key_influencer"] = n["id"] in top_ids

    # Detect suspicious patterns
    detected_patterns: List[SuspiciousPattern] = []

    # 1. Kingpin / Hub Pattern (high degree connected to multiple categories)
    for inf in top_influencers:
        if inf.degree >= 3:
            neighbors = list(G_undirected.neighbors(inf.node_id))
            neighbor_cats = {G.nodes[nbr].get("category") for nbr in neighbors if nbr in G.nodes}
            if len(neighbor_cats) >= 2:
                detected_patterns.append(SuspiciousPattern(
                    pattern_type="Command & Control Hub",
                    severity="Critical" if inf.risk_level == "Critical" else "High",
                    description=f"Target '{inf.label}' acts as a central operational nexus coordinating {inf.degree} assets across {len(neighbor_cats)} categories ({', '.join(filter(None, neighbor_cats))}).",
                    involved_nodes=[inf.node_id] + neighbors[:5],
                    confidence=0.94
                ))

    # 2. Critical Bridge / Broker Pattern (High betweenness centrality)
    for cand in influencer_candidates:
        if cand["betweenness"] > 0.25 and cand["degree"] >= 2:
            detected_patterns.append(SuspiciousPattern(
                pattern_type="Syndicate Intermediary / Bridge",
                severity="High",
                description=f"Entity '{cand['label']}' acts as a critical broker bridging separate functional sub-cells (Betweenness: {cand['betweenness']}). Neutralizing this node fractures the syndicate.",
                involved_nodes=[cand["node_id"]],
                confidence=0.91
            ))

    # 3. Simple Cycles (Circular financial or communication flows)
    try:
        simple_cycles = list(nx.simple_cycles(G))
        for cycle in simple_cycles:
            if 2 <= len(cycle) <= 6:
                labels = [G.nodes[cid].get("label", cid) for cid in cycle if cid in G.nodes]
                detected_patterns.append(SuspiciousPattern(
                    pattern_type="Circular Flow / Layering Loop",
                    severity="Critical",
                    description=f"Detected circular closed-loop flow between: {' ➔ '.join(labels)} ➔ {labels[0]}. Hallmark indicator of money laundering or layered communication.",
                    involved_nodes=cycle,
                    confidence=0.96
                ))
    except Exception:
        pass

    return {
        "stats": {
            "total_nodes": num_nodes,
            "total_edges": num_edges,
            "density": round(density, 4),
            "avg_degree": round(avg_degree, 2),
            "connected_components": nx.number_connected_components(G_undirected) if num_nodes > 0 else 0
        },
        "key_influencers": top_influencers,
        "suspicious_patterns": detected_patterns,
        "enriched_nodes": enriched_nodes
    }
