from fastapi import APIRouter, status, Query
from fastapi.responses import JSONResponse, Response
from typing import Optional
import json
import base64
import binascii
from .models import BlogCreateRequest, BlogResponse, PaginatedBlogResponse
from src.server.dynamodb import put_blog_data, get_all_blogs

router = APIRouter()


@router.post("")
async def create_blog(request: BlogCreateRequest):
    try:
        await put_blog_data(request.category, request.title, request.url, request.keywords)
        return Response(
            status_code=status.HTTP_201_CREATED
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": str(e)}
        ) 


@router.get("", response_model=PaginatedBlogResponse)
async def get_blogs(
    limit: Optional[int] = Query(default=10, ge=1, le=100, description="Number of items per page"),
    last_key: Optional[str] = Query(default=None, description="Pagination token from previous response")
):
    """Get all blogs with pagination support"""
    try:
        # Decode the last_key if provided
        exclusive_start_key = None
        if last_key:
            try:
                decoded_key = base64.b64decode(last_key).decode('utf-8')
                exclusive_start_key = json.loads(decoded_key)
            except (binascii.Error, json.JSONDecodeError) as e:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message": f"Invalid pagination token: {str(e)}"}
                )
        
        result = await get_all_blogs(limit=limit, exclusive_start_key=exclusive_start_key)
        
        # Encode the last_evaluated_key for the response
        encoded_last_key = None
        if result["last_evaluated_key"]:
            key_json = json.dumps(result["last_evaluated_key"])
            encoded_last_key = base64.b64encode(key_json.encode('utf-8')).decode('utf-8')
        
        return PaginatedBlogResponse(
            items=result["items"],
            last_key=encoded_last_key,
            has_more=result["has_more"]
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": str(e)}
        )

