import os
# import json
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List, Dict, Any
import google.generativeai as genai
# Remove dotenv import, config handles it
# from dotenv import load_dotenv
import logging
from PIL import Image, UnidentifiedImageError # For image handling & filtering
# import io

# Text/Image extraction libraries
# import fitz # PyMuPDF
from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE
from docx import Document
from bson import ObjectId # Import ObjectId

# Use absolute import
import models
from config import settings # Import settings
from database import get_database, get_gridfs_bucket # Import DB and GridFS dependencies
import crud # Import crud functions
from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorGridFSBucket # Import DB and GridFS types

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# --- Configuration ---
# load_dotenv() # Removed - handled by config.py
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") # Removed - use settings
TEMP_UPLOAD_DIR = "temp_uploads"
IMAGE_OUTPUT_DIR_BASE = os.path.join(TEMP_UPLOAD_DIR, "images")
MIN_IMAGE_WIDTH = 50  # Pixels - adjust as needed for pre-filtering
MIN_IMAGE_HEIGHT = 50 # Pixels - adjust as needed for pre-filtering

# Configure Gemini
if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE": # Check settings
    logger.warning("GEMINI_API_KEY not found in settings or is default. Study guide generation will fail.")
    gemini_model = None
else:
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY) # Use settings
        # Using gemini-1.5-pro which supports multimodal and JSON output mode
        gemini_model = genai.GenerativeModel('gemini-2.0-flash')
        logger.info("Gemini configured successfully with gemini-2.0-flas.")
    except Exception as e:
        logger.error(f"Failed to configure Gemini: {e}")
        gemini_model = None

# Ensure temp directories exist
os.makedirs(TEMP_UPLOAD_DIR, exist_ok=True)
os.makedirs(IMAGE_OUTPUT_DIR_BASE, exist_ok=True)

# --- Helper Functions ---

def pre_filter_image(image_path: str) -> bool:
    """Basic pre-filtering for images based on dimensions."""
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            if width < MIN_IMAGE_WIDTH or height < MIN_IMAGE_HEIGHT:
                logger.info(f"Filtering out image (too small): {image_path}")
                return False
            # Add other checks here if needed (e.g., color variance)
        return True
    except UnidentifiedImageError:
        logger.warning(f"Cannot identify image file, filtering out: {image_path}")
        return False
    except Exception as e:
        logger.warning(f"Error during image pre-filtering for {image_path}: {e}")
        return False # Filter out if error occurs



# --- Updated Gemini Interaction ---
# Renamed function and updated return type hint


# --- API Endpoint ---
# Update the route to the desired structure
# @router.post("/workspaces/{workspace_id}/upload", response_model=models.StudyGuideResponse)
# async def upload_and_create_study_guide( # Renamed function for clarity
#     workspace_id: str, # Add workspace_id path parameter
#     file: UploadFile = File(...),
#     db: AsyncIOMotorDatabase = Depends(get_database),
#     fs: AsyncIOMotorGridFSBucket = Depends(get_gridfs_bucket)
# ):
#     """
#     Uploads a document for a specific workspace, extracts text/images,
#     and generates a hierarchical study guide using Gemini multimodal capabilities.
#     """
#     if not file.filename:
#         raise HTTPException(status_code=400, detail="No filename provided.")

#     request_id = str(uuid.uuid4())
#     request_temp_dir = os.path.join(TEMP_UPLOAD_DIR, request_id)
#     request_image_dir = os.path.join(IMAGE_OUTPUT_DIR_BASE, request_id)
#     os.makedirs(request_temp_dir, exist_ok=True)
#     os.makedirs(request_image_dir, exist_ok=True)

#     _, extension = os.path.splitext(file.filename)
#     extension = extension.lower()
#     temp_file_path = os.path.join(request_temp_dir, f"upload{extension}")

#     try:
#         logger.info(f"Receiving file: {file.filename}, size: {file.size}, type: {file.content_type}")
#         with open(temp_file_path, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)
#         logger.info(f"Saved temporary file: {temp_file_path}")
#     except Exception as e:
#         logger.error(f"Failed to save temporary file {temp_file_path}: {e}")
#         shutil.rmtree(request_temp_dir, ignore_errors=True)
#         shutil.rmtree(request_image_dir, ignore_errors=True)
#         raise HTTPException(status_code=500, detail=f"Could not save uploaded file: {e}")
#     finally:
#         await file.close()

#     text_content = ""
#     # Keep track of *all* extracted images before filtering for the final response
#     all_extracted_images_info: List[models.ExtractedImageInfo] = []
#     # Keep track of images that pass filtering to send to Gemini
#     filtered_images_info: List[models.ExtractedImageInfo] = []
#     try:
#         if extension == ".pdf":
#             # Update to capture both lists from extraction function
# text_content, all_extracted_images_info, filtered_images_info = extract_text_and_images_pdf(temp_file_path, request_image_dir)
#         elif extension == ".pptx":
#              # Update to capture both lists from extraction function
#             text_content, all_extracted_images_info, filtered_images_info = extract_text_and_images_pptx(temp_file_path, request_image_dir)
#         elif extension == ".docx":
#             text_content = extract_text_docx(temp_file_path)
#             # No images extracted for docx yet
#         elif extension == ".txt":
#             text_content = extract_text_txt(temp_file_path)
#             # No images for txt
#         else:
#             raise HTTPException(status_code=400, detail=f"Unsupported file type: {extension}. Supported types: .pdf, .pptx, .docx, .txt")

#         if not text_content.strip():
#             raise HTTPException(status_code=400, detail="Extracted text content is empty.")

#         # Generate study guide sections using Gemini with filtered images
#         # Use the correct function name and expect hierarchical structure
#         study_guide_main_sections = await generate_hierarchical_study_guide(text_content, filtered_images_info, request_image_dir)

#         # Format the final response using the correct model
#         response_data = models.StudyGuideResponse(
#             original_filename=file.filename,
#             extracted_images=all_extracted_images_info, # Return info for all originally extracted images
#             study_guide=study_guide_main_sections, # Hierarchical study guide
#             workspace_id=ObjectId(workspace_id) # Add workspace_id to the model data
#         )

#         # Construct paths for the filtered images that were actually processed and potentially sent to Gemini
#         filtered_image_paths = [os.path.join(request_image_dir, img_info.filename) for img_info in filtered_images_info]

#         # Save the generated study guide metadata and upload files to GridFS
#         saved_study_guide = await crud.create_study_guide(
#             db=db,
#             fs=fs, # Pass GridFS bucket
#             study_guide_data=response_data,
#             original_pdf_path=temp_file_path, # Pass path to original PDF
#             image_paths=filtered_image_paths # Pass paths of filtered images
#         )

#         # Return the saved data (which includes the _id and GridFS IDs)
#         return saved_study_guide

#     except HTTPException as http_exc:
#         raise http_exc
#     except Exception as e:
#         logger.error(f"Unexpected error processing file {file.filename}: {e}")
#         raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
#     finally:
#         shutil.rmtree(request_temp_dir, ignore_errors=True)
#         # Only remove image dir if it exists and is not needed anymore
#         if os.path.exists(request_image_dir):
#              shutil.rmtree(request_image_dir, ignore_errors=True)
#         logger.info(f"Cleaned up temporary directories for request {request_id}")

# Endpoint to retrieve a study guide by its ID
@router.get("/{study_guide_id}", response_model=models.StudyGuideResponse)
async def read_study_guide(study_guide_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Retrieves a study guide document by its MongoDB _id.
    Note: This returns the metadata including GridFS IDs, not the file content itself.
    """
    study_guide = await crud.get_study_guide(db=db, study_guide_id=study_guide_id)
    if study_guide is None:
        raise HTTPException(status_code=404, detail="Study guide not found")
    return study_guide

# Endpoint to retrieve all study guides for a specific workspace
@router.get("/workspaces/{workspace_id}/study-guides/", response_model=List[models.StudyGuideResponse]) # Corrected path
async def list_study_guides_for_workspace(workspace_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Retrieves all study guide documents associated with a specific workspace_id.
    """
    # Basic validation for workspace_id format
    if not ObjectId.is_valid(workspace_id):
         raise HTTPException(status_code=400, detail="Invalid workspace ID format")

    study_guides = await crud.get_study_guides_for_workspace(db=db, workspace_id=workspace_id)
    # The CRUD function returns an empty list if none are found or on error,
    # so we don't strictly need to check for None here unless we want to differentiate.
    return study_guides
