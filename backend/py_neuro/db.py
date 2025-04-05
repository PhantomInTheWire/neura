import motor.motor_asyncio
from .config import settings # Import settings from config.py
import logging

logger = logging.getLogger(__name__)

class Database:
    client: motor.motor_asyncio.AsyncIOMotorClient = None

db = Database() # Singleton instance to hold the client

async def connect_db():
    """Connects to the MongoDB database."""
    if settings.MONGODB_URL:
        logger.info(f"Attempting to connect to MongoDB at {settings.MONGODB_URL}...")
        db.client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
        # Optional: Ping the server to verify connection
        try:
             await db.client.admin.command('ping')
             logger.info("Successfully connected to MongoDB.")
        except Exception as e:
             logger.error(f"MongoDB connection failed: {e}")
             db.client = None # Reset client if connection fails
    else:
        logger.warning("MONGODB_URL not set in environment/config. Database connection not established.")

async def close_db():
    """Closes the MongoDB connection."""
    if db.client:
        db.client.close()
        logger.info("Closed MongoDB connection.")

async def get_database() -> motor.motor_asyncio.AsyncIOMotorDatabase | None:
    """FastAPI dependency to get the database instance."""
    if db.client:
        return db.client[settings.DATABASE_NAME]
    logger.warning("Database client not available.")
    return None
