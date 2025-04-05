from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Import CORS middleware
# Use absolute imports relative to py_neuro
from py_neuro.routers import knowledge_graph, topics, study_guide, workspaces, files # Add files router
from py_neuro.database import connect_to_mongo, close_mongo_connection

app = FastAPI(
    title="Neura", # Updated title from source
    description="Learn through Scientifically proven methods!", # Updated description
    version="0.1.0",
)

# Configure CORS
origins = [
    "http://localhost:3000", # The origin for your Next.js frontend during development
    # Add other origins if needed, e.g., your deployed frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all standard methods
    allow_headers=["*"], # Allows all headers
)

# Include routers
# Order might matter depending on path specificity, putting workspaces first as in source
app.include_router(workspaces.router, prefix="/api/workspaces", tags=["Workspaces"])
app.include_router(knowledge_graph.router, prefix="/api", tags=["Knowledge Graph"])
app.include_router(topics.router, prefix="/api/topics", tags=["Topics"])
app.include_router(study_guide.router, prefix="/api/study-guides", tags=["Study Guides"])
app.include_router(files.router, prefix="/api/files", tags=["Files"]) # Include files router

@app.get("/")
async def read_root():
    # Updated message from source (though it was the same as target before)
    return {"message": "py-neuro is running!"}

# Database connection lifecycle events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()
