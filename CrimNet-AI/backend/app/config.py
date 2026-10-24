import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    # App Settings
    APP_NAME: str = "CrimNet AI - Criminal Intelligence Network Analysis System"
    VERSION: str = "2.4.0-PROD"
    DEBUG: bool = True
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    
    # NLP & AI Engine Configuration
    # Defaults to True for 100% offline self-contained local neural NLP extraction
    USE_LOCAL_NLP_ENGINE: bool = os.getenv("USE_LOCAL_NLP_ENGINE", "True").lower() in ("true", "1", "yes")
    
    # Optional LLM API integration (can plug any OpenAI-compatible or custom endpoint)
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    AI_API_ENDPOINT: str = os.getenv("AI_API_ENDPOINT", "")
    
    # Database Settings (Supabase / PostgreSQL)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://sjiwrfqywcenafcnifms.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "sb_publishable_clALi60K45VxW-4gw-YQyA_Ku8eti_6")

settings = Settings()
