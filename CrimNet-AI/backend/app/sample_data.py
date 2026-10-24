from typing import List, Dict, Any

SAMPLE_REPORTS: List[Dict[str, Any]] = [
    {
        "id": "case_1_narcotics_hawala",
        "title": "Case Dossier: Coastal Narcotics & Hawala Syndicate",
        "category": "Narcotics & Financial Crime",
        "summary": "Intelligence interception of a cross-state syndicate smuggling synthetic narcotics funded through layered hawala conduits.",
        "text": """CRIME INTELLIGENCE REPORT // CONFIDENTIAL
AGENCY: Directorate of Revenue Intelligence & Special Task Force
SUBJECT: Cross-Border Narcotics Syndicate 'D-Corridor' & Hawala Laundering Pipeline

1. SYNOPSIS:
Surveillance operations over the past 60 days have uncovered a structured criminal syndicate orchestrated by Vikram 'Tiger' Singhania (Kingpin, Red Notice). Singhania commands logistics through his chief lieutenant, Tariq 'The Ghost' Mehmood, and financial operations via hawala broker Rajesh Vora.

2. OPERATIONAL & LOGISTICAL ASSETS:
Intercepted communications indicate Singhania operates out of Safehouse Alpha (Bandra West, Mumbai) and commands a narcotics consolidation facility at Warehouse 14 (Nhava Sheva Port, Navi Mumbai). The syndicate uses a modified container truck (Vehicle MH-04-AZ-8821) registered under shell company Zenith Global Logistics Pvt Ltd. The truck transports shipments directly to Northern Distribution Hub (Sector 62, Noida).

3. TELECOMMUNICATIONS & CDR ANALYSIS:
- Target Vikram Singhania communicates primarily using burner line +91-98765-43210.
- Intercepted CDR shows frequent encrypted calls between +91-98765-43210 and +91-91234-56789 (used by Tariq Mehmood) and satellite phone SAT-INMARSAT-8829.
- Tariq Mehmood acts as the operational bridge, dispatching orders to field courier Farhan 'Bullet' Khan (Phone +91-99887-76655).

4. FINANCIAL TRAIL & HAWALA CHANNELS:
Funds for consignment procurement (₹3.4 Crores) originated from Shell Account HDFC-991823 (held by Zenith Global Logistics). Rajesh Vora transferred ₹1.8 Crores to Offshore Hawala Desk (Dubai, UAE) and ₹1.6 Crores to Crypto Wallet 0x71C829B04921 for purchasing chemical precursors.

5. IDENTIFIED TARGETS:
- Vikram 'Tiger' Singhania (Person, Critical Risk, Syndicate Kingpin)
- Tariq 'The Ghost' Mehmood (Person, High Risk, Operations Chief)
- Rajesh Vora (Person, High Risk, Hawala Banker)
- Farhan 'Bullet' Khan (Person, Medium Risk, Armed Courier)
- Zenith Global Logistics (Organization, High Risk, Front Company)
- Safehouse Alpha (Location, Medium Risk, Command Post)
- Warehouse 14 Nhava Sheva (Location, High Risk, Narcotics Cache)
- Truck MH-04-AZ-8821 (Vehicle, Medium Risk, Smuggling Transport)
- Phone +91-98765-43210 (Phone, High Risk, Burner Line)
- Account HDFC-991823 (FinancialAccount, Critical Risk, Laundering Sink)"""
    },
    {
        "id": "case_2_arms_pipeline",
        "title": "Surveillance Intercept: Maritime Arms Trafficking Ring",
        "category": "Arms Trafficking",
        "summary": "Intelligence brief on automatic weapons procurement and coastal transit corridor.",
        "text": """INTELLIGENCE REPORT: OPERATION IRONCLAD
AGENCY: Counter-Terrorism Intelligence Division
TARGET: Maritime Arms Supply Network

Surveillance of coastal creeks near Porbandar revealed that arms dealer Tariq 'The Ghost' Mehmood met with maritime smuggler Captain Rashid Al-Bakr at Creek Point 9. Rashid operates the unregistered speedboat 'Al-Mehran IV' (Vessel REG-GJR-4491). 

The shipment consisting of 40 automatic rifles and encrypted transceivers was unloaded at Sea Route Landing Point B and handed over to Farhan 'Bullet' Khan. Payments of $120,000 were routed via Dubai Hawala Desk into Swiss Union Vault Account 883-910, overseen by broker Rajesh Vora. Khan transported the armaments using a Black Scorpio SUV (DL-08-CC-1199) directly to Safehouse Alpha in Bandra."""
    },
    {
        "id": "case_3_ransomware_escrow",
        "title": "Cybercrime Dossier: Ransomware & Dark Web Escrow Cell",
        "category": "Cyber Extortion",
        "summary": "Forensic analysis of a state-linked ransomware cell funneling ransoms into dummy banking accounts.",
        "text": """CYBER FORENSICS INTELLIGENCE BRIEF
INCIDENT: Critical Infrastructure Ransomware Extortion Campaign
ORGANIZATION: DarkNexus Cyber Syndicate

DarkNexus Syndicate leader 'CipherX' (identified as Anton Sokolov) coordinated a double-extortion cyberattack. Anton Sokolov communicated with escrow agent 'KryptoKing' (Rajesh Vora's crypto alias) using encrypted Wickr channels.

Ransom payments totaling 45 BTC were received into Bitcoin Wallet bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh. The cryptocurrency was peeled through 12 micro-transactions into Account HDFC-991823 managed by Zenith Global Logistics before cash liquidation at Cash Out Terminal Mumbai Central."""
    }
]

INITIAL_NODES = [
    {
        "id": "person_vikram_singhania",
        "label": "Vikram 'Tiger' Singhania",
        "category": "Person",
        "risk_level": "Critical",
        "properties": {
            "role": "Syndicate Kingpin",
            "alias": "Tiger",
            "status": "Wanted (Red Notice)",
            "notes": "Direct controller of narcotics supply and hawala finance network."
        }
    },
    {
        "id": "person_tariq_mehmood",
        "label": "Tariq 'The Ghost' Mehmood",
        "category": "Person",
        "risk_level": "High",
        "properties": {
            "role": "Chief of Operations & Arms Handler",
            "alias": "The Ghost",
            "status": "Active Surveillance",
            "notes": "Manages cross-border weapon caches and logistics coordination."
        }
    },
    {
        "id": "person_rajesh_vora",
        "label": "Rajesh Vora",
        "category": "Person",
        "risk_level": "High",
        "properties": {
            "role": "Hawala Broker & Financial Controller",
            "alias": "Munimji",
            "status": "Under Investigation",
            "notes": "Handles money laundering and shell corporate accounts."
        }
    },
    {
        "id": "person_farhan_khan",
        "label": "Farhan 'Bullet' Khan",
        "category": "Person",
        "risk_level": "Medium",
        "properties": {
            "role": "Armed Courier & Enforcer",
            "alias": "Bullet",
            "status": "Detained",
            "notes": "Operates transport vehicles and physically delivers consignments."
        }
    },
    {
        "id": "org_zenith_logistics",
        "label": "Zenith Global Logistics",
        "category": "Organization",
        "risk_level": "High",
        "properties": {
            "role": "Corporate Front / Shell Entity",
            "registration": "U72900MH2021PTC109283",
            "notes": "Used for cross-border freight forwarding and bank account layering."
        }
    },
    {
        "id": "phone_9876543210",
        "label": "+91-98765-43210",
        "category": "Phone",
        "risk_level": "High",
        "properties": {
            "type": "Encrypted Burner Line",
            "imei": "864291048829103",
            "carrier": "Airtel Prepaid"
        }
    },
    {
        "id": "phone_9123456789",
        "label": "+91-91234-56789",
        "category": "Phone",
        "risk_level": "Medium",
        "properties": {
            "type": "Operations SIM",
            "imei": "358902049182390",
            "carrier": "Vi Postpaid"
        }
    },
    {
        "id": "acc_hdfc_991823",
        "label": "A/C HDFC-991823",
        "category": "FinancialAccount",
        "risk_level": "Critical",
        "properties": {
            "bank": "HDFC Bank Mumbai",
            "holder": "Zenith Global Logistics",
            "balance": "₹3.4 Crores",
            "flag": "High Value Suspicious Transactions"
        }
    },
    {
        "id": "loc_safehouse_bandra",
        "label": "Safehouse Alpha (Bandra)",
        "category": "Location",
        "risk_level": "Medium",
        "properties": {
            "address": "Bandra West, Mumbai",
            "type": "Residential Compound",
            "surveillance": "Camera Feed 04 Active"
        }
    },
    {
        "id": "loc_warehouse_14",
        "label": "Warehouse 14 (Nhava Sheva)",
        "category": "Location",
        "risk_level": "High",
        "properties": {
            "address": "Port Sector 4, Navi Mumbai",
            "type": "Customs Bonded Warehouse",
            "flag": "Narcotics Stash Point"
        }
    },
    {
        "id": "veh_truck_mh04",
        "label": "Truck MH-04-AZ-8821",
        "category": "Vehicle",
        "risk_level": "Medium",
        "properties": {
            "make": "Tata 1613 Heavy Container",
            "registered_to": "Zenith Global Logistics",
            "tracker": "GPS ID-9921"
        }
    }
]

INITIAL_EDGES = [
    {
        "id": "singhania-COMMANDS-tariq",
        "source": "person_vikram_singhania",
        "target": "person_tariq_mehmood",
        "relationship": "COMMANDS",
        "weight": 1.0,
        "evidence": "Wiretap confirms Singhania directly directs Mehmood on tactical operations."
    },
    {
        "id": "singhania-COMMANDS-vora",
        "source": "person_vikram_singhania",
        "target": "person_rajesh_vora",
        "relationship": "COMMANDS",
        "weight": 1.0,
        "evidence": "Singhania authorizes hawala payouts and offshore asset purchases through Vora."
    },
    {
        "id": "singhania-CALLS-phone1",
        "source": "person_vikram_singhania",
        "target": "phone_9876543210",
        "relationship": "CALLS",
        "weight": 1.0,
        "evidence": "Tower triangulation logs Singhania holding burner +91-98765-43210."
    },
    {
        "id": "phone1-CALLS-phone2",
        "source": "phone_9876543210",
        "target": "phone_9123456789",
        "relationship": "CALLS",
        "weight": 1.0,
        "evidence": "48 recorded high-frequency encrypted calls before shipment arrivals."
    },
    {
        "id": "tariq-CALLS-phone2",
        "source": "person_tariq_mehmood",
        "target": "phone_9123456789",
        "relationship": "CALLS",
        "weight": 1.0,
        "evidence": "Subscribed to Mehmood under alias Ramesh Patil."
    },
    {
        "id": "tariq-COMMANDS-khan",
        "source": "person_tariq_mehmood",
        "target": "person_farhan_khan",
        "relationship": "COMMANDS",
        "weight": 1.0,
        "evidence": "Mehmood assigned Khan for escorting contraband container trucks."
    },
    {
        "id": "singhania-OPERATES-safehouse",
        "source": "person_vikram_singhania",
        "target": "loc_safehouse_bandra",
        "relationship": "OPERATES_OUT_OF",
        "weight": 1.0,
        "evidence": "Physical surveillance confirmed Singhania's presence at Bandra Safehouse."
    },
    {
        "id": "vora-OPERATES-zenith",
        "source": "person_rajesh_vora",
        "target": "org_zenith_logistics",
        "relationship": "OPERATES_OUT_OF",
        "weight": 1.0,
        "evidence": "Vora is listed as authorized signatory for Zenith Global Logistics."
    },
    {
        "id": "zenith-FUNDS-hdfc",
        "source": "org_zenith_logistics",
        "target": "acc_hdfc_991823",
        "relationship": "FUNDS",
        "weight": 1.0,
        "evidence": "Corporate bank account under Zenith's tax identification."
    },
    {
        "id": "zenith-OWNS-truck",
        "source": "org_zenith_logistics",
        "target": "veh_truck_mh04",
        "relationship": "OWNS_VEHICLE",
        "weight": 1.0,
        "evidence": "Vehicle registration documents link MH-04-AZ-8821 directly to Zenith fleet."
    },
    {
        "id": "khan-OPERATES-truck",
        "source": "person_farhan_khan",
        "target": "veh_truck_mh04",
        "relationship": "OPERATES_OUT_OF",
        "weight": 1.0,
        "evidence": "Khan intercepted driving this truck near Nhava Sheva checkpoint."
    },
    {
        "id": "truck-LOCATED_AT-wh14",
        "source": "veh_truck_mh04",
        "target": "loc_warehouse_14",
        "relationship": "OPERATES_OUT_OF",
        "weight": 1.0,
        "evidence": "GPS log confirms regular loading sessions at Nhava Sheva Warehouse 14."
    }
]
