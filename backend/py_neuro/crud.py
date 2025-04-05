# CRUD (Create, Read, Update, Delete) operations
from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorGridFSBucket
from bson import ObjectId
import logging
import os
from typing import List

# Use absolute import
from py_neuro import models

logger = logging.getLogger(__name__)

STUDY_GUIDE_COLLECTION = "study_guides" # Define collection name

# --- GridFS Helper ---
async def upload_file_to_gridfs(fs: AsyncIOMotorGridFSBucket, file_path: str, filename: str, content_type: str | None = None) -> ObjectId:
    """Uploads a file from the local filesystem to GridFS."""
    try:
        with open(file_path, "rb") as file_data:
            # upload_from_stream requires filename, source, and optionally metadata
            file_id = await fs.upload_from_stream(
                filename=filename,
                source=file_data,
                metadata={"contentType": content_type} if content_type else None
            )
            logger.info(f"Uploaded {filename} to GridFS with ID: {file_id}")
            return file_id
    except Exception as e:
        logger.error(f"Error uploading file {filename} to GridFS: {e}")
        raise # Re-raise the exception to be handled by the caller

# --- Study Guide CRUD ---
async def create_study_guide(
    db: AsyncIOMotorDatabase,
    fs: AsyncIOMotorGridFSBucket, # Add GridFS bucket dependency
    study_guide_data: models.StudyGuideResponse,
    original_pdf_path: str, # Path to the temporary original PDF
    image_paths: List[str] # List of paths to temporary extracted images
) -> models.StudyGuideResponse:
    """
    Uploads associated files (PDF, images) to GridFS and inserts the
    study guide metadata document into the database.
    """
    try:
        # 1. Upload original PDF to GridFS
        pdf_gridfs_id = await upload_file_to_gridfs(
            fs=fs,
            file_path=original_pdf_path,
            filename=study_guide_data.original_filename,
            content_type="application/pdf" # Assuming PDF
        )
        study_guide_data.original_pdf_gridfs_id = pdf_gridfs_id

        # 2. Upload extracted images to GridFS and update the model list
        image_map = {os.path.basename(p): p for p in image_paths} # Map filename to full path
        for img_info in study_guide_data.extracted_images:
            if img_info.filename in image_map:
                try:
                    img_gridfs_id = await upload_file_to_gridfs(
                        fs=fs,
                        file_path=image_map[img_info.filename],
                        filename=img_info.filename
                        # content_type could be inferred or passed if available
                    )
                    img_info.gridfs_id = img_gridfs_id
                except Exception as img_upload_err:
                    # Log error but potentially continue? Or fail the whole operation?
                    # For now, log and skip associating the ID for this image.
                    logger.error(f"Failed to upload image {img_info.filename} to GridFS: {img_upload_err}")
            else:
                 logger.warning(f"Image path not found for {img_info.filename} during GridFS upload.")


        # 3. Convert Pydantic model (now with GridFS IDs) to dict for DB insertion
        study_guide_dict = study_guide_data.model_dump(by_alias=True, exclude_unset=True)

        # Remove the 'id' field if it's None before insertion, MongoDB will generate it
        if "_id" in study_guide_dict and study_guide_dict["_id"] is None:
            del study_guide_dict["_id"]

        logger.info(f"Inserting study guide for: {study_guide_data.original_filename}")
        result = await db[STUDY_GUIDE_COLLECTION].insert_one(study_guide_dict)

        # Fetch the newly created document to include the generated _id
        created_document = await db[STUDY_GUIDE_COLLECTION].find_one({"_id": result.inserted_id})

        if created_document:
            logger.info(f"Successfully inserted study guide with ID: {result.inserted_id}")
            # Convert the retrieved dict back to the Pydantic model for type consistency
            # Use model_validate for Pydantic v2
            return models.StudyGuideResponse.model_validate(created_document)
        else:
            # This case should be rare if insert_one succeeds
            logger.error(f"Failed to retrieve study guide after insertion with ID: {result.inserted_id}")
            raise Exception("Failed to retrieve study guide after insertion")

    except Exception as e:
        logger.error(f"Error inserting study guide into database: {e}")
        # Re-raise the exception or handle it as appropriate for the application
        raise

async def get_study_guide(db: AsyncIOMotorDatabase, study_guide_id: str) -> models.StudyGuideResponse | None:
    """Fetches a study guide document by its MongoDB _id."""
    try:
        oid = ObjectId(study_guide_id)
        document = await db[STUDY_GUIDE_COLLECTION].find_one({"_id": oid})
        if document:
            logger.info(f"Retrieved study guide with ID: {study_guide_id}")
            return models.StudyGuideResponse.model_validate(document)
        else:
            logger.warning(f"Study guide not found with ID: {study_guide_id}")
            return None
    except Exception as e:
        logger.error(f"Error retrieving study guide {study_guide_id}: {e}")
        # Depending on desired behavior, could raise HTTPException here or return None
        return None


# --- Placeholder CRUD functions for other models (e.g., Workspace) ---
# Example:
# async def create_workspace(db: AsyncIOMotorDatabase, workspace: models.WorkspaceCreate):
#     workspace_dict = workspace.model_dump() # Use model_dump for Pydantic v2
#     result = await db["workspaces"].insert_one(workspace_dict)
#     created_workspace = await db["workspaces"].find_one({"_id": result.inserted_id})
#     if created_workspace:
#         return models.Workspace.model_validate(created_workspace) # Use model_validate
#     return None

# async def get_workspace(db: AsyncIOMotorDatabase, workspace_id: str):
#      try:
#          oid = ObjectId(workspace_id)
#          workspace = await db["workspaces"].find_one({"_id": oid})
#          if workspace:
#              return models.Workspace.model_validate(workspace) # Use model_validate
#      except Exception as e:
#          logger.error(f"Error getting workspace {workspace_id}: {e}")
#      return None

# ... other CRUD functions ...
