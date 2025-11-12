import boto3
import uuid
import time
from enum import Enum
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

def put_blog_data(category: Categories, title: str, url: str, keywords: list):
    return blog_data_table.put_item(Item={
        "pk": PrimaryKey.ARTICLES.value,
        "sk": category.value,
        "title": title,
        "url": url,
        "keywords": keywords,
        "createdAt": int(time.time() * 1000)
    })
