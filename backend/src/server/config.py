import os

class Settings:
    ENV: str = os.getenv("ENV", "local")  # or "prod"
    DYNAMODB_ENDPOINT_URL: str = (
        "http://localhost:8000" if ENV == "local" else None
    )
    REGION: str = os.getenv("AWS_REGION")
    BLOG_URL_RAW_TABLE: str = "PostsBlogUrlsRaw"
    BLOG_DATA_TABLE: str = "BlogsData"

settings = Settings()