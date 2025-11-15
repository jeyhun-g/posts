import boto3
import uuid
import time
from enum import Enum
from typing import Optional, Dict, Any

from pydantic import HttpUrl
from .config import settings


class PrimaryKey(Enum):
    ARTICLES = "ARTICLES"
    CATEGORIES = "CATEGORIES"

class Categories(Enum):
    SOFTWARE_ENGINEERING = "SOFTWARE_ENGINEERING"

dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=settings.DYNAMODB_ENDPOINT_URL,
    region_name=settings.REGION
)

blog_url_raw_table = dynamodb.Table(settings.BLOG_URL_RAW_TABLE)
blog_data_table = dynamodb.Table(settings.BLOG_DATA_TABLE)

def put_item(blog_url: str):
    return blog_url_raw_table.put_item(Item={ 
        "id": str(uuid.uuid4()),
        "url": blog_url,
        "createdAt": int(time.time() * 1000)
    })

async def put_blog_data(category: Categories, title: str, url: HttpUrl, keywords: list):
    return blog_data_table.put_item(Item={
        "pk": PrimaryKey.ARTICLES.value,
        "sk": f"{category}#{url}",
        "title": title,
        "url": str(url),
        "keywords": keywords,
        "createdAt": int(time.time() * 1000)
    })

async def get_all_blogs(limit: Optional[int] = None, exclusive_start_key: Optional[Dict[str, Any]] = None):
    """Get all blogs from the database with pagination support"""
    query_params = {
        "KeyConditionExpression": "pk = :pk",
        "ExpressionAttributeValues": {
            ":pk": PrimaryKey.ARTICLES.value
        }
    }
    
    if limit is not None:
        query_params["Limit"] = limit
    
    if exclusive_start_key is not None:
        query_params["ExclusiveStartKey"] = exclusive_start_key
    
    response = blog_data_table.query(**query_params)
    
    return {
        "items": response.get("Items", []),
        "last_evaluated_key": response.get("LastEvaluatedKey"),
        "has_more": "LastEvaluatedKey" in response
    }
