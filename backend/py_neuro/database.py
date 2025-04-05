import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorGridFSBucket
from .config import settings # Import the settings instance

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None
    fs: AsyncIOMotorGridFSBucket = None # Add GridFS bucket instance

# Singleton instance to hold the client, db connection, and GridFS bucket
db_instance = Database()

async def connect_to_mongo():
    """Establishes the MongoDB connection."""
    logger.info("Connecting to MongoDB...")
    try:
        # Add a server selection timeout (e.g., 5 seconds)
        db_instance.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=5000
        )
        db_instance.db = db_instance.client[settings.DATABASE_NAME] # Access the specific database
        db_instance.fs = AsyncIOMotorGridFSBucket(db_instance.db) # Initialize GridFS bucket
        # You can add a check here to verify the connection, e.g., by pinging the server
        await db_instance.client.admin.command('ping')
        logger.info(f"Successfully connected to MongoDB database: {settings.DATABASE_NAME} and initialized GridFS.")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB or initialize GridFS: {e}")
        # Depending on the application's needs, you might want to raise the exception
        # or handle it differently (e.g., exit the application)
        raise

async def close_mongo_connection():
    """Closes the MongoDB connection."""
    if db_instance.client:
        logger.info("Closing MongoDB connection...")
        db_instance.client.close()
        logger.info("MongoDB connection closed.")

def get_database() -> AsyncIOMotorDatabase:
    """
    Dependency function to get the database instance.
    Ensures that the connection has been established.
    """
    if db_instance.db is None:
        # This should ideally not happen if connect_to_mongo is called at startup
        logger.error("Database not initialized. Call connect_to_mongo first.")
        raise RuntimeError("Database connection is not available.")
    return db_instance.db

def get_gridfs_bucket() -> AsyncIOMotorGridFSBucket:
    """
    Dependency function to get the GridFS bucket instance.
    Ensures that the connection and bucket have been established.
    """
    if db_instance.fs is None:
        # This should ideally not happen if connect_to_mongo is called at startup
        logger.error("GridFS bucket not initialized. Call connect_to_mongo first.")
        raise RuntimeError("GridFS bucket is not available.")
    return db_instance.fs

# --- Old Placeholder (can be removed or kept for reference) ---
# print("Database module loaded (placeholder for MongoDB)")
# def get_db(): # Keep old placeholder name for now, replace later
#     # Placeholder for dependency injection of DB session/client
#     print("Getting DB connection (placeholder)")
#     yield None # Return None for now
