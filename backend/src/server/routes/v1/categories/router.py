from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from src.server.dynamodb import Categories
from .models import CategoriesResponse

router = APIRouter()


@router.get("", response_model=CategoriesResponse)
async def get_categories():
    """Get all available categories"""
    try:
        categories = [cat.value for cat in Categories]
        return CategoriesResponse(categories=categories)
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": str(e)}
        )

