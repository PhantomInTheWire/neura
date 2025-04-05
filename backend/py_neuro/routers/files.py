import logging
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
import mimetypes # To guess content type

# Use relative import
from ..database import get_gridfs_bucket

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/gridfs/{file_id}")
async def get_gridfs_file(file_id: str, fs: AsyncIOMotorGridFSBucket = Depends(get_gridfs_bucket)):
    """
    Retrieves a file stored in GridFS by its _id.
    """
    if not ObjectId.is_valid(file_id):
        raise HTTPException(status_code=400, detail="Invalid file ID format")

    oid = ObjectId(file_id)

    try:
        # Find file metadata first to get filename and potentially content type
        gridfs_file = await fs.find_one({"_id": oid})
        if not gridfs_file:
            raise HTTPException(status_code=404, detail="File not found in GridFS")

        # Determine media type (Content-Type)
        media_type = None
        if gridfs_file.metadata and "contentType" in gridfs_file.metadata:
            media_type = gridfs_file.metadata["contentType"]
        else:
            # Guess based on filename if not stored in metadata
            guessed_type, _ = mimetypes.guess_type(gridfs_file.filename)
            if guessed_type:
                media_type = guessed_type

        # Default if still unknown
        if not media_type:
            media_type = "application/octet-stream"

        # Open download stream
        download_stream = await fs.open_download_stream(oid)

        # Return as a streaming response
        return StreamingResponse(download_stream, media_type=media_type)

    except Exception as e:
        logger.error(f"Error retrieving file {file_id} from GridFS: {e}")
        # Distinguish between file not found and other errors if possible
        # For now, return 500 for any unexpected error during retrieval
        raise HTTPException(status_code=500, detail=f"Error retrieving file: {e}")
