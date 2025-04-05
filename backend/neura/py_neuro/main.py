from fastapi import FastAPI
from py_neuro.routers import knowledge_graph, topics, study_guide # Use absolute import

app = FastAPI(
    title="pyneuro",
    description="API focusing on Knowledge Graph.",
    version="0.1.0",
)

# Include routers
app.include_router(knowledge_graph.router, prefix="/api", tags=["Knowledge Graph"])
app.include_router(topics.router, prefix="/api/topics", tags=["Topics"])
app.include_router(study_guide.router, prefix="/api/study-guides", tags=["Study Guides"]) # Add study guide router

@app.get("/")
async def read_root():
    return {"message": "Welcome to pynuro!"}

# Placeholder 
# for future database connection/disconnection logic
# @app.on_event("startup")
# async def startup_db_client():
#     pass

# @app.on_event("shutdown")
# async def shutdown_db_client():
#     pass
