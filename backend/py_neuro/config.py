import os
from pathlib import Path
import logging
from pydantic_settings import BaseSettings
import google.generativeai as genai # Add import

# Determine the directory where config.py resides
CONFIG_DIR = Path(__file__).resolve().parent
logger = logging.getLogger(__name__) # Add logger

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

# --- Initialize Gemini Model ---
gemini_model = None
if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE": # Check settings
    logger.warning("GEMINI_API_KEY not found in settings or is default. AI features requiring it will fail.")
else:
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY) # Use settings
        # Using a model that supports multimodal and JSON output mode
        # Note: Check Google AI documentation for the latest recommended model for JSON mode.
        # gemini-1.5-flash or gemini-1.5-pro might be suitable. Using flash for potential cost/speed benefits.
        gemini_model = genai.GenerativeModel('gemini-2.0-flash') # Or 'gemini-1.5-pro'
        logger.info("Gemini configured successfully with gemini-2.0-flash.")
    except Exception as e:
        logger.error(f"Failed to configure Gemini: {e}")
        gemini_model = None # Ensure it's None if configuration fails
