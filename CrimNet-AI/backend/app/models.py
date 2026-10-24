from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class NodeModel(BaseModel):
    id: str = Field(..., description="Unique slug or identifier (e.g., person_vikram_singhania)")
    label: str = Field(..., description="Display title or name")
    category: str = Field(..., description="Category: Person, Organization, Location, Phone, Vehicle, FinancialAccount, Event, Contraband")
    risk_level: str = Field(default="Medium", description="Threat Level: Critical, High, Medium, Low")
    properties: Dict[str, Any] = Field(default_factory=dict, description="Attributes such as aliases, role, status, notes")
    created_at: Optional[str] = None
    
    # Graph metrics calculated dynamically by NetworkX
    degree: Optional[int] = 0
    centrality: Optional[float] = 0.0
    is_key_influencer: Optional[bool] = False
    influence_score: Optional[float] = 0.0

class EdgeModel(BaseModel):
    id: str = Field(..., description="Unique edge identifier")
    source: str = Field(..., description="Source node identifier")
    target: str = Field(..., description="Target node identifier")
    relationship: str = Field(..., description="Relationship: COMMANDS, FUNDS, CALLS, OPERATES_OUT_OF, ASSOCIATE_OF, TRANSFERS_TO, MEETS_WITH, OWNS_VEHICLE")
    weight: float = Field(default=1.0, description="Connection strength or frequency")
    evidence: Optional[str] = Field(default=None, description="Direct excerpt or evidence from intelligence logs")
    created_at: Optional[str] = None

class ExtractRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Raw criminal intelligence, FIR transcript, CDR wiretap, or financial report")
    source_type: Optional[str] = Field(default="police_report", description="police_report, cdr, financial, surveillance, intelligence_brief")
    append_mode: Optional[bool] = Field(default=True, description="Append to current graph or build fresh")

class SuspiciousPattern(BaseModel):
    pattern_type: str = Field(..., description="Type of anomaly (e.g., Command Hub, Circular Hawala Loop, Bridge Broker)")
    severity: str = Field(default="High", description="Critical, High, Medium")
    description: str
    involved_nodes: List[str] = Field(default_factory=list)
    confidence: float = 0.92

class ExtractResponse(BaseModel):
    success: bool
    summary: str
    extracted_nodes: List[NodeModel]
    extracted_edges: List[EdgeModel]
    suspicious_patterns: List[SuspiciousPattern] = Field(default_factory=list)
    new_nodes_count: int
    new_edges_count: int
    total_nodes: int
    total_edges: int

class KeyInfluencer(BaseModel):
    node_id: str
    label: str
    category: str
    risk_level: str
    degree: int
    betweenness: float
    role_description: str
    influence_score: float

class NetworkResponse(BaseModel):
    nodes: List[Dict[str, Any]]
    links: List[Dict[str, Any]]
    stats: Dict[str, Any]
    key_influencers: List[KeyInfluencer]
    suspicious_patterns: List[SuspiciousPattern]
    categories: List[str]

class SampleReport(BaseModel):
    id: str
    title: str
    category: str
    summary: str
    text: str
