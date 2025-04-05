from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId # Import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase # Use Database type hint

# Use absolute imports
from py_neuro.models import Workspace, WorkspaceCreate, WorkspaceUpdate
from py_neuro.database import get_database # Corrected import path

router = APIRouter()

# Note: The dependency Depends(get_database) should return the *database* object,
# not the collection directly. We access the collection within the endpoint.

@router.get("/", response_model=List[Workspace])
async def get_workspaces(db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get list of all workspaces."""
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection not available")
    workspaces_cursor = db["workspaces"].find() # Access collection here
    workspaces = await workspaces_cursor.to_list(None) # Fetch all
    return workspaces

@router.post("/", response_model=Workspace, status_code=201) # Added 201 status
async def create_workspace(workspace: WorkspaceCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Create a new workspace."""
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection not available")
    # Use model_dump() for Pydantic v2
    workspace_dict = workspace.model_dump()
    result = await db["workspaces"].insert_one(workspace_dict)
    created_workspace = await db["workspaces"].find_one({"_id": result.inserted_id})
    if created_workspace is None:
         raise HTTPException(status_code=500, detail="Failed to retrieve created workspace")
    return created_workspace

@router.get("/{workspace_id}", response_model=Workspace)
async def get_workspace(workspace_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get a specific workspace by ID."""
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection not available")
    if not ObjectId.is_valid(workspace_id):
        raise HTTPException(status_code=400, detail="Invalid workspace ID format")

    workspace = await db["workspaces"].find_one({"_id": ObjectId(workspace_id)})
    if workspace is None:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace

@router.put("/{workspace_id}", response_model=Workspace)
async def update_workspace(
    workspace_id: str,
    workspace_update: WorkspaceUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update a workspace."""
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection not available")
    if not ObjectId.is_valid(workspace_id):
        raise HTTPException(status_code=400, detail="Invalid workspace ID format")

    # Use model_dump() for Pydantic v2, exclude unset fields
    update_data = workspace_update.model_dump(exclude_unset=True)

    if not update_data:
         raise HTTPException(status_code=400, detail="No update data provided")

    result = await db["workspaces"].find_one_and_update(
        {"_id": ObjectId(workspace_id)},
        {"$set": update_data},
        return_document=True # Use return_document=True for motor/pymongo 4+
    )

    if result is None:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return result

@router.delete("/{workspace_id}", status_code=204) # Use 204 No Content for successful delete
async def delete_workspace(workspace_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Delete a workspace."""
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection not available")
    if not ObjectId.is_valid(workspace_id):
        raise HTTPException(status_code=400, detail="Invalid workspace ID format")

    result = await db["workspaces"].delete_one({"_id": ObjectId(workspace_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Workspace not found")
    # No content to return on successful delete
    return None # Or return Response(status_code=204)


