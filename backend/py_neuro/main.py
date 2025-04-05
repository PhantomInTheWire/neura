from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import knowledge_graph, topics, study_guide, workspaces, files
from .database import connect_to_mongo, close_mongo_connection
from contextlib import asynccontextmanager


# Lifespan context manager (replaces @app.on_event)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        await connect_to_mongo()
        yield
    finally:
        # Shutdown
        await close_mongo_connection()


# Create the FastAPI app instance AFTER defining lifespan
app = FastAPI(
    title="Neura", # Updated title from source
    description="Learn through Scientifically proven methods!", # Updated description
    version="0.1.0",
    lifespan=lifespan # Register the lifespan context manager
)

# Configure CORS
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
# Order might matter depending on path specificity, putting workspaces first as in source
app.include_router(workspaces.router, prefix="/api/workspaces", tags=["Workspaces"])
app.include_router(knowledge_graph.router, prefix="/api", tags=["Knowledge Graph"])
app.include_router(topics.router, prefix="/api/topics", tags=["Topics"])
# app.include_router(study_guide.router, prefix="/api/study-guides", tags=["Study Guides"])
app.include_router(files.router, prefix="/api/files", tags=["Files"]) # Include files router

@app.get("/")
async def read_root():
    return {"message": "py-neuro is running!"}

# # Database connection lifecycle events
# @app.on_event("startup")
# async def startup_db_client():
#     await connect_to_mongo()

# @app.on_event("shutdown")
# async def shutdown_db_client():
#     await close_mongo_connection()
