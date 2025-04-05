from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Response
from typing import List
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorGridFSBucket
import os
import shutil
import logging
import uuid
from .. import crud # Relative import
from .utils import extract_text_and_images_pdf, extract_text_and_images_pptx, extract_text_docx, extract_text_txt, generate_hierarchical_study_guide # Corrected relative import

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import the new response model
from ..models import Workspace, WorkspaceCreate, WorkspaceUpdate, StudyGuideResponse, ExtractedImageInfo, WorkspaceWithPopulatedStudyGuides
from ..database import get_database, get_gridfs_bucket # Relative import

router = APIRouter()

# --- Configuration ---
# load_dotenv() # Removed - handled by config.py
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") # Removed - use settings
TEMP_UPLOAD_DIR = "temp_uploads"
IMAGE_OUTPUT_DIR_BASE = os.path.join(TEMP_UPLOAD_DIR, "images")
MIN_IMAGE_WIDTH = 50  # Pixels - adjust as needed for pre-filtering
MIN_IMAGE_HEIGHT = 50 # Pixels - adjust as needed for pre-filtering



# Note: The dependency Depends(get_database) should return the *database* object,
# not the collection directly. We access the collection within the endpoint.

# GET: api/workspaces
@router.get("/", response_model=List[Workspace])
async def get_workspaces(db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get list of all workspaces."""
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection not available")
    workspaces_cursor = db["workspaces"].find() # Access collection here
    workspaces = await workspaces_cursor.to_list(None) # Fetch all
    return workspaces

# POST: api/workspaces
@router.post("/", response_model=Workspace, status_code=201)
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

# GET: api/workspaces/123
# Use the new response model that includes populated study guides
@router.get("/{workspace_id}", response_model=WorkspaceWithPopulatedStudyGuides)
async def get_workspace(workspace_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get a specific workspace by ID, populating study guides."""
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection not available")
    if not ObjectId.is_valid(workspace_id):
        raise HTTPException(status_code=400, detail="Invalid workspace ID format")

    workspace = await db["workspaces"].find_one({"_id": ObjectId(workspace_id)})
    if workspace is None:
        raise HTTPException(status_code=404, detail="Workspace not found")
    # Use aggregation to populate study_guides
    pipeline = [
        {"$match": {"_id": ObjectId(workspace_id)}},
        {
            "$lookup": {
                "from": "study_guides", # The name of the study guides collection
                "localField": "study_guides", # The field in the workspaces collection (contains list of ObjectIds)
                "foreignField": "_id", # The field in the study_guides collection to match against
                "as": "populated_study_guides" # The name of the new array field to add
            }
        }
    ]
    result_cursor = db["workspaces"].aggregate(pipeline)
    populated_workspace = await result_cursor.to_list(length=1) # Should be only one result

    if not populated_workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    # Replace the list of IDs with the populated documents
    # Note: The response model might need adjustment if it strictly expects only IDs.
    # For now, let's assume the frontend can handle the populated structure.
    # We might need a different response model later if validation fails.
    final_workspace = populated_workspace[0]
    final_workspace["study_guides"] = final_workspace.pop("populated_study_guides", []) # Rename field for consistency

    # The response_model=WorkspaceWithPopulatedStudyGuides handles validation.
    # FastAPI will automatically validate the final_workspace dict against the model.
    return final_workspace


# PUT: api/workspaces/123
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

# DELETE: api/workspaces/123
@router.delete("/{workspace_id}", status_code=204)
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


# POST: api/workspaces/123/study-guides
@router.post("/{workspace_id}/study-guides", response_model=StudyGuideResponse)
async def upload_and_create_study_guide(
    workspace_id: str, # Add workspace_id path parameter
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_database),
    fs: AsyncIOMotorGridFSBucket = Depends(get_gridfs_bucket)
):
    """
    Uploads a document for a specific workspace, extracts text/images,
    and generates a hierarchical study guide using Gemini multimodal capabilities.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided.")

    request_id = str(uuid.uuid4())
    request_temp_dir = os.path.join(TEMP_UPLOAD_DIR, request_id)
    request_image_dir = os.path.join(IMAGE_OUTPUT_DIR_BASE, request_id)
    os.makedirs(request_temp_dir, exist_ok=True)
    os.makedirs(request_image_dir, exist_ok=True)

    _, extension = os.path.splitext(file.filename)
    extension = extension.lower()
    temp_file_path = os.path.join(request_temp_dir, f"upload{extension}")

    try:
        logger.info(f"Receiving file: {file.filename}, size: {file.size}, type: {file.content_type}")
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info(f"Saved temporary file: {temp_file_path}")
    except Exception as e:
        logger.error(f"Failed to save temporary file {temp_file_path}: {e}")
        shutil.rmtree(request_temp_dir, ignore_errors=True)
        shutil.rmtree(request_image_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Could not save uploaded file: {e}")
    finally:
        await file.close()

    text_content = ""
    # Keep track of *all* extracted images before filtering for the final response
    all_extracted_images_info: List[ExtractedImageInfo] = []
    # Keep track of images that pass filtering to send to Gemini
    filtered_images_info: List[ExtractedImageInfo] = []
    try:
        if extension == ".pdf":
            # Update to capture both lists from extraction function
            text_content, all_extracted_images_info, filtered_images_info = extract_text_and_images_pdf(temp_file_path, request_image_dir)
        elif extension == ".pptx":
             # Update to capture both lists from extraction function
            text_content, all_extracted_images_info, filtered_images_info = extract_text_and_images_pptx(temp_file_path, request_image_dir)
        elif extension == ".docx":
            text_content = extract_text_docx(temp_file_path)
            # No images extracted for docx yet
        elif extension == ".txt":
            text_content = extract_text_txt(temp_file_path)
            # No images for txt
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {extension}. Supported types: .pdf, .pptx, .docx, .txt"
            )

        if not text_content.strip():
            raise HTTPException(status_code=400, detail="Extracted text content is empty.")

        # Generate study guide sections using Gemini with filtered images
        # Use the correct function name and expect hierarchical structure
        study_guide_main_sections = await generate_hierarchical_study_guide(text_content, filtered_images_info, request_image_dir)

        # Format the final response using the correct model
        response_data = StudyGuideResponse(
            original_filename=file.filename,
            extracted_images=all_extracted_images_info, # Return info for all originally extracted images
            study_guide=study_guide_main_sections, # Hierarchical study guide
            workspace_id=ObjectId(workspace_id) # Add workspace_id to the model data
        )

        # Construct paths for the filtered images that were actually processed and potentially sent to Gemini
        filtered_image_paths = [os.path.join(request_image_dir, img_info.filename) for img_info in filtered_images_info]

        # Save the generated study guide metadata and upload files to GridFS
        saved_study_guide = await crud.create_study_guide(
            db=db,
            fs=fs, # Pass GridFS bucket
            study_guide_data=response_data,
            original_pdf_path=temp_file_path, # Pass path to original PDF
            image_paths=filtered_image_paths # Pass paths of filtered images
        )

        # Update the workspace to include this study guide ID
        if saved_study_guide and saved_study_guide.id:
            # Add the new study guide ID to the workspace's study_guides array
            await db["workspaces"].update_one(
                {"_id": ObjectId(workspace_id)},
                {"$addToSet": {"study_guides": saved_study_guide.id}}
            )
            logger.info(f"Updated workspace {workspace_id} with new study guide ID {saved_study_guide.id}")
        
        # Return the saved data (which includes the _id and GridFS IDs)
        return saved_study_guide

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.error(f"Unexpected error processing file {file.filename}: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
    finally:
        shutil.rmtree(request_temp_dir, ignore_errors=True)
        # Only remove image dir if it exists and is not needed anymore
        if os.path.exists(request_image_dir):
             shutil.rmtree(request_image_dir, ignore_errors=True)
        logger.info(f"Cleaned up temporary directories for request {request_id}")
