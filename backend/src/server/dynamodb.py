import boto3
from .config import settings

dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=settings.DYNAMODB_ENDPOINT_URL,
)

table = dynamodb.Table(settings.BLOG_URL_RAW_TABLE)

def put_item(blog_url: str):
    return table.put_item(Item={ "url": blog_url })
