from fastapi import APIRouter
from .models import BlogCreateRequest

router = APIRouter()


@router.post("")
async def create_blog(request: BlogCreateRequest):
    """Create a new blog post"""
    # TODO: Implement business logic
    return {"message": "Not implemented"}


@router.get("")
async def get_blogs():
    """Get all blogs"""
    # TODO: Implement business logic
    return {"message": "Not implemented"}

