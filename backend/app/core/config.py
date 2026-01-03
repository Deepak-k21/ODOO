from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "GlobeTrotter API"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # JWT Settings
    SECRET_KEY: str = "your-super-secret-key-change-in-production-globetrotter-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # MongoDB Settings
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "globetrotter"
    
    # Gemini AI Settings
    GEMINI_API_KEY: str = "AIzaSyD91y0CZOPQAfdw5uYQkc91Lb05Snt4TJk"
    
    # CORS Settings
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
