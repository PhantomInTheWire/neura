
from fastapi import FastAPI
from python_chatedu_api.routers import knowledge_graph, topics, study_guide # Use absolute import

app = FastAPI(
    title="Neura",
    description="Scientifically effiecient learning!",
    version="0.1.0",
)

# Include routers
app.include_router(knowledge_graph.router, prefix="/api", tags=["Knowledge Graph"])
app.include_router(topics.router, prefix="/api/topics", tags=["Topics"])
app.include_router(study_guide.router, prefix="/api/study-guides", tags=["Study Guides"]) # Add study guide router

@app.get("/")
async def read_root():
    return {"message": "Welcome to the ChatEDU Python API Clone!"}
