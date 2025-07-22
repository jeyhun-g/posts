import boto3
import uuid
import time
from .config import settings

dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=settings.DYNAMODB_ENDPOINT_URL,
    region_name=settings.REGION
)

table = dynamodb.Table(settings.BLOG_URL_RAW_TABLE)

def put_item(blog_url: str):
    return table.put_item(Item={ 
        "id": str(uuid.uuid4()),
        "url": blog_url,
        "createdAt": int(time.time() * 1000)
    })
