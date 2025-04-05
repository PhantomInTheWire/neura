from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection

from ..models import Workspace, WorkspaceCreate, WorkspaceUpdate
from ..db import get_db

router = APIRouter()

@router.get("/", response_model=List[Workspace])
async def get_workspaces(db: AsyncIOMotorCollection = Depends(get_db)):
    """Get list of all workspaces."""
    workspaces = await db.find().to_list(None)
    return workspaces

@router.post("/", response_model=Workspace)
async def create_workspace(workspace: WorkspaceCreate, db: AsyncIOMotorCollection = Depends(get_db)):
    """Create a new workspace."""
    workspace_dict = workspace.model_dump()
    result = await db.insert_one(workspace_dict)
    created_workspace = await db.find_one({"_id": result.inserted_id})
    return created_workspace

@router.get("/{workspace_id}", response_model=Workspace)
async def get_workspace(workspace_id: str, db: AsyncIOMotorCollection = Depends(get_db)):
    """Get a specific workspace by ID."""
    if not ObjectId.is_valid(workspace_id):
        raise HTTPException(status_code=400, detail="Invalid workspace ID")
    
    workspace = await db.find_one({"_id": ObjectId(workspace_id)})
    if workspace is None:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace

@router.put("/{workspace_id}", response_model=Workspace)
async def update_workspace(
    workspace_id: str,
    workspace_update: WorkspaceUpdate,
    db: AsyncIOMotorCollection = Depends(get_db)
):
    """Update a workspace."""
    if not ObjectId.is_valid(workspace_id):
        raise HTTPException(status_code=400, detail="Invalid workspace ID")

    update_data = {k: v for k, v in workspace_update.dict().items() if v is not None}
    result = await db.find_one_and_update(
        {"_id": ObjectId(workspace_id)},
        {"$set": update_data},
        return_document=True
    )
    
    if result is None:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return result

@router.delete("/{workspace_id}")
async def delete_workspace(workspace_id: str, db: AsyncIOMotorCollection = Depends(get_db)):
    """Delete a workspace."""
    if not ObjectId.is_valid(workspace_id):
        raise HTTPException(status_code=400, detail="Invalid workspace ID")
        
    result = await db.delete_one({"_id": ObjectId(workspace_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return {"message": f"Workspace {workspace_id} deleted successfully"}