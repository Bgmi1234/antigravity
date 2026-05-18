from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from ..services import youtube_service

router = APIRouter()

class YouTubeUploadRequest(BaseModel):
    video_path: str
    title: str
    description: str
    tags: List[str]

class YouTubeUploadResponse(BaseModel):
    video_url: str

@router.post("/upload", response_model=YouTubeUploadResponse)
def upload_video_route(req: YouTubeUploadRequest):
    """
    Uploads a video to YouTube using OAuth authentication.
    """
    try:
        url = youtube_service.upload_video(
            video_path=req.video_path,
            title=req.title,
            description=req.description,
            tags=req.tags
        )
        return {"video_url": url}
    except Exception as e:
        # Catch FileNotFoundError, OAuth errors, and API errors
        raise HTTPException(status_code=500, detail=str(e))
