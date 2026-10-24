# 🏆 Hackathon Presentation & Pitch Guide

## Project Name: **CrimNet AI**
**Subtitle**: AI-Powered Criminal Intelligence Knowledge Graph & Forensic Network Mapping System

---

## 1. 🎯 The 30-Second Elevator Pitch

> *"Law enforcement agencies collect massive volumes of unstructured data across police FIRs, call records (CDRs), hawala financial ledgers, and surveillance notes. However, investigators struggle to connect the dots because the data is fragmented and siloed. **CrimNet AI** solves this by automatically converting raw intelligence into an interactive, physics-driven Knowledge Graph. It uses Graph Theory (NetworkX) and NLP to uncover hidden syndicate hierarchies, highlight Kingpins using betweenness centrality, and detect suspicious money laundering cycles in milliseconds."*

---

## 2. 💡 Key Innovations & Architecture

```
Raw Police FIRs / CDRs / Ledgers
          │
          ▼
[Custom Neural NLP Extraction Engine]
  ├─ 8 Entity Types: Person, Organization, Phone, Vehicle, Bank A/C, Location, Weapons, Events
  └─ Semantic Relational Mining: COMMANDS, FUNDS, CALLS, OPERATES, TRANSFERS, MEETS
          │
          ▼
[Graph Analytics Engine (NetworkX)]
  ├─ Centrality Metrics (Degree, Betweenness, PageRank)
  ├─ Kingpin & Star-Hub Identification
  └─ Circular Hawala Loop & Burner Multiplexing Detection
          │
          ▼
[Tactical React 2D Physics Visualizer]
  ├─ Dynamic Halo Rings & Glowing Kingpin Nodes
  ├─ Animated Particle Flow for Financial/Call Transactions
  └─ Ego-Network Isolation & Forensic Case Drawer
```

---

## 3. 🎬 Live Demo Script for Judges (2-Minute Walkthrough)

### Step 1: Open the Dashboard
* Double click `run.bat` or open `http://localhost:5173`.
* **Point to the Top Bar**: Show real-time syndicate metrics (Active Targets, Connections, Network Density, Critical Threat counter).

### Step 2: Show the Knowledge Graph
* **Interact with the Canvas**: Drag nodes, zoom in/out, and show the physics simulation.
* **Hover over a Kingpin** (*Vikram 'Tiger' Singhania*): Notice how the ego-network highlights all connected associates and dims background noise.
* **Explain the Particle Flows**: Show animated particles streaming across `COMMANDS`, `FUNDS`, and `CALLS` links.

### Step 3: Ingest a New Crime Report in Real-Time
* In the left panel, click on **Case 2: Maritime Arms Trafficking Ring** (or type a custom FIR).
* Click **"ANALYZE & EXTRACT GRAPH"**.
* Watch the system automatically parse suspects, speedboats, weapons, safehouses, and bank conduits, dynamically growing the graph before their eyes!

### Step 4: Show Investigator Analytics
* Switch to the **Analytics** tab on the right.
* Show the **Key Influencers Leaderboard**: Explain how betweenness centrality detected that *Tariq 'The Ghost' Mehmood* is the operational bridge between the Kingpin and the field couriers.
* Show the **Suspicious Pattern Alerter**: Point to detected circular hawala flows and burner multiplexing flags.

### Step 5: Deep-Dive Forensic Drawer
* Click on any suspect or bank account node.
* Show the right-hand Inspector with threat level, aliases, IMEI/tracker numbers, and verbatim evidence snippets extracted from police reports.

---

## 4. 🧠 Answers to Potential Questions from Judges

**Q: How does the system extract relationships from unstructured text?**
> *"We implemented a multi-pass NLP extraction pipeline that tokenizes text, resolves named entities and aliases (e.g. Vikram 'Tiger' Singhania), and identifies grammatical predicates and co-occurrences to infer relationship types like COMMANDS, FUNDS, and CALLS along with verbatim evidence quotes."*

**Q: What makes this better than a standard database table?**
> *"Relational databases require you to already know what you're querying for. Graph theory allows us to calculate structural metrics like Betweenness Centrality—revealing hidden brokers who don't appear in the FIR headlines but control the entire flow of funds and orders."*

**Q: Can this scale to large police databases?**
> *"Yes. The graph store supports PostgreSQL / Supabase indexing on sources and targets, and NetworkX algorithms can analyze thousands of nodes in sub-second time. The canvas dynamically throttles particle simulation for high-density rendering."*

---

## 5. 🛠️ Tech Stack Summary
* **Backend**: FastAPI (Python 3.12), NetworkX (Graph Analytics), Pydantic
* **Storage**: Supabase PostgreSQL + Local SQLite Graph Engine
* **Frontend**: React 18, Vite, Tailwind CSS, `react-force-graph-2d`, Lucide Icons
