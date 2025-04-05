import random
from fastapi import APIRouter, HTTPException
from typing import List
import models # Use absolute import

router = APIRouter()

# In-memory storage for dummy data (replace with DB later)
# We need this to potentially find parent topics if needed, though not used in POST yet
# Also needed to generate unique IDs for the dummy response
dummy_nodes_store: List[models.TopicNode] = [
    models.TopicNode(id=1, name="Introduction", x=100, y=100, completionPercentage=0.8),
    models.TopicNode(id=2, name="Core Concepts", x=300, y=100, completionPercentage=0.6),
    models.TopicNode(id=3, name="Advanced Topics", x=500, y=100, completionPercentage=0.2),
    models.TopicNode(id=4, name="Applications", x=300, y=300, completionPercentage=0.0),
]
next_topic_id = 5 # Simple counter for new dummy IDs

@router.post("/add", response_model=models.TopicNode, status_code=201)
async def add_topic(topic_data: models.TopicCreate):
    """
    Creates a new topic (section).
    (Currently returns dummy data and doesn't persist)
    """
    global next_topic_id
    print(f"Received topic data to add: {topic_data}")

    # Simulate creation - generate a dummy response
    # In a real app, you'd insert into DB and get the real ID, x, y, etc.
    new_topic = models.TopicNode(
        id=next_topic_id,
        name=topic_data.name,
        x=random.uniform(50, 550), # Assign random position for dummy
        y=random.uniform(50, 350),
        completionPercentage=0.0 # New topics start at 0%
        # We ignore parentTopicId and orderPosition for the dummy response for now
    )
    next_topic_id += 1
    # dummy_nodes_store.append(new_topic) # Add to dummy store if needed later

    print(f"Simulated creation, returning: {new_topic}")
    return new_topic

# Placeholder for future GET endpoints for topics if needed
# @router.get("/notebook/{notebook_id}", response_model=List[models.TopicNode])
# async def get_topics_for_notebook(notebook_id: int):
#     # Logic to retrieve topics for a notebook
#     pass
