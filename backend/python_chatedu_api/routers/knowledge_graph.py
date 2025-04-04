from fastapi import APIRouter
from typing import List
from python_chatedu_api import models # Use absolute import

router = APIRouter()

# Dummy data - replace with actual database logic later
dummy_nodes = [
    models.TopicNode(id=1, name="Introduction", x=100, y=100, completionPercentage=0.8),
    models.TopicNode(id=2, name="Core Concepts", x=300, y=100, completionPercentage=0.6),
    models.TopicNode(id=3, name="Advanced Topics", x=500, y=100, completionPercentage=0.2),
    models.TopicNode(id=4, name="Applications", x=300, y=300, completionPercentage=0.0),
]

dummy_edges = [
    models.TopicEdge(sourceTopicId=1, targetTopicId=2),
    models.TopicEdge(sourceTopicId=2, targetTopicId=3),
    models.TopicEdge(sourceTopicId=2, targetTopicId=4),
]

@router.get("/topicNodes/{notebook_id}", response_model=List[models.TopicNode])
async def get_topic_nodes(notebook_id: int):
    """
    Retrieves the list of topic nodes for a specific notebook.
    (Currently returns dummy data)
    """
    # In a real implementation, you would query the database based on notebook_id
    print(f"Fetching nodes for notebook_id: {notebook_id}")
    return dummy_nodes

@router.get("/topicEdges/{notebook_id}", response_model=List[models.TopicEdge])
async def get_topic_edges(notebook_id: int):
    """
    Retrieves the list of topic edges (connections) for a specific notebook.
    (Currently returns dummy data)
    """
    # In a real implementation, you would query the database based on notebook_id
    print(f"Fetching edges for notebook_id: {notebook_id}")
    return dummy_edges
