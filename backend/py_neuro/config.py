import os
from pathlib import Path
from pydantic_settings import BaseSettings

# Determine the directory where config.py resides
CONFIG_DIR = Path(__file__).resolve().parent

class Settings(BaseSettings):
    # Default values can be overridden by environment variables or .env file
    MONGODB_URL: str = "mongodb://localhost:27017" # Renamed for clarity
    DATABASE_NAME: str = "Cluster0" # Renamed for clarity
    GEMINI_API_KEY: str = "" # Added Gemini key

    class Config:
        # Construct the path to the .env file relative to this config file
        env_file = CONFIG_DIR / ".env"
        env_file_encoding = 'utf-8' # Specify encoding

# Create a single settings instance for the application to import
settings = Settings()
